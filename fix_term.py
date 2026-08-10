import re

with open("src/components/loans/InstallmentPaymentTerminal.tsx", "r") as f:
    content = f.read()

bad1 = """import React, { useState, useRef, useEffect } from 'react';
import { Search, CheckCircle, AlertCircle, ArrowRight, Printer, CreditCard, Banknote, Calendar, User, FileText, ArrowLeft, RotateCcw } from 'lucide-react';"""
good1 = """import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, AlertCircle, ArrowRight, Printer, CreditCard, Banknote, Calendar, User, FileText, ArrowLeft, RotateCcw } from 'lucide-react';"""
content = content.replace(bad1, good1)

bad2 = """export default function InstallmentPaymentTerminal({ showNotification, formatCurrency, onBack, userId }: Props) {
  const [step, setStep] = useState<'search' | 'form' | 'confirm' | 'success'>('search');
  const [searchCode, setSearchCode] = useState('');"""
good2 = """export default function InstallmentPaymentTerminal({ showNotification, formatCurrency, onBack, userId }: Props) {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const [step, setStep] = useState<'search' | 'form' | 'confirm' | 'success'>('search');
  const [searchCode, setSearchCode] = useState(initialCode);"""
content = content.replace(bad2, good2)

with open("src/components/loans/InstallmentPaymentTerminal.tsx", "w") as f:
    f.write(content)

