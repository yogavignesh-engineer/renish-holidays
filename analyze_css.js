
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf-8");
const css = fs.readFileSync("style.css", "utf-8");

// Extract all class names from HTML
const classRegex = /class="([^"]+)"/g;
const htmlClasses = new Set();
let match;
while ((match = classRegex.exec(html)) !== null) {
  const classes = match[1].split(/\s+/);
  for (const c of classes) {
    if (c) htmlClasses.add(c);
  }
}

// Extract all class selectors from CSS
const cssClassRegex = /\.([a-zA-Z0-9_-]+)(?=[^\{]*\{)/g;
const cssClasses = new Set();
let cssMatch;
// A naive approach: remove comments first
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
while ((cssMatch = cssClassRegex.exec(cssNoComments)) !== null) {
  cssClasses.add(cssMatch[1]);
}

const missing = [];
for (const c of htmlClasses) {
  if (!cssClasses.has(c)) {
    missing.push(c);
  }
}

console.log("Classes in HTML but not in CSS:");
console.log(missing.join(", "));

