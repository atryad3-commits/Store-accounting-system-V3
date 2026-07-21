import { SystemUpdatePage } from "./components/admin/SystemUpdatePage";
import { PersonalNotesManager } from "./components/notes/PersonalNotesManager";
import FastStocktakingMobile from "./components/inventory/FastStocktakingMobile";
import PricingWizardModal from './components/modals/PricingWizardModal';
import ReceiptsList from './components/financial/ReceiptsList';
import InvoicesList from './components/invoices/InvoicesList';
import CurrencyInput from './components/common/CurrencyInput';
import FastBarcodeScanner from './components/common/FastBarcodeScanner';
import PersonLedgerActionsDropdown from './components/persons/PersonLedgerActionsDropdown';
import ChangelogModal from './components/ChangelogModal';
import changelogData from './data/changelog.json';
import ReceiveReceiptModal from "./components/financial/ReceiveReceiptModal";
import PayReceiptModal from "./components/financial/PayReceiptModal";
import AccountsManager from "./components/accounts/AccountsManager";
import CashboxesManager from "./components/accounts/CashboxesManager";
import PersonsManager from "./components/persons/PersonsManager";
import DebtorsNotification from "./components/DebtorsNotification";
import BeautifulLoading from "./components/BeautifulLoading";
import DataReconciliation from "./components/DataReconciliation";
import CreateSalaryPayroll from './components/payroll/CreateSalaryPayroll';
import ListSalaryPayroll from './components/payroll/ListSalaryPayroll';
import React, { useState, useEffect, useMemo, useRef } from "react";

import ProductsTab from "./components/products/ProductsTab";
import PersonOpeningBalances from "./components/persons/PersonOpeningBalances";
import PersonLedger from "./components/persons/PersonLedger";
import SettingsTab from "./components/admin/SettingsTab";
import SidebarNavigation from "./components/SidebarNavigation";
import MobileRestrictedMenu from "./components/MobileRestrictedMenu";
import MinimalMobilePersonModal from "./components/modals/MinimalMobilePersonModal";

import WarehouseManager from './components/warehouses/WarehouseManager';

import PersonGroupsManager from "./components/persons/PersonGroupsManager";
import PersonRolesManager from "./components/persons/PersonRolesManager";

// { useState, useEffect, useMemo, useRef } from "react";
import WarehouseDocCreate from './components/warehouses/WarehouseDocCreate';
import SaleInvoiceCreate from './components/invoices/SaleInvoiceCreate';
import CalculatorModal from "./components/modals/CalculatorModal";
import SaleReturnInvoiceCreate from './components/invoices/SaleReturnInvoiceCreate';
import PurchaseInvoiceCreate from './components/invoices/PurchaseInvoiceCreate';
import PurchaseReturnInvoiceCreate from './components/invoices/PurchaseReturnInvoiceCreate';
import Barcode from "react-barcode";
import {
  Building,
  ScanLine,
  Shield,
  Key,
  Maximize,
  Minimize,
  Tag,
  Plus,
  Trash2,
  Edit2,
  Image,
  Save,
  FileText,
  User,
  ShoppingCart,
  Calculator,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  FilePlus,
  Calendar,
  List,
  Receipt,
  Search,
  DollarSign,
  Package,
  X,
  Zap,
  RefreshCw,
  Menu,
  Github,
  CreditCard,
  Wallet,
  Store,
  Settings,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Printer,
  Eye,
  ListTodo,
  CheckSquare,
  LogOut,
  LogIn,
  Database,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileSpreadsheet,
  Users,
  BookOpen,
  ClipboardList,
  Activity,
  Clock,
  History,
  ArrowRightLeft,
  Percent,
  LayoutList,
  GripHorizontal,
  Box,
  CornerDownLeft,
  CornerUpRight,
  Banknote,
  PackagePlus,
  Copy,
  LayoutDashboard,
  Layers,
  Phone,
  MapPin,
  PlusCircle,
  MinusCircle,
  Barcode as BarcodeIcon,
  LayoutGrid,
  Table,
  Download,
  Globe,
  Bell,
  Sparkles,
  Ban,
  Pencil,
  Check,
} from "lucide-react";
import * as XLSX from "xlsx";
import { playAudioFeedback } from "./utils/audio";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Cell,
} from "recharts";
import {
  addCommas,
  removeCommas,
  numberToWords,
  getBaseValueInToman,
  getDefaultExchangeRate,
  showInvoiceCurrency,
  numToPersianWords,
  toPersianDigits,
  formatDateDisplay, convertToGregorian, customPersonFilter,
} from "./utils/format";
import CustomDatePicker from "./components/ui/CustomDatePicker";
const DatePicker = CustomDatePicker;
import html2pdf from "html2pdf.js";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import ProductFormModal from "./components/modals/ProductFormModal";
import PersonFormModal from "./components/modals/PersonFormModal";
import AccountFormModal from "./components/modals/AccountFormModal";
import CashboxFormModal from "./components/modals/CashboxFormModal";
import WarehouseFormModal from "./components/modals/WarehouseFormModal";
import SmsPanel from "./components/admin/SmsPanel";

import Select from "react-select";
import { useAuth } from "./context/AuthContext";
import {
  generateId,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getCheckbooks,
  addCheckbook,
  updateCheckbook,
  deleteCheckbook,
  getIssuedChecks,
  addIssuedCheck,
  updateIssuedCheck,
  deleteIssuedCheck,
  getReceivedChecks,
  addReceivedCheck,
  updateReceivedCheck,
  deleteReceivedCheck,
  getLocalData,
  saveLocalData,
  getStoreSettings,
  saveStoreSettings,
  getSmsMessages,
  addSmsMessage,
  deleteSmsMessage,
  getPersonGroups,
  addPersonGroup,
  updatePersonGroup,
  deletePersonGroup,
  getPersonRoles,
  addPersonRole,
  updatePersonRole,
  deletePersonRole,
  getPersons,
  addPerson,
  updatePerson,
  deletePerson,
  getPersonOpeningBalances,
  addPersonOpeningBalance,
  updatePersonOpeningBalance,
  deletePersonOpeningBalance,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  addProductCategory,
  updateProductCategory,
  deleteProductCategory,
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  getCashboxes,
  addCashbox,
  updateCashbox,
  deleteCashbox,
  getWarehouses,
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getInvoices,
  getInventoryTransactions,
  addInvoice,
  generateDocNumber,
  updateDocCounter,
  updateInvoice,
  deleteInvoice,
  voidInvoice,
  getTransactions,
  addTransaction,
  getPayslips,
  addPayslip,
  updateTransaction,
  deleteTransaction,
  getWarehouseStocks,
  getProductPriceHistory,
  updateProductPriceHistory,
  recalculateAllWarehouseStocks,
  getFinancialYears,
  getActiveFinancialYear,
  addFinancialYear,
  closeFinancialYear,
  getAccountingDocuments,
} from "./services/dataService";
import ModuleSelector from "./components/ui/ModuleSelector";
import DatabaseReconciliation from "./components/admin/DatabaseReconciliation";
import DatabaseDashboard from "./components/admin/DatabaseDashboard";
import SystemChecklist from "./components/admin/SystemChecklist";
import SystemLogs from "./components/admin/SystemLogs";
import DatabaseLogs from "./components/admin/DatabaseLogs";

import GroupPriceUpdateWizard from "./components/modals/GroupPriceUpdateWizard";
import ProductPriceChangeModal from "./components/modals/ProductPriceChangeModal";
import PrintBarcodeModal from "./components/modals/PrintBarcodeModal";
import ProductCardModal from "./components/modals/ProductCardModal";
import ProductLastPricesView from "./components/reports/ProductLastPricesView";
import QuickPriceInquiry from "./components/inventory/QuickPriceInquiry";
import CheckManagement from "./components/financial/CheckManagement";
import PersonNotesAndAttachments from "./components/financial/PersonNotesAndAttachments";
import InvoiceAllocation from "./components/financial/InvoiceAllocation";

import SearchableSelect from "./components/ui/SearchableSelect";
import BarcodeScannerModal from "./components/modals/BarcodeScannerModal";
import EditReceiptModal from "./components/modals/EditReceiptModal";
import FinancialTransfer from "./components/financial/FinancialTransfer";
import QuickRefund from "./components/financial/QuickRefund";
import UserManager from "./components/admin/UserManager";
import ProfileModal from "./components/auth/ProfileModal";
import InventoryReport from "./components/reports/InventoryReport";
import KardexReport from "./components/reports/KardexReport";
import CRMDashboard from "./components/crm/CRMDashboard";
import SystemDiagnostics from "./components/admin/SystemDiagnostics";
import StocktakingManager from "./components/inventory/StocktakingManager";
import AnalyticalDashboard from "./components/reports/AnalyticalDashboard";
import FinancialDashboard from "./components/reports/FinancialDashboard";
import DebtsCreditsReport from "./components/reports/DebtsCreditsReport";
import LoansManager from "./components/loans/LoansManager";
import ChartOfAccounts from "./components/accounting/ChartOfAccounts";
import AccountingDocsList from "./components/accounting/AccountingDocsList";
import AccountingDocCreate from "./components/accounting/AccountingDocCreate";
import AccountingDocView from "./components/accounting/AccountingDocView";
import AccountingAutoSync from "./components/accounting/AccountingAutoSync";
import AccountingVerification from "./components/accounting/AccountingVerification";
import OpeningBalances from "./components/accounting/OpeningBalances";
import FinancialYearManager from "./components/accounting/FinancialYearManager";
import WarehousePrintTemplate from "./components/print/WarehousePrintTemplate";
import InvoicePrintTemplate from "./components/print/InvoicePrintTemplate";
import AIProductSearchModal from "./components/products/AIProductSearchModal";
import BulkProductImportModal from "./components/products/BulkProductImportModal";
import FastProductCreateModal from "./components/products/FastProductCreateModal";
import PersonProfileView from "./components/persons/PersonProfileView";
import PersonIOModal from "./components/modals/PersonIOModal";
import ProductCategoriesView from "./components/products/ProductCategoriesView";
import {
  Person,
  PersonGroup,
  Product,
  Account,
  Cashbox,
  Warehouse,
  InvoiceItem,
  WarehouseStock,
} from "./types";
import appVersion from "./version.json";
import OrderList from "./components/inventory/OrderList";
import { useAppController } from "./hooks/useAppController";






export default function App() {

        const [invoicePrintFormat, setInvoicePrintFormat] = useState<'a4' | 'a5' | 'pos80'>('a4');
  
  const INVOICE_PRINT_FORMATS = {
    a4: { name: 'کاغذ A4', css: `@page { size: A4 portrait; margin: 5mm; } .print-section { width: 210mm !important; }` },
    a5: { name: 'کاغذ A5', css: `@page { size: A5 portrait; margin: 5mm; } .print-section { width: 148mm !important; font-size: 0.85em; }` },
    pos80: { name: 'فیش پرینتر (80mm)', css: `@page { size: 80mm auto; margin: 1mm; } .print-section { width: 78mm !important; padding: 2mm !important; font-size: 0.75em; } .print-section table { font-size: 0.85em; }` }
  };
const appState = useAppController();
      const {
        isFastStocktaking, activeFinancialYear,
        hasCheckedFinancialYears,
        isComposeOpen,
        setIsComposeOpen,
        priceChangeProduct,
        setPriceChangeProduct,
        confirmState,
        setConfirmState,
        confirmAction,
        user,
        signOut,
        activeTab,
        setRawActiveTab,
        setActiveTab,
        systemModule,
        setSystemModule,
        isSidebarOpen,
        setIsSidebarOpen,
        isCalculatorOpen,
        setIsCalculatorOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        setIsChangelogModalOpen,
        isFullWidth,
        setIsFullWidth,
        menuLayout,
        setMenuLayout,
        expandedGroups,
        setExpandedGroups,
        persons,
        setPersons,
        personOpeningBalances,
        isOpeningBalanceModalOpen,
        setIsOpeningBalanceModalOpen,
        editingOpeningBalanceId,
        setEditingOpeningBalanceId,
        selectedOpeningBalancePersonId,
        setSelectedOpeningBalancePersonId,
        openingBalanceAmount,
        setOpeningBalanceAmount,
        openingBalanceType,
        setOpeningBalanceType,
        openingBalanceDate,
        setOpeningBalanceDate,
        openingBalanceDescription,
        setOpeningBalanceDescription,
        openingBalanceSearch,
        setOpeningBalanceSearch,
        submittingOpeningBalance,
        setSubmittingOpeningBalance,
        personGroups,
        personRoles,
        products,
        setProducts,
        invoices,
        accounts,
        setAccounts,
        cashboxes,
        warehouses,
        warehouseStocks,
        loans,
        setLoans,
        installments,
        setInstallments,
        warehouseSubTab,
        setWarehouseSubTab,
        recalculating,
        personSearchTerm,
        setPersonSearchTerm,
        selectedProductIds,
        setSelectedProductIds,
        whStockSearch,
        setWhStockSearch,
        selectedPersonGroup,
        setSelectedPersonGroup,
        selectedPersonRole,
        setSelectedPersonRole,
        personCurrentPage,
        setPersonCurrentPage,
        personPageSize,
        setPersonPageSize,
        personsViewMode,
        setPersonsViewMode,
        getRoleName,
        getRoleBadgeClasses,
        mapPersonToOption,
        activePersonsOnly,
        filteredPersons,
        transactions,
        setTransactions,
        payslips,
        accountingDocuments,
        checkbooks,
        issuedChecks,
        receivedChecks,
        storeSettings,
        setStoreSettings,
        isGmailTheme,
        loading,
        authLoading,
        requiresInitSetup,
        sendNotification,
        receiptNumber,
        setReceiptPersonId,
        printingTransaction,
        setPrintingTransaction,
        receiptLinkedInvoices,
        submittingReceipt,
        viewingPayslip,
        setViewingPayslip,
        printingPersonLedger,
        setPrintingPersonLedger,
        printingBarcodeProduct,
        setPrintingBarcodeProduct,
        ledgerPersonId,
        setLedgerPersonId,
        profilePersonId,
        setProfilePersonId,
        ledgerTab,
        setLedgerTab,
        reportDateRange,
        setReportDateRange,
        viewingInvoice,
        setViewingInvoice,
        viewingCheck,
        setViewingCheck,
        viewingAccountingDoc,
        setViewingAccountingDoc,
        isAccountingDocModalOpen,
        setIsAccountingDocModalOpen,
        editingAccountingDoc,
        setEditingAccountingDoc,
        pricingWizardInvoice,
        setPricingWizardInvoice,
        pricingWizardItems,
        setPricingWizardItems,
        previewInvoiceData,
        setPreviewInvoiceData,
        previewReceiptData,
        setPreviewReceiptData,
        editingReceipt,
        setEditingReceipt,
        isEditReceiptModalOpen,
        setIsEditReceiptModalOpen,
        showProductBarcodesList,
        setShowProductBarcodesList,
        invoiceType,
        invoiceNumber,
        date,
        setCustomerId,
        items,
        submitting,
        transferProposal,
        setTransferProposal,
        clearDraft,
        notification,
        setNotification,
        showNotification,
        setSuccessMsg,
        customAlert,
        successMsg,
        isScannerOpen,
        setIsScannerOpen,
        isBulkImportOpen,
        setIsBulkImportOpen,
        handleBulkImportItems,
        handleBarcodeScan,
        productCategories,
        isCategoryModalOpen,
        setIsCategoryModalOpen,
        newCatName,
        setNewCatName,
        newCatParentId,
        setNewCatParentId,
        editingCategoryId,
        newCatDesc,
        setNewCatDesc,
        submittingProduct,
        setNewCashboxBalance,
        setNewWarehouseName,
        setNewWarehouseManager,
        setNewWarehouseLocation,
        setNewWarehouseIsActive,
        handleSubmitPerson,
        isProductModalOpen,
        setIsProductModalOpen,
        isFastProductModalOpen,
        setIsFastProductModalOpen,
        isGenerateBarcodesModalOpen,
        setIsGenerateBarcodesModalOpen,
        barcodeFormat,
        setBarcodeFormat,
        barcodePrefix,
        setBarcodePrefix,
        barcodeLength,
        setBarcodeLength,
        barcodeStartNumber,
        setBarcodeStartNumber,
        isGroupPriceModalOpen,
        setIsGroupPriceModalOpen,
        isPersonModalOpen,
        setIsPersonModalOpen,
        newPersonType,
        setNewPersonType,
        setNewPersonTitle,
        setNewPersonAlias,
        newPersonFirstName,
        setNewPersonFirstName,
        newPersonLastName,
        setNewPersonLastName,
        newPersonCompanyName,
        setNewPersonCompanyName,
        setNewPersonFatherName,
        setNewPersonNationalId,
        setNewPersonAddress,
        setNewPersonImage,
        newPersonRole,
        setNewPersonRole,
        setNewPersonAccountingCode,
        newPersonPhone,
        setNewPersonPhone,
        setNewPersonContacts,
        setNewPersonInitialBalance,
        setNewPersonInitialBalanceType,
        setNewPersonCreditLimit,
        submittingPerson,
        isPersonExtraModalOpen,
        setIsPersonExtraModalOpen,
        personExtraId,
        setPersonExtraId,
        setPersonBankName,
        setPersonBankAcc,
        setPersonCard,
        setPersonSheba,
        personBankAccounts,
        setPersonBankAccounts,
        personNotes,
        setPersonNotes,
        isPersonIOModalOpen,
        setIsPersonIOModalOpen,
        personIOAction,
        setPersonIOAction,
        isAccountModalOpen,
        setIsAccountModalOpen,
        isCashboxModalOpen,
        setIsCashboxModalOpen,
        isWarehouseModalOpen,
        setIsWarehouseModalOpen,
        viewingProduct,
        setViewingProduct,
        editingProductId,
        editingPersonId,
        setEditingPersonId,
        editingAccountId,
        setEditingAccountId,
        editingCashboxId,
        setEditingCashboxId,
        editingWarehouseId,
        setEditingWarehouseId,
        settingsForm,
        setSettingsForm,
        submittingSettings,
        settingsTab,
        setSettingsTab,
        fetchInvoices,
        fetchProducts,
        handleExportProductsData,
        handleDownloadProductsTemplate,
        handleImportProductsData,
        handleFastSaveProduct,
        handleSaveCategory,
        handleGenerateBarcodes,
        fetchPersons,
        fetchPersonOpeningBalances,
        handleDeletePerson,
        isGeneratingCodes,
        handleGenerateMissingAccountingCodes,
        fetchAccounts,
        handleDeleteAccount,
        fetchCashboxes,
        fetchTransactions,
        fetchAccountingDocuments,
        confirmReceiptSubmit,
        handleEditReceiptByCheck,
        handleSaveReceipt,
        handleDeleteCashbox,
        handleDeleteWarehouse,
        handleRecalculateStocks,
        handleEditWarehouse,
        handleToggleProductActive,
        handleDuplicateProduct,
        handleEditPerson,
        handleEditAccount,
        handleEditCashbox,
        handleSaveSettings,
        handleLogoUpload,
        fetchDataSilent,
        fetchData,
        getLastPriceForProduct,
        handleFastAddProduct,
        handleFastBarcodeScan,
        getPersonDisplayName,
        renderPersonLink,
        handleEditInvoiceAction,
        saveInvoiceData,
        handleExecuteTransferAndSubmit,
        formatProductStockDetails,
        calculatePersonBalance,
        formatCurrency,
        toPersianDigits,
        formatNumber,
        renderTabContent
      } = appState;

  if (appState.isStoreSelectionOpen) {
    return (
      <StoreSelectionModal 
        availableStores={appState.availableStores} 
        setAvailableStores={appState.setAvailableStores} 
        onSelectStore={(id: string) => {
          localStorage.setItem("activeStoreId", id);
          window.location.reload();
        }} 
      />
    );
  }

if (loading || authLoading) {
    const textStr = authLoading ? "در حال بررسی احراز هویت..." : "در حال بارگذاری اطلاعات و تنظیمات سیستم...";
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden" dir="rtl">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Logo/Icon */}
          <div className="relative w-24 h-24 mb-8">
            <motion.div
              className="absolute inset-0 border-4 border-indigo-200 rounded-2xl"
              animate={{ rotate: 180, scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-2 border-4 border-blue-400 rounded-xl"
              animate={{ rotate: -180, scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-4 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30"
              animate={{ scale: [1, 0.9, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <LayoutDashboard className="w-6 h-6 text-white" />
            </motion.div>
          </div>

          {/* Loading Text */}
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              نرم‌افزار جامع مدیریت مالی
            </h2>
            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
              <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                 className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
              />
              <span className="text-sm font-bold text-slate-500">{textStr}</span>
            </div>
          </div>
        </div>

        {/* Decorative progress bar */}
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-slate-100">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

if (requiresInitSetup && user) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-10 pb-10"
        dir="rtl"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden max-w-xl w-full">
          <div className="bg-slate-900 p-10 text-center text-white relative overflow-hidden">
            <h1 className="text-2xl font-black mb-3 relative z-10 tracking-tight">
              خوش آمدید
            </h1>
            <p className="text-slate-300 font-medium relative z-10 text-sm">
              جهت ورود به سیستم، تنظیمات اولیه را تکمیل نمایید
            </p>
          </div>
          <div className="p-8">
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm font-bold flex items-start gap-3 mb-8 border border-amber-100 shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                توجه: <strong>نوع تقویم</strong> و <strong>واحد پولی</strong> پس
                از ثبت برای حفظ یکپارچگی پایگاه داده سیستم{" "}
                <strong>غیرقابل تغییر</strong> خواهند بود.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  نام مجموعه / شرکت
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeName}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      storeName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-800 focus:border-slate-800 focus:bg-white transition-colors font-semibold text-slate-900"
                  placeholder="عنوان کسب و کار خود را وارد کنید..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  واحد پولی سیستم
                </label>
                <select
                  value={settingsForm.currency}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      currency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-800 focus:border-slate-800 focus:bg-white transition-colors font-semibold text-slate-900"
                >
                  <option value="ریال">ریال</option>
                  <option value="تومان">تومان</option>
                  <option value="دلار">دلار (USD)</option>
                  <option value="افغانی">افغانی</option>
                  <option value="درهم">درهم (AED)</option>
                  <option value="یورو">یورو (EUR)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  تاریخ و تقویم سیستم
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm({
                        ...settingsForm,
                        calendarType: "jalali",
                      })
                    }
                    className={`py-4 px-2 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${settingsForm.calendarType !== "gregorian" ? "border-slate-800 bg-slate-800 text-white shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"}`}
                  >
                    تقویم شمسی (جلالی)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm({
                        ...settingsForm,
                        calendarType: "gregorian",
                      })
                    }
                    className={`py-4 px-2 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${settingsForm.calendarType === "gregorian" ? "border-slate-800 bg-slate-800 text-white shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"}`}
                  >
                    تقویم میلادی
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  فونت سیستم
                </label>
                <select
                  value={settingsForm.fontFamily || "Vazirmatn"}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      fontFamily: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-800 focus:border-slate-800 focus:bg-white transition-colors font-semibold text-slate-900"
                >
                  <option value="Vazirmatn">وزیرمتن (Vazirmatn)</option>
                  <option value="IRANYekanXFaNum">
                    ایران یکان (IRANYekanX)
                  </option>
                  <option value="Lalezar">لاله‌زار (Lalezar)</option>
                  <option value="Readex Pro">ریدکس پرو (Readex Pro)</option>
                  <option value="Cairo">قاهره (Cairo)</option>
                  <option value="Amiri">امیری (Amiri)</option>
                  <option value="Changa">چنگا (Changa)</option>
                  <option value="Tahoma">تاهوما (Tahoma)</option>
                </select>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-2">
                <button
                  type="submit"
                  disabled={submittingSettings}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98] focus:ring-4 focus:ring-slate-100"
                >
                  {submittingSettings ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  ثبت نهایی و ورود به سیستم
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }




      return (
        <>
          <DebtorsNotification persons={persons} 
            settings={storeSettings} 
            
            calculatePersonBalance={calculatePersonBalance} 
            onOpenPersonProfile={(pid) => { 
              setProfilePersonId(pid); 
              setActiveTab("person_profile");
            }} 
          />
          <AnimatePresence>
            {notification && (
              <motion.div
                key="notification-toast"
                initial={{ opacity: 0, y: 50, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 20, x: "-50%" }}
                className={`fixed bottom-6 left-1/2 z-[99999] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
                  notification.type === "success"
                    ? "bg-emerald-600 text-white"
                    : notification.type === "error"
                      ? "bg-rose-600 text-white"
                      : notification.type === "warning"
                        ? "bg-amber-500 text-white"
                        : "bg-slate-800 text-white"
                }`}
              >
                {notification.type === "success" && (
                  <CheckCircle className="w-5 h-5" />
                )}
                {notification.type === "error" && (
                  <AlertCircle className="w-5 h-5" />
                )}
                {(notification.type === "info" ||
                  notification.type === "warning") && <Info className="w-5 h-5" />}
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>
          
          

          <MobileRestrictedMenu activeTab={activeTab} setActiveTab={setActiveTab} setIsPersonModalOpen={setIsPersonModalOpen} setIsProductModalOpen={setIsProductModalOpen} />
          {/* Confirm Action Modal */}{" "}
          {confirmState.isOpen && (
            <div className="fixed inset-0 bg-slate-900/40 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl flex flex-col items-center border border-gray-100 overflow-hidden"
                dir="rtl"
              >
                {confirmState.loading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[10] flex items-center justify-center">
                    <BeautifulLoading text="در حال انجام عملیات..." />
                  </div>
                )}
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg mb-2">تایید عملیات</h3>
                <p className="text-gray-500 text-sm text-center mb-4">
                  {confirmState.message}
                </p>
                {confirmState.details && (
                   <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 text-sm text-slate-700 max-h-48 overflow-y-auto whitespace-pre-wrap text-right">
                      {confirmState.details}
                   </div>
                )}
                <div className="flex gap-3 w-full">
                  <button
                    disabled={confirmState.loading}
                    onClick={async () => {
                      setConfirmState({ ...confirmState, loading: true });
                      try {
                        await confirmState.onConfirm();
                      } finally {
                        setConfirmState({ ...confirmState, isOpen: false, loading: false });
                      }
                    }}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {confirmState.loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    بله، تایید
                  </button>
                  <button
                    disabled={confirmState.loading}
                    onClick={() =>
                      setConfirmState({ ...confirmState, isOpen: false })
                    }
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-xl font-bold transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              </motion.div>
            </div>
          )}
          {/* Gmail style Compose Quick Action Modal */}
          {isComposeOpen && (
                    <div key="isComposeOpen-modal"
                      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[200] p-4 print:hidden"
              dir="rtl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col font-sans"
              >
                {/* Modal Header */}
                <div className="bg-[#f6f8fc] px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#fdf2f2] text-[#b3261e] rounded-xl flex items-center justify-center shadow-xs">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-800">
                        ایجاد سریع سند / تراکنش
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        میانبرهای کاربردی برای ثبت سریع اطلاعات در بخش‌های مختلف
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="p-1.5 hover:bg-slate-200/50 text-slate-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white max-h-[70vh] overflow-y-auto">
                  {/* Shortcut Item 1 */}
                  <button
                    type="button"
                    onClick={() => {
                      clearDraft();
                      setActiveTab("create_sale");
                      setIsComposeOpen(false);
                    }}
                    className="p-4 border border-slate-200 hover:border-[#b3261e]/40 hover:bg-rose-50/10 rounded-2xl text-right flex gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0 flex items-center justify-center font-bold">
                      📑
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">
                        صدور فاکتور فروش کالا
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        فروش کالا و خدمات به مشتریان با ثبت خودکار سند حسابداری و
                        کاهش موجودی انبار.
                      </p>
                    </div>
                  </button>

                  {/* Shortcut Item 2 */}
                  <button
                    type="button"
                    onClick={() => {
                      clearDraft();
                      setActiveTab("create_purchase");
                      setIsComposeOpen(false);
                    }}
                    className="p-4 border border-slate-200 hover:border-[#b3261e]/40 hover:bg-rose-50/10 rounded-2xl text-right flex gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex-shrink-0 flex items-center justify-center font-bold">
                      🛒
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">
                        ثبت فاکتور خرید کالا
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        ثبت خرید کالا و خدمات از تامین‌کنندگان برای افزایش موجودی
                        انبار.
                      </p>
                    </div>
                  </button>

                  {/* Shortcut Item 3 */}
                  <button
                    type="button"
                    onClick={() => {
                      setRawActiveTab("create_receive_receipt");
                      setIsComposeOpen(false);
                    }}
                    className="p-4 border border-slate-200 hover:border-[#b3261e]/40 hover:bg-rose-50/10 rounded-2xl text-right flex gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex-shrink-0 flex items-center justify-center font-bold">
                      💵
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">
                        ثبت سند دریافت وجه
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        ثبت مبالغ دریافتی از مشتریان، صندوق یا بانک به صورت نقد یا
                        چک.
                      </p>
                    </div>
                  </button>

                  {/* Shortcut Item 4 */}
                  <button
                    type="button"
                    onClick={() => {
                      setRawActiveTab("create_pay_receipt");
                      setIsComposeOpen(false);
                    }}
                    className="p-4 border border-slate-200 hover:border-[#b3261e]/40 hover:bg-rose-50/10 rounded-2xl text-right flex gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0 flex items-center justify-center font-bold">
                      💸
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">
                        ثبت سند پرداخت وجه
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        ثبت پرداختی‌های نقد یا چک به تامین‌کنندگان، هزینه‌ها یا
                        پرسنل.
                      </p>
                    </div>
                  </button>

                  {/* Shortcut Item 5 */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("transfer");
                      setIsComposeOpen(false);
                    }}
                    className="p-4 border border-slate-200 hover:border-[#b3261e]/40 hover:bg-rose-50/10 rounded-2xl text-right flex gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer md:col-span-2"
                  >
                    <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center font-bold">
                      🔄
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">
                        انتقال وجه بین حساب‌ها
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        جابجایی مبالغ نقدینگی بین حساب‌های بانکی و صندوق‌های مختلف
                        کسب و کار با ثبت سند معین.
                      </p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
          {systemModule === "selector" ? (
            <ModuleSelector
              storeSettings={storeSettings}
              invoices={invoices}
              persons={persons}
              products={products}
              transactions={transactions}
              issuedChecks={issuedChecks}
              receivedChecks={receivedChecks}
              onSelectModule={(sel) => {
                setSystemModule(sel);
                if (sel === "commerce") setActiveTab("analytical_dashboard");
                else if (sel === "inventory") setActiveTab("inventory_report");
                else if (sel === "accounting") setActiveTab("financial_report");
                else if (sel === "admin") setActiveTab("settings");
                else if (sel === "crm") setActiveTab("crm_dashboard");
                else if (sel === "hr") setActiveTab("list_salary_payroll");
                else if (sel === "reports_module")
                  setActiveTab("analytical_dashboard");
                else setActiveTab("financial_report");
              }}
            />
          ) : (
            <div
              className={`flex ${menuLayout === "horizontal" ? "flex-col h-screen" : "h-screen"} overflow-hidden ${isGmailTheme ? "theme-gmail bg-[#f6f8fc]" : `theme-${storeSettings?.theme || "classic"} bg-gray-50/50`} text-gray-800 font-sans print:h-auto print:block print:overflow-visible`}
              dir="rtl"
            >
              {isGmailTheme && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
              /* Gmail theme overrides */
              .theme-gmail .bg-indigo-600 { background-color: #b3261e !important; }
              .theme-gmail .hover\\:bg-indigo-700:hover { background-color: #8c1d18 !important; }
              .theme-gmail .text-indigo-600 { color: #b3261e !important; }
              .theme-gmail .text-indigo-800 { color: #8c1d18 !important; }
              .theme-gmail .border-indigo-600 { border-color: #b3261e !important; }
              .theme-gmail .bg-indigo-50 { background-color: #fce8e6 !important; }
              .theme-gmail .text-indigo-300 { color: #b3261e !important; }
              .theme-gmail .focus\\:ring-indigo-500:focus { --tw-ring-color: #b3261e !important; ring-color: #b3261e !important; }
              .theme-gmail .focus\\:ring-indigo-600:focus { --tw-ring-color: #b3261e !important; ring-color: #b3261e !important; }
              .theme-gmail .bg-indigo-600\\/20 { background-color: rgba(253, 232, 230, 0.7) !important; }
              .theme-gmail .border-indigo-100 { border-color: #fce8e6 !important; }
              .theme-gmail .border-indigo-200 { border-color: #f9d5d3 !important; }
              .theme-gmail .text-indigo-500 { color: #b3261e !important; }
              .theme-gmail .bg-indigo-600\\/10 { background-color: rgba(253, 232, 230, 0.4) !important; }
              /* Custom overrides for cards and layouts inside Gmail theme */
              .theme-gmail .bg-gradient-to-l.from-indigo-50.to-white { background-image: linear-gradient(to left, #fce8e6, #ffffff) !important; }
              .theme-gmail .bg-gradient-to-r.from-indigo-500.to-indigo-600 { background-image: linear-gradient(to right, #b3261e, #8c1d18) !important; }
              .theme-gmail .bg-gradient-to-br.from-indigo-500.to-indigo-600 { background-image: linear-gradient(to bottom right, #b3261e, #8c1d18) !important; }
              .theme-gmail .from-indigo-600 { --tw-gradient-from: #b3261e !important; }
              .theme-gmail .to-indigo-700 { --tw-gradient-to: #8c1d18 !important; }
              .theme-gmail .text-indigo-700 { color: #b3261e !important; }
              .theme-gmail .bg-indigo-100 { background-color: #fce8e6 !important; }
              .theme-gmail .text-indigo-900 { color: #601410 !important; }
              .theme-gmail .hover\\:text-indigo-500:hover { color: #b3261e !important; }
              .theme-gmail .border-l-4.border-indigo-600 { border-left-color: #b3261e !important; }
              .theme-gmail .border-r-4.border-indigo-600 { border-right-color: #b3261e !important; }
              .theme-gmail .accent-indigo-600 { accent-color: #b3261e !important; }
              .theme-gmail .bg-indigo-900 { background-color: #3f0c0a !important; }
              `
                  }}
                />
              )}
              {storeSettings?.theme === "emerald" && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
              /* Emerald theme overrides */
              .theme-emerald .bg-indigo-600 { background-color: #059669 !important; }
              .theme-emerald .hover\\:bg-indigo-700:hover { background-color: #047857 !important; }
              .theme-emerald .text-indigo-600 { color: #059669 !important; }
              .theme-emerald .text-indigo-800 { color: #064e3b !important; }
              .theme-emerald .border-indigo-600 { border-color: #059669 !important; }
              .theme-emerald .bg-indigo-50 { background-color: #ecfdf5 !important; }
              .theme-emerald .text-indigo-300 { color: #6ee7b7 !important; }
              .theme-emerald .focus\\:ring-indigo-500:focus, .theme-emerald .focus\\:ring-indigo-600:focus { --tw-ring-color: #059669 !important; ring-color: #059669 !important; }
              .theme-emerald .bg-indigo-600\\/20 { background-color: rgba(16, 185, 129, 0.2) !important; }
              .theme-emerald .border-indigo-100 { border-color: #d1fae5 !important; }
              .theme-emerald .border-indigo-200 { border-color: #a7f3d0 !important; }
              .theme-emerald .text-indigo-500 { color: #10b981 !important; }
              .theme-emerald .bg-indigo-600\\/10 { background-color: rgba(16, 185, 129, 0.1) !important; }
              .theme-emerald .bg-gradient-to-l.from-indigo-50.to-white { background-image: linear-gradient(to left, #ecfdf5, #ffffff) !important; }
              .theme-emerald .bg-gradient-to-r.from-indigo-500.to-indigo-600 { background-image: linear-gradient(to right, #10b981, #059669) !important; }
              .theme-emerald .from-indigo-600 { --tw-gradient-from: #059669 !important; }
              .theme-emerald .to-indigo-700 { --tw-gradient-to: #047857 !important; }
              .theme-emerald .text-indigo-700 { color: #047857 !important; }
              .theme-emerald .bg-indigo-100 { background-color: #d1fae5 !important; }
              .theme-emerald .text-indigo-900 { color: #064e3b !important; }
              .theme-emerald .hover\\:text-indigo-500:hover { color: #10b981 !important; }
              .theme-emerald .border-l-4.border-indigo-600 { border-left-color: #059669 !important; }
              .theme-emerald .border-r-4.border-indigo-600 { border-right-color: #059669 !important; }
              .theme-emerald .accent-indigo-600 { accent-color: #059669 !important; }
              .theme-emerald .bg-indigo-900 { background-color: #064e3b !important; }
              .theme-emerald .from-indigo-900 { --tw-gradient-from: #064e3b !important; }
              .theme-emerald.bg-indigo-900 { background-color: #064e3b !important; }
            `
                  }}
                />
              )}
              {storeSettings?.theme === "ocean" && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
              /* Ocean theme overrides */
              .theme-ocean .bg-indigo-600 { background-color: #0284c7 !important; }
              .theme-ocean .hover\\:bg-indigo-700:hover { background-color: #0369a1 !important; }
              .theme-ocean .text-indigo-600 { color: #0284c7 !important; }
              .theme-ocean .text-indigo-800 { color: #075985 !important; }
              .theme-ocean .border-indigo-600 { border-color: #0284c7 !important; }
              .theme-ocean .bg-indigo-50 { background-color: #f0f9ff !important; }
              .theme-ocean .text-indigo-300 { color: #7dd3fc !important; }
              .theme-ocean .focus\\:ring-indigo-500:focus, .theme-ocean .focus\\:ring-indigo-600:focus { --tw-ring-color: #0284c7 !important; ring-color: #0284c7 !important; }
              .theme-ocean .bg-indigo-600\\/20 { background-color: rgba(2, 132, 199, 0.2) !important; }
              .theme-ocean .border-indigo-100 { border-color: #e0f2fe !important; }
              .theme-ocean .border-indigo-200 { border-color: #bae6fd !important; }
              .theme-ocean .text-indigo-500 { color: #0ea5e9 !important; }
              .theme-ocean .bg-indigo-600\\/10 { background-color: rgba(2, 132, 199, 0.1) !important; }
              .theme-ocean .bg-gradient-to-l.from-indigo-50.to-white { background-image: linear-gradient(to left, #f0f9ff, #ffffff) !important; }
              .theme-ocean .bg-gradient-to-r.from-indigo-500.to-indigo-600 { background-image: linear-gradient(to right, #0ea5e9, #0284c7) !important; }
              .theme-ocean .from-indigo-600 { --tw-gradient-from: #0284c7 !important; }
              .theme-ocean .to-indigo-700 { --tw-gradient-to: #0369a1 !important; }
              .theme-ocean .text-indigo-700 { color: #0369a1 !important; }
              .theme-ocean .bg-indigo-100 { background-color: #e0f2fe !important; }
              .theme-ocean .text-indigo-900 { color: #0c4a6e !important; }
              .theme-ocean .hover\\:text-indigo-500:hover { color: #0ea5e9 !important; }
              .theme-ocean .border-l-4.border-indigo-600 { border-left-color: #0284c7 !important; }
              .theme-ocean .border-r-4.border-indigo-600 { border-right-color: #0284c7 !important; }
              .theme-ocean .accent-indigo-600 { accent-color: #0284c7 !important; }
              .theme-ocean .bg-indigo-900 { background-color: #0c4a6e !important; }
              .theme-ocean .from-indigo-900 { --tw-gradient-from: #0c4a6e !important; }
              .theme-ocean.bg-indigo-900 { background-color: #0c4a6e !important; }
            `
                  }}
                />
              )}
              
              {storeSettings?.theme === "hacker" && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
              /* Hacker theme overrides */
              body {
                font-family: "JetBrains Mono", "Courier New", "IRANYekanXFaNum", monospace !important;
                background-color: #000000 !important;
                color: #00ff00 !important;
                text-shadow: 0 0 2px rgba(0, 255, 0, 0.4);
              }

              body::after {
                content: " ";
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                z-index: 9999;
                background-size: 100% 2px, 3px 100%;
                pointer-events: none;
              }

              .theme-hacker * {
                border-radius: 0 !important;
                border-color: #004400 !important;
              }

              .theme-hacker .bg-white, .theme-hacker .bg-slate-50, .theme-hacker .bg-gray-50, .theme-hacker .bg-slate-900, .theme-hacker .bg-slate-800 {
                background-color: #020202 !important;
                color: #00ff00 !important;
              }
              
              .theme-hacker .text-slate-900, .theme-hacker .text-gray-900, .theme-hacker .text-slate-800, .theme-hacker .text-slate-700, .theme-hacker .text-gray-700, .theme-hacker .text-slate-600, .theme-hacker .text-gray-600, .theme-hacker .text-slate-500, .theme-hacker .text-gray-500 {
                color: #00dd00 !important;
              }
              
              .theme-hacker .text-indigo-600, .theme-hacker .text-indigo-700, .theme-hacker .text-indigo-800, .theme-hacker .text-indigo-900, .theme-hacker .text-blue-600, .theme-hacker .text-emerald-600, .theme-hacker .text-rose-600, .theme-hacker .text-amber-600 {
                color: #00ff00 !important;
              }

              .theme-hacker .bg-indigo-600, .theme-hacker .bg-blue-600, .theme-hacker .bg-emerald-600, .theme-hacker .bg-rose-600 {
                background-color: #005500 !important;
                color: #00ff00 !important;
                border: 1px solid #00ff00 !important;
              }
              
              .theme-hacker .bg-indigo-50, .theme-hacker .bg-blue-50, .theme-hacker .bg-emerald-50, .theme-hacker .bg-rose-50, .theme-hacker .bg-amber-50, .theme-hacker .bg-gray-100, .theme-hacker .bg-slate-100 {
                background-color: #001100 !important;
                border-color: #004400 !important;
              }

              .theme-hacker input, .theme-hacker select, .theme-hacker textarea {
                background-color: #000000 !important;
                color: #00ff00 !important;
                border: 1px solid #00aa00 !important;
              }

              .theme-hacker input:focus, .theme-hacker select:focus, .theme-hacker textarea:focus {
                outline: none !important;
                box-shadow: 0 0 8px rgba(0, 255, 0, 0.6) !important;
                border-color: #00ff00 !important;
              }

              .theme-hacker button {
                text-shadow: none !important;
              }

              .theme-hacker .shadow-sm, .theme-hacker .shadow, .theme-hacker .shadow-md, .theme-hacker .shadow-lg, .theme-hacker .shadow-xl, .theme-hacker .shadow-2xl {
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.1) !important;
              }
              
              .theme-hacker svg {
                color: #00ff00 !important;
              }
              
              .theme-hacker table th {
                background-color: #002200 !important;
                color: #00ff00 !important;
                border-color: #00ff00 !important;
              }
              
              .theme-hacker table td {
                border-color: #004400 !important;
              }
              
              .theme-hacker tr:hover td {
                background-color: #001100 !important;
              }
            `
                  }}
                />
              )}
              {storeSettings?.theme === "rose" && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
              /* Rose theme overrides */
              .theme-rose .bg-indigo-600 { background-color: #e11d48 !important; }
              .theme-rose .hover\\:bg-indigo-700:hover { background-color: #be123c !important; }
              .theme-rose .text-indigo-600 { color: #e11d48 !important; }
              .theme-rose .text-indigo-800 { color: #881337 !important; }
              .theme-rose .border-indigo-600 { border-color: #e11d48 !important; }
              .theme-rose .bg-indigo-50 { background-color: #fff1f2 !important; }
              .theme-rose .text-indigo-300 { color: #fda4af !important; }
              .theme-rose .focus\\:ring-indigo-500:focus, .theme-rose .focus\\:ring-indigo-600:focus { --tw-ring-color: #e11d48 !important; ring-color: #e11d48 !important; }
              .theme-rose .bg-indigo-600\\/20 { background-color: rgba(225, 29, 72, 0.2) !important; }
              .theme-rose .border-indigo-100 { border-color: #ffe4e6 !important; }
              .theme-rose .border-indigo-200 { border-color: #fecdd3 !important; }
              .theme-rose .text-indigo-500 { color: #f43f5e !important; }
              .theme-rose .bg-indigo-600\\/10 { background-color: rgba(225, 29, 72, 0.1) !important; }
              .theme-rose .bg-gradient-to-l.from-indigo-50.to-white { background-image: linear-gradient(to left, #fff1f2, #ffffff) !important; }
              .theme-rose .bg-gradient-to-r.from-indigo-500.to-indigo-600 { background-image: linear-gradient(to right, #f43f5e, #e11d48) !important; }
              .theme-rose .from-indigo-600 { --tw-gradient-from: #e11d48 !important; }
              .theme-rose .to-indigo-700 { --tw-gradient-to: #be123c !important; }
              .theme-rose .text-indigo-700 { color: #be123c !important; }
              .theme-rose .bg-indigo-100 { background-color: #ffe4e6 !important; }
              .theme-rose .text-indigo-900 { color: #881337 !important; }
              .theme-rose .hover\\:text-indigo-500:hover { color: #f43f5e !important; }
              .theme-rose .border-l-4.border-indigo-600 { border-left-color: #e11d48 !important; }
              .theme-rose .border-r-4.border-indigo-600 { border-right-color: #e11d48 !important; }
              .theme-rose .accent-indigo-600 { accent-color: #e11d48 !important; }
              .theme-rose .bg-indigo-900 { background-color: #881337 !important; }
              .theme-rose .from-indigo-900 { --tw-gradient-from: #881337 !important; }
              .theme-rose.bg-indigo-900 { background-color: #881337 !important; }
            `
                  }}
                />
              )}
              <div className="block">
                <SidebarNavigation
                  mode="sidebar"
                user={user}
                signOut={signOut}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                systemModule={systemModule}
                hasCheckedFinancialYears={hasCheckedFinancialYears}
                activeFinancialYear={activeFinancialYear}
                isGmailTheme={isGmailTheme}
                storeSettings={storeSettings}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuLayout={menuLayout}
                setIsComposeOpen={setIsComposeOpen}
                expandedGroups={expandedGroups}
                setExpandedGroups={setExpandedGroups}
              />
    </div>
                        {/* Main Content Area */}
              <div
                className={`flex-1 flex flex-col w-full min-w-0 min-h-0 transition-all duration-300 overflow-hidden print:overflow-visible print:bg-white print:h-auto ${isGmailTheme ? "bg-white md:rounded-3xl md:border md:border-slate-200/80 md:m-3 md:shadow-xs" : ""}`}
              >
                {/* Top Header */}
                <div
                  className={`flex flex-col sticky top-0 z-[60] print:hidden ${isGmailTheme ? "bg-[#f6f8fc]" : "bg-white border-b border-gray-100 shadow-sm"}`}
                >
                  <div
                    className={`hidden md:flex flex-row items-center justify-between p-4 sticky top-0 ${
                      isGmailTheme
                        ? "bg-[#f6f8fc] border-none"
                        : "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-xs"
                    }`}
                    dir="rtl"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="hidden p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors cursor-pointer shadow-3xs border border-slate-100 bg-white"
                      >
                        <Menu className="w-5 h-5" />
                      </button>
                      <div className="font-extrabold text-slate-900 flex items-center gap-2">
                        {storeSettings.logoUrl ? (
                          <img
                            src={storeSettings.logoUrl}
                            className={`w-6 h-6 rounded object-contain ${menuLayout === "vertical" ? "md:hidden" : ""}`}
                            alt="logo"
                          />
                        ) : (
                          <div className={`w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-600/20 relative overflow-hidden shrink-0 ${menuLayout === "vertical" ? "md:hidden" : ""}`}>
                            <div className="absolute inset-0 bg-white/20 transform -rotate-45 translate-x-4"></div>
                            <Layers className="w-4 h-4 relative z-10" />
                          </div>
                        )}
                        <div className={`flex items-center gap-2 ${menuLayout === "vertical" ? "md:hidden" : ""}`}>
                          <span className="text-indigo-600 tracking-widest text-lg font-black">تراز</span>
                          <span className="text-slate-300 font-normal">|</span>
                          <span className="text-sm text-slate-700 truncate max-w-[150px]">{storeSettings.storeName || "سیستم مدیریت"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Google style centered Search bar */}
                    {isGmailTheme && (
                      <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="جستجو در میان اسناد، تراکنش‌ها، فاکتورها و اشخاص..."
                          className="w-full pr-11 pl-4 py-2 bg-[#eaf1fb] hover:bg-[#e3ecf8] focus:bg-white text-slate-800 placeholder-slate-500 rounded-full outline-none focus:ring-2 focus:ring-[#b3261e]/30 border-none font-bold text-sm transition-all shadow-3xs"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      
                      <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className="p-2 border rounded-xl transition-all cursor-pointer shadow-3xs active:scale-95 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 bg-white border-slate-200"
                        title="ماشین حساب"
                      >
                        <Calculator className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => {
                           appState.setIsStoreSelectionOpen(true);
                        }}
                        className="px-3 py-2 border rounded-xl transition-all cursor-pointer font-black gap-2 flex items-center text-xs shadow-3xs active:scale-95 text-slate-600 hover:text-indigo-700 bg-white border-indigo-200"
                        title="تغییر کسب و کار"
                      >
                        <Database className="w-4 h-4" />
                        <span className="hidden sm:inline-block">
                          تغییر فروشگاه
                        </span>
                      </button>
                      <button
                        onClick={() => setSystemModule("selector")}
                        className="px-3 py-2 border rounded-xl transition-all cursor-pointer font-black gap-2 flex items-center text-xs shadow-3xs active:scale-95 text-slate-600 hover:text-emerald-700 bg-white border-emerald-200"
                        title="تغییر ماژول کاری"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden sm:inline-block">
                          تغییر بخش کاری
                        </span>
                      </button>
                      {user && (
                        <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                          <div className="flex flex-col text-left">
                            <div className="text-sm font-black text-slate-800 leading-tight">
                              {user.name}
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase">
                              {user.role === "admin"
                                ? "مدیر سیستم"
                                : user.role === "accountant"
                                  ? "حسابدار"
                                  : user.role === "cashier"
                                    ? "صندوق‌دار"
                                    : "کاربر عادی"}
                            </div>
                          </div>
                          <button 
                            onClick={() => setIsProfileModalOpen(true)}
                            className="w-9 h-9 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-xl flex items-center justify-center font-black shadow-sm transition-colors cursor-pointer"
                            title="ویرایش پروفایل"
                          >
                            {user.name?.charAt(0) || <User className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={signOut}
                            className="w-8 h-8 flex items-center justify-center mr-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="خروج از حساب"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={async () => {
                          const newVal = menuLayout === "vertical" ? "horizontal" : "vertical";
                          setMenuLayout(newVal);
                          const updated = { ...storeSettings, menuLayout: newVal };
                          setStoreSettings(updated);
                          setSettingsForm(updated);
                          try { await saveStoreSettings(updated); } catch(e){}
                        }}
                        className={`px-3 py-2 border rounded-xl transition-all cursor-pointer font-black gap-2 hidden md:flex items-center text-xs shadow-3xs active:scale-95 text-slate-600 hover:text-indigo-700 bg-white border-slate-200`}
                        title={
                          menuLayout === "vertical"
                            ? "نمایش منوی افقی"
                            : "نمایش منوی عمودی"
                        }
                      >
                        {menuLayout === "vertical" ? (
                          <LayoutList className="w-4 h-4" />
                        ) : (
                          <GripHorizontal className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline-block">
                          {menuLayout === "vertical" ? "منوی افقی" : "منوی عمودی"}
                        </span>
                      </button>
                      <button
                        onClick={async () => {
                          const newVal = !isFullWidth;
                          setIsFullWidth(newVal);
                          const updated = { ...storeSettings, isFullWidth: newVal };
                          setStoreSettings(updated);
                          setSettingsForm(updated);
                          try { await saveStoreSettings(updated); } catch(e){}
                        }}
                        className={`px-3 py-2 border rounded-xl transition-all cursor-pointer font-black gap-2 flex items-center text-xs shadow-3xs active:scale-95 ${isFullWidth ? "text-indigo-700 bg-indigo-50 border-indigo-200" : "text-slate-600 hover:text-indigo-700 hover:bg-slate-50 bg-white border-slate-200"}`}
                        title={
                          isFullWidth
                            ? "بازگشت به نمایش کلاسیک"
                            : "حالت تمام صفحه گسترده"
                        }
                      >
                        {isFullWidth ? (
                          <Minimize className="w-4 h-4" />
                        ) : (
                          <Maximize className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline-block">
                          {isFullWidth ? "نمایش کلاسیک" : "تمام صفحه"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="block">
                  <SidebarNavigation
                    mode="horizontal"
                    user={user}
                    signOut={signOut}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    systemModule={systemModule}
                    hasCheckedFinancialYears={hasCheckedFinancialYears}
                    activeFinancialYear={activeFinancialYear}
                    isGmailTheme={isGmailTheme}
                    storeSettings={storeSettings}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    menuLayout={menuLayout}
                    setIsComposeOpen={setIsComposeOpen}
                    expandedGroups={expandedGroups}
                    setExpandedGroups={setExpandedGroups}
                  />
    </div>
                </div>
                <main className="flex-1 overflow-y-auto min-h-0 p-4 pb-24 md:p-8 bg-slate-50/50 print:overflow-visible print:bg-white print:p-0">
                  <div
                    className={`mx-auto transition-all duration-300 print:max-w-none print:w-full print:px-0 ${isFullWidth ? "max-w-full xl:px-14" : "max-w-6xl"}`}
                  >
                    {activeTab === "products" ? (
                      <ProductsTab
                        {...appState}
                        formatCurrency={formatCurrency}
                        toPersianDigits={toPersianDigits}
                        numToPersianWords={numToPersianWords}
                        DatePicker={DatePicker}
                        persian={persian}
                        persian_fa={persian_fa}
                        AIProductSearchModal={AIProductSearchModal}
                      />
                    ) : activeTab === "person_opening_balances" ? (
                      <PersonOpeningBalances 
                        setActiveTab={setActiveTab}
                        setLedgerPersonId={setLedgerPersonId}
                        formatDateDisplay={formatDateDisplay}
                        persons={persons}
                        setPersons={setPersons}
                        fetchPersons={fetchPersons}
                        confirmAction={confirmAction}
                    
                        customAlert={customAlert}
                        showNotification={showNotification}
                        formatCurrency={formatCurrency}
                        toPersianDigits={toPersianDigits}
                        numToPersianWords={numToPersianWords}
                        DatePicker={DatePicker}
                        persian={persian}
                        persian_fa={persian_fa}
                        storeSettings={storeSettings}
                        user={user}
                         setIsOpeningBalanceModalOpen={setIsOpeningBalanceModalOpen} isOpeningBalanceModalOpen={isOpeningBalanceModalOpen} editingOpeningBalanceId={editingOpeningBalanceId} addPersonOpeningBalance={addPersonOpeningBalance} fetchPersonOpeningBalances={fetchPersonOpeningBalances} setSubmittingOpeningBalance={setSubmittingOpeningBalance} Select={Select} selectedOpeningBalancePersonId={selectedOpeningBalancePersonId} personOpeningBalances={personOpeningBalances} setSelectedOpeningBalancePersonId={setSelectedOpeningBalancePersonId} setOpeningBalanceAmount={setOpeningBalanceAmount} setOpeningBalanceType={setOpeningBalanceType} Info={Info} openingBalanceType={openingBalanceType} CurrencyInput={CurrencyInput} openingBalanceAmount={openingBalanceAmount} openingBalanceDate={openingBalanceDate} setOpeningBalanceDate={setOpeningBalanceDate} activeFinancialYear={activeFinancialYear} openingBalanceDescription={openingBalanceDescription} setOpeningBalanceDescription={setOpeningBalanceDescription} submittingOpeningBalance={submittingOpeningBalance} RefreshCw={RefreshCw}
                      FileSpreadsheet={FileSpreadsheet}
                        setEditingOpeningBalanceId={setEditingOpeningBalanceId}
                        DateObject={DateObject}
                        openingBalanceSearch={openingBalanceSearch}
                        setOpeningBalanceSearch={setOpeningBalanceSearch}
                        addCommas={addCommas}
                        Edit2={Edit2}
                        deletePersonOpeningBalance={deletePersonOpeningBalance}
                        updatePersonOpeningBalance={updatePersonOpeningBalance}
                      />
                    ) : activeTab === "persons" ? (
                      <PersonsManager
                        filteredPersons={filteredPersons} personPageSize={personPageSize} personCurrentPage={personCurrentPage} calculatePersonBalance={calculatePersonBalance} formatNumber={formatNumber} personSearchTerm={personSearchTerm} setPersonSearchTerm={setPersonSearchTerm} selectedPersonGroup={selectedPersonGroup} setSelectedPersonGroup={setSelectedPersonGroup} personGroups={personGroups} selectedPersonRole={selectedPersonRole} setSelectedPersonRole={setSelectedPersonRole} personRoles={personRoles} personsViewMode={personsViewMode} setPersonsViewMode={setPersonsViewMode} setIsPersonModalOpen={setIsPersonModalOpen} setPersonCurrentPage={setPersonCurrentPage} getRoleBadgeClasses={getRoleBadgeClasses} getRoleName={getRoleName} handleEditPerson={handleEditPerson} setProfilePersonId={setProfilePersonId} setLedgerPersonId={setLedgerPersonId} setRawActiveTab={setRawActiveTab} handleDeletePerson={handleDeletePerson} setPrintingPersonLedger={setPrintingPersonLedger} fetchPersons={fetchPersons} activePersonsOnly={activePersonsOnly} clearDraft={clearDraft} handleGenerateMissingAccountingCodes={handleGenerateMissingAccountingCodes} isGeneratingCodes={isGeneratingCodes} setPersonIOAction={setPersonIOAction} setIsPersonIOModalOpen={setIsPersonIOModalOpen} setEditingPersonId={setEditingPersonId} setNewPersonType={setNewPersonType} setNewPersonTitle={setNewPersonTitle} setNewPersonAlias={setNewPersonAlias} setNewPersonFirstName={setNewPersonFirstName} setNewPersonLastName={setNewPersonLastName} setNewPersonCompanyName={setNewPersonCompanyName} setNewPersonFatherName={setNewPersonFatherName} setNewPersonNationalId={setNewPersonNationalId} setNewPersonAccountingCode={setNewPersonAccountingCode} setNewPersonAddress={setNewPersonAddress} setNewPersonImage={setNewPersonImage} setNewPersonPhone={setNewPersonPhone} setNewPersonContacts={setNewPersonContacts} setNewPersonRole={setNewPersonRole} setNewPersonInitialBalance={setNewPersonInitialBalance} setNewPersonInitialBalanceType={setNewPersonInitialBalanceType} setNewPersonCreditLimit={setNewPersonCreditLimit} successMsg={successMsg} getPersonDisplayName={getPersonDisplayName} toPersianDigits={toPersianDigits} storeSettings={storeSettings}  setCustomerId={setCustomerId} setReceiptPersonId={setReceiptPersonId} setPersonExtraId={setPersonExtraId} setPersonBankName={setPersonBankName} setPersonBankAcc={setPersonBankAcc} setPersonCard={setPersonCard} setPersonSheba={setPersonSheba} setPersonBankAccounts={setPersonBankAccounts} setPersonNotes={setPersonNotes} setIsPersonExtraModalOpen={setIsPersonExtraModalOpen} confirmAction={confirmAction} setPersonPageSize={setPersonPageSize} setActiveTab={setActiveTab}
                      />
                    ) : activeTab === "person_groups" ? (
                      <PersonGroupsManager showNotification={showNotification} />
                    ) : activeTab === "person_roles" ? (
                      <PersonRolesManager showNotification={showNotification} />
                    ) : activeTab === "accounts" ? (
                      <AccountsManager
                        setEditingAccountId={setEditingAccountId}
                        setIsAccountModalOpen={setIsAccountModalOpen}
                        successMsg={successMsg}
                        accounts={accounts}
                        formatNumber={formatNumber}
                        handleEditAccount={handleEditAccount}
                        confirmAction={confirmAction}
                        handleDeleteAccount={handleDeleteAccount}
                        toPersianDigits={toPersianDigits}
                        storeSettings={storeSettings}
                      />
                    ) : activeTab === "cashboxes" ? (
                      <CashboxesManager
                        setEditingCashboxId={setEditingCashboxId}
                        setNewCashboxBalance={setNewCashboxBalance}
                        setIsCashboxModalOpen={setIsCashboxModalOpen}
                        successMsg={successMsg}
                        cashboxes={cashboxes}
                        formatNumber={formatNumber}
                        handleEditCashbox={handleEditCashbox}
                        confirmAction={confirmAction}
                    
                        handleDeleteCashbox={handleDeleteCashbox}
                        toPersianDigits={toPersianDigits}
                        storeSettings={storeSettings}
                      />
                    ) : activeTab === "warehouses" ? (
                      <WarehouseManager 
                        showNotification={showNotification}
                        warehouseSubTab={warehouseSubTab}
                        setWarehouseSubTab={setWarehouseSubTab}
                        warehouses={warehouses}
                        products={products}
                        setEditingWarehouseId={setEditingWarehouseId}
                        setIsWarehouseModalOpen={setIsWarehouseModalOpen}
                        setNewWarehouseName={setNewWarehouseName}
                        setNewWarehouseManager={setNewWarehouseManager}
                        setNewWarehouseLocation={setNewWarehouseLocation}
                        setNewWarehouseIsActive={setNewWarehouseIsActive}
                        recalculating={recalculating}
                        handleRecalculateStocks={handleRecalculateStocks}
                        handleEditWarehouse={handleEditWarehouse}
                        confirmAction={confirmAction}
                        handleDeleteWarehouse={handleDeleteWarehouse}
                        whStockSearch={whStockSearch}
                        setWhStockSearch={setWhStockSearch}
                        warehouseStocks={warehouseStocks}
                        formatNumber={formatNumber}
                      />
                    ) : activeTab === "financial_report" ? (
                      <FinancialDashboard
                        invoices={invoices}
                        persons={persons}
                        storeSettings={storeSettings}
                        reportDateRange={reportDateRange}
                        setReportDateRange={setReportDateRange}
                        issuedChecks={issuedChecks}
                        receivedChecks={receivedChecks}
                        accounts={accounts}
                        cashboxes={cashboxes}
                        transactions={transactions}
                        calculatePersonBalance={calculatePersonBalance}
                        getPersonDisplayName={getPersonDisplayName}
                        formatNumber={formatNumber}
                        setActiveTab={setActiveTab}
                        fetchData={fetchData}
                        getDefaultExchangeRate={getDefaultExchangeRate}
                        currentUser={user}
                      />
                    ) : activeTab === "person_profile" ? (
                      <PersonProfileView

                        personId={profilePersonId}
                        persons={persons}
                        invoices={invoices}
                        transactions={transactions}
                        issuedChecks={issuedChecks}
                        receivedChecks={receivedChecks}
                        accountingDocuments={accountingDocuments}
                        storeSettings={storeSettings}
                        calculatePersonBalance={calculatePersonBalance}
                        onBack={() => setActiveTab("persons")}
                        onEdit={handleEditPerson}
                        onViewExtraInfo={(p: any) => {
                          setPersonExtraId(p.id);
                          setPersonBankAccounts(p.bankAccounts || []);
                          setPersonNotes(p.additionalNotes || "");
                          setIsPersonExtraModalOpen(true);
                        }}
                        onViewLedger={(id) => {
                          setLedgerPersonId(id);
                          setActiveTab("person_ledger");
                        }}
                        onCreateSale={(id) => {
                          setCustomerId(id);
                          setActiveTab("sale_invoice_create");
                        }}
                        onCreatePurchase={(id) => {
                          setCustomerId(id);
                          setActiveTab("purchase_invoice_create");
                        }}
                        onCreateReceive={(id) => {
                          setReceiptPersonId(id);
                          setActiveTab("receipt_create");
                        }}
                        onCreatePay={(id) => {
                          setReceiptPersonId(id);
                          setActiveTab("payment_create");
                        }}
                        getPersonDisplayName={getPersonDisplayName}
                        getRoleName={getRoleName}
                        getRoleBadgeClasses={getRoleBadgeClasses}
                        formatCurrency={formatCurrency}
                        toPersianDigits={toPersianDigits}
                        formatDateDisplay={formatDateDisplay}

                      />
                    ) : activeTab === "person_ledger" ? (
                      <PersonLedger 
                        persons={persons}
                        setPersons={setPersons}
                        fetchPersons={fetchPersons}
                        confirmAction={confirmAction}
                    
                        customAlert={customAlert}
                        showNotification={showNotification}
                        formatCurrency={formatCurrency}
                        toPersianDigits={toPersianDigits}
                        numToPersianWords={numToPersianWords}
                        DatePicker={DatePicker}
                        persian={persian}
                        persian_fa={persian_fa}
                        storeSettings={storeSettings}
                        user={user}
                        PersonLedgerActionsDropdown={PersonLedgerActionsDropdown} ledgerPersonId={ledgerPersonId} setActiveTab={setActiveTab} setCustomerId={setCustomerId} setReceiptPersonId={setReceiptPersonId} handleEditPerson={handleEditPerson} setIsPersonModalOpen={setIsPersonModalOpen} sendNotification={sendNotification} setPrintingPersonLedger={setPrintingPersonLedger} fetchInvoices={fetchInvoices} fetchTransactions={fetchTransactions} fetchAccountingDocuments={fetchAccountingDocuments} User={User} Select={Select} mapPersonToOption={mapPersonToOption} setLedgerPersonId={setLedgerPersonId} customPersonFilter={customPersonFilter} accountingDocuments={accountingDocuments} payslips={payslips} invoices={invoices} convertToGregorian={convertToGregorian} printingPersonLedger={printingPersonLedger} getPersonDisplayName={getPersonDisplayName} formatNumber={formatNumber} formatDateDisplay={formatDateDisplay} getRoleBadgeClasses={getRoleBadgeClasses} getRoleName={getRoleName} setLedgerTab={setLedgerTab} ledgerTab={ledgerTab} PersonNotesAndAttachments={PersonNotesAndAttachments} List={List} setViewingInvoice={setViewingInvoice} transactions={transactions} setViewingPayslip={setViewingPayslip} setPreviewReceiptData={setPreviewReceiptData} issuedChecks={issuedChecks} setViewingCheck={setViewingCheck} receivedChecks={receivedChecks} Calendar={Calendar} Tag={Tag}
                      />
                    ) : activeTab === "debts_credits" ? (                  <DebtsCreditsReport showNotification={showNotification} />
                    
                    
                    
                    
                    
                    ) : activeTab === "transfer" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <FinancialTransfer />
                      </motion.div>
                    ) : activeTab === "invoice_allocation" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <InvoiceAllocation
                          customAlert={customAlert}
                          formatCurrency={formatCurrency}
                          getDefaultExchangeRate={getDefaultExchangeRate}
                        />
                      </motion.div>
                    ) : activeTab === "quick_refund" ? (
                      <QuickRefund
                        showNotification={showNotification}
                        onComplete={() => {
                          fetchDataSilent();
                          fetchPersons();
                          fetchAccounts();
                          fetchCashboxes();
                        }}
                      />
                                    ) : activeTab === "check_panel" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-full"
                      >
                        <CheckManagement
                          onEditReceiptByCheck={handleEditReceiptByCheck}
                          showNotification={showNotification}
                          currentUser={user?.name || "کاربر سیستم"}
                          sendNotification={sendNotification}
                          storeSettings={storeSettings}
                          setViewingCheck={setViewingCheck}
                        />
                      </motion.div>
                    ) : activeTab === "loans" ? (
                      <LoansManager persons={persons} accounts={accounts}
                        loans={loans}
                        setLoans={setLoans}
                        installments={installments}
                        setInstallments={setInstallments}
                       
                       
                        setAccounts={setAccounts}
                        transactions={transactions}
                        setTransactions={setTransactions}
                      />
                    ) : activeTab === "system_diagnostics" ? (
                      <SystemDiagnostics persons={persons} products={products}
                       
                        invoices={invoices}
                       
                        transactions={transactions}
                        warehouseStocks={warehouseStocks}
                        issuedChecks={issuedChecks}
                        receivedChecks={receivedChecks}
                      />
                    ) : activeTab === "users_manager" ? (
                      <UserManager />
                    ) : activeTab === "settings" ? (
                      <SettingsTab storeSettings={storeSettings} 
                        
                        user={user}
                      settingsForm={settingsForm}
                        setSettingsForm={setSettingsForm}
                        CurrencyInput={CurrencyInput}
                        AlertTriangle={AlertTriangle}
                        AlertCircle={AlertCircle}
                      confirmAction={confirmAction}
                        handleSaveSettings={handleSaveSettings}
                        submittingSettings={submittingSettings}
                        Box={Box}
                        settingsTab={settingsTab}
                        setSettingsTab={setSettingsTab}
                        successMsg={successMsg}
                        Trash2={Trash2}
                        Image={Image}
                        handleLogoUpload={handleLogoUpload}
                        Globe={Globe}
                        CheckSquare={CheckSquare}
                        productCategories={productCategories}
                        ChevronDown={ChevronDown}
                        ChevronUp={ChevronUp}
                        Check={Check}
                        X={X}
                      />
                    ) : activeTab === "inventory_report" ? (
                      <InventoryReport showNotification={showNotification} categories={productCategories} />
                    ) : activeTab === "order_list" ? (
                      <OrderList 
                        products={products}
                        categories={productCategories}
                        formatCurrency={formatCurrency}
                        toPersianDigits={toPersianDigits}
                      />
                    ) : activeTab === "kardex" ? (
                      <KardexReport />
                    ) : activeTab === "crm_dashboard" ? (
                      <CRMDashboard persons={persons} showNotification={showNotification} confirmAction={confirmAction} />
                    ) : activeTab === "analytical_dashboard" ? (
                      <AnalyticalDashboard showNotification={showNotification} />
                    
                    ) : activeTab === "sms_panel" ? (
                      <SmsPanel storeSettings={storeSettings} setActiveTab={setActiveTab} setSettingsTab={setSettingsTab} />
                    ) : activeTab === "system_logs" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <SystemLogs />
                      </motion.div>
                    ) : activeTab === "database_logs" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <DatabaseLogs />
                      </motion.div>
                    ) : activeTab === "data_reconciliation" ? (
                      <DatabaseReconciliation />
                    ) : activeTab === "database" ? (
                      <DatabaseDashboard showNotification={showNotification} />
                    ) : activeTab === "personal_notes" ? (
                      <PersonalNotesManager storeSettings={storeSettings} />
                    ) : activeTab === "update" ? (
                      <SystemUpdatePage storeSettings={storeSettings} setActiveTab={setActiveTab} />
                    ) : activeTab === "quick_price_inquiry" ? (
                      <QuickPriceInquiry products={products}
                       
                        settings={storeSettings}
                      />
                    ) : activeTab === "product_view" ? (
                      <div className="flex flex-col h-full gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`bg-white rounded-2xl shadow-sm border border-gray-100 shrink-0 ${viewingProduct ? 'p-4 mx-4 mt-4' : 'p-8 max-w-3xl mx-auto mt-10 w-full'}`}
                        >
                          <h2 className={`${viewingProduct ? 'text-lg mb-4' : 'text-2xl mb-6'} font-bold text-gray-800 flex items-center gap-2`}>
                            <Package className={`${viewingProduct ? 'w-5 h-5' : 'w-8 h-8'} text-indigo-600`} />
                            جستجوی پیشرفته کارت کالا
                          </h2>
                          <div className="relative">
                            <SearchableSelect
                              options={(products || []).map((p) => ({
                                value: p.id,
                                label: p.name,
                                subLabel: formatProductStockDetails(p),
                                badge: p.type === "service" ? "خدمات" : "کالا",
                                searchStr: `${p.code || ""} ${p.barcode || ""}`,
                              }))}
                              value={viewingProduct ? viewingProduct.id.toString() : ""}
                              onChange={(val) => {
                                const p = products.find(
                                  (prod) => prod.id.toString() === val,
                                );
                                if (p) setViewingProduct(p);
                                else setViewingProduct(null);
                              }}
                              placeholder="جستجو کالا (نام، کد، بارکد)..."
                              searchPlaceholder="نام، کد یا بارکد کالا را وارد کنید..."
                            />
                          </div>
                          {!viewingProduct && (
                            <div className="mt-8 text-center text-gray-500 text-sm">
                              جهت مشاهده تاریخچه و گردش کالا، جستجو و انتخاب کنید
                            </div>
                          )}
                        </motion.div>
                        
                        {viewingProduct && (
                          <div className="flex-1 min-h-[500px]">
                            <ProductCardModal
                              product={viewingProduct}
                              warehouses={warehouses}
                              currency={storeSettings?.currency || "تومان"}
                              isModal={false}
                              persons={persons}
                              storeSettings={storeSettings}
                              onClose={() => {
                                setViewingProduct(null);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : activeTab === "checklist" ? (
                      <SystemChecklist />
                    ) : activeTab === "stocktaking" ? (
                      <StocktakingManager
                        showNotification={showNotification}
                        currentUser={user?.name}
                        onNavigateToDocs={() =>
                          setActiveTab("create_warehouse_doc")
                        }
                      />
                    ) : activeTab === "financial_years" ? (
                      <FinancialYearManager showNotification={showNotification} />
                    ) : activeTab === "chart_of_accounts" ? (
                      <ChartOfAccounts
                        showNotification={showNotification}
                        currentUser={user?.name}
                      />
                    ) : activeTab === "accounting_docs_list" ? (
                      <AccountingDocsList
                        showNotification={showNotification}
                        onNavigateToCreate={() => {
                          setEditingAccountingDoc(null);
                          setActiveTab("accounting_doc_create");
                        }}
                        onNavigateToView={(doc: any) => {
                          setViewingAccountingDoc(doc);
                          setIsAccountingDocModalOpen(true);
                        }}
                        onNavigateToEdit={(doc: any) => {
                          setEditingAccountingDoc(doc);
                          setActiveTab("accounting_doc_create");
                        }}
                      />
                    ) : activeTab === "accounting_doc_create" ? (
                      <AccountingDocCreate
                        showNotification={showNotification}
                        initialDoc={editingAccountingDoc}
                        onBack={() => {
                          setEditingAccountingDoc(null);
                          setActiveTab("accounting_docs_list");
                        }}
                      />
                    ) : activeTab === "accounting_doc_view" &&
                      viewingAccountingDoc ? (
                      <AccountingDocView
                        doc={viewingAccountingDoc}
                        storeSettings={storeSettings}
                        onBack={() => setActiveTab("accounting_docs_list")}
                      />
                    ) : activeTab === "accounting_auto_sync" ? (
                      <AccountingAutoSync showNotification={showNotification} />
                    ) : activeTab === "accounting_verification" ? (
                      <AccountingVerification showNotification={showNotification} />
                    ) : activeTab === "accounting_opening_balances" ? (
                      <OpeningBalances
                        showNotification={showNotification}
                        onBack={() => setActiveTab("accounting_docs_list")}
                      />
                    ) : null}
                    {![
                      "products",
                      "person_opening_balances",
                      "persons",
                      "person_groups",
                      "person_roles",
                      "accounts",
                      "cashboxes",
                      "warehouses",
                      "financial_report",
                      "person_profile",
                      "person_ledger",
                      "debts_credits",
                      "transfer",
                      "invoice_allocation",
                      "quick_refund",
                      "check_panel",
                      "loans",
                      "system_diagnostics",
                      "users_manager",
                      "settings",
                      "inventory_report",
                      "kardex",
                      "crm_dashboard",
                      "analytical_dashboard",
                      "sms_panel",
                      "system_logs",
                      "database_logs",
                      "data_reconciliation",
                      "database",
                      "update",
                      "quick_price_inquiry",
                      "product_view",
                      "checklist",
                      "stocktaking",
                      "financial_years",
                      "chart_of_accounts",
                      "accounting_docs_list",
                      "accounting_doc_create",
                      "accounting_doc_view",
                      "accounting_auto_sync",
                      "accounting_verification",
                      "accounting_opening_balances",
                    ].includes(activeTab) && (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="h-full flex flex-col"
                        >
                          {renderTabContent()}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                </main>

                
          

          

        <AnimatePresence>
                  {viewingPayslip && (
                    <div
                      key="payslip-modal"
                      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/55 backdrop-blur-sm"
                      dir="rtl"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-3xl max-h-[95vh] flex flex-col print-section print:max-h-none print:h-auto print:overflow-visible print:border-none print:shadow-none print:rounded-none"
                        id="printable-payslip-area"
                      >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 no-print">
                          <h3 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
                            <FileText className="w-5 h-5 animate-pulse-slow" />
                            پیش‌نمایش فیش رسمی حقوق کارمند
                          </h3>
                          <button
                            type="button"
                            onClick={() => setViewingPayslip(null)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors border border-gray-100"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Printable Body */}
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 text-gray-800 text-sm print:overflow-visible print:p-0">
                          {/* Official Slip Header */}
                          <div className="border-4 border-double border-gray-300 p-5 rounded-2xl bg-gray-50/20 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-right space-y-1">
                              <span className="text-xs text-indigo-600 font-bold tracking-wider">
                                سند مالی شماره #{toPersianDigits(viewingPayslip.id)}
                              </span>
                              <h2 className="text-xl font-black text-gray-950">
                                {storeSettings.storeName ||
                                  "مجموعه تجاری و مالی صبا"}
                              </h2>
                              <p className="text-xs text-gray-500 font-medium">
                                {viewingPayslip.parsed?.userNote ||
                                  "فیش رسمی حقوق و دستمزد کارمند"}
                              </p>
                            </div>
                            <div className="text-center bg-white border border-gray-200 py-2.5 px-4 rounded-xl min-w-[150px] shadow-sm">
                              <span className="text-xs text-gray-400 font-semibold block m-0">
                                تاریخ صدور سند
                              </span>
                              <span className="text-sm font-extrabold text-gray-900 font-sans mt-0.5 block">
                                {formatDateDisplay(
                                  viewingPayslip.date || viewingPayslip.jalaliDate,
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Employee and Period Meta */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-50/20 border border-indigo-100 rounded-xl p-4">
                            <div>
                              <span className="text-gray-500 font-medium">
                                نام و نام خانوادگی کارمند:
                              </span>
                              <span className="font-extrabold text-indigo-950 text-base mr-2">
                                {viewingPayslip.computedPersonName ||
                                  viewingPayslip.personName}
                              </span>
                            </div>
                            <div className="md:text-left">
                              <span className="text-gray-500 font-medium">
                                مشتمل بر دوره پرداخت:
                              </span>
                              <span className="font-semibold text-gray-800 mr-2">
                                {viewingPayslip.parsed?.periodMonth &&
                                viewingPayslip.parsed?.periodYear
                                  ? [
                                      "فروردین",
                                      "اردیبهشت",
                                      "خرداد",
                                      "تیر",
                                      "مرداد",
                                      "شهریور",
                                      "مهر",
                                      "آبان",
                                      "آذر",
                                      "دی",
                                      "بهمن",
                                      "اسفند",
                                    ][
                                      Number(viewingPayslip.parsed.periodMonth) - 1
                                    ] +
                                    " " +
                                    viewingPayslip.parsed.periodYear
                                  : viewingPayslip.parsed?.userNote || "بدون بابت"}
                              </span>
                            </div>
                          </div>

                          {/* Comparison Columns: Earnings vs Deductions */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            {/* Earnings */}
                            <div className="border border-emerald-100 rounded-xl overflow-hidden shadow-sm">
                              <div className="bg-emerald-600 text-white font-extrabold px-4 py-2.5 text-center flex justify-between items-center text-xs">
                                <span>حقوق ناخالص و مزایا (ریال/تومان)</span>
                                <span>مبلغ</span>
                              </div>
                              <table className="w-full text-right divide-y divide-gray-100 text-xs text-right">
                                <tbody>
                                  <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-gray-600 font-medium text-right">
                                      حقوق پایه و کارکرد ماهانه
                                    </td>
                                    <td
                                      className="py-2.5 px-4 font-bold text-gray-900 font-mono text-left"
                                      dir="ltr"
                                    >
                                      {formatNumber(
                                        viewingPayslip.parsed?.base || 0,
                                      )}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-gray-600 font-medium text-right">
                                      حق مسکن و معیشت رفاهی
                                    </td>
                                    <td
                                      className="py-2.5 px-4 font-bold text-gray-900 font-mono text-left"
                                      dir="ltr"
                                    >
                                      {formatNumber(
                                        viewingPayslip.parsed?.allowances
                                          ?.housing || 0,
                                      )}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-gray-600 font-medium text-right">
                                      حق بن و خواربار رفاهی
                                    </td>
                                    <td
                                      className="py-2.5 px-4 font-bold text-gray-900 font-mono text-left"
                                      dir="ltr"
                                    >
                                      {formatNumber(
                                        viewingPayslip.parsed?.allowances
                                          ?.grocery || 0,
                                      )}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-gray-600 font-medium text-right">
                                      اضافه کار و سایر مزایا
                                    </td>
                                    <td
                                      className="py-2.5 px-4 font-bold text-gray-900 font-mono text-left"
                                      dir="ltr"
                                    >
                                      {formatNumber(
                                        viewingPayslip.parsed?.allowances?.other ||
                                          0,
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                                <tfoot>
                                  <tr className="bg-emerald-50/50 font-extrabold text-emerald-950 border-t border-emerald-100">
                                    <td className="py-3 px-4 text-right">
                                      جمع مبالغ ناخالص:
                                    </td>
                                    <td
                                      className="py-3 px-4 font-mono text-left text-sm text-emerald-800"
                                      dir="ltr"
                                    >
                                      {formatNumber(
                                        (viewingPayslip.parsed?.base || 0) +
                                          (viewingPayslip.parsed?.allowances
                                            ?.housing || 0) +
                                          (viewingPayslip.parsed?.allowances
                                            ?.grocery || 0) +
                                          (viewingPayslip.parsed?.allowances
                                            ?.other || 0),
                                      )}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>

                            {/* Deductions */}
                            <div className="border border-rose-100 rounded-xl overflow-hidden shadow-sm">
                              <div className="bg-rose-600 text-white font-extrabold px-4 py-2.5 text-center flex justify-between items-center text-xs">
                                <span>
                                  حق بیمه سهم کارمند و مالیات (ریال/تومان)
                                </span>
                                <span>کسورات</span>
                              </div>
                              <table className="w-full text-right divide-y divide-gray-100 text-xs text-right">
                                <tbody>
                                  <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-gray-600 font-medium text-right">
                                      بیمه تامین اجتماعی سهم کارمند
                                    </td>
                                    <td
                                      className="py-2.5 px-4 font-bold text-gray-900 font-mono text-left"
                                      dir="ltr"
                                    >
                                      {formatNumber(
                                        viewingPayslip.parsed?.deductions
                                          ?.insurance || 0,
                                      )}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-gray-600 font-medium text-right">
                                      مالیات حقوق و درآمد معین
                                    </td>
                                    <td
                                      className="py-2.5 px-4 font-bold text-gray-900 font-mono text-left"
                                      dir="ltr"
                                    >
                                      {formatNumber(
                                        viewingPayslip.parsed?.deductions?.tax || 0,
                                      )}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-gray-600 font-medium text-right">
                                      مساعده دریافتی و سایر کسورات
                                    </td>
                                    <td
                                      className="py-2.5 px-4 font-bold text-gray-900 font-mono text-left"
                                      dir="ltr"
                                    >
                                      {formatNumber(
                                        viewingPayslip.parsed?.deductions
                                          ?.penalty || 0,
                                      )}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-gray-400/50 text-[10px] text-right">
                                      ---
                                    </td>
                                    <td
                                      className="py-2.5 px-4 font-bold text-gray-400/50 font-mono text-left text-[10px]"
                                      dir="ltr"
                                    >
                                      ۰
                                    </td>
                                  </tr>
                                </tbody>
                                <tfoot>
                                  <tr className="bg-rose-50/50 font-extrabold text-rose-950 border-t border-rose-100">
                                    <td className="py-3 px-4 text-right">
                                      جمع مبالغ کسورات:
                                    </td>
                                    <td
                                      className="py-3 px-4 font-mono text-left text-sm text-rose-800"
                                      dir="ltr"
                                    >
                                      {formatNumber(
                                        (viewingPayslip.parsed?.deductions
                                          ?.insurance || 0) +
                                          (viewingPayslip.parsed?.deductions?.tax ||
                                            0) +
                                          (viewingPayslip.parsed?.deductions
                                            ?.penalty || 0),
                                      )}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>

                          {/* Grand Total Net Salary */}
                          <div className="bg-indigo-950 text-white rounded-2xl p-5 border border-indigo-950 flex flex-col gap-3 shadow">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right w-full">
                              <div>
                                <h4 className="text-sm font-bold text-indigo-200">
                                  مبلغ خالص دریافتی پرداختنی کارمند
                                </h4>
                                <p className="text-xs text-indigo-300 mt-1">
                                  حقوق پرداختی حاصل از کسر حقوق و مزایا از کسورات
                                  معین
                                </p>
                              </div>
                              <div>
                                <span className="text-2xl font-black text-amber-300 tracking-tight block">
                                  {formatNumber(
                                    viewingPayslip.parsed?.netSalary ||
                                      viewingPayslip.amount,
                                  )}{" "}
                                  <span className="text-xs text-indigo-200">
                                    {storeSettings.currency}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="text-xs font-bold text-indigo-100/90 text-right border-t border-indigo-900 pt-2.5 w-full leading-relaxed">
                              مبلغ به حروف:{" "}
                              <span className="text-amber-300">
                                {numToPersianWords(
                                  viewingPayslip.parsed?.netSalary ||
                                    viewingPayslip.amount,
                                )}{" "}
                                {storeSettings.currency}
                              </span>{" "}
                              تمام.
                            </div>
                          </div>

                          {/* Stamp & Signatures Block */}
                          <div className="border-t border-dashed border-gray-300 pt-7 grid grid-cols-2 text-center text-xs mt-8">
                            <div className="space-y-12">
                              <span className="font-extrabold text-gray-700 block">
                                مهر و امضا امور مالی مجموعه
                              </span>
                              <div className="w-24 h-1 bg-gray-200/50 mx-auto rounded-full"></div>
                            </div>
                            <div className="space-y-12">
                              <span className="font-extrabold text-gray-700 block">
                                امضای دریافت کننده (همکار)
                              </span>
                              <div className="w-24 h-1 bg-gray-200/50 mx-auto rounded-full"></div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 no-print">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            پرینت فیش حقوقی
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewingPayslip(null)}
                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-xl text-sm font-bold transition-all"
                          >
                            بستن
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {isCategoryModalOpen && (
                    <div key="isCategoryModalOpen-modal"
                      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                      dir="rtl"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-md flex flex-col"
                      >
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <List className="w-5 h-5 text-indigo-500" />
                            ثبت گروه‌بندی جدید
                          </h3>
                          <button
                            onClick={() => setIsCategoryModalOpen(false)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="p-6">
                          <div className="flex flex-col gap-5">
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                نام گروه <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                placeholder="مثال: لوازم بهداشتی"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900"
                              />
                            </div>
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                گروه والد (اختیاری)
                              </label>
                              <Select
                                isRtl
                                value={
                                  newCatParentId
                                    ? {
                                        value: newCatParentId,
                                        label: productCategories.find(
                                          (c) =>
                                            c.id === newCatParentId ||
                                            c.id.toString() ===
                                              newCatParentId?.toString(),
                                        )?.name,
                                      }
                                    : null
                                }
                                onChange={(option: any) =>
                                  setNewCatParentId(option ? option.value : "")
                                }
                                options={
                                  productCategories
                                    .filter((c) => c.id !== editingCategoryId)
                                    .map((c) => ({
                                      value: c.id.toString(),
                                      label: c.name,
                                    })) as any
                                }
                                placeholder="انتخاب گروه والد..."
                                isClearable
                              />
                            </div>
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                توضیحات تکمیلی
                              </label>
                              <textarea
                                value={newCatDesc}
                                onChange={(e) => setNewCatDesc(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900"
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                          <button
                            type="button"
                            onClick={() => setIsCategoryModalOpen(false)}
                            className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors shadow-sm"
                          >
                            انصراف
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              confirmAction(
                                "آیا از ثبت گروه کالایی اطمینان دارید؟",
                                handleSaveCategory,
                              )
                            }
                            className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            ثبت گروه
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {showProductBarcodesList && (
                    <div key="showProductBarcodesList-modal"
                      className="fixed inset-0 z-[100] flex flex-col bg-white overflow-y-auto print:absolute print:z-auto print:block"
                      dir="rtl"
                    >
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 print:hidden sticky top-0 z-10 shadow-sm">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Printer className="w-5 h-5 text-indigo-600" />
                          چاپ لیستی بارکد کالاها (A4)
                        </h3>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => window.print()}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700"
                          >
                            <Printer className="w-5 h-5" />
                            چاپ
                          </button>
                          <button
                            onClick={() => setShowProductBarcodesList(false)}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-8 print:p-0">
                        <div className="bg-white print:shadow-none shadow-sm border border-gray-200 print:border-none mx-auto print:mx-0 w-[210mm] min-h-[297mm] p-[10mm] print:p-0 print:w-full print:h-auto">
                          <h2 className="text-center font-black text-2xl mb-6 border-b-2 border-black/10 pb-4 text-gray-900">
                            لیست بارکد کالاها -{" "}
                            {storeSettings?.storeName || "فروشگاه"}
                          </h2>

                          <table className="w-full text-sm border-collapse border border-gray-400 print:border-black">
                            <thead>
                              <tr className="bg-gray-100 print:bg-gray-200 uppercase font-black text-xs text-gray-800">
                                <th className="border border-gray-400 print:border-black p-3 text-center w-12">
                                  ردیف
                                </th>
                                <th className="border border-gray-400 print:border-black p-3 text-right">
                                  نام کالا
                                </th>
                                <th className="border border-gray-400 print:border-black p-3 text-center w-32">
                                  کد کالا
                                </th>
                                <th className="border border-gray-400 print:border-black p-3 text-center w-40">
                                  قیمت فروش
                                </th>
                                <th className="border border-gray-400 print:border-black p-3 text-center w-44">
                                  بارکد
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {(selectedProductIds.length > 0 
                                  ? (products || []).filter(p => selectedProductIds.includes(p.id) && p.type !== "service")
                                  : (products || []).filter((p) => p.type !== "service")
                                )
                                .map((prod, idx) => (
                                  <tr key={prod.id || idx} className="break-inside-avoid">
                                    <td className="border border-gray-400 print:border-black p-3 text-center font-bold text-gray-700">
                                      {toPersianDigits(idx + 1)}
                                    </td>
                                    <td className="border border-gray-400 print:border-black p-3 text-right">
                                      <span className="font-black text-base text-gray-900">
                                        {prod.name}
                                      </span>
                                    </td>
                                    <td className="border border-gray-400 print:border-black p-3 text-center font-mono font-bold text-gray-600">
                                      {toPersianDigits(prod.code || "---")}
                                    </td>
                                    <td className="border border-gray-400 print:border-black p-3 text-center font-bold">
                                      {prod.price ? (
                                        <span>
                                          <span
                                            className="text-lg tracking-wider font-extrabold text-gray-900"
                                            dir="ltr"
                                          >
                                            {toPersianDigits(
                                              formatNumber(prod.price),
                                            )}
                                          </span>{" "}
                                          <span className="text-xs text-gray-600">
                                            {storeSettings?.currency || "تومان"}
                                          </span>
                                        </span>
                                      ) : (
                                        <span className="text-gray-400 font-bold text-xs">
                                          ---
                                        </span>
                                      )}
                                    </td>
                                    <td className="border border-gray-400 print:border-black p-2 text-center align-middle">
                                      {prod.barcode ? (
                                        <div className="flex justify-center h-16 overflow-hidden">
                                          <Barcode
                                            value={prod.barcode}
                                            width={1.8}
                                            height={50}
                                            fontSize={12}
                                            margin={0}
                                            background="transparent"
                                          />
                                        </div>
                                      ) : (
                                        <span className="text-gray-400 text-xs font-bold">
                                          ---
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {isGenerateBarcodesModalOpen && (
                    <div key="isGenerateBarcodesModalOpen-modal"
                      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                      dir="rtl"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl w-full max-w-lg flex flex-col shadow-2xl border border-slate-100"
                      >
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
                          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            <BarcodeIcon className="w-5 h-5 text-indigo-600 animate-pulse" />{" "}
                            تولید خودکار بارکد برای کالاها
                          </h3>
                          <button
                            onClick={() => setIsGenerateBarcodesModalOpen(false)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto max-h-[85vh]">
                          <div className="bg-indigo-50/70 text-indigo-800 text-xs font-medium p-4 rounded-2xl leading-relaxed border border-indigo-100/50 flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              ℹ
                            </div>
                            <span>
                              این بخش برای تمام کالاهایی که فاقد بارکد هستند، بر
                              اساس فرمت انتخابی شما بارکد کاملاً یکتا و خودکار ایجاد
                              می‌کند.
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-2">
                                انتخاب فرمت بارکدساز
                              </label>
                              <div className="grid grid-cols-2 gap-2.5">
                                {[
                                  {
                                    id: "prefix_serial",
                                    label: "پیشوند + سریال",
                                    desc: "PRD-000100",
                                  },
                                  {
                                    id: "numeric_only",
                                    label: "فقط عددی",
                                    desc: "10000001",
                                  },
                                  {
                                    id: "date_prefix",
                                    label: "سال و ماه + سریال",
                                    desc: "2606-0001",
                                  },
                                  {
                                    id: "random_alphanumeric",
                                    label: "کاراکتر تصادفی",
                                    desc: "PRD-X7H2K",
                                  },
                                ].map((fmt, index) => (
                                  <button
                                    key={fmt.id}
                                    type="button"
                                    onClick={() => setBarcodeFormat(fmt.id)}
                                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                                      barcodeFormat === fmt.id
                                        ? "bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20"
                                        : "bg-white border-slate-200 hover:bg-slate-50"
                                    }`}
                                  >
                                    <span
                                      className={`text-xs font-black ${barcodeFormat === fmt.id ? "text-indigo-900" : "text-slate-800"}`}
                                    >
                                      {fmt.label}
                                    </span>
                                    <span
                                      className="text-[10px] font-mono text-slate-400 font-bold"
                                      dir="ltr"
                                    >
                                      {fmt.desc}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {(barcodeFormat === "prefix_serial" ||
                              barcodeFormat === "random_alphanumeric") && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                  پیشوند بارکد (Prefix)
                                </label>
                                <input
                                  type="text"
                                  value={barcodePrefix}
                                  onChange={(e) => setBarcodePrefix(e.target.value)}
                                  dir="ltr"
                                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-900 font-sans font-bold"
                                  placeholder="مثال: PRD-"
                                />
                              </motion.div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                              {barcodeFormat !== "random_alphanumeric" && (
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    شروع شماره سریال از
                                  </label>
                                  <input
                                    type="number"
                                    value={barcodeStartNumber}
                                    onChange={(e) =>
                                      setBarcodeStartNumber(Number(e.target.value))
                                    }
                                    dir="ltr"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-900 font-sans font-bold"
                                  />
                                </div>
                              )}

                              <div
                                className={
                                  barcodeFormat === "random_alphanumeric"
                                    ? "col-span-2"
                                    : ""
                                }
                              >
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                  {barcodeFormat === "random_alphanumeric"
                                    ? "طول کاراکترهای تصادفی"
                                    : "طول سریال عددی (Padding)"}
                                </label>
                                <input
                                  type="number"
                                  value={barcodeLength}
                                  onChange={(e) =>
                                    setBarcodeLength(Number(e.target.value))
                                  }
                                  dir="ltr"
                                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-900 font-sans font-bold"
                                />
                              </div>
                            </div>

                            <div className="mt-4 p-5 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 flex flex-col items-center justify-center gap-2">
                              <span className="text-[11px] font-bold text-slate-500">
                                پیش‌نمایش اولین بارکد تولیدی با این فرمت:
                              </span>
                              <span
                                className="text-xl font-black font-mono text-indigo-700 tracking-widest"
                                dir="ltr"
                              >
                                {(() => {
                                  if (barcodeFormat === "prefix_serial") {
                                    return `${barcodePrefix}${String(barcodeStartNumber).padStart(barcodeLength, "0")}`;
                                  } else if (barcodeFormat === "numeric_only") {
                                    return `${String(barcodeStartNumber).padStart(barcodeLength, "0")}`;
                                  } else if (barcodeFormat === "date_prefix") {
                                    const yy = new Date()
                                      .getFullYear()
                                      .toString()
                                      .substring(2);
                                    const mm = String(
                                      new Date().getMonth() + 1,
                                    ).padStart(2, "0");
                                    return `${yy}${mm}-${String(barcodeStartNumber).padStart(barcodeLength, "0")}`;
                                  } else {
                                    return `${barcodePrefix}${"X".repeat(barcodeLength)}`;
                                  }
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
                          <button
                            onClick={() => setIsGenerateBarcodesModalOpen(false)}
                            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-all font-bold text-xs shadow-sm cursor-pointer"
                            disabled={submittingProduct}
                          >
                            انصراف
                          </button>
                          <button
                            onClick={handleGenerateBarcodes}
                            disabled={submittingProduct}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-bold text-xs shadow-md shadow-indigo-600/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                          >
                            {submittingProduct ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                در حال پردازش...
                              </>
                            ) : (
                              "تولید و تخصیص بارکدها"
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {isGroupPriceModalOpen && (
                    <GroupPriceUpdateWizard products={products}
                     
                      productCategories={productCategories}
                      initialSelectedIds={selectedProductIds}
                      currency={storeSettings?.currency || "تومان"}
                      onClose={() => setIsGroupPriceModalOpen(false)}
                      onSave={async (items) => {
                        for (const item of items) {
                          const p = products.find(prod => prod.id === item.id);
                          if (p) {
                            await updateProduct(p.id.toString(), {
                              ...p,
                              price: item.newSalePrice,
                              purchasePrice: item.newPurchasePrice,
                              priceChangeDate: new Date().toISOString(),
                            });
                          }
                        }
                        await fetchDataSilent();
                        setIsGroupPriceModalOpen(false);
                        if (selectedProductIds.length > 0) {
                          setSelectedProductIds([]);
                        }
                        setSuccessMsg("قیمت‌ها با موفقیت بروزرسانی شد.");
                      }}
                    />
                  )}
                  {isScannerOpen && (
                    <BarcodeScannerModal
                      key="barcode-scanner-modal"
                      onClose={() => setIsScannerOpen(false)}
                      onScan={handleBarcodeScan}
                    />
                  )}
                  {isEditReceiptModalOpen && editingReceipt && (
                    <EditReceiptModal persons={persons} accounts={accounts}
                      isOpen={isEditReceiptModalOpen}
                      onClose={() => {
                        setIsEditReceiptModalOpen(false);
                        setEditingReceipt(null);
                      }}
                      receipt={editingReceipt}
                      onSave={handleSaveReceipt}
                     
                     
                      cashboxes={cashboxes}
                      checkbooks={checkbooks}
                      storeSettings={storeSettings}
                    />
                  )}
                  {printingBarcodeProduct && (
                    <PrintBarcodeModal key="print-barcode-modal"
                      product={printingBarcodeProduct}
                      onClose={() => setPrintingBarcodeProduct(null)}
                      storeSettings={storeSettings}
                    />
                  )}
                                {priceChangeProduct && (
                    <ProductPriceChangeModal key="product-price-change-modal"
                      product={priceChangeProduct}
                      currency={storeSettings?.currency || 'تومان'}
                      onClose={() => setPriceChangeProduct(null)}
                      onSuccess={() => {
                        setPriceChangeProduct(null);
                        fetchProducts();
                      }}
                      showNotification={showNotification}
                    />
                  )}

                  <ProductFormModal storeSettings={storeSettings} 
                    isOpen={isProductModalOpen} 
                    onClose={() => setIsProductModalOpen(false)} 
                    editingProductId={editingProductId} 
                    products={products} 
                    productCategories={productCategories} 
                    warehouses={warehouses} 
                    onSuccess={() => fetchDataSilent()} 
                    showNotification={(msg, type = "success") => setNotification({ message: msg, type })} 
                    confirmAction={confirmAction} 
                    activeTab={activeTab} 
                    handleFastAddProduct={handleFastAddProduct} 
                  />
                  {isPersonExtraModalOpen && (
      <div key="isPersonExtraModalOpen-modal"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-4xl flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-500" />
              ثبت اطلاعات تکمیلی بانکی و یادداشت‌ها
            </h3>
            <button
              onClick={() => setIsPersonExtraModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto">
            <form
              id="personExtraForm"
              onSubmit={async (e) => {
                e.preventDefault();
                confirmAction(
                  "آیا از ذخیره اطلاعات بانکی و تکمیلی اطمینان دارید؟",
                  async () => {
                    if (personExtraId) {
                      const existing = persons.find((p) => String(p.id) === String(personExtraId));
                      if (existing) {
                        await updatePerson(personExtraId as string, {
                          ...existing,
                          additionalNotes: personNotes,
                          bankAccounts: personBankAccounts,
                        });
                        await fetchDataSilent();
                      }
                    }
                    setIsPersonExtraModalOpen(false);
                  },
                );
              }}
              className="space-y-6"
            >
              <div>
                 <div className="flex justify-between items-center mb-3">
                   <label className="block text-sm font-medium text-gray-700">
                     حساب‌های بانکی
                   </label>
                   <button
                     type="button"
                     onClick={() => setPersonBankAccounts([...personBankAccounts, { id: generateId(), bankName: '', accountNumber: '', cardNumber: '', shebaNumber: '', title: '' }])}
                     className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:text-emerald-700"
                   >
                     <Plus className="w-4 h-4" />
                     افزودن حساب
                   </button>
                 </div>
                 
                 {personBankAccounts.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <p className="text-sm text-gray-500">هیچ حسابی ثبت نشده است.</p>
                    </div>
                 ) : (
                    <div className="space-y-3">
                      {personBankAccounts.map((account, index) => (
                        <div key={account.id || index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                          <button
                             type="button"
                             onClick={() => setPersonBankAccounts(personBankAccounts.filter((_, i) => i !== index))}
                             className="absolute left-3 top-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-lg"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div className="lg:col-span-1">
                               <label className="block text-xs text-gray-500 mb-1">عنوان حساب</label>
                               <input type="text" value={account.title || ''} onChange={e => { const newAccs = [...personBankAccounts]; newAccs[index].title = e.target.value; setPersonBankAccounts(newAccs); }} className="w-full px-3 py-1.5 text-sm border rounded-lg" placeholder="مثلا: حساب جاری" />
                            </div>
                            <div className="lg:col-span-1">
                               <label className="block text-xs text-gray-500 mb-1">نام بانک</label>
                               <input type="text" value={account.bankName || ''} onChange={e => { const newAccs = [...personBankAccounts]; newAccs[index].bankName = e.target.value; setPersonBankAccounts(newAccs); }} className="w-full px-3 py-1.5 text-sm border rounded-lg" placeholder="مثلا: ملی" />
                            </div>
                            <div className="lg:col-span-1">
                               <label className="block text-xs text-gray-500 mb-1">شماره حساب</label>
                               <input type="text" dir="ltr" value={account.accountNumber || ''} onChange={e => { const newAccs = [...personBankAccounts]; newAccs[index].accountNumber = e.target.value; setPersonBankAccounts(newAccs); }} className="w-full px-3 py-1.5 text-sm border rounded-lg text-left" placeholder="010..." />
                            </div>
                            <div className="lg:col-span-1">
                               <label className="block text-xs text-gray-500 mb-1">شماره کارت</label>
                               <input type="text" dir="ltr" value={account.cardNumber || ''} onChange={e => { const newAccs = [...personBankAccounts]; newAccs[index].cardNumber = e.target.value; setPersonBankAccounts(newAccs); }} className="w-full px-3 py-1.5 text-sm border rounded-lg text-left" placeholder="6037..." />
                            </div>
                            <div className="lg:col-span-1">
                               <label className="block text-xs text-gray-500 mb-1">شماره شبا</label>
                               <input type="text" dir="ltr" value={account.shebaNumber || ''} onChange={e => { const newAccs = [...personBankAccounts]; newAccs[index].shebaNumber = e.target.value; setPersonBankAccounts(newAccs); }} className="w-full px-3 py-1.5 text-sm border rounded-lg text-left" placeholder="IR..." />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                 )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  یادداشت‌های اضافی اطلاعات شخص (آدرس‌های بیشتر و ...)
                </label>
                <textarea
                  value={personNotes}
                  onChange={(e) => setPersonNotes(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl"
                  rows={3}
                  placeholder="یادداشت و اطلاعات بیشتر خود را وارد کنید..."
                />
              </div>
            </form>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={() => setIsPersonExtraModalOpen(false)}
              className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors text-sm"
            >
              انصراف
            </button>
            <button
              form="personExtraForm"
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              ذخیره اطلاعات تکمیلی
            </button>
          </div>
        </motion.div>
      </div>
    )}
                  <PersonIOModal isOpen={isPersonIOModalOpen} onClose={() => setIsPersonIOModalOpen(false)} action={personIOAction} setAction={setPersonIOAction} persons={persons} storeSettings={storeSettings} addPerson={addPerson} showNotification={showNotification} confirmAction={confirmAction} getRoleName={getRoleName} fetchPersons={fetchPersons} />
                  <MinimalMobilePersonModal
                    isOpen={isPersonModalOpen && window.innerWidth < 768}
                    onClose={() => {
                      setIsPersonModalOpen(false);
                      setEditingPersonId(null);
                      
                    }}
                    newPersonType={newPersonType}
                    setNewPersonType={setNewPersonType}
                    newPersonFirstName={newPersonFirstName}
                    setNewPersonFirstName={setNewPersonFirstName}
                    newPersonLastName={newPersonLastName}
                    setNewPersonLastName={setNewPersonLastName}
                    newPersonCompanyName={newPersonCompanyName}
                    setNewPersonCompanyName={setNewPersonCompanyName}
                    newPersonPhone={newPersonPhone}
                    setNewPersonPhone={setNewPersonPhone}
                    newPersonRole={newPersonRole}
                    setNewPersonRole={setNewPersonRole}
                    handleSubmitPerson={handleSubmitPerson}
                    submittingPerson={submittingPerson}
                    personRoles={personRoles}
                  />
                  
                  <PersonFormModal storeSettings={storeSettings} setActiveTab={setActiveTab} setLedgerPersonId={setLedgerPersonId} 
                    isOpen={isPersonModalOpen && window.innerWidth >= 768} 
                    onClose={() => setIsPersonModalOpen(false)} 
                    editingPersonId={editingPersonId} 
                    persons={persons} 
                    personGroups={personGroups} 
                    personRoles={personRoles} 
                    onSuccess={() => fetchDataSilent()} 
                    showNotification={(msg, type = "success") => setNotification({ message: msg, type })} 
                    confirmAction={confirmAction} 
                  />
                  <AccountFormModal storeSettings={storeSettings} 
                    isOpen={isAccountModalOpen} 
                    onClose={() => setIsAccountModalOpen(false)} 
                    editingAccountId={editingAccountId} 
                    accounts={accounts} 
                    onSuccess={() => fetchDataSilent()} 
                    showNotification={(msg, type = "success") => setNotification({ message: msg, type })} 
                    confirmAction={confirmAction} 
                  />
                  <CashboxFormModal storeSettings={storeSettings} 
                    isOpen={isCashboxModalOpen} 
                    onClose={() => setIsCashboxModalOpen(false)} 
                    editingCashboxId={editingCashboxId} 
                    cashboxes={cashboxes} 
                    onSuccess={() => fetchDataSilent()} 
                    showNotification={(msg, type = "success") => setNotification({ message: msg, type })} 
                    confirmAction={confirmAction} 
                  />
                  <WarehouseFormModal storeSettings={storeSettings} 
                    isOpen={isWarehouseModalOpen} 
                    onClose={() => setIsWarehouseModalOpen(false)} 
                    editingWarehouseId={editingWarehouseId} 
                    warehouses={warehouses} 
                    onSuccess={() => fetchDataSilent()} 
                    showNotification={(msg, type = "success") => setNotification({ message: msg, type })} 
                    confirmAction={confirmAction} 
                  />
                  {/* Invoice Saved Viewer / Print Sheet Modals */}
                  
                  {/* Check Details Modal */}
                  {viewingCheck && (
                    <div
                      key="viewing-check-modal"
                      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/55 backdrop-blur-sm"
                      dir="rtl"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-md"
                      >
                        <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h2 className="text-lg font-black text-gray-900">
                                {viewingCheck._type === 'issued' ? 'جزئیات چک پرداختی' : 'جزئیات چک دریافتی'}
                              </h2>
                              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                                شماره چک: {toPersianDigits(viewingCheck.checkNumber)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setViewingCheck(null)}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                              <span className="block text-[10px] font-bold text-gray-500 mb-1">مبلغ چک</span>
                              <div className="text-sm font-black text-gray-900">
                                {toPersianDigits(formatNumber(viewingCheck.amount))} <span className="text-[10px] text-gray-500 font-bold">{storeSettings?.currency || 'تومان'}</span>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                              <span className="block text-[10px] font-bold text-gray-500 mb-1">وضعیت فعلی</span>
                              <div className="text-sm font-black text-indigo-700">
                                {viewingCheck.status === 'issued' ? 'در جریان (صادره)' :
                                 viewingCheck.status === 'cashed' ? 'پاس شده' :
                                 viewingCheck.status === 'bounced' ? 'برگشتی' :
                                 viewingCheck.status === 'cancelled' ? 'باطل شده' :
                                 viewingCheck.status === 'received' ? 'دریافت شده' :
                                 viewingCheck.status === 'deposited' ? 'خوابانده به حساب' :
                                 viewingCheck.status === 'assigned' ? 'خرج شده (واگذاری)' :
                                 viewingCheck.status === 'bounced_assigned' ? 'برگشتی (خرج شده)' :
                                 viewingCheck.status === 'returned' ? 'عودت داده شده' : 'نامشخص'}
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                              <span className="block text-[10px] font-bold text-gray-500 mb-1">تاریخ صدور / دریافت</span>
                              <div className="text-sm font-bold text-gray-900 text-right font-sans">
                                {formatDateDisplay(viewingCheck.issueDate || viewingCheck.receiveDate, storeSettings?.calendarType)}
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                              <span className="block text-[10px] font-bold text-gray-500 mb-1">تاریخ سررسید</span>
                              <div className="text-sm font-bold text-gray-900 text-right font-sans">
                                {formatDateDisplay(viewingCheck.dueDate, storeSettings?.calendarType)}
                              </div>
                            </div>
                          </div>
                          
                          {viewingCheck.description && (
                            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                              <span className="block text-[10px] font-bold text-amber-700 mb-1">بابت / توضیحات</span>
                              <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                {viewingCheck.description}
                              </p>
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <button
                              onClick={() => {
                                if (viewingCheck._type === 'issued') setActiveTab('issued_checks');
                                else setActiveTab('received_checks');
                                setViewingCheck(null);
                              }}
                              className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-colors text-sm border border-indigo-200"
                            >
                              مشاهده در بخش مدیریت چک‌ها
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {viewingInvoice && (
                    <div
                      key="viewing-invoice-modal"
                      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/55 backdrop-blur-sm"
                      dir="rtl"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-4xl max-h-[95vh] flex flex-col print-section print:max-h-none print:h-auto print:overflow-visible print:border-none print:shadow-none print:rounded-none"
                      >
                        {/* Header (No print) */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 no-print">
                          <h3 className="text-lg font-black text-indigo-700 flex items-center gap-2">
                            <Printer className="w-5 h-5" />
                            برگه رسمی فاکتور سیستم
                          </h3>
                          <div className="flex items-center gap-2">
                            <select
                              value={invoicePrintFormat}
                              onChange={(e) => setInvoicePrintFormat(e.target.value as any)}
                              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 outline-none"
                            >
                              <option value="a4">کاغذ A4</option>
                              <option value="a5">کاغذ A5</option>
                              <option value="pos80">لیبل پرینتر</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                setTimeout(() => window.print(), 100);
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <Printer className="w-4 h-4" />
                              چاپ / ذخیره PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewingInvoice(null)}
                              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors border border-gray-100 cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Printable Area */}
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 text-gray-800 text-sm print:overflow-visible print:px-8 print:py-12 bg-gray-50/50 print:bg-white flex justify-center">
                          <style>{`
                            @media print {
                              ${INVOICE_PRINT_FORMATS[invoicePrintFormat].css}
                            }
                          `}</style>
                          {viewingInvoice.type?.includes("warehouse") ? (
                            <div
                              className={
                                "bg-white print:p-0 rounded-2xl print:rounded-none overflow-hidden text-slate-800 w-full shadow-sm border border-slate-200 print:shadow-none print:border-none relative flex flex-col font-sans " +
                                (storeSettings?.print_paper_size === "A5"
                                  ? "max-w-[148mm] min-h-[210mm]"
                                  : storeSettings?.print_paper_size === "receipt80"
                                    ? "max-w-[80mm] min-h-[100mm] print:text-xs"
                                    : storeSettings?.print_paper_size === "receipt58"
                                      ? "max-w-[58mm] min-h-[100mm] print:text-[10px]"
                                      : "max-w-[210mm] min-h-fit")
                              }
                            >
                              <WarehousePrintTemplate persons={persons}
                                data={viewingInvoice}
                                storeSettings={storeSettings}
                                warehouses={warehouses}
                                products={products}
                              />
                            </div>
                          ) : (
                            <div
                              className={
                                "bg-white print:p-0 rounded-2xl print:rounded-none overflow-hidden text-slate-800 w-full shadow-sm border border-slate-200 print:shadow-none print:border-none relative flex flex-col font-sans " +
                                (storeSettings?.print_paper_size === "A5"
                                  ? "max-w-[148mm] min-h-[210mm]"
                                  : storeSettings?.print_paper_size === "receipt80"
                                    ? "max-w-[80mm] min-h-[100mm] print:text-xs"
                                    : storeSettings?.print_paper_size === "receipt58"
                                      ? "max-w-[58mm] min-h-[100mm] print:text-[10px]"
                                      : "max-w-[210mm] min-h-fit")
                              }
                            >
                              <InvoicePrintTemplate persons={persons}
                                data={viewingInvoice}
                                storeSettings={storeSettings}
                               
                                transactions={transactions}
                                invoices={invoices}
                                personOpeningBalances={personOpeningBalances}
                                issuedChecks={issuedChecks}
                                receivedChecks={receivedChecks}
                              />
                            </div>
                          )}
                        </div>

                        {/* Sticky bottom (No print) */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 no-print">
                          {(viewingInvoice.isDraft ||
                            viewingInvoice.status === "draft") && (
                            <button
                              type="button"
                              onClick={() => {
                                setViewingInvoice(null);
                                handleEditInvoiceAction(viewingInvoice);
                              }}
                              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-xs"
                            >
                              <Edit2 className="w-4 h-4" />
                              ویرایش و ثبت نهایی پیش‌نویس
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-xs"
                          >
                            <Printer className="w-4 h-4" />
                            چاپ و پرینت سند
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewingInvoice(null)}
                            className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                          >
                            بستن پیش‌نمایش
                          </button>
                        </div>
                      </motion.div>
                    </div>

                  )}
                  {/* Receipt PRE-REGISTER Preview overlay */}
                  {previewReceiptData &&
                    (() => {
                      const isReceive = previewReceiptData.type === "receive";
                      const themeBg = isReceive
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-rose-600 hover:bg-rose-700";
                      const themeText = isReceive
                        ? "text-emerald-700"
                        : "text-rose-700";
                      const themeLightBg = isReceive
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-rose-50 border-rose-100";
                      const receiptPerson = persons.find(
                        (p) =>
                          p.id.toString() ===
                          previewReceiptData.personId?.toString(),
                      );
                      const receiptTitle = isReceive
                        ? "پیش‌نمایش رسید دریافت وجه"
                        : "پیش‌نمایش رسید پرداخت وجه";

                      let resourceName = "نامشخص";
                      if (previewReceiptData.method === "cash") {
                        if (previewReceiptData.resourceType === "bank") {
                          const bank = accounts.find(
                            (a) =>
                              a.id.toString() ===
                              previewReceiptData.resourceId?.toString(),
                          );
                          if (bank)
                            resourceName =
                              bank.bankName + " - " + bank.accountNumber;
                        } else {
                          const box = cashboxes.find(
                            (c) =>
                              c.id.toString() ===
                              previewReceiptData.resourceId?.toString(),
                          );
                          if (box) resourceName = box.name;
                        }
                      }

                      return (
                        <div
                          key="preview-receipt-modal"
                          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                          dir="rtl"
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col font-sans relative"
                          >
                            {submittingReceipt && (
                              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center cursor-wait select-none">
                                <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                                  {/* Spinner Outer Ring */}
                                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                                  {/* Spinner Inner Ring */}
                                  <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-pulse" />
                                </div>
                                
                                <h3 className="text-lg font-black text-white mb-2">در حال ثبت اطلاعات و صدور سند...</h3>
                                <p className="text-slate-400 text-xs max-w-xs leading-relaxed mb-6 font-bold">
                                  لطفاً منتظر بمانید. تمامی عملیات‌های بانکی، ثبت اسناد حسابداری و تخصیص فاکتورها به صورت یکپارچه و امن در حال انجام است.
                                </p>

                                {/* Elegant Progress/Activity Indicator */}
                                <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                                  <div className="absolute h-full w-1/2 bg-indigo-500 rounded-full animate-loading-bar"></div>
                                </div>
                              </div>
                            )}
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                              <div>
                                <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                                  <Wallet className={`w-5 h-5 ${themeText}`} />
                                  {receiptTitle}
                                </h3>
                                <p className="text-[10px] text-gray-400 font-extrabold mt-1 uppercase tracking-widest">
                                  رسید پیش نویس قبل از تایید نهایی
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setPreviewReceiptData(null)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-colors border border-gray-100 bg-white"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div
                              className="p-6 md:p-8 overflow-y-auto"
                              style={{ maxHeight: "calc(100vh - 200px)" }}
                            >
                              {/* Beautiful Ticket Style Receipt */}
                              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 bg-white shadow-sm relative overflow-hidden">
                                {/* Decorative Ticket Edges */}
                                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 rounded-full border-r-2 border-gray-200 -translate-y-1/2"></div>
                                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 rounded-full border-l-2 border-gray-200 -translate-y-1/2"></div>

                                <div className="text-center mb-8">
                                  <span
                                    className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-3 ${themeLightBg} ${themeText}`}
                                  >
                                    {isReceive
                                      ? "دریافت از مشتری / طرف حساب"
                                      : "پرداخت به مشتری / طرف حساب"}
                                  </span>
                                  <div
                                    className="text-4xl md:text-5xl font-black font-mono tracking-tighter text-gray-900 flex items-center justify-center gap-2 mb-2"
                                    dir="ltr"
                                  >
                                    {formatCurrency(previewReceiptData.amount)}
                                  </div>
                                  <p className="text-sm font-bold text-gray-500">
                                    {numToPersianWords(previewReceiptData.amount)}{" "}
                                    {storeSettings.currency}
                                  </p>
                                </div>

                                {/* Horizontal Divider */}
                                <div className="w-full border-t border-dashed border-gray-200 my-6"></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                  <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                                      طرف حساب
                                    </span>
                                    <div className="text-base font-black text-gray-800">
                                      {renderPersonLink(
                                        receiptPerson?.id,
                                        receiptPerson?.name,
                                      )}{" "}
                                      {receiptPerson?.personCode ? (
                                        <span className="text-gray-400 font-mono text-sm ml-1">
                                          [{receiptPerson.personCode}]
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                                      شماره سند / ثبت
                                    </span>
                                    <div className="text-base font-bold font-mono text-gray-800">
                                      {previewReceiptData.receiptNumber ||
                                        "ثبت نشده"}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                                      تاریخ ایجاد سند
                                    </span>
                                    <div className="text-base font-bold text-gray-800 font-mono flex items-center gap-2">
                                        <span>
                                          {formatDateDisplay(
                                            previewReceiptData.date || previewReceiptData.jalaliDate,
                                          )}
                                        </span>
                                        {previewReceiptData.createdAt && (
                                          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded" dir="ltr">
                                            {toPersianDigits(new Date(previewReceiptData.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false }))}
                                          </span>
                                        )}
                                      </div>
                                  </div>
                                  <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                                      نوع تسویه / حساب
                                    </span>
                                    <div className="text-base font-bold text-gray-800">
                                      {previewReceiptData.method === "cash" ? (
                                        <span className="flex items-center gap-1.5">
                                          <Banknote className="w-4 h-4 text-gray-400" />{" "}
                                          نقدی - {resourceName}
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1.5">
                                          <CreditCard className="w-4 h-4 text-gray-400" />{" "}
                                          چک بانکی
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {previewReceiptData.method === "check" && (
                                  <div className="mt-6 bg-amber-50 rounded-2xl p-4 border border-amber-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <span className="block text-[10px] uppercase tracking-widest font-bold text-amber-600/70 mb-1">
                                        شماره چک
                                      </span>
                                      <div className="text-sm font-bold font-mono text-amber-900">
                                        {previewReceiptData.checkNumber}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="block text-[10px] uppercase tracking-widest font-bold text-amber-600/70 mb-1">
                                        تاریخ سررسید چک
                                      </span>
                                      <div className="text-sm font-bold font-mono text-amber-900">
                                        {previewReceiptData.checkDueDate}
                                      </div>
                                    </div>
                                    <div className="md:col-span-2">
                                      <span className="block text-[10px] uppercase tracking-widest font-bold text-amber-600/70 mb-1">
                                        {isReceive
                                          ? "بانک صادرکننده"
                                          : "از دسته چک"}
                                      </span>
                                      <div className="text-sm font-bold text-amber-900">
                                        {isReceive
                                          ? previewReceiptData.checkBankName
                                          : (() => {
                                              const checkbook = checkbooks.find(
                                                (cb) =>
                                                  cb.id ===
                                                  previewReceiptData.checkbookId,
                                              );
                                              const bankAccount = accounts.find(
                                                (a) =>
                                                  a.id === checkbook?.accountId,
                                              );
                                              return `${bankAccount?.bankName} (${checkbook?.startNumber} - ${checkbook?.endNumber})`;
                                            })()}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {previewReceiptData.description && (
                                  <div className="mt-6 pt-6 border-t border-gray-100">
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">
                                      یادداشت سند
                                    </span>
                                    <p className="text-sm font-bold text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed">
                                      {previewReceiptData.description}
                                    </p>
                                  </div>
                                )}
                                
                                {previewReceiptData.note && (
                                  <div className="mt-6 pt-6 border-t border-gray-100">
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">
                                      یادداشت کوتاه / کد پیگیری
                                    </span>
                                    <p className="text-sm font-bold text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed">
                                      {previewReceiptData.note}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Linked Invoices Section */}
                              {Object.keys(
                                previewReceiptData.linkedInvoices ||
                                  receiptLinkedInvoices ||
                                  {},
                              ).filter(
                                (k) =>
                                  (previewReceiptData.linkedInvoices ||
                                    receiptLinkedInvoices)[k] > 0,
                              ).length > 0 && (
                                <div className="mt-6 border-2 border-indigo-100 rounded-3xl overflow-hidden bg-white shadow-sm">
                                  <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-500" />
                                    <span className="font-black text-indigo-900 text-sm">
                                      تخصیص یافته به فاکتورهای:
                                    </span>
                                  </div>
                                  <table className="w-full text-sm text-right bg-white">
                                    <thead className="bg-white border-b border-gray-100 text-gray-400">
                                      <tr>
                                        <th className="p-4 font-bold text-xs uppercase tracking-widest">
                                          شماره فاکتور
                                        </th>
                                        <th className="p-4 font-bold text-xs uppercase tracking-widest text-center">
                                          مبلغ تسویه شده
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                      {Object.entries(
                                        previewReceiptData.linkedInvoices ||
                                          receiptLinkedInvoices ||
                                          {},
                                      )
                                        .filter(([_, amt]) => (amt as number) > 0)
                                        .map(([invId, amt]) => {
                                          const inv = invoices.find(
                                            (i) =>
                                              i.id.toString() === invId.toString(),
                                          );
                                          return (
                                            <tr
                                              key={invId}
                                              className="hover:bg-gray-50 transition-colors"
                                            >
                                              <td className="p-4 font-black text-gray-800">
                                                فاکتور{" "}
                                                {inv
                                                  ? inv.invoiceNumber ||
                                                    `#${inv.id}`
                                                  : `#${invId}`}
                                              </td>
                                              <td
                                                className="p-4 font-mono font-black text-indigo-600 text-center text-base"
                                                dir="ltr"
                                              >
                                                {formatCurrency(amt as number)}{" "}
                                                <span className="text-[10px] font-sans text-gray-400">
                                                  {storeSettings.currency}
                                                </span>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>

                            <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 no-print">
                              <button
                                type="button"
                                onClick={() => setPreviewReceiptData(null)}
                                className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-colors shadow-sm"
                              >
                                {previewReceiptData._isReadOnly
                                  ? "بستن پیش‌نمایش"
                                  : "بازگشت"}
                              </button>
                              {!previewReceiptData._isReadOnly && (
                                <button
                                  type="button"
                                  disabled={submittingReceipt}
                                  onClick={confirmReceiptSubmit}
                                  className={`px-8 py-3 text-white rounded-xl font-black text-sm flex items-center gap-2 transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 ${themeBg}`}
                                >
                                  {submittingReceipt ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-5 h-5" />
                                  )}
                                  {isReceive
                                    ? "تایید نهایی و صدور رسید دریافت"
                                    : "تایید نهایی و صدور رسید پرداخت"}
                                </button>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      );
                    })()}

                  {/* Inter-warehouse Auto-transfer Proposal Dialog */}
                  {transferProposal && transferProposal.show && (
                    <div
                      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                      dir="rtl"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl shadow-2xl border-2 border-indigo-100 overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col font-sans"
                      >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-indigo-100 flex justify-between items-center bg-indigo-50/40">
                          <div className="text-right">
                            <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
                              <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                              تأمین موجودی و انتقال خودکار بین انبارها
                            </h3>
                            <p className="text-xs text-slate-500 font-bold mt-0.5">
                              برخی اقلام فاکتور در انبار فروش منتخب کسر موجودی
                              دارند.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setTransferProposal(null)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-slate-100 p-2 rounded-xl transition-colors border border-gray-100 cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                          {/* Intro message */}
                          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-bold text-amber-900 leading-relaxed">
                            موجودی کافی در انبار فروش منتخب یافت نشد. بر اساس آمار
                            موجودی انبارها، انتقال‌های زیر جهت تامین کسری فاکتور
                            فروش پیشنهاد می‌شود. با ضربه روی «تأیید و اجرای هوشمند
                            انتقال»، اسناد انتقال انبار صادر و فاکتور فروش شما فوراً
                            ذخیره می‌شود.
                          </div>

                          {/* Items Shortages List */}
                          <div className="space-y-4">
                            <h4 className="font-extrabold text-sm text-slate-800 border-b border-indigo-50 pb-2 flex items-center gap-2">
                              <Package className="w-4 h-4 text-indigo-500" /> بررسی
                              جزئیات کالاها و روش تأمین
                            </h4>

                            {transferProposal.items.map((item, idx) => {
                              const hasActionableTransfers =
                                item.transfers && item.transfers.length > 0;
                              return (
                                <div
                                  key={idx}
                                  className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 space-y-3"
                                >
                                  <div className="flex justify-between items-start flex-wrap gap-2">
                                    <span className="font-black text-slate-900 text-sm">
                                      {item.productName}
                                    </span>
                                    <div className="flex gap-2">
                                      <span className="text-[10px] bg-indigo-50 text-indigo-950 font-bold px-2 py-0.5 border border-indigo-150 rounded-md">
                                        موردنیاز: {item.required} {item.unit}
                                      </span>
                                      <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 border border-rose-150 rounded-md">
                                        کسری در انبار فروش: {item.deficit}{" "}
                                        {item.unit}
                                      </span>
                                    </div>
                                  </div>

                                  {/* List of suggested transfers */}
                                  {hasActionableTransfers ? (
                                    <div className="space-y-2 mt-2">
                                      <div className="text-[11px] text-slate-400 font-bold">
                                        برنامه انتقال پیشنهادی:
                                      </div>
                                      {item.transfers.map(
                                        (tr: any, tIdx: number) => (
                                          <div
                                            key={tIdx}
                                            className="bg-white border border-indigo-50/50 rounded-xl p-3 flex justify-between items-center text-xs text-slate-700 shadow-sm"
                                          >
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className="bg-slate-100 px-2 py-1 rounded font-bold text-slate-800">
                                                {tr.fromWarehouseName}
                                              </span>
                                              <span className="text-indigo-500">
                                                ←
                                              </span>
                                              <span className="font-black text-slate-800">
                                                انتقال {tr.qty} {item.unit}
                                              </span>
                                              <span className="text-indigo-500">
                                                ←
                                              </span>
                                              <span className="bg-indigo-50 px-2 py-1 rounded font-bold text-indigo-900">
                                                {tr.toWarehouseName}
                                              </span>
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                              آماده صدور سند
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-xs font-bold text-rose-500 bg-rose-50/50 border border-rose-100 px-3 py-2 rounded-xl flex items-center gap-2">
                                      <AlertTriangle className="w-4 h-4 shrink-0" />
                                      موجودی این کالا در هیچ انبار دیگری هم کافی
                                      نیست! (کسری غیرقابل تامین: {item.deficit}{" "}
                                      {item.unit})
                                    </div>
                                  )}

                                  {/* Remaining deficit if any */}
                                  {item.remainingDeficit > 0 &&
                                    hasActionableTransfers && (
                                      <div className="text-[10px] text-rose-600 font-bold flex items-center gap-1.5 mt-2 bg-rose-50/30 p-2 rounded-lg border border-rose-100/50">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        کسری باقی‌مانده غیرقابل تأمین از انبارهای
                                        دیگر: {item.remainingDeficit} {item.unit}
                                      </div>
                                    )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 bg-indigo-50/30 border-t border-indigo-100 flex justify-between items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setTransferProposal(null)}
                            className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all text-xs shrink-0"
                          >
                            انصراف و اصلاح فاکتور
                          </button>

                          {(() => {
                            const canFullyTransfer = transferProposal.items.every(
                              (i: any) => i.remainingDeficit === 0,
                            );
                            const hasAnyTransfer = transferProposal.items.some(
                              (i: any) => i.transfers && i.transfers.length > 0,
                            );

                            if (canFullyTransfer) {
                              return (
                                <button
                                  type="button"
                                  onClick={handleExecuteTransferAndSubmit}
                                  disabled={submitting}
                                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 text-white rounded-xl font-black flex items-center gap-2 transition-all shadow-md shadow-indigo-600/10 text-xs"
                                >
                                  {submitting ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                  تأیید و اجرای هوشمند انتقال و ثبت فاکتور
                                </button>
                              );
                            } else {
                              if (storeSettings?.allowNegativeStock) {
                                return (
                                  <div className="flex flex-col md:flex-row gap-3 items-center w-full justify-end">
                                    <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 flex items-center gap-2 flex-1 md:flex-auto shrink-0 whitespace-normal text-right">
                                      <AlertTriangle className="w-4 h-4 shrink-0" />
                                      {hasAnyTransfer
                                        ? "موجودی ناکافی (امکان انتقال جزئی)"
                                        : "انتقال خودکار غیرمقدور (عدم موجودی کل)"}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleExecuteTransferAndSubmit}
                                      disabled={submitting}
                                      className="px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-200 text-white rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/10 text-xs shrink-0 whitespace-nowrap"
                                    >
                                      {submitting ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-4 h-4" />
                                      )}
                                      {hasAnyTransfer
                                        ? "انتقال مقادیر موجود و ثبت فاکتور"
                                        : "ثبت فاکتور (بدون انتقال مقدور)"}
                                    </button>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    {hasAnyTransfer
                                      ? "موجودی ناکافی جهت انتقال کامل. امکان ثبت فاکتور با موجودی منفی غیرفعال است."
                                      : "انتقال خودکار غیرمقدور (عدم موجودی کل کالاها)"}
                                  </div>
                                );
                              }
                            }
                          })()}
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Invoice PRE-REGISTER Preview overlay */}

                  {previewInvoiceData && (
                    <div key="previewInvoiceData-modal"
                      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
                      dir="rtl"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-4xl max-h-[95vh] flex flex-col print-section print:max-h-none print:h-auto print:overflow-visible print:border-none print:shadow-none print:rounded-none relative"
                      >
                        {submitting && (
                          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center cursor-wait select-none no-print">
                            <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                              <RefreshCw className="w-6 h-6 text-indigo-400 animate-pulse" />
                            </div>
                            
                            <h3 className="text-lg font-black text-white mb-2">در حال ثبت سند و بروزرسانی انبارها...</h3>
                            <p className="text-slate-400 text-xs max-w-xs leading-relaxed mb-6 font-bold">
                              لطفاً منتظر بمانید. فاکتور، اسناد انبارداری مرتبط و تراکنش‌های مالی به صورت یکپارچه و امن در حال محاسبه و ذخیره‌سازی است.
                            </p>

                            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                              <div className="absolute h-full w-1/2 bg-indigo-500 rounded-full animate-loading-bar"></div>
                            </div>
                          </div>
                        )}
                        {/* Header (No print) */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 no-print">
                          <div className="text-right">
                            <h3 className="text-base font-black text-amber-600 flex items-center gap-2">
                              <Eye className="w-5 h-5 animate-pulse" />
                              {activeTab.includes("warehouse")
                                ? "پیش‌نمایش قبل از ثبت قطع"
                                : "پیش‌نمایش فاکتور قبل از ثبت قطعی"}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-extrabold mt-0.5">
                              لطفاً اقلام و مبالغ را بررسی کنید. برای چاپ مستقیم
                              می‌توانید گزینه پرینت را بزنید.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreviewInvoiceData(null)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors border border-gray-100 cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Printable Body */}
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 text-gray-800 text-sm print:overflow-visible print:p-0">
                          {/* Visual A4 structure inside dialog */}
                          <div className="border-2 border-indigo-400/50 p-6 rounded-2xl bg-white shadow-xs space-y-6 relative border-dashed print:border-none print:shadow-none print:p-0">
                            {/* Top draft watermark */}
                            <span className="absolute left-6 top-6 no-print text-[10px] bg-amber-100 text-amber-850 font-black px-2.5 py-1 rounded-sm tracking-widest leading-none border border-amber-200">
                              پیش‌نویس غیررسمی
                            </span>

                            {/* Header info */}
                            {/* --- COMPLETELY DIFFERENT CONDITIONAL RENDERING BEGIN --- */}
                            {previewInvoiceData.type?.includes("warehouse") ? (
                              <div
                                className={
                                  "bg-white print:p-0 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:shadow-none border border-gray-100 print:border-none relative overflow-hidden text-gray-800 " +
                                  (storeSettings?.print_paper_size === "A5"
                                    ? "max-w-[148mm] min-h-[210mm] mx-auto"
                                    : storeSettings?.print_paper_size === "receipt80"
                                      ? "max-w-[80mm] min-h-[100mm] mx-auto print:text-xs"
                                      : storeSettings?.print_paper_size ===
                                          "receipt58"
                                        ? "max-w-[58mm] min-h-[100mm] mx-auto print:text-[10px]"
                                        : "max-w-4xl min-h-fit mx-auto")
                                }
                              >
                                <WarehousePrintTemplate persons={persons}
                                  data={previewInvoiceData}
                                  storeSettings={storeSettings}
                                  warehouses={warehouses}
                                  products={products}
                                />
                              </div>
                            ) : (
                              <div
                                className={
                                  "bg-white print:p-0 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:shadow-none border border-gray-100 print:border-none relative overflow-hidden text-gray-800 " +
                                  (storeSettings?.print_paper_size === "A5"
                                    ? "max-w-[148mm] min-h-[210mm] mx-auto"
                                    : storeSettings?.print_paper_size === "receipt80"
                                      ? "max-w-[80mm] min-h-[100mm] mx-auto print:text-xs"
                                      : storeSettings?.print_paper_size ===
                                          "receipt58"
                                        ? "max-w-[58mm] min-h-[100mm] mx-auto print:text-[10px]"
                                        : "max-w-[210mm] min-h-fit mx-auto")
                                }
                              >
                                <InvoicePrintTemplate persons={persons}
                                  data={previewInvoiceData}
                                  storeSettings={storeSettings}
                                 
                                  transactions={transactions}
                                  invoices={invoices}
                                  personOpeningBalances={personOpeningBalances}
                                  issuedChecks={issuedChecks}
                                  receivedChecks={receivedChecks}
                                />
                              </div>
                            )}
                            {/* --- COMPLETELY DIFFERENT CONDITIONAL RENDERING END --- */}
                          </div>
                        </div>

                        {/* Bottom save triggers */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 no-print">
                          <button
                            type="button"
                            onClick={() => setPreviewInvoiceData(null)}
                            className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                          >
                            {activeTab.includes("warehouse")
                              ? "بازگشت و ویرایش سند"
                              : "بازگشت و ویرایش فاکتور"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTimeout(() => window.print(), 100);
                            }}
                            className="px-5 py-2.5 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                            چاپ مستقیم پیش‌نویس
                          </button>
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={async () => {
                              const success =
                                await saveInvoiceData(previewInvoiceData);
                              if (success) {
                                setPreviewInvoiceData(null);
                              }
                            }}
                            className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-70"
                          >
                            {submitting ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  ease: "linear",
                                }}
                                className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : (
                              <>
                                <CheckCircle className="w-4.5 h-4.5" />
                                تایید نهایی و ثبت سند فاکتور
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
                {/* System Version Footer */}
                <footer className="hidden md:block w-full bg-white border-t border-gray-200 py-6 mt-auto shrink-0 no-print">
                  <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div 
                      onClick={() => setIsChangelogModalOpen(true)}
                      className="flex items-center gap-3 text-indigo-900 border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-indigo-100/50 transition-colors"
                    >
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                        Version
                      </span>
                      <span className="text-xs font-black font-mono">v{changelogData[0]?.version || "1.0.0"}</span>
                      <div className="w-px h-3 bg-indigo-200"></div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono font-medium text-indigo-400">
                          commit: {appVersion.hash}
                        </span>
                        <span className="text-[9px] font-medium text-indigo-400">
                          {appVersion.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <Receipt className="w-4 h-4 opacity-70" />
                      <span className="text-xs font-bold text-gray-500 tracking-tight">
                        سیستم جامع مالی و حسابداری یکپارچه
                      </span>
                    </div>

                    <div className="text-[10px] text-gray-400 font-medium">
                      تمامی حقوق محفوظ است &copy; {new Date().getFullYear()}
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          )}
          {printingTransaction &&
            (() => {
              const isReceive = printingTransaction.type === "receive";
              const isSalary = printingTransaction.type === "salary";
              const isPay = printingTransaction.type === "pay";

              const themeColor = isReceive ? "emerald" : isSalary ? "blue" : "rose";
              const themeBg = isReceive
                ? "bg-emerald-50"
                : isSalary
                  ? "bg-blue-50"
                  : "bg-rose-50";
              const themeText = isReceive
                ? "text-emerald-700"
                : isSalary
                  ? "text-blue-700"
                  : "text-rose-700";
              const themeBorder = isReceive
                ? "border-emerald-200"
                : isSalary
                  ? "border-blue-200"
                  : "border-rose-200";
              const themeStamp = isReceive
                ? "border-emerald-500/30 text-emerald-500/20"
                : isSalary
                  ? "border-blue-500/30 text-blue-500/20"
                  : "border-rose-500/30 text-rose-500/20";

              const receiptTitle = isReceive
                ? "رسید دریافت وجه"
                : isSalary
                  ? "فیش حقوق و دستمزد"
                  : "رسید پرداخت وجه";

              const relatedPerson = persons.find(
                (p) =>
                  p.id === printingTransaction.personId ||
                  p.id?.toString() === printingTransaction.personId?.toString(),
              );
              const personName = relatedPerson?.name || "نامشخص";
              const personCode = relatedPerson?.personCode
                ? `[${relatedPerson.personCode}] `
                : "";

              return <div
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm print:bg-white print:p-0 print:absolute print:z-auto print:block"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-full flex flex-col print-section print:shadow-none print:border-none print:rounded-none print:w-[210mm] print:h-[148mm] print:max-w-none print:max-h-none mx-auto font-sans"
                  >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 print:hidden relative z-10 shrink-0">
                      <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <Printer className="w-5 h-5 text-indigo-500" />
                        پیش‌نمایش چاپ رسید
                      </h3>
                      <button
                        onClick={() => setPrintingTransaction(null)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-colors bg-white border border-gray-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div
                      id="print-area"
                      className="p-6 md:p-8 print:p-6 bg-white relative overflow-y-auto overflow-x-hidden print:overflow-hidden flex-1 flex flex-col font-sans border-2 border-gray-100 print:border-[3px] print:border-gray-800 rounded-2xl print:rounded-none min-h-[500px]"
                    >
                      <div className="relative z-10 flex-1 flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8 border-b-[3px] border-gray-800 pb-5">
                          <div className="flex items-center gap-4 w-[35%]">
                            {storeSettings?.logoUrl ? (
                              <img
                                src={storeSettings.logoUrl}
                                alt="Logo"
                                className="w-16 h-16 object-contain grayscale"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-50 border-[2px] border-gray-800 rounded-2xl flex items-center justify-center print:border-gray-800">
                                <Store className="w-8 h-8 text-gray-800" />
                              </div>
                            )}
                            <div>
                              <h2 className="text-xl font-black text-gray-900 leading-tight">
                                {storeSettings?.storeName || "نام مجموعه تجاری"}
                              </h2>
                              {storeSettings?.phone && (
                                <p
                                  className="text-sm text-gray-700 font-sans font-bold mt-1.5 text-base"
                                  dir="ltr"
                                >
                                  {storeSettings.phone}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="w-[30%] text-center flex justify-center mt-2">
                            <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 border-[3px] border-gray-800 px-6 py-2.5 inline-block rounded-2xl">
                              {receiptTitle}
                            </h1>
                          </div>

                          <div className="w-[35%] flex flex-col items-end text-sm space-y-3 mt-2">
                            <div className="flex justify-between items-center w-full max-w-[170px]">
                              <span className="text-gray-800 font-bold">
                                شماره:
                              </span>
                              <span className="font-sans font-black text-gray-900">
                                {toPersianDigits(
                                  printingTransaction.receiptNumber,
                                ) || `#${toPersianDigits(printingTransaction.id)}`}
                              </span>
                            </div>
                            <div className="flex justify-between items-center w-full max-w-[170px]">
                              <span className="text-gray-800 font-bold">
                                تاریخ:
                              </span>
                              <span className="font-sans font-black text-gray-900">
                                {formatDateDisplay(
                                  printingTransaction.date || printingTransaction.jalaliDate,
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center w-full max-w-[170px]">
                              <span className="text-gray-800 font-bold">
                                پیوست:
                              </span>
                              <span className="font-sans font-bold text-gray-900">
                                ندارد
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Amount Block */}
                        <div className="mb-10 flex justify-center mt-4">
                          <div className="w-full max-w-sm border-[3px] border-gray-800 rounded-2xl overflow-hidden flex">
                            <div className="bg-gray-100 border-l-[3px] border-gray-800 px-5 py-4 flex items-center justify-center">
                              <span className="text-base font-black text-gray-900 whitespace-nowrap">
                                مبلغ ({storeSettings?.currency || "ریال"})
                              </span>
                            </div>
                            <div className="flex-1 flex items-center justify-center p-4 text-3xl font-black font-sans tracking-wide bg-white relative">
                              {toPersianDigits(
                                typeof formatNumber === "function"
                                  ? formatNumber(printingTransaction.amount)
                                  : String(printingTransaction.amount),
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Body details */}
                        <div className="mb-10 text-lg md:text-xl font-bold text-gray-900 leading-[3.8rem] md:leading-[4.5rem] text-justify px-4">
                          بدینوسیله گواهی می‌شود مبلغ{" "}
                          <span className="border-b-[3px] border-dashed border-gray-800 px-6 font-black mx-1 pb-1 inline-block min-w-[120px] text-center text-xl md:text-2xl">
                            {toPersianDigits(
                              typeof formatNumber === "function"
                                ? formatNumber(printingTransaction.amount)
                                : String(printingTransaction.amount),
                            )}{" "}
                            {storeSettings?.currency || "ریال"}
                          </span>{" "}
                          معادل ({" "}
                          <span className="border-b-[3px] border-dashed border-gray-800 px-6 font-black text-lg md:text-xl pb-1 inline-block min-w-[200px] text-center">
                            {numToPersianWords(printingTransaction.amount)}
                          </span>{" "}
                          ) مشخصاً،
                          <br />
                          {isReceive
                            ? "از جناب آقای / سرکار خانم / شرکت"
                            : "به جناب آقای / سرکار خانم / شرکت"}{" "}
                          <span className="font-black text-2xl border-b-[3px] border-dashed border-gray-800 px-8 mx-1 pb-1 inline-block min-w-[300px] text-center">
                            {personCode}
                            {personName}
                          </span>
                          <br />
                          به صورت{" "}
                          <span className="font-black text-xl md:text-2xl border-b-[3px] border-dashed border-gray-800 px-6 mx-1 pb-1 inline-block min-w-[150px] text-center">
                            {printingTransaction.method === "cash"
                              ? "نقدی / واریز بانکی"
                              : "چک"}
                          </span>
                          {printingTransaction.method === "check" ? (
                            <span className="font-black text-xl md:text-2xl border-b-[3px] border-dashed border-gray-800 px-6 mx-1 pb-1 inline-block min-w-[300px] text-center">
                              {printingTransaction.checkBankName ||
                                (printingTransaction.checkbookId
                                  ? checkbooks.find(
                                      (cb) =>
                                        cb.id?.toString() ===
                                        printingTransaction.checkbookId?.toString(),
                                    )
                                    ? accounts.find(
                                        (a) =>
                                          a.id?.toString() ===
                                          checkbooks
                                            .find(
                                              (cb) =>
                                                cb.id?.toString() ===
                                                printingTransaction.checkbookId?.toString(),
                                            )
                                            ?.accountId?.toString(),
                                      )?.bankName
                                    : "نامشخص"
                                  : "نامشخص")}{" "}
                              / شماره:{" "}
                              {toPersianDigits(
                                printingTransaction.checkNumber || "",
                              )}{" "}
                              / سررسید:{" "}
                              {toPersianDigits(
                                printingTransaction.checkDueDate || "",
                              )}
                            </span>
                          ) : null}
                          {!isSalary && printingTransaction.method !== "check" && (
                            <>
                              {" "}
                              {isReceive ? "به" : "توسط"}{" "}
                              <span className="font-black text-xl md:text-2xl border-b-[3px] border-dashed border-gray-800 px-8 mx-1 pb-1 inline-block min-w-[200px] text-center">
                                {printingTransaction.resourceType === "bank"
                                  ? `حساب ${accounts.find((a) => a.id === printingTransaction.resourceId || a.id?.toString() === printingTransaction.resourceId?.toString())?.bankName || "نامشخص"}`
                                  : printingTransaction.resourceType === "cashbox"
                                    ? `صندوق ${cashboxes.find((c) => c.id === printingTransaction.resourceId || c.id?.toString() === printingTransaction.resourceId?.toString())?.name || "نامشخص"}`
                                    : "نامشخص"}
                              </span>
                            </>
                          )}
                          <br />
                          بابت{" "}
                          <span className="font-black text-xl md:text-2xl border-b-[3px] border-dashed border-gray-800 px-10 mx-1 pb-1 inline-block min-w-[350px] text-center">
                            {printingTransaction.description || "‌"}
                          </span>
                          <br />
                          {printingTransaction.note && (
                            <>
                              یادداشت / کد پیگیری:{" "}
                              <span className="font-bold text-lg border-b border-dashed border-gray-500 px-6 mx-1 inline-block text-center">
                                {printingTransaction.note}
                              </span>
                              <br />
                            </>
                          )}
                          {isReceive
                            ? "نقداً دریافت گردید."
                            : "تمام و کمال پرداخت گردید."}
                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between items-end px-12 mt-auto pt-32 mb-8">
                          <div className="text-center w-56">
                            <span className="block text-sm font-bold text-gray-900 mb-20">
                              {storeSettings?.print_signature_1 ||
                                (isReceive
                                  ? "مهر و امضای پرداخت کننده"
                                  : isSalary
                                    ? "امضای کارمند"
                                    : "مهر و امضای گیرنده وجه")}
                            </span>
                            <span className="block w-full border-t-[2px] border-gray-400 border-dashed"></span>
                          </div>
                          <div className="text-center w-56">
                            <span className="block text-sm font-bold text-gray-900 mb-20">
                              {storeSettings?.print_signature_2 ||
                                "مهر و امضای امور مالی / مدیریت"}
                            </span>
                            <span className="block w-full border-t-[2px] border-gray-400 border-dashed"></span>
                          </div>
                        </div>

                        {storeSettings?.print_footer_note && (
                          <div className="mt-8 text-center text-xs text-gray-600 font-bold leading-relaxed px-4 pt-4 border-t-2 border-gray-800">
                            {storeSettings.print_footer_note}
                          </div>
                        )}

                        {/* Address block at bottom if available */}
                        {!storeSettings?.print_footer_note &&
                          storeSettings?.address && (
                            <div className="mt-8 text-center text-xs text-gray-600 font-bold px-4 pt-4 border-t-[2px] border-gray-800">
                              نشانی: {storeSettings.address}
                            </div>
                          )}

                        <div className="mt-6 text-center text-xs text-gray-500 font-sans font-bold opacity-80 flex justify-between px-4 pt-2">
                          <span>
                            شناسه سیستمی:{" "}
                            {toPersianDigits(
                              printingTransaction.receiptNumber ||
                                printingTransaction.id ||
                                "",
                            )}
                          </span>
                          <span>
                            PRINTED:{" "}
                            {new Date().toLocaleString("en-US", { hour12: false })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto print:hidden rounded-b-3xl relative z-10 shrink-0">
                      <button
                        onClick={() => setPrintingTransaction(null)}
                        className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-all shadow-sm text-sm"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={() => {
                          setTimeout(() => window.print(), 100);
                        }}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5"
                      >
                        <Printer className="w-5 h-5" />
                        چاپ رسید
                      </button>
                    </div>
                  </motion.div>
                </div>
            })()}
          <PricingWizardModal
            pricingWizardInvoice={pricingWizardInvoice} setPricingWizardInvoice={setPricingWizardInvoice} pricingWizardItems={pricingWizardItems} setPricingWizardItems={setPricingWizardItems} products={products} storeSettings={storeSettings} toPersianDigits={toPersianDigits} formatDateDisplay={formatDateDisplay} formatNumber={formatNumber} setSuccessMsg={setSuccessMsg} fetchProducts={fetchProducts} updateProduct={updateProduct} List={List}
          />
          {isAccountingDocModalOpen && viewingAccountingDoc && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" dir="rtl">
              <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
                 <button onClick={() => setIsAccountingDocModalOpen(false)} className="absolute top-4 left-4 z-50 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                   <X className="w-5 h-5 text-slate-600" />
                 </button>
                 <div className="flex-1 overflow-y-auto w-full">
                   <AccountingDocView
                      doc={viewingAccountingDoc}
                      storeSettings={storeSettings}
                      onBack={() => setIsAccountingDocModalOpen(false)}
                   />
                 </div>
              </div>
            </div>
          )}
          <FastProductCreateModal
            isOpen={isFastProductModalOpen}
            onClose={() => setIsFastProductModalOpen(false)}
            onSave={handleFastSaveProduct}
          />
          <BulkProductImportModal products={products}
            isOpen={isBulkImportOpen}
            onClose={() => setIsBulkImportOpen(false)}
           
            onImport={handleBulkImportItems}
            isPurchase={
              activeTab === "create_purchase" ||
              (activeTab === "create_warehouse_doc" &&
                invoiceType === "warehouse_receipt")
            }
            getLastPriceForProduct={getLastPriceForProduct}
          />
          {isProfileModalOpen && (
            <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
          )}
          {submitting && !previewInvoiceData && (
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-[99999] flex flex-col items-center justify-center p-8 text-center cursor-wait select-none" dir="rtl">
              <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                <RefreshCw className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
              
              <h3 className="text-lg font-black text-white mb-2">در حال ثبت اطلاعات فاکتور و بروزرسانی انبارها...</h3>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed mb-6 font-bold">
                لطفاً منتظر بمانید. تمامی اسناد فاکتور، حواله‌ها و رسیدهای انبار و تراکنش‌های مالی مرتبط به صورت یکپارچه و ایمن در حال محاسبه و ذخیره‌سازی است.
              </p>

              <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                <div className="absolute h-full w-1/2 bg-indigo-500 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          )}


    
          <CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
        </>
      );
      }
