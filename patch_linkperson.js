const fs = require('fs');
const file = 'src/components/profile/LinkPerson.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /await updateUser\(user\.id\.toString\(\), {\s*\.\.\.user,\s*personId: selectedPersonId,\s*profileLinkedAt: new Date\(\)\.toISOString\(\)\s*}\);/g,
  `const updatedUser = { ...user, personId: selectedPersonId, profileLinkedAt: new Date().toISOString() };\n      await updateUser(user.id.toString(), updatedUser);\n      await signIn(updatedUser as any);`
);

content = content.replace(
  /await updateUser\(user\.id\.toString\(\), {\s*\.\.\.user,\s*personId: addedPerson\.id,\s*profileLinkedAt: new Date\(\)\.toISOString\(\)\s*}\);/g,
  `const updatedUser = { ...user, personId: addedPerson.id, profileLinkedAt: new Date().toISOString() };\n      await updateUser(user.id.toString(), updatedUser);\n      await signIn(updatedUser as any);`
);

fs.writeFileSync(file, content);
