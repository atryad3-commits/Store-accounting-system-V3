const fs = require('fs');
const file = 'src/components/modals/ExtraModals.tsx';
let content = fs.readFileSync(file, 'utf8');

// The replace I did added them twice perhaps?
// Let's replace the block with single declaration
const toReplace = `    isGenerateBarcodesModalOpen, setIsGenerateBarcodesModalOpen,
    isPersonExtraModalOpen, setIsPersonExtraModalOpen,
    personExtraId,
    isPersonExtraModalOpen, setIsPersonExtraModalOpen,
    personExtraId,`;

content = content.replace(toReplace, `    isGenerateBarcodesModalOpen, setIsGenerateBarcodesModalOpen,
    isPersonExtraModalOpen, setIsPersonExtraModalOpen,
    personExtraId,`);

fs.writeFileSync(file, content);
