const fs = require('fs');
const file = 'src/components/modals/ExtraModals.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{isGenerateBarcodesModalOpen && (",
  `{isPersonExtraModalOpen && (
        <PersonExtraModal
          isOpen={isPersonExtraModalOpen}
          onClose={() => setIsPersonExtraModalOpen(false)}
          personId={personExtraId}
          persons={persons}
          onSuccess={async () => {
             // You can add refetch logic if needed, or rely on snapshot
          }}
          showNotification={showNotification}
        />
      )}
      {isGenerateBarcodesModalOpen && (`
);

fs.writeFileSync(file, content);
