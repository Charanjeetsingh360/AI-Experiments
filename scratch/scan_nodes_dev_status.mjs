import axios from 'axios';
import fs from 'fs';
import path from 'path';

const FIGMA_TOKEN = process.env.FIGMA_TOKEN ?? process.env.FIGMA_API_TOKEN ?? '';
const FILE_KEY = 'XCvAxa7G7QgiTfk08G2LGg';

const nodesToScan = [
  { name: 'V3 / home', id: '2766:112482' },
  { name: 'login', id: '3247:126153' },
  { name: 'new user', id: '3470:118680' },
  { name: 'V3 / My Schedule / Assigned', id: '183:59750' },
  { name: 'V3 / My Schedule / Assigned 2', id: '3150:147457' },
  { name: 'My Clients', id: '183:59846' },
  { name: 'V2 / Availability & Unavailability / Availability', id: '183:59885' },
  { name: 'V2 / Availability & Unavailability / Unavailability', id: '1966:65873' },
  { name: 'Trainings / V3', id: '183:59923' },
  { name: 'Trainings / V3 2', id: '3281:112251' },
  { name: 'Trainings / V1', id: '3252:127215' },
  { name: 'V1/Key Documents', id: '183:59993' },
  { name: 'Messages / V3', id: '183:60029' },
  { name: 'Caregiver Forms / V3', id: '183:60061' }
];

async function scan() {
  if (!FIGMA_TOKEN) {
    throw new Error('Set FIGMA_TOKEN or FIGMA_API_TOKEN before scanning Figma nodes.');
  }

  const ids = nodesToScan.map(n => n.id).join(',');
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${ids}`;
  
  console.log(`Scanning Figma nodes for devStatus on file ${FILE_KEY}...`);
  try {
    const response = await axios.get(url, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN }
    });
    
    const nodes = response.data.nodes;
    for (const key in nodes) {
      const node = nodes[key].document;
      console.log(`Node: ${node.name} (${key})`);
      console.log(`- type: ${node.type}`);
      console.log(`- devStatus: ${JSON.stringify(node.devStatus || null)}`);
      
      // Let's also traverse children to find any READY_FOR_DEV frames nested or search in general
      if (node.children) {
        traverse(node);
      }
    }
  } catch (error) {
    console.error('Scan failed:', error.message);
  }
}

function traverse(node) {
  if (node.devStatus) {
    console.log(`  Found devStatus on child: ${node.name} (${node.id}) -> ${JSON.stringify(node.devStatus)}`);
  }
  if (node.children) {
    node.children.forEach(traverse);
  }
}

scan();
