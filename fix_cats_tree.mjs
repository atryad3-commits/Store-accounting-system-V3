import fs from 'fs';

let content = fs.readFileSync('src/components/products/ProductCategoriesView.tsx', 'utf8');

content = content.replace(
  /import React, { useState, useMemo } from "react";/,
  `import React, { useState, useMemo } from "react";\nimport ProductCategoryModal from "../modals/ProductCategoryModal";\nimport { ChevronDown, ChevronLeft } from "lucide-react";`
);

fs.writeFileSync('src/components/products/ProductCategoriesView.tsx', content);
