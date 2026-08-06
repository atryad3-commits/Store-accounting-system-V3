const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

code = code.replace(
/addSystemLog,\n\} from "\.\.\/services\/dataService";/,
`addSystemLog,\n  getLoans,\n  getInstallments,\n} from "../services/dataService";`
);

const fetchLoansFunc = `
  const fetchLoansAndInstallments = async () => {
    try {
      const [lData, iData] = await Promise.all([getLoans(), getInstallments()]);
      setLoans(lData);
      setInstallments(iData);
    } catch (e) {
      console.error("Error fetching loans and installments", e);
    }
  };
`;

code = code.replace(
/const fetchDataSilent = async \(\) => \{/,
fetchLoansFunc + '\n  const fetchDataSilent = async () => {'
);

code = code.replace(
/fetchFinancialYearInfo\(\),/g,
'fetchFinancialYearInfo(),\n        fetchLoansAndInstallments(),'
);

// We can remove the weird dynamic import in handleCreateReceipt if we want, or just leave it since it works, but let's change it.
code = code.replace(
/import\("\.\.\/services\/dataService"\)\.then\(\(\{ getLoans, getInstallments \}\) =>\s+Promise\.all\(\[\s+getLoans\(\)\.then\(setLoans\),\s+getInstallments\(\)\.then\(setInstallments\),\s+\]\),\s+\),/,
'fetchLoansAndInstallments(),'
);

fs.writeFileSync('src/hooks/useAppController.tsx', code);
