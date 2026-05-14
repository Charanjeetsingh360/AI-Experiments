/**
 * Style Dictionary Configuration
 * Converts design tokens from Figma → multiple output formats
 * 
 * Outputs:
 * - JSON: Master token registry
 * - SCSS: CSS custom properties
 * - JavaScript: Runtime token access
 * - Tailwind: Theme configuration
 * - Figma: Figma-compatible format
 */

const StyleDictionary = require('style-dictionary');
const path = require('path');

// Register custom transforms
StyleDictionary.registerTransform({
  name: 'size/px',
  type: 'value',
  transformer: (token) => {
    if (typeof token.value === 'number') {
      return `${token.value}px`;
    }
    return token.value;
  },
});

StyleDictionary.registerTransform({
  name: 'color/css',
  type: 'value',
  transformer: (token) => {
    if (token.type === 'color') {
      return token.value;
    }
    return token.value;
  },
});

// Register custom formats
StyleDictionary.registerFormat({
  name: 'css/variables',
  formatter: function({ dictionary }) {
    let output = ':root {\n';
    dictionary.allTokens.forEach((token) => {
      output += `  --${token.name}: ${token.value};\n`;
    });
    output += '}\n';
    return output;
  },
});

StyleDictionary.registerFormat({
  name: 'json/flat',
  formatter: function({ dictionary }) {
    const tokens = {};
    dictionary.allTokens.forEach((token) => {
      tokens[token.name] = token.value;
    });
    return JSON.stringify(tokens, null, 2);
  },
});

StyleDictionary.registerFormat({
  name: 'javascript/module',
  formatter: function({ dictionary }) {
    let output = '// Auto-generated token file\n';
    output += '// Do not edit manually\n\n';
    output += 'export const tokens = {\n';
    
    const grouped = {};
    dictionary.allTokens.forEach((token) => {
      const parts = token.name.split('-');
      const category = parts[0];
      
      if (!grouped[category]) {
        grouped[category] = {};
      }
      grouped[category][token.name] = token.value;
    });
    
    Object.entries(grouped).forEach(([category, tokens]) => {
      output += `  ${category}: {\n`;
      Object.entries(tokens).forEach(([name, value]) => {
        output += `    ${name}: '${value}',\n`;
      });
      output += '  },\n';
    });
    
    output += '};\n\n';
    output += 'export default tokens;\n';
    return output;
  },
});

module.exports = {
  source: ['tokens/sd-input/**/*.json'],
  platforms: {
    // Platform 1: CSS Variables
    css: {
      transformGroup: 'css',
      buildPath: 'tokens/output/css/',
      files: [
        {
          destination: '_tokens.css',
          format: 'css/variables',
        },
      ],
    },

    // Platform 2: SCSS
    scss: {
      transformGroup: 'scss',
      buildPath: 'tokens/output/scss/',
      files: [
        {
          destination: '_tokens-generated.scss',
          format: 'scss/variables',
        },
        {
          destination: '_tokens-css-vars.scss',
          format: 'scss/variables',
        },
      ],
    },

    // Platform 3: JavaScript
    js: {
      transformGroup: 'js',
      buildPath: 'tokens/output/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/module',
        },
      ],
    },

    // Platform 4: JSON
    json: {
      transformGroup: 'js',
      buildPath: 'tokens/output/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
        {
          destination: 'tokens-formatted.json',
          format: 'json',
        },
      ],
    },

    // Platform 5: Tailwind
    tailwind: {
      transformGroup: 'js',
      buildPath: 'tokens/output/tailwind/',
      files: [
        {
          destination: 'theme-extend.js',
          format: 'javascript/module',
        },
      ],
    },
  },
};
