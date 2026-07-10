with open("src/components/persons/PersonLedgerActionsDropdown.tsx", "r") as f:
    content = f.read()

imports = """import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, DownloadCloud, Activity, Settings, Printer, Edit2, ShoppingCart, RefreshCw, Send, X, Package, Shield, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2pdf from "html2pdf.js";

"""
with open("src/components/persons/PersonLedgerActionsDropdown.tsx", "w") as f:
    f.write(imports + "export default " + content)
