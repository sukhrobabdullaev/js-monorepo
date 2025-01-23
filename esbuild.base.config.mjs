export const createBuildOptions = ({
                                     entryPoints,
                                     outdir,
                                     format,
                                     globalName,
                                     external = []
                                   }) => ({
  entryPoints,
  outdir,
  bundle: true,
  format: format === 'umd' ? 'iife' : format,
  platform: getPlatform(format),
  sourcemap: true,
  target: 'es2020',
  globalName: format === 'umd' ? globalName : undefined,
  external,
  loader: {'.ts': 'ts'},
  // banner: format === 'umd' ? getBanner(globalName) : undefined
})

const getPlatform = (format) => {
  switch (format) {
    case 'umd':
      return 'browser'
    case 'esm':
      return 'neutral'
    case 'cjs':
      return 'node'
  }
}



// optional fun stuff below

const getBanner = (globalName) => ({
  js: `/*!
 * FastNEAR
 * 🏃🏻💨 High-performance NEAR Protocol utilities
 * 
 * Quick Start (open your console):
 * > ${globalName}.example()
 * 
 * Or click the "?" button for complete examples
 */

// Inject helper functions
(function() {
  const examples = {
    sendNear: \`
// Send 1 NEAR to bob.near
await ${globalName}.sendTokens({
  receiverId: "bob.near",
  amount: "1"
})\`,
    viewAccount: \`
// Get account details
const account = await ${globalName}.viewAccount("bob.near")
console.log(account.balance)\`
  };

  // Add example helper to global object
  ${globalName}.example = () => {
    console.log('%c🏃🏻💨 FastNEAR Examples', 'font-size: 14px; font-weight: bold;');
    Object.entries(examples).forEach(([name, code]) => {
      console.log(\`\\n%c\${name}:\\n\${code}\`, 'color: #5f9f7f;');
    });
  };

  // Inject modal with examples
  const modalHtml = \`
    <div id="fastnear-modal" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.7); z-index:10000;">
      <div style="position:relative; max-width:600px; margin:40px auto; padding:20px; background:white; border-radius:8px; font-family:system-ui;">
        <h2 style="margin-top:0;">🏃🏻💨 FastNEAR Examples</h2>
        <pre style="background:#f5f5f5; padding:15px; border-radius:4px; overflow-x:auto;">\${Object.values(examples).join('\\n\\n')}</pre>
        <button onclick="this.parentElement.parentElement.style.display='none'" 
                style="position:absolute; top:15px; right:15px; border:none; background:none; cursor:pointer; font-size:20px;">×</button>
      </div>
    </div>
  \`;

  // Add help button
  const helpButton = document.createElement('button');
  helpButton.innerHTML = '?';
  helpButton.title = 'Show FastNEAR Examples';
  helpButton.style.cssText = 'position:fixed; bottom:20px; right:20px; width:40px; height:40px; border-radius:50%; background:#5f9f7f; color:white; border:none; cursor:pointer; font-size:20px; z-index:9999;';
  helpButton.onclick = () => {
    if (!document.getElementById('fastnear-modal')) {
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    document.getElementById('fastnear-modal').style.display = 'block';
  };
  document.body.appendChild(helpButton);
})();
`})
