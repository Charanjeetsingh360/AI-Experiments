/**
 * Style Dictionary Configuration (SD v5 ESM — migrated from .js CJS)
 * Converts design tokens from Figma → multiple output formats
 */

export default {
  source: ['tokens/sd-input/**/*.json'],

  platforms: {
    // CSS Variables
    css: {
      transformGroup: 'css',
      buildPath: 'tokens/output/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
        },
      ],
    },

    // JSON output
    json: {
      transformGroup: 'web',
      buildPath: 'tokens/output/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
      ],
    },

    // JavaScript output
    js: {
      transformGroup: 'web',
      buildPath: 'tokens/output/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
};
