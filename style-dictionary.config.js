/**
 * Style Dictionary Configuration (v4 compatible)
 * Converts design tokens from Figma → multiple output formats
 */

module.exports = {
  source: ['tokens/sd-input/**/*.json'],
  
  platforms: {
    // CSS Variables using built-in transformer
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
