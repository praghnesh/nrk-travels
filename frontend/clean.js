const fs = require('fs');
const path = require('path');

function walk(d) {
  fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.tsx') && !p.endsWith('layout.tsx') && !p.includes('components')) {
      let c = fs.readFileSync(p, 'utf8');
      const o = c;
      c = c.replace(/import\s+Navbar\s+from\s+["']@\/components\/navbar\/Navbar["'];?\s*/g, '');
      c = c.replace(/import\s+Footer\s+from\s+["']@\/components\/layout\/Footer["'];?\s*/g, '');
      c = c.replace(/<Navbar\s*\/>\s*/g, '');
      c = c.replace(/<Footer\s*\/>\s*/g, '');
      if (o !== c) {
        fs.writeFileSync(p, c, 'utf8');
        console.log('Cleaned ' + p);
      }
    }
  });
}

walk('e:/nrktravels/nrk-travels/frontend/src/app');
