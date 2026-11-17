import fs from 'node:fs';import assert from 'node:assert/strict';
let ts;try{ts=(await import('typescript')).default}catch{ts=(await import('../tools/node_modules/typescript/lib/typescript.js')).default}
const files=fs.readdirSync('src',{recursive:true}).filter(p=>/\.tsx?$/.test(p));
for(const file of files){const result=ts.transpileModule(fs.readFileSync('src/'+file,'utf8'),{fileName:file,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX,strict:true},reportDiagnostics:true});const errors=result.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error)||[];assert.equal(errors.length,0,file+': '+errors.map(e=>ts.flattenDiagnosticMessageText(e.messageText,' ')).join('; '))}
new Function(fs.readFileSync('scripts/preview-runtime.js','utf8'));
const html=fs.readFileSync('preview/index.html','utf8');for(const m of html.matchAll(/(?:src|href)="(images\/[^"#]+|styles.css|app.js|data.js|favicon.svg)"/g))assert.ok(fs.existsSync('preview/'+m[1]),m[1]);
assert.match(html, /<html[^>]*data-motion="full"/);assert.doesNotMatch(html, /class="motion-toggle"/);
for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes('id="'+m[1]+'"'),'Missing anchor '+m[1]);
console.log(`PASS: ${files.length} TypeScript files parsed; standalone JavaScript syntax; all local assets and section links present.`);
