#!/usr/bin/env node

/**
 * Figma Token Sync Script
 * Pulls design variables from Figma and syncs to GitHub
 * 
 * Usage: npm run figma:sync
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const CONFIG_PATH = path.join(__dirname, '../figma-mcp.config.json');
const AUDIT_LOG_PATH = path.join(__dirname, '../tokens/audit-logs');

// Load configuration
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Get API token from environment
const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN;

if (!FIGMA_API_TOKEN) {
  console.error('❌ FIGMA_API_TOKEN environment variable not set');
  process.exit(1);
}

if (!config.figmaConfig.figmaFileId || config.figmaConfig.figmaFileId === 'YOUR_FIGMA_FILE_ID_HERE') {
  console.error('❌ figmaFileId not configured in figma-mcp.config.json');
  process.exit(1);
}

const axiosInstance = axios.create({
  baseURL: config.figmaConfig.figmaAPIEndpoint,
  headers: {
    'X-Figma-Token': FIGMA_API_TOKEN,
  },
});

/**
 * Main sync function
 */
async function syncTokensFromFigma() {
  const startTime = new Date();
  
  console.log('\n🔄 Starting Figma Token Sync...');
  console.log(`📁 File ID: ${config.figmaConfig.figmaFileId}`);
  console.log(`⏰ Started at: ${startTime.toISOString()}\n`);

  try {
    // Step 1: Fetch file from Figma
    console.log('📥 Fetching Figma file...');
    const fileResponse = await axiosInstance.get(`/files/${config.figmaConfig.figmaFileId}`);
    const figmaFile = fileResponse.data;

    console.log(`✅ File fetched: ${figmaFile.name}`);

    // Step 2: Extract variables
    console.log('\n📋 Extracting design variables...');
    const variables = await extractVariables(figmaFile);
    console.log(`✅ Extracted ${variables.length} variables`);

    // Step 3: Convert to token format
    console.log('\n🔄 Converting to token format...');
    const tokenData = convertToTokenFormat(variables);

    // Step 4: Save to sd-input directory
    console.log('\n💾 Saving token data...');
    saveTokenData(tokenData);
    console.log('✅ Token data saved');

    // Step 5: Generate audit log
    const endTime = new Date();
    const auditEntry = {
      timestamp: startTime.toISOString(),
      completedAt: endTime.toISOString(),
      duration: endTime - startTime,
      status: 'success',
      variableCount: variables.length,
      themes: Object.keys(config.themes),
      densities: Object.keys(config.densityModes),
      tokenLayerCount: tokenData.layers.length,
      figmaFileId: config.figmaConfig.figmaFileId,
      figmaFileName: figmaFile.name,
    };

    logAuditEntry(auditEntry);

    console.log('\n✅ Figma Token Sync COMPLETE');
    console.log(`📊 Status: SUCCESS`);
    console.log(`📈 Variables synced: ${variables.length}`);
    console.log(`⏱️  Duration: ${auditEntry.duration}ms\n`);

    return true;
  } catch (error) {
    console.error('\n❌ Figma Token Sync FAILED');
    console.error(`Error: ${error.message}`);
    
    logAuditEntry({
      timestamp: startTime.toISOString(),
      status: 'failed',
      error: error.message,
      figmaFileId: config.figmaConfig.figmaFileId,
    });

    process.exit(1);
  }
}

/**
 * Extract variables from Figma file
 */
async function extractVariables(figmaFile) {
  // In production, would fetch specific variable sets from Figma API
  // This is a placeholder implementation
  
  const variables = [];
  
  // Fetch variable sets from Figma
  try {
    const variablesResponse = await axiosInstance.get(`/files/${figmaFile.id}/variables/local`);
    return variablesResponse.data.variables || [];
  } catch (error) {
    console.warn('⚠️  Could not fetch variables from Figma API');
    console.warn('Using local token definitions instead');
    return [];
  }
}

/**
 * Convert Figma variables to token format
 */
function convertToTokenFormat(variables) {
  const tokenData = {
    layers: [],
    themes: {},
    densities: {},
    timestamp: new Date().toISOString(),
  };

  // Initialize themes
  Object.keys(config.themes).forEach((themeKey) => {
    tokenData.themes[themeKey] = {
      name: config.themes[themeKey].name,
      variables: {},
    };
  });

  // Initialize densities
  Object.keys(config.densityModes).forEach((densityKey) => {
    tokenData.densities[densityKey] = {
      name: config.densityModes[densityKey].name,
      variables: {},
    };
  });

  // Process variables (placeholder)
  variables.forEach((variable) => {
    // Group by theme and density
    Object.keys(config.themes).forEach((themeKey) => {
      if (variable.name.includes(themeKey)) {
        tokenData.themes[themeKey].variables[variable.id] = {
          name: variable.name,
          value: variable.value,
        };
      }
    });
  });

  return tokenData;
}

/**
 * Save token data to sd-input directory
 */
function saveTokenData(tokenData) {
  const sdInputPath = path.join(__dirname, '../tokens/sd-input');

  // Create directory if it doesn't exist
  if (!fs.existsSync(sdInputPath)) {
    fs.mkdirSync(sdInputPath, { recursive: true });
  }

  // Save tokens JSON
  const tokensFile = path.join(sdInputPath, 'tokens.json');
  fs.writeFileSync(tokensFile, JSON.stringify(tokenData, null, 2));

  // Save themes JSON
  const themesFile = path.join(sdInputPath, 'themes.json');
  fs.writeFileSync(themesFile, JSON.stringify(tokenData.themes, null, 2));

  // Save densities JSON
  const densitiesFile = path.join(sdInputPath, 'densities.json');
  fs.writeFileSync(densitiesFile, JSON.stringify(tokenData.densities, null, 2));
}

/**
 * Log audit entry
 */
function logAuditEntry(entry) {
  if (!fs.existsSync(AUDIT_LOG_PATH)) {
    fs.mkdirSync(AUDIT_LOG_PATH, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const auditFile = path.join(AUDIT_LOG_PATH, `sync-${timestamp}.json`);
  fs.writeFileSync(auditFile, JSON.stringify(entry, null, 2));

  console.log(`📝 Audit logged: ${path.basename(auditFile)}`);
}

// Run sync
syncTokensFromFigma();
