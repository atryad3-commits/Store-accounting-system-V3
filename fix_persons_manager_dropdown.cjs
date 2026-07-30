const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonsManager.tsx', 'utf8');

const target1 = `                                      {g.name}
                                  </button>`;
const replacement1 = `                                      {g.icon ? g.icon + " " : ""}{g.name}
                                  </button>`;

code = code.replace(target1, replacement1);

const target2 = `                                      <option key={g.id ? \`id-\${g.id}\` : \`idx-\${index}\`} value={g.id}>
                                        {g.name}
                                      </option>`;
const replacement2 = `                                      <option key={g.id ? \`id-\${g.id}\` : \`idx-\${index}\`} value={g.id}>
                                        {g.icon ? g.icon + " " : ""}{g.name}
                                      </option>`;
code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/persons/PersonsManager.tsx', code);
console.log('Fixed PersonsManager Dropdown');
