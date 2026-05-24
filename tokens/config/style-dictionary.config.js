/**
 * Starter Style Dictionary config for CS360 tokens.
 *
 * Confirm the installed Style Dictionary version before using this directly.
 * This config assumes token files live in ./tokens and output CSS variables
 * should be generated into ./src/styles.
 */

module.exports = {
  source: ['tokens/primitives.json', 'tokens/semantic.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'cs360-tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    json: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/nested',
        },
      ],
    },
  },
};
