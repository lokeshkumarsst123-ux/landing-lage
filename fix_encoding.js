const fs = require('fs');
let text = fs.readFileSync('index.html', 'utf8');

// Fix all remaining <div class="X" standalone-attr> patterns
// Generic fix: merge standalone attribute into class
text = text.replace(/<(div|span|a|section|nav|header|footer|button)\s+class="([^"]+)"\s+([a-z][a-z0-9\-]*)>/g, 
  '<$1 class="$2 $3">');

// Run multiple times to catch nested cases
for (let i = 0; i < 3; i++) {
  text = text.replace(/<(div|span|a|section|nav|header|footer|button)\s+class="([^"]+)"\s+([a-z][a-z0-9\-]*)>/g,
    '<$1 class="$2 $3">');
}

// Fix "port-bg-lavender" which has a space issue
text = text.replace(/class="port-cs-screens "\s*port-bg-lavender/g, 'class="port-cs-screens port-bg-lavender"');

// Fix transform broken in ellipse
text = text.replace(/transform="rotate\((\d+)"\s+(\d+)\s+(\d+)\)/g, 'transform="rotate($1 $2 $3)"');

// Fix Google path fill values that have a space: fill=" #4285F4"
text = text.replace(/fill="\s+(#[0-9A-Fa-f]{3,6})"/g, 'fill="$1"');

// Fix swoosh path - the d attr has fill inside it
// Pattern: d="M5 15Q50 0 115 15 stroke=" color" stroke-width="3" stroke-linecap="round""
text = text.replace(/d="M5 15Q50 0 115 15 stroke="\s*([^"]+)"\s+stroke-width="3"\s+stroke-linecap="round""/g,
  'd="M5 15Q50 0 115 15" stroke="$1" stroke-width="3" stroke-linecap="round"');

// Fix var(--blue) stroke in swoosh
text = text.replace(/stroke="\s*var\(--blue\)"/g, 'stroke="var(--blue)"');

// Fix remaining broken class with leading space
text = text.replace(/class=" ([a-z])/g, 'class="$1');

// Fix id="group-phone-number style=" flex:1"" → id="group-phone-number" style="flex:1"
text = text.replace(/id="group-phone-number style="\s*flex:1""/g, 'id="group-phone-number" style="flex:1"');

// Fix placeholder="John" Doe  → placeholder="John Doe"
text = text.replace(/placeholder="John"\s+Doe/g, 'placeholder="John Doe"');

// Fix style="flex:0" 0 110px → style="flex:0 0 110px"
text = text.replace(/style="flex:0"\s+0\s+110px/g, 'style="flex:0 0 110px"');

// Fix option value= → value=""
text = text.replace(/value=([^">\s])/g, 'value="$1');
text = text.replace(/value=>/g, 'value="">');

// Fix aria-label broken
text = text.replace(/aria-label="Twitter"\s*\/\s*X>/g, 'aria-label="Twitter / X">');

// Fix contact-right/contact-left broken
text = text.replace(/<div class="col-lg-5"\s+offset-lg-1\s+contact-right>/g, '<div class="col-lg-5 offset-lg-1 contact-right">');
text = text.replace(/<div class="col-lg-6"\s+contact-left>/g, '<div class="col-lg-6 contact-left">');

// Count remaining
const badAttrs = (text.match(/<(div|span)\s+class="[^"]+"\s+[a-z][a-z0-9\-]+>/g) || []).length;
console.log('Remaining broken:', badAttrs);
if (badAttrs > 0) {
  const samples = text.match(/<(div|span)\s+class="[^"]+"\s+[a-z][a-z0-9\-]+>/g) || [];
  samples.forEach(s => console.log(' ', s.substring(0, 80)));
}

fs.writeFileSync('index.html', text, 'utf8');
console.log('Done!');
