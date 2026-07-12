const fs = require('fs');
const content = fs.readFileSync('src/components/invoices/InvoicesList.tsx', 'utf8');

const target = `  } = props;
      
        const activePurchases = invoices`;

const replacement = `  } = props;

  const [invoiceTabFilter, setInvoiceTabFilter] = useState("all");

  useEffect(() => {
    setInvoiceTabFilter("all");
  }, [activeTab]);
      
        const activePurchases = invoices`;

if (content.includes(target)) {
  fs.writeFileSync('src/components/invoices/InvoicesList.tsx', content.replace(target, replacement));
  console.log('Patched state successfully');
} else {
  console.log('Target for state not found');
}
