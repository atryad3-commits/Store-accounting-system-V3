const fs = require('fs');
const states = fs.readFileSync('states.txt', 'utf8');
const jsx = fs.readFileSync('jsx.txt', 'utf8');

const componentCode = `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, ArrowDownToLine, ArrowUpFromLine, TableProperties, Database, 
  Settings2, FileJson, FileSpreadsheet, Plus, CheckCircle
} from 'lucide-react';

interface PersonIOModalProps {
  isOpen: boolean;
  onClose: () => void;
  persons: any[];
  storeSettings: any;
  addPerson: (p: any) => Promise<any>;
  showNotification: (msg: string, type: 'success' | 'error' | 'info') => void;
  confirmAction: (msg: string, callback: () => void) => void;
}

export default function PersonIOModal({
  isOpen, onClose, persons, storeSettings, addPerson, showNotification, confirmAction
}: PersonIOModalProps) {
${states}

  if (!isOpen) return null;

  return (
    ${jsx.replace(/isPersonIOModalOpen && \(\s*([\s\S]*)\s*\)/, '$1')}
  );
}
`;

fs.writeFileSync('src/components/modals/PersonIOModal.tsx', componentCode);
