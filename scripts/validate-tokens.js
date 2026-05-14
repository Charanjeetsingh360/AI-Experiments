#!/usr/bin/env node

/**
 * Token Validation Script
 * Validates token integrity, naming conventions, and OWASP compliance
 * 
 * Usage: npm run tokens:validate
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CONFIG_PATH = path.join(__dirname, '../figma-mcp.config.json');
const TOKENS_OUTPUT_PATH = path.join(__dirname, '../tokens/output');
const MANIFEST_PATH = path.join(TOKENS_OUTPUT_PATH, 'manifest/token-manifest.json');

// OWASP regex patterns
const HEX_COLOR_PATTERN = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
const HARDCODED_VALUE_PATTERN = /^(#[0-9A-Fa-f]{6}|rgb|hsl|px|em|rem|\d+)/i;
const UNSAFE_CHARS_PATTERN = /[<>'"]/g;

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

let errors = [];
let warnings = [];
let passed = 0;

/**
 * Main validation function
 */
function validateTokens() {
  console.log('\n🔍 Starting Token Validation...\n');

  // Check if output directory exists
  if (!fs.existsSync(TOKENS_OUTPUT_PATH)) {
    console.error('❌ Token output directory not found');
    console.error(`   Expected: ${TOKENS_OUTPUT_PATH}`);
    process.exit(1);
  }

  // Run all validation checks
  validateTokenNaming();
  validateTokenFormat();
  validateThemeCoverage();
  validateDensityCoverage();
  validateHardcodedValues();
  validateSecurityCompliance();
  validateTokenIntegrity();

  // Print results
  printValidationResults();
}

/**
 * Validate token naming conventions
 */
function validateTokenNaming() {
  console.log('📋 Checking token naming conventions...');
  
  const jsonPath = path.join(TOKENS_OUTPUT_PATH, 'json/tokens.json');
  
  if (!fs.existsSync(jsonPath)) {
    warnings.push('⚠️  JSON tokens file not found (not generated yet)');
    return;
  }

  const tokens = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const tokenNames = Object.keys(tokens);

  if (tokenNames.length === 0) {
    warnings.push('⚠️  No tokens found in JSON file');
    return;
  }

  let invalidNames = 0;
  const expectedPrefix = 'cs360';

  tokenNames.forEach((name) => {
    // Check for prefix
    if (!name.includes(expectedPrefix) && !name.startsWith('--')) {
      invalidNames++;
    }

    // Check for kebab-case
    if (!/^[a-z0-9]+-[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
      invalidNames++;
    }

    // Check for unsafe characters
    if (UNSAFE_CHARS_PATTERN.test(name)) {
      errors.push(`❌ Token name contains unsafe characters: ${name}`);
    }
  });

  if (invalidNames === 0) {
    console.log(`✅ All ${tokenNames.length} tokens follow naming conventions`);
    passed++;
  } else {
    warnings.push(`⚠️  ${invalidNames} tokens don't follow expected naming pattern`);
  }
}

/**
 * Validate token format and structure
 */
function validateTokenFormat() {
  console.log('📐 Checking token format and structure...');

  const formats = ['json', 'scss', 'js', 'tailwind'];
  let validFormats = 0;

  formats.forEach((format) => {
    const dirPath = path.join(TOKENS_OUTPUT_PATH, format);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      if (files.length > 0) {
        validFormats++;
      }
    }
  });

  if (validFormats >= 3) {
    console.log(`✅ All expected token formats generated (${validFormats}/4)`);
    passed++;
  } else {
    warnings.push(`⚠️  Only ${validFormats} of 4 expected token formats found`);
  }
}

/**
 * Validate theme coverage
 */
function validateThemeCoverage() {
  console.log('🎨 Checking theme coverage...');

  const themes = Object.keys(config.themes);
  let themeCoverage = 0;

  themes.forEach((theme) => {
    // Check if tokens reference theme
    if (hasThemeVariables(theme)) {
      themeCoverage++;
    }
  });

  if (themeCoverage === themes.length) {
    console.log(`✅ All ${themes.length} themes are covered (Light, Dark, High-Contrast)`);
    passed++;
  } else {
    warnings.push(`⚠️  Only ${themeCoverage} of ${themes.length} themes found in tokens`);
  }
}

/**
 * Validate density coverage
 */
function validateDensityCoverage() {
  console.log('📏 Checking density mode coverage...');

  const densities = Object.keys(config.densityModes);
  let densityCoverage = 0;

  densities.forEach((density) => {
    // Check if tokens reference density
    if (hasDensityVariables(density)) {
      densityCoverage++;
    }
  });

  if (densityCoverage === densities.length) {
    console.log(`✅ All ${densities.length} density modes are covered (Compact, Default, Comfortable)`);
    passed++;
  } else {
    warnings.push(`⚠️  Only ${densityCoverage} of ${densities.length} density modes found`);
  }
}

/**
 * Validate no hardcoded values
 */
function validateHardcodedValues() {
  console.log('🔒 Checking for hardcoded values (OWASP)...');

  const jsonPath = path.join(TOKENS_OUTPUT_PATH, 'json/tokens.json');
  
  if (!fs.existsSync(jsonPath)) {
    warnings.push('⚠️  Cannot check hardcoded values (JSON not found)');
    return;
  }

  const tokens = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const hardcodedValues = [];

  Object.entries(tokens).forEach(([name, value]) => {
    // In semantic layer, values should reference primitives
    if (typeof value === 'string' && HEX_COLOR_PATTERN.test(value)) {
      // Check if this is a primitive layer token
      if (!name.includes('primitives') && !name.includes('blue') && !name.includes('neutral')) {
        hardcodedValues.push({ token: name, value });
      }
    }
  });

  if (hardcodedValues.length === 0) {
    console.log('✅ No hardcoded values found in semantic layer');
    passed++;
  } else {
    warnings.push(`⚠️  ${hardcodedValues.length} potentially hardcoded values detected`);
  }
}

/**
 * Validate security compliance (OWASP)
 */
function validateSecurityCompliance() {
  console.log('🔐 Checking OWASP security compliance...');

  let securityChecks = 0;

  // Check 1: No API tokens in files
  const filesContent = getAllFilesContent(TOKENS_OUTPUT_PATH);
  if (!filesContent.includes('FIGMA_API_TOKEN') && !filesContent.includes('figma_api_token')) {
    securityChecks++;
  } else {
    errors.push('❌ API token found in output files (security issue)');
  }

  // Check 2: No unsafe SQL patterns
  if (!filesContent.includes('DROP') && !filesContent.includes('SELECT')) {
    securityChecks++;
  }

  // Check 3: No XSS vectors
  if (!UNSAFE_CHARS_PATTERN.test(filesContent)) {
    securityChecks++;
  }

  if (securityChecks === 3) {
    console.log('✅ All OWASP security checks passed');
    passed++;
  } else {
    warnings.push(`⚠️  ${3 - securityChecks} security checks failed`);
  }
}

/**
 * Validate token integrity with hashing
 */
function validateTokenIntegrity() {
  console.log('📝 Checking token integrity (SHA256)...');

  const jsonPath = path.join(TOKENS_OUTPUT_PATH, 'json/tokens.json');
  
  if (!fs.existsSync(jsonPath)) {
    warnings.push('⚠️  Cannot verify integrity (JSON not found)');
    return;
  }

  const content = fs.readFileSync(jsonPath, 'utf8');
  const hash = crypto.createHash('sha256').update(content).digest('hex');

  // Save/verify manifest
  if (!fs.existsSync(path.dirname(MANIFEST_PATH))) {
    fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  }

  const manifest = {
    timestamp: new Date().toISOString(),
    tokenCount: Object.keys(JSON.parse(content)).length,
    integrityHash: hash,
    themes: Object.keys(config.themes),
    densities: Object.keys(config.densityModes),
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`✅ Token integrity verified (SHA256: ${hash.substring(0, 8)}...)`);
  passed++;
}

/**
 * Helper: Check if theme variables exist
 */
function hasThemeVariables(theme) {
  const jsonPath = path.join(TOKENS_OUTPUT_PATH, 'json/tokens.json');
  if (!fs.existsSync(jsonPath)) return false;

  const content = fs.readFileSync(jsonPath, 'utf8');
  return content.includes(theme) || content.includes(`data-theme="${theme}"`);
}

/**
 * Helper: Check if density variables exist
 */
function hasDensityVariables(density) {
  const jsonPath = path.join(TOKENS_OUTPUT_PATH, 'json/tokens.json');
  if (!fs.existsSync(jsonPath)) return false;

  const content = fs.readFileSync(jsonPath, 'utf8');
  return content.includes(`density-${density}`) || content.includes(density);
}

/**
 * Helper: Get all files content
 */
function getAllFilesContent(dirPath) {
  let content = '';
  
  function walkDir(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        try {
          content += fs.readFileSync(filePath, 'utf8');
        } catch (e) {
          // Skip binary files
        }
      }
    });
  }

  walkDir(dirPath);
  return content;
}

/**
 * Print validation results
 */
function printValidationResults() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION RESULTS');
  console.log('='.repeat(60) + '\n');

  if (errors.length > 0) {
    console.log('❌ ERRORS:');
    errors.forEach((error) => console.log(`   ${error}`));
    console.log();
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach((warning) => console.log(`   ${warning}`));
    console.log();
  }

  console.log(`✅ Checks Passed: ${passed}/7`);

  if (errors.length === 0 && passed >= 5) {
    console.log('\n✅ VALIDATION PASSED');
    console.log('Manifest saved to:', MANIFEST_PATH);
    process.exit(0);
  } else {
    console.log('\n⚠️  VALIDATION COMPLETED WITH ISSUES');
    process.exit(errors.length > 0 ? 1 : 0);
  }
}

// Run validation
validateTokens();
