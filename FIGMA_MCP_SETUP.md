# Figma MCP Setup Guide

Complete step-by-step guide to set up Figma integration with your AI-Experiments repository.

## Prerequisites

- Node.js 18+
- GitHub account with repository access
- Figma account with design file
- Administrator access to repository

## Steps

### 1. Create Figma Personal Access Token

1. Go to [Figma Developers](https://www.figma.com/developers/api)
2. Click "Create a new personal access token"
3. Name: `AI-Experiments-Sync`
4. Select scope: `file_content:read`
5. Click "Create token"
6. **Save the token** (you won't see it again)

### 2. Add GitHub Secret

1. Go to your repository: `https://github.com/Charanjeetsingh360/AI-Experiments`
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `FIGMA_API_TOKEN`
5. Value: Paste your Figma token from Step 1
6. Click "Add secret"

### 3. Get Your Figma File ID

1. Open your Figma design file
2. Copy the file ID from the URL:
   ```
   figma.com/file/YOUR_FILE_ID_HERE/...
   ```
3. Save the file ID

### 4. Update Configuration

1. Open `figma-mcp.config.json`
2. Find the line:
   ```json
   "figmaFileId": "YOUR_FIGMA_FILE_ID_HERE"
   ```
3. Replace with your actual file ID from Step 3
4. Commit and push the change

### 5. Create Figma Design Variables

In your Figma file:

1. Go to Assets panel → Variables tab
2. Click "+" to create variable group
3. Name: `color`
4. Create variables:
   - `color/text/primary`
   - `color/text/secondary`
   - `color/action/primary`
   - etc.
5. Add modes:
   - `Light` (default)
   - `Dark`
   - `High Contrast`
6. Set values for each mode

### 6. Test Locally (Optional)

```bash
# Install dependencies
npm install style-dictionary

# Generate tokens
npm run tokens:generate

# Validate
npm run tokens:validate

# Expected output:
# ✅ VALIDATION PASSED
```

### 7. Trigger First Sync

Option A - Manual via GitHub Actions:
1. Go to Actions tab
2. Select "Figma MCP Token Sync" workflow
3. Click "Run workflow"
4. Wait for completion

Option B - Automatic:
- Sync runs daily at 2 AM UTC
- Next sync will be automatic

## Troubleshooting

### "FIGMA_API_TOKEN not found"
- Verify token added to GitHub Secrets
- Check secret name exactly: `FIGMA_API_TOKEN`
- Regenerate token if needed

### "Figma File ID not configured"
- Double-check file ID in `figma-mcp.config.json`
- Format should be 24-character alphanumeric string
- Commit and push changes

### "Validation FAILED"
- Check token naming follows convention
- Ensure all themes have variables
- Verify no hardcoded hex values

### "No changes detected"
- Tokens haven't changed since last sync
- Make changes in Figma and try again
- Use `force_sync: true` in workflow input

## Monitoring Syncs

Check audit logs:
```bash
ls tokens/audit-logs/
cat tokens/audit-logs/sync-*.json
```

View workflow runs:
- Go to Actions tab
- Select "Figma MCP Token Sync"
- Check run history and logs

## Next Steps

After first successful sync:
1. Review generated files in `tokens/output/`
2. Integrate tokens into your components
3. Test in light/dark/high-contrast modes
4. Test with all density levels
5. Set up daily sync monitoring

## Support

- Documentation: `FIGMA_MCP_IMPLEMENTATION.md`
- Quick reference: `PHASE_1_COMPLETE.md`
- GitHub Issues: Report problems here
- Audit logs: `tokens/audit-logs/`
