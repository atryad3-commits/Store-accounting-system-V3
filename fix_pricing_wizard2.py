with open("src/components/modals/PricingWizardModal.tsx", "r") as f:
    content = f.read()

imports = """import React, { useState } from 'react';
import { motion } from 'motion/react';
import * as lucide from 'lucide-react';
const { Tag, X, Percent, Check, Printer } = lucide as any;

export default function PricingWizardModal(props: any) {
  const {
    pricingWizardInvoice, setPricingWizardInvoice,
    pricingWizardItems, setPricingWizardItems,
    products, storeSettings, toPersianDigits, formatDateDisplay, formatNumber,
    updateProductSalePrice, setSuccessMsg, fetchProducts
  } = props;
  
  const [pricingPrintMode, setPricingPrintMode] = useState<"list" | "labels">("list");
  const [bulkProfitMargin, setBulkProfitMargin] = useState<number>(0);
  
"""

with open("src/components/modals/PricingWizardModal.tsx", "w") as f:
    f.write(imports + "\n  return (\n    <>\n" + content + "\n    </>\n  );\n}\n")
