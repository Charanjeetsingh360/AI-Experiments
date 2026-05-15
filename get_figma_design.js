const axios = require('axios');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./figma-mcp.config.json', 'utf8'));

async function getDesign() {
  // Main file for Web Portal - My Clients page
  const webPortalFileId = config.figmaConfig.figmaFileId; // XCvAxa7G7QgiTfk08G2LGg
  // Mobile app file for Client Card component
  const mobileAppFileId = 'TSOq0ugv6zfr6gFZh5zYrP';
  
  const webPortalNodeIds = ['183-59846']; // My Clients page
  const mobileAppNodeIds = ['3071-45410']; // Client Card component
  
  const token = process.env.FIGMA_API_TOKEN;
  if (!token) {
    console.error('ERROR: FIGMA_API_TOKEN environment variable not set');
    return;
  }

  try {
    // Fetch Web Portal - My Clients page
    console.log('\\n=== FETCHING WEB PORTAL - MY CLIENTS PAGE ===\\n');
    const webResponse = await axios.get(
      `https://api.figma.com/v1/files/${webPortalFileId}/nodes?ids=${webPortalNodeIds.join(',')}`,
      { headers: { 'X-Figma-Token': token } }
    );
    
    const webNodes = webResponse.data.nodes;
    for (const id in webNodes) {
      if (!webNodes[id]) {
        console.log(`--- Node ${id} not found ---`);
        continue;
      }
      const node = webNodes[id].document;
      console.log(`\\n--- PAGE: ${node.name} (${id}) ---\\n`);
      processNode(node, 0, 6); // Increased depth to 6
    }

    // Fetch Mobile App - Client Card component
    console.log('\\n\\n=== FETCHING MOBILE APP - CLIENT CARD COMPONENT ===\\n');
    const mobileResponse = await axios.get(
      `https://api.figma.com/v1/files/${mobileAppFileId}/nodes?ids=${mobileAppNodeIds.join(',')}`,
      { headers: { 'X-Figma-Token': token } }
    );
    
    const mobileNodes = mobileResponse.data.nodes;
    for (const id in mobileNodes) {
      if (!mobileNodes[id]) {
        console.log(`--- Node ${id} not found ---`);
        continue;
      }
      const node = mobileNodes[id].document;
      console.log(`\\n--- COMPONENT: ${node.name} (${id}) ---\\n`);
      processNode(node, 0, 6);
    }

  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

function processNode(node, depth = 0, maxDepth = 4) {
  const indent = '  '.repeat(depth);
  const info = [];
  
  if (node.type) info.push('Type: ' + node.type);
  if (node.layoutMode) info.push('Layout: ' + node.layoutMode);
  
  // Size info
  if (node.absoluteBoundingBox) {
    const box = node.absoluteBoundingBox;
    info.push('Size: ' + Math.round(box.width) + 'x' + Math.round(box.height));
  }
  
  if (node.paddingLeft || node.paddingTop || node.paddingRight || node.paddingBottom) 
    info.push('Padding: T:' + (node.paddingTop||0) + ' R:' + (node.paddingRight||0) + ' B:' + (node.paddingBottom||0) + ' L:' + (node.paddingLeft||0));
  if (node.itemSpacing) info.push('Gap: ' + node.itemSpacing);
  
  // Border radius
  if (node.cornerRadius) info.push('Radius: ' + node.cornerRadius);
  
  // Fills/Background
  if (node.fills && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.color && fill.visible !== false) {
      const r = Math.round(fill.color.r * 255);
      const g = Math.round(fill.color.g * 255);
      const b = Math.round(fill.color.b * 255);
      info.push('BG: rgb(' + r + ',' + g + ',' + b + ')');
    }
  }
  
  // Strokes/Border
  if (node.strokes && node.strokes.length > 0) {
    const stroke = node.strokes[0];
    if (stroke.color && stroke.visible !== false) {
      const r = Math.round(stroke.color.r * 255);
      const g = Math.round(stroke.color.g * 255);
      const b = Math.round(stroke.color.b * 255);
      info.push('Border: rgb(' + r + ',' + g + ',' + b + ') ' + (node.strokeWeight || 1) + 'px');
    }
  }
  
  // Typography
  if (node.style) {
    const s = node.style;
    info.push('Font: ' + s.fontSize + 'px/' + Math.round(s.lineHeightPx || s.fontSize * 1.2) + 'px ' + (s.fontWeight || 400));
    if (s.textAlignHorizontal) info.push('Align: ' + s.textAlignHorizontal);
  }
  
  // Text content
  if (node.characters) {
    info.push('Text: "' + node.characters.substring(0, 30) + (node.characters.length > 30 ? '...' : '') + '"');
  }

  if (node.name) {
    const output = indent + node.name + (info.length > 0 ? ' [' + info.join(' | ') + ']' : '');
    console.log(output); 
  }

  if (node.children && depth < maxDepth) {
    node.children.forEach(child => processNode(child, depth + 1, maxDepth));
  }
}

getDesign();
