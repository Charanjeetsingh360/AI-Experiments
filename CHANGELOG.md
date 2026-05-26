# Changelog

## Unreleased

- Added CI quality gates for token validation, production build, and high-severity runtime dependency audit.
- Added a browser Content Security Policy baseline while preserving Angular runtime styles and Google Fonts loading.
- Converted token validation to native ES modules so it works with the repository's `"type": "module"` setting.
- Replaced raw pagination SVGs with the shared `<cs-icon>` Material Symbols component.
