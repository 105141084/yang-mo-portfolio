const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "_site");
const sourceFiles = ["index.html", "styles.css", "script.js", "favicon.svg"];
const referencedFiles = new Set(sourceFiles);
const referencePatterns = [
  /\b(?:src|poster|href)=["'](\.\/[^"'?#]+)(?:[?#][^"']*)?["']/gi,
  /url\(\s*["']?(\.\/[^"')?#]+)(?:[?#][^"')]*)?["']?\s*\)/gi
];

function collectReferences(fileName) {
  const content = fs.readFileSync(path.join(root, fileName), "utf8");

  for (const pattern of referencePatterns) {
    for (const match of content.matchAll(pattern)) {
      const relativePath = path.posix.normalize(match[1].replace(/^\.\//, ""));
      if (!relativePath.startsWith("assets/") && !relativePath.startsWith("vendor/")) {
        continue;
      }
      referencedFiles.add(relativePath);
    }
  }
}

for (const fileName of sourceFiles.filter((name) => /\.(?:html|css|js)$/i.test(name))) {
  collectReferences(fileName);
}

const files = [...referencedFiles].sort();
const missingFiles = files.filter((fileName) => !fs.existsSync(path.join(root, fileName)));

if (missingFiles.length) {
  console.error(`Missing referenced files:\n${missingFiles.join("\n")}`);
  process.exit(1);
}

fs.rmSync(outputDir, { recursive: true, force: true });

let totalBytes = 0;
for (const fileName of files) {
  const source = path.join(root, fileName);
  const destination = path.join(outputDir, fileName);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  totalBytes += fs.statSync(source).size;
}

fs.writeFileSync(path.join(outputDir, ".nojekyll"), "");

console.log(
  `Built ${files.length} static files (${(totalBytes / 1024 / 1024).toFixed(2)} MB) in _site.`
);
