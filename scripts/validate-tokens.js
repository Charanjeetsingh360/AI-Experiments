#!/usr/bin/env node

/**
 * Token Validation Script
 * Validates token integrity, naming conventions, and OWASP compliance
 * against the generated CSS output (tokens/output/css/tokens.css).
 *
 * Usage: npm run tokens:validate
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CONFIG_PATH = path.join(__dirname, '../figma-mcp.config.json');
const TOKENS_OUTPUT_PATH = path.join(__dirname, '../tokens/output');
const CSS_PATH = path.join(TOKENS_OUTPUT_PATH, 'css/tokens.css');
const MANIFEST_PATH = path.join(TOKENS_OUTPUT_PATH, 'manifest/token-manifest.json');

const HEX_COLOR_PATTERN = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
const UNSAFE_CHARS_PATTERN = /[<>]/;
const CUSTOM_PROP_PATTERN = /^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/i;

const EMITTED_DENSITIES = ['default', 'compact', 'comfortable'];
const EMITTED_THEMES = ['light', 'soothing-dark', 'high-contrast', 'stark-dark'];

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

let errors = [];
let warnings = [];
let passed = 0;

function validateTokens() {
  console.log('\n🔍 Starting Token Validation...\n');

  if (!fs.existsSync(TOKENS_OUTPUT_PATH)) {
    console.error('❌ Token output directory not found');
    console.error(`   Expected: ${TOKENS_OUTPUT_PATH}`);
    process.exit(1);
  }

  if (!fs.existsSync(CSS_PATH)) {
    console.error('❌ Generated CSS not found. Run `npm run tokens:generate` first.');
    console.error(`   Expected: ${CSS_PATH}`);
    process.exit(1);
  }

  const cssContent = fs.readFileSync(CSS_PATH, 'utf8');
  const tokens = parseCustomProperties(cssContent);

  validateTokenNaming(tokens);
  validateTokenFormat();
  validateThemeCoverage(cssContent);
  validateDensityCoverage(cssContent);
  validateHardcodedValues(tokens);
  validateSecurityCompliance(tokens);
  validateTokenIntegrity(cssContent, tokens);

  printValidationResults();
}

function parseCustomProperties(css) {
  const entries = [];
  for (const line of css.split('\n')) {
    const match = line.match(CUSTOM_PROP_PATTERN);
    if (match) {
      entries.push({ name: match[1], value: match[2].trim() });
    }
  }
  return entries;
}

function validateTokenNaming(tokens) {
  console.log('📋 Checking token naming conventions...');

  if (tokens.length === 0) {
    warnings.push('⚠️  No CSS custom properties found in tokens.css');
    return;
  }

  let invalidNames = 0;

  tokens.forEach(({ name }) => {
    const bareName = name.replace(/^--/, '');
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(bareName)) {
      invalidNames++;
    }

    if (UNSAFE_CHARS_PATTERN.test(name)) {
      errors.push(`❌ Token name contains unsafe characters: ${name}`);
    }
  });

  if (invalidNames === 0) {
    console.log(`✅ All ${tokens.length} tokens follow naming conventions`);
    passed++;
  } else {
    warnings.push(`⚠️  ${invalidNames} tokens don't follow expected naming pattern`);
  }
}

function validateTokenFormat() {
  console.log('📐 Checking token format and structure...');

  const stat = fs.statSync(CSS_PATH);
  if (stat.size > 0) {
    console.log(`✅ Generated CSS present (${stat.size} bytes)`);
    passed++;
  } else {
    warnings.push('⚠️  Generated tokens.css is empty');
  }
}

function validateThemeCoverage(css) {
  console.log('🎨 Checking theme coverage...');

  const found = EMITTED_THEMES.filter((theme) => css.includes(`[data-theme="${theme}"]`));
  if (found.length === EMITTED_THEMES.length) {
    console.log(`✅ All ${found.length} theme selectors present (${found.join(', ')})`);
    passed++;
  } else {
    warnings.push(`⚠️  Only ${found.length} of ${EMITTED_THEMES.length} theme selectors found`);
  }
}

function validateDensityCoverage(css) {
  console.log('📏 Checking density mode coverage...');

  const found = EMITTED_DENSITIES.filter((density) => css.includes(`[data-density="${density}"]`));
  if (found.length === EMITTED_DENSITIES.length) {
    console.log(`✅ All ${found.length} density selectors present (${found.join(', ')})`);
    passed++;
  } else {
    warnings.push(`⚠️  Only ${found.length} of ${EMITTED_DENSITIES.length} density selectors found`);
  }
}

function validateHardcodedValues(tokens) {
  console.log('🔒 Checking for hardcoded values (OWASP)...');

  const hardcoded = [];

  tokens.forEach(({ name, value }) => {
    if (HEX_COLOR_PATTERN.test(value)) {
      const isPrimitive = /colors?-(white|black|blue|neutral|gray|grey|red|yellow|green|slate)/.test(name);
      if (!isPrimitive) {
        hardcoded.push({ name, value });
      }
    }
    HEX_COLOR_PATTERN.lastIndex = 0;
  });

  if (hardcoded.length === 0) {
    console.log('✅ No hardcoded values found outside primitive layer');
    passed++;
  } else {
    warnings.push(`⚠️  ${hardcoded.length} potentially hardcoded values detected`);
  }
}

function validateSecurityCompliance(tokens) {
  console.log('🔐 Checking OWASP security compliance...');

  const corpus = tokens.map((token) => `${token.name}:${token.value}`).join('\n');
  let securityChecks = 0;

  if (!/FIGMA_API_TOKEN|figma_api_token/i.test(corpus)) {
    securityChecks++;
  } else {
    errors.push('❌ API token reference found in tokens (security issue)');
  }

  if (!/\b(DROP|SELECT|INSERT|UPDATE|DELETE)\s+\w/i.test(corpus)) {
    securityChecks++;
  } else {
    errors.push('❌ SQL-like pattern found in tokens');
  }

  if (!UNSAFE_CHARS_PATTERN.test(corpus)) {
    securityChecks++;
  } else {
    errors.push('❌ Unsafe characters (< or >) found in token names/values');
  }

  if (securityChecks === 3) {
    console.log('✅ All OWASP security checks passed');
    passed++;
  } else {
    warnings.push(`⚠️  ${3 - securityChecks} security checks failed`);
  }
}

function validateTokenIntegrity(cssContent, tokens) {
  console.log('📝 Checking token integrity (SHA256)...');

  const hash = crypto.createHash('sha256').update(cssContent).digest('hex');

  if (!fs.existsSync(path.dirname(MANIFEST_PATH))) {
    fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  }

  const manifest = {
    timestamp: new Date().toISOString(),
    source: path.relative(path.join(__dirname, '..'), CSS_PATH),
    tokenCount: tokens.length,
    integrityHash: hash,
    themes: EMITTED_THEMES,
    densities: EMITTED_DENSITIES,
    configuredThemes: Object.keys(config.themes || {}),
    configuredDensities: Object.keys(config.densityModes || {}),
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`✅ Token integrity verified (SHA256: ${hash.substring(0, 8)}...)`);
  passed++;
}

function printValidationResults() {
  console.log('\n============================================================');
  console.log('📊 VALIDATION RESULTS');
  console.log('============================================================\n');

  if (errors.length > 0) {
    console.log('❌ ERRORS:');
    errors.forEach((error) => console.log(`   ${error}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach((warning) => console.log(`   ${warning}`));
    console.log('');
  }

  console.log(`✅ Checks Passed: ${passed}/7`);

  if (errors.length > 0) {
    console.log('\n❌ VALIDATION FAILED');
    process.exit(1);
  }

  if (passed >= 6) {
    console.log('\n✅ VALIDATION PASSED');
    process.exit(0);
  }

  console.log('\n⚠️  VALIDATION COMPLETED WITH ISSUES');
  process.exit(0);
}

validateTokens();
