import PricingWizardModal from './components/modals/PricingWizardModal';
import ReceiptsList from './components/financial/ReceiptsList';
import InvoicesList from './components/invoices/InvoicesList';
import CurrencyInput from './components/common/CurrencyInput';
import FastBarcodeScanner from './components/common/FastBarcodeScanner';
import PersonLedgerActionsDropdown from './components/persons/PersonLedgerActionsDropdown';
import ChangelogModal from './components/ChangelogModal';
import changelogData from './data/changelog.json';
import ReceiptPaymentForm from "./components/financial/ReceiptPaymentForm";
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

import WarehouseManager from './components/warehouses/WarehouseManager';

import PersonGroupsManager from "./components/persons/PersonGroupsManager";
import PersonRolesManager from "./components/persons/PersonRolesManager";

// { useState, useEffect, useMemo, useRef } from "react";
import WarehouseDocCreate from './components/warehouses/WarehouseDocCreate';
import SaleInvoiceCreate from './components/invoices/SaleInvoiceCreate';
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
  formatDateDisplay, convertToGregorian,
} from "./utils/format";
import CustomDatePicker from "./components/ui/CustomDatePicker";
const DatePicker = CustomDatePicker;
import html2pdf from "html2pdf.js";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
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

const customPersonFilter = (option: any, inputValue: string) => {
  if (!inputValue) return true;
  const terms = inputValue.toLowerCase().split(" ").filter(Boolean);
  const searchable = (
    option.data.searchStr ||
    option.label ||
    ""
  ).toLowerCase();
  return terms.every((term) => searchable.includes(term));
};

export default function App() {
  const [activeFinancialYear, setActiveFinancialYearState] =
    useState<any>(null);
  const [hasCheckedFinancialYears, setHasCheckedFinancialYears] =
    useState(false);

  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const fetchFinancialYearInfo = async () => {
    try {
      const years = await getFinancialYears();
      const active = years.find((y: any) => y.status === "open") || null;
      setActiveFinancialYearState(active);
      setHasCheckedFinancialYears(true);
    } catch (e) {
      console.error("fetchFinancialYearInfo error", e);
    }
  };

  const [priceChangeProduct, setPriceChangeProduct] = useState<any>(null);
  const [historyProductId, setHistoryProductId] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => Promise<void> | void;
    details?: React.ReactNode;
    loading?: boolean;
  }>({ isOpen: false, message: "", onConfirm: () => {} });

  const confirmAction = (message: string, onConfirm: () => Promise<void> | void, details?: React.ReactNode) => {
    setConfirmState({ isOpen: true, message, onConfirm, details, loading: false });
  };
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const [activeTab, setRawActiveTab] = useState<
    | "create_sale"
    | "debts_credits"
    | "create_purchase"
    | "list_sale"
    | "list_purchase"
    | "create_receive_receipt"
    | "list_receive_receipt"
    | "create_pay_receipt"
    | "list_pay_receipt"
    | "create_salary_payroll"
    | "list_salary_payroll"
    | "create_warehouse_doc"
    | "list_warehouse_docs"
    | "products"
    | "product_view"
    | "product_categories"
    | "persons"
    | "person_profile"
    | "person_opening_balances"
    | "person_groups"
    | "person_roles"
    | "accounts"
    | "cashboxes"
    | "warehouses"
    | "update"
    | "settings"
    | "sms_panel"
    | "financial_report"
    | "analytical_dashboard"
    | "crm_dashboard"
    | "person_ledger"
    | "inventory_report"
    | "checklist"
    | "database"
    | "users_manager"
    | "system_diagnostics"
    | "data_reconciliation"
    | "check_panel"
    | "checkbooks"
    | "issued_checks"
    | "received_checks"
    | "check_calendar"
    | "check_charts"
    | "transfer"
    | "invoice_allocation"
    | "quick_refund"
    | "quick_price_inquiry"
    | "create_sale_return"
    | "create_purchase_return"
    | "list_sale_return"
    | "list_purchase_return"
    | "loans"
    | "system_logs"
    | "database_logs"
    | "stocktaking"
    | "financial_years"
    | "chart_of_accounts"
    | "accounting_docs_list"
    | "accounting_doc_create"
    | "accounting_doc_view"
    | "accounting_auto_sync"
    | "accounting_verification"
    | "accounting_opening_balances"
  >("financial_report");

  const setActiveTab = (tab: any, force: boolean = false) => {
    if (tab === activeTab) return;

    if (!force) {
      const isInvoiceTab =
        activeTab === "create_sale" ||
        activeTab === "create_purchase" ||
        activeTab === "create_warehouse_doc";
      if (isInvoiceTab && items && (items || []).length > 0) {
        confirmAction(
          "فاکتور/سند در حال ثبت است. در صورت خروج از این صفحه، اطلاعات وارد شده حذف خواهد شد. آیا مطمئن هستید؟",
          () => {
            setItems([]);
            setCustomerId("");
            setInvoicePaidAmount(0);
            setOverallDiscountPercent(0);
            setRawActiveTab(tab);
          },
        );
        return;
      }

      const isReceiptTab =
        activeTab === "create_receive_receipt" ||
        activeTab === "create_pay_receipt";
      if (
        isReceiptTab &&
        receiptLinkedInvoices &&
        Object.keys(receiptLinkedInvoices).length > 0
      ) {
        confirmAction(
          "رسید در حال ثبت است. در صورت خروج از این صفحه، اطلاعات وارد شده حذف خواهد شد. آیا مطمئن هستید؟",
          () => {
            setReceiptLinkedInvoices({});
            setReceiptPersonId("");
            setReceiptAmount("");
            setRawActiveTab(tab);
          },
        );
        return;
      }
    }

    setRawActiveTab(tab);
  };
  const [systemModule, setSystemModule] = useState<"sales" | "purchase" | "accounting" | "selector" | "crm" | "hr" | "reports_module" | "all" | "commerce" | "inventory" | "admin">("selector");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState<boolean>(false);
  const [menuLayout, setMenuLayout] = useState<"vertical" | "horizontal">("vertical");
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({
        sales_operations: true,
        purchase_operations: false,
        receipts_payments: false,
        checks_management: false,
        loans_management: false,
        base_info: false,
        reports: true,
        settings: false,
      });

  

  
  const [userSettingsLoaded, setUserSettingsLoaded] = useState(false);

  useEffect(() => {
    if (user?.id) {
      
      try {
        const localSettingsStr = localStorage.getItem('user_settings_' + user.id);
        if (localSettingsStr) {
          const settings = JSON.parse(localSettingsStr);
          if (settings.systemModule) setSystemModule(settings.systemModule);
          if (settings.isFullWidth !== undefined) setIsFullWidth(settings.isFullWidth);
          if (settings.menuLayout) setMenuLayout(settings.menuLayout);
          if (settings.expandedGroups) setExpandedGroups(settings.expandedGroups);
        }
      } catch(e) {}
      setUserSettingsLoaded(true);
    } else {
      setUserSettingsLoaded(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && userSettingsLoaded) {
      localStorage.setItem('user_settings_' + user.id, JSON.stringify({
        systemModule,
        isFullWidth,
        menuLayout,
        expandedGroups
      }));
    }
  }, [user?.id, userSettingsLoaded, systemModule, isFullWidth, menuLayout, expandedGroups]);

  useEffect(() => {
    setLastCreatedReceipt(null);
    if (editingInvoiceId) return; // Prevent overwriting title/type when editing
    if (activeTab === "create_sale") {
      setInvoiceType("sale");
      setInvoiceTitle("فاکتور فروش کالا");
    } else if (activeTab === "create_sale_return") {
      setInvoiceType("sale_return");
      setInvoiceTitle("فاکتور برگشت از فروش");
    } else if (activeTab === "create_purchase_return") {
      setInvoiceType("purchase_return");
      setInvoiceTitle("فاکتور برگشت از خرید");
    } else if (activeTab === "create_purchase") {
      setInvoiceType("purchase");
      setInvoiceTitle("فاکتور خرید کالا");
    } else if (activeTab === "create_warehouse_doc") {
      setInvoiceType("warehouse_receipt");
      setInvoiceTitle("اسناد انبار (ورود/خروج)");
      setWarehouseWizardStep(1);
      setWarehouseOperationType("purchase_invoice");
    }
  }, [activeTab]);

  const [persons, setPersons] = useState<Person[]>([]);
  const [personOpeningBalances, setPersonOpeningBalances] = useState<any[]>([]);
  const [isOpeningBalanceModalOpen, setIsOpeningBalanceModalOpen] =
    useState(false);
  const [editingOpeningBalanceId, setEditingOpeningBalanceId] = useState<
    string | null
  >(null);
  const [selectedOpeningBalancePersonId, setSelectedOpeningBalancePersonId] =
    useState("");
  const [openingBalanceAmount, setOpeningBalanceAmount] = useState("");
  const [openingBalanceType, setOpeningBalanceType] = useState<
    "debtor" | "creditor"
  >("debtor");
  const [openingBalanceDate, setOpeningBalanceDate] = useState<any>(
    new Date(),
  );
  const [openingBalanceDescription, setOpeningBalanceDescription] =
    useState("");
  const [openingBalanceSearch, setOpeningBalanceSearch] = useState("");
  const [submittingOpeningBalance, setSubmittingOpeningBalance] =
    useState(false);
  const [personGroups, setPersonGroups] = useState<PersonGroup[]>([]);
  const [personRoles, setPersonRoles] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cashboxes, setCashboxes] = useState<Cashbox[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehouseStocks, setWarehouseStocks] = useState<WarehouseStock[]>([]);
  const [loans, setLoans] = useState<import("./types").Loan[]>([]);
  const [installments, setInstallments] = useState<
    import("./types").Installment[]
  >([]);
  const [warehouseSubTab, setWarehouseSubTab] = useState<"list" | "stocks">(
    "list",
  );
  const [recalculating, setRecalculating] = useState(false);
  const [personSearchTerm, setPersonSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<(string | number)[]>([]);
  const [whStockSearch, setWhStockSearch] = useState("");
  const [selectedProductCategory, setSelectedProductCategory] =
    useState<string>("all");
  const [selectedPersonGroup, setSelectedPersonGroup] = useState<string>("all");
  const [selectedPersonRole, setSelectedPersonRole] = useState<string>("all");
  const [personCurrentPage, setPersonCurrentPage] = useState<number>(1);
  const [personPageSize, setPersonPageSize] = useState<number>(10);
  const [personsViewMode, setPersonsViewMode] = useState<"list" | "table">(
    "table",
  );
  const [productCurrentPage, setProductCurrentPage] = useState<number>(1);
  const [productPageSize, setProductPageSize] = useState<number>(10);
  const [invoiceCurrentPage, setInvoiceCurrentPage] = useState<number>(1);
  const [invoicePageSize, setInvoicePageSize] = useState<number>(10);
  const [newPersonGroupName, setNewPersonGroupName] = useState("");
  const [newPersonGroupColor, setNewPersonGroupColor] = useState("indigo");
  const [editingPersonGroupId, setEditingPersonGroupId] = useState<
    string | null
  >(null);

  const [newPersonRoleName, setNewPersonRoleName] = useState("");
  const [newPersonRoleCode, setNewPersonRoleCode] = useState("");
  const [editingPersonRoleId, setEditingPersonRoleId] = useState<string | null>(
    null,
  );

  const getRoleName = (roleId?: string) => {
    if (!roleId) return "نامشخص";
    const role = personRoles.find((r) => r.id === roleId);
    return role
      ? role.name
      : roleId === "customer"
        ? "مشتری"
        : roleId === "supplier"
          ? "تامین کننده"
          : roleId === "employee"
            ? "کارمند"
            : "نامشخص";
  };

  const getRoleBadgeClasses = (roleId?: string) => {
    const role = personRoles.find((r) => r.id === roleId);
    if (role && role.color) return role.color;
    return roleId === "customer"
      ? "bg-emerald-50 text-emerald-800 border-emerald-100"
      : roleId === "supplier"
        ? "bg-orange-50 text-orange-850 border-orange-100"
        : "bg-purple-50 text-purple-800 border-purple-100";
  };

  const mapPersonToOption = (p: any) => ({
    value: p.id.toString(),
    label:
      (p.personCode ? "[" + p.personCode + "] " : "") +
      (p.alias || p.name) +
      " (" +
      getRoleName(p.role) +
      ")",
    imageUrl: p.imageUrl,
    searchStr: `${p.alias || ""} ${p.name || ""} ${p.title || ""} ${p.firstName || ""} ${p.lastName || ""} ${p.phone || ""} ${p.nationalId || ""} ${p.personCode || ""} ${p.companyName || ""} ${p.fatherName || ""}`,
  });

  const activePersonsOnly = (persons || []).filter((p) => p.isActive !== false);

  const filteredPersons = (persons || []).filter((p) => {
    // 0. Role Filter
    if (selectedPersonRole !== "all" && p.role !== selectedPersonRole) {
      return false;
    }

    // 1. Group Filter
    if (selectedPersonGroup !== "all") {
      if (selectedPersonGroup === "none") {
        if (p.group && p.group.trim() !== "") return false;
      } else {
        if (p.group !== selectedPersonGroup) return false;
      }
    }

    // 2. Search Filter
    if (!personSearchTerm) return true;
    const terms = personSearchTerm.toLowerCase().split(" ").filter(Boolean);
    const grp = personGroups.find((g) => g.id === p.group);
    const searchable =
      `${p.name || ""} ${p.alias || ""} ${p.firstName || ""} ${p.lastName || ""} ${p.phone || ""} ${p.nationalId || ""} ${p.personCode || ""} ${p.accountingCode || ""} ${p.companyName || ""} ${p.fatherName || ""} ${grp?.name || ""}`.toLowerCase();
    return terms.every((term) => searchable.includes(term));
  });

  // Reset page when filters change
  useEffect(() => {
    setPersonCurrentPage(1);
  }, [personSearchTerm, selectedPersonGroup, personPageSize]);

  useEffect(() => {
    setProductCurrentPage(1);
  }, [productSearchTerm, selectedProductCategory, productPageSize]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payslips, setPayslips] = useState<any[]>([]);
  const [accountingDocuments, setAccountingDocuments] = useState<any[]>([]);
  const [checkbooks, setCheckbooks] = useState<any[]>([]);
  const [issuedChecks, setIssuedChecks] = useState<any[]>([]);
  const [receivedChecks, setReceivedChecks] = useState<any[]>([]);
  const [smsMessages, setSmsMessages] = useState<any[]>([]);

  const [storeSettings, setStoreSettings] = useState<any>({
    storeName: "فروشگاه پیش‌فرض",
    address: "",
    phone: "",
    logoUrl: "",
    currency: "تومان",
    isSetup: false,
    fontFamily: "Vazirmatn",
    theme: "classic",
  });
  const isGmailTheme = storeSettings?.theme === "gmail";
  const [loading, setLoading] = useState(false);
  const [requiresInitSetup, setRequiresInitSetup] = useState(false);

  // Notification Utility
  const sendNotification = async (message, personPhone, method) => {
    if (!method || method === "none" || !personPhone) return;

    if (method === "sms" || method === "gsm") {
      const msgObj = {
        id: generateId(),
        recipient: personPhone,
        message: message,
        status: "sent",
        provider: method,
        timestamp: Date.now(),
      };
      await addSmsMessage(msgObj);
      setSmsMessages((prev) => [...prev, msgObj]);
    }

    setTimeout(() => {
      let icon = "💬";
      if (method === "sms") icon = "📱";
      if (method === "whatsapp") icon = "🟢";
      if (method === "gsm") icon = "📡";

      setSuccessMsg(
        icon + " پیامک/اطلاع‌رسانی به " + personPhone + " ارسال شد.",
      );
    }, 1500);
  };

  // Receipts & Payments Form State
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptPersonId, setReceiptPersonId] = useState<string | number | "">(
    "",
  );
  const [receiptPersonSearchText, setReceiptPersonSearchText] = useState("");
  const [isReceiptPersonDropdownOpen, setIsReceiptPersonDropdownOpen] =
    useState(false);
  const [printingTransaction, setPrintingTransaction] = useState<any>(null);
  const [receiptDate, setReceiptDate] = useState<Date | any>(new Date());
  const [receiptAmount, setReceiptAmount] = useState<string>("");
  const [receiptResourceType, setReceiptResourceType] = useState<
    "bank" | "cashbox"
  >("bank");
  const [receiptMethod, setReceiptMethod] = useState<"cash" | "check">("cash");
  const [receiptCheckNumber, setReceiptCheckNumber] = useState("");
  const [receiptCheckDueDate, setReceiptCheckDueDate] = useState<Date | any>(
    new Date(),
  );
  const [receiptCheckBankName, setReceiptCheckBankName] = useState("");
  const [receiptCheckbookId, setReceiptCheckbookId] = useState<
    string | number | ""
  >("");
  const [receiptResourceId, setReceiptResourceId] = useState<
    string | number | ""
  >("");
  const [receiptDescription, setReceiptDescription] = useState<string>("");
  const [receiptNote, setReceiptNote] = useState<string>("");
  const [receiptLinkedInvoices, setReceiptLinkedInvoices] = useState<
    Record<string, number>
  >({});
  const [submittingReceipt, setSubmittingReceipt] = useState<boolean>(false);
  const receiptSuccessMsg = false;

  // Salary form state
  const [salaryPersonId, setSalaryPersonId] = useState<string | number | "">(
    "",
  );
  const [salaryDate, setSalaryDate] = useState<any>(new Date());
  const [salaryPeriodMonth, setSalaryPeriodMonth] = useState<string>("1");
  const [salaryPeriodYear, setSalaryPeriodYear] = useState<string>("1403");
  const [salaryBaseAmount, setSalaryBaseAmount] = useState<string>("");
  const [salaryHousingAllowance, setSalaryHousingAllowance] =
    useState<string>("");
  const [salaryGroceryAllowance, setSalaryGroceryAllowance] =
    useState<string>("");
  const [salaryOtherAllowances, setSalaryOtherAllowances] =
    useState<string>("");
  const [salaryInsuranceDeduction, setSalaryInsuranceDeduction] =
    useState<string>("");
  const [salaryTaxDeduction, setSalaryTaxDeduction] = useState<string>("");
  const [salaryOtherDeductions, setSalaryOtherDeductions] =
    useState<string>("");
  const [salaryDescription, setSalaryDescription] = useState<string>("");
  const [salaryResourceId, setSalaryResourceId] = useState<
    string | number | ""
  >("");
  const salarySuccessMsg = false;
  const [submittingSalary, setSubmittingSalary] = useState<boolean>(false);
  const [viewingPayslip, setViewingPayslip] = useState<any | null>(null);
  const [printingPersonLedger, setPrintingPersonLedger] = useState<any | null>(
    null,
  );
  const [printingBarcodeProduct, setPrintingBarcodeProduct] = useState<
    any | null
  >(null);

  // Person Ledger & Profile state
  const [ledgerPersonId, setLedgerPersonId] = useState<string | number | "">(
    "",
  );
  const [profilePersonId, setProfilePersonId] = useState<string | number | "">(
    "",
  );
  const [ledgerTab, setLedgerTab] = useState<
    "transactions" | "detailed" | "items" | "checks" | "drafts" | "notes"
  >("transactions");
  const [drawerPersonId, setDrawerPersonId] = useState<string | number | "">(
    "",
  );

  // Invoice Print & Preview State
  // For financial report
  const [reportDateRange, setReportDateRange] = useState<Date[]>([]);
  const [viewingInvoice, setViewingInvoice] = useState<any>(null);
  const [viewingCheck, setViewingCheck] = useState<any>(null);
  const [viewingAccountingDoc, setViewingAccountingDoc] = useState<any>(null);
  const [isAccountingDocModalOpen, setIsAccountingDocModalOpen] = useState(false);
  const [editingAccountingDoc, setEditingAccountingDoc] = useState<any>(null);
  const [pricingWizardInvoice, setPricingWizardInvoice] = useState<any>(null);
  const [pricingWizardItems, setPricingWizardItems] = useState<any[]>([]);
  const [pricingPrintMode, setPricingPrintMode] = useState<"list" | "labels">(
    "list",
  );
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [invoiceGroupMode, setInvoiceGroupMode] = useState<
    "none" | "month" | "season"
  >("none");

  const [previewInvoiceData, setPreviewInvoiceData] = useState<any>(null);
  const [previewReceiptData, setPreviewReceiptData] = useState<any>(null);
  const [editingReceipt, setEditingReceipt] = useState<any>(null);
  const [isEditReceiptModalOpen, setIsEditReceiptModalOpen] = useState(false);
  const [lastCreatedReceipt, setLastCreatedReceipt] = useState<any>(null);
  const [showProductBarcodesList, setShowProductBarcodesList] = useState(false);

  // Update State
  const [updatingStr, setUpdatingStr] = useState(false);
  const [updateLog, setUpdateLog] = useState("");
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStepName, setUpdateStepName] = useState("");
  const [updateStepsStatus, setUpdateStepsStatus] = useState<{
    [key: string]: "idle" | "running" | "success" | "error";
  }>({});
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [latestCommits, setLatestCommits] = useState<any[]>([]);
  const [latestGithubSha, setLatestGithubSha] = useState<string | null>(null);
  const [checkingUpdateVersion, setCheckingUpdateVersion] = useState(false);
  const [hasPromptedUpdate, setHasPromptedUpdate] = useState(false);
  const [didConfirmUpdate, setDidConfirmUpdate] = useState(false);

  useEffect(() => {
    if (!checkingUpdateVersion && !hasPromptedUpdate) {
      const fetchLatestVersion = async () => {
        setCheckingUpdateVersion(true);
        try {
          const timestamp = new Date().getTime();
          const [resVer, resCom] = await Promise.all([
            fetch(
              `https://api.github.com/repos/bazyarlivecom/Store-accounting-system/releases/latest?t=${timestamp}`,
              { cache: "no-store" },
            ),
            fetch(
              `https://api.github.com/repos/bazyarlivecom/Store-accounting-system/commits?per_page=10&t=${timestamp}`,
              { cache: "no-store" },
            ),
          ]);
          let fetchedVer = "Build 2.9.0";

          if (resVer.ok) {
            const data = await resVer.json();
            fetchedVer = data.tag_name || data.name || "Build 2.9.0";
            setLatestVersion(fetchedVer);
          } else {
            setLatestVersion("Build 2.9.0");
          }
          if (resCom.ok) {
            const commits = await resCom.json();
            if (commits.length > 0) {
              setLatestGithubSha(commits[0].sha);
              let currentLocalSha = localStorage.getItem("localCommitSha");
              if (!currentLocalSha && commits.length > 2) {
                currentLocalSha = commits[2].sha;
                localStorage.setItem("localCommitSha", currentLocalSha);
              }
              const newCommits = [];
              for (const c of commits) {
                if (c.sha === currentLocalSha) break;
                newCommits.push(c);
              }
              setLatestCommits(newCommits);
            }
          }
        } catch (error) {
          setLatestVersion("Build 2.9.0");
        } finally {
          setCheckingUpdateVersion(false);
          setHasPromptedUpdate(true);
        }
      };
      fetchLatestVersion();
    }
  }, [checkingUpdateVersion, hasPromptedUpdate]);

  // Update prompt has been disabled in the cloud environment

  // Form State
  const [invoiceType, setInvoiceType] = useState<
    | "sale"
    | "purchase"
    | "warehouse_receipt"
    | "warehouse_remittance"
    | "proforma"
    | "sale_return"
    | "purchase_return"
  >("sale");
  const [listFilter, setListFilter] = useState<any>("all");
  const [purchaseFilter, setPurchaseFilter] = useState<
    "all" | "received" | "pending"
  >("all");

  useEffect(() => {
    setInvoiceCurrentPage(1);
  }, [
    activeTab,
    invoiceGroupMode,
    listFilter,
    invoiceSearchQuery,
    purchaseFilter,
  ]);

  const [invoiceMode, setInvoiceMode] = useState<"auto" | "manual">("auto");
  const [invoiceTitle, setInvoiceTitle] = useState("فاکتور فروش کالا");
  const [warehouseWizardStep, setWarehouseWizardStep] = useState(1);
  const [warehouseOperationType, setWarehouseOperationType] =
    useState("purchase_invoice");
  const [deletePreviousDocs, setDeletePreviousDocs] = useState(false);
  const [invoiceDescription, setInvoiceDescription] = useState("");
  const [invoiceNote, setInvoiceNote] = useState("");
  const [invoiceWarehouseId, setInvoiceWarehouseId] = useState<
    string | number | ""
  >("");
  const [invoiceCurrency, setInvoiceCurrency] = useState<string>("تومان");
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [exchangeRateInput, setExchangeRateInput] = useState<string>("1");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [sellerInvoiceNumber, setSellerInvoiceNumber] = useState("");
  const [date, setDate] = useState<Date | any>(new Date());
  const [customerId, setCustomerId] = useState<string | number | "">("");
  const [sourceInvoiceId, setSourceInvoiceId] = useState<string | number | "">(
    "",
  );

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [overallDiscountPercent, setOverallDiscountPercent] =
    useState<number>(0);
  const [invoicePaymentStatus, setInvoicePaymentStatus] = useState<
    "paid" | "unpaid" | "partial"
  >("unpaid");
  const [invoicePaidAmount, setInvoicePaidAmount] = useState<number>(0);

  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [receiptHasDraft, setReceiptHasDraft] = useState<boolean>(false);
  const [autoSaveInvoiceId, setAutoSaveInvoiceId] = useState<string | null>(
    null,
  );
  const autoSaveDbTimer = useRef<any>(null);
  const isAutoSavingDb = useRef<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  // Inter-warehouse Auto-transfer Proposal State
  const [transferProposal, setTransferProposal] = useState<{
    show: boolean;
    items: {
      productId: string | number;
      productName: string;
      unit: string;
      required: number;
      availableInTarget: number;
      deficit: number;
      remainingDeficit: number;
      transfers: {
        fromWarehouseId: string | number;
        fromWarehouseName: string;
        toWarehouseId: string | number;
        toWarehouseName: string;
        qty: number;
      }[];
    }[];
    payload: any;
  } | null>(null);


  // Auto-save effect for receipt
  useEffect(() => {
    if (["create_receive_receipt", "create_pay_receipt"].includes(activeTab)) {
      if (receiptPersonId || receiptAmount) {
         if (!receiptNumber) {
             const docType = activeTab === "create_receive_receipt" ? "receive_receipt" : "pay_receipt";
             generateDocNumber(docType).then(num => {
                 setReceiptNumber(num);
                 updateDocCounter(docType, num);
             });
         }
      }
      
      const draft = {
        receiptNumber,
        receiptPersonId,
        receiptDate,
        receiptAmount,
        receiptResourceType,
        receiptMethod,
        receiptCheckNumber,
        receiptCheckDueDate,
        receiptCheckBankName,
        receiptCheckbookId,
        receiptResourceId,
        receiptDescription,
        receiptNote,
        receiptLinkedInvoices,
        activeTab
      };
      
      if (receiptPersonId || receiptAmount || receiptDescription || receiptNote) {
        localStorage.setItem("receipt_draft", JSON.stringify(draft));
        setReceiptHasDraft(true);
      } else {
        localStorage.removeItem("receipt_draft");
        setReceiptHasDraft(false);
      }
    }
  }, [
    receiptPersonId,
    receiptDate,
    receiptAmount,
    receiptResourceType,
    receiptMethod,
    receiptCheckNumber,
    receiptCheckDueDate,
    receiptCheckBankName,
    receiptCheckbookId,
    receiptResourceId,
    receiptDescription,
    receiptNote,
    receiptLinkedInvoices,
    activeTab
  ]);

  useEffect(() => {
    if (localStorage.getItem("receipt_draft")) {
      setReceiptHasDraft(true);
    }
  }, []);

  const restoreReceiptDraft = () => {
    const d = localStorage.getItem("receipt_draft");
    if (d) {
      try {
        const parsed = JSON.parse(d);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
        setReceiptPersonId(parsed.receiptPersonId || "");
        setReceiptDate(parsed.receiptDate || new Date());
        setReceiptAmount(parsed.receiptAmount || "");
        setReceiptResourceType(parsed.receiptResourceType || "cashbox");
        setReceiptMethod(parsed.receiptMethod || "cash");
        setReceiptCheckNumber(parsed.receiptCheckNumber || "");
        setReceiptCheckDueDate(parsed.receiptCheckDueDate || new Date());
        setReceiptCheckBankName(parsed.receiptCheckBankName || "");
        setReceiptCheckbookId(parsed.receiptCheckbookId || "");
        setReceiptResourceId(parsed.receiptResourceId || "");
        setReceiptDescription(parsed.receiptDescription || "");
        setReceiptNote(parsed.receiptNote || "");
        setReceiptLinkedInvoices(parsed.receiptLinkedInvoices || {});
        
        showNotification("پیشنویس رسید دریافت/پرداخت بازیابی شد.", "info");
      } catch (e) {}
    }
  };

  const discardReceiptDraft = () => {
    localStorage.removeItem("receipt_draft");
    setReceiptHasDraft(false);
    
    // clear form
    setReceiptPersonId("");
    setReceiptAmount("");
    setReceiptDescription("");
    setReceiptNote("");
    setReceiptLinkedInvoices({});
    setReceiptMethod("cash");
    setReceiptResourceType("cashbox");
    showNotification("پیشنویس رسید حذف شد.", "info");
  };

  // Auto-save effect
  useEffect(() => {
    if (
      [
        "create_sale",
        "create_purchase",
        "create_warehouse_doc",
        "create_sale_return",
        "create_purchase_return",
      ].includes(activeTab)
    ) {
      const draft = {
        invoiceMode,
        invoiceNumber,
        sellerInvoiceNumber,
        customerId,
        sourceInvoiceId,
        items,
        overallDiscountPercent,
        invoiceCurrency,
        exchangeRate,
        exchangeRateInput,
        invoiceType,
        invoiceTitle,
        invoiceDescription,
        invoiceNote,
        activeTab,
        autoSaveInvoiceId,
      };
      if ((items || []).length > 0 || customerId) {
        localStorage.setItem("invoice_draft", JSON.stringify(draft));
        setHasDraft(true);
      } else {
        localStorage.removeItem("invoice_draft");
        setHasDraft(false);
      }

      // Auto-save to database as draft if person is selected and at least one item is present
      if (
        customerId &&
        (items || []).length > 0 &&
        !submitting &&
        invoiceType &&
        !editingInvoiceId
      ) {
        if (autoSaveDbTimer.current) clearTimeout(autoSaveDbTimer.current);
        autoSaveDbTimer.current = setTimeout(async () => {
          if (isAutoSavingDb.current) return;
          isAutoSavingDb.current = true;
          try {
            const cleanItems = (items || []).filter(
              (item) =>
                item.productName ||
                item.productId ||
                (item.quantity > 0 && item.unitPrice > 0),
            );

            if (cleanItems.length === 0) {
              isAutoSavingDb.current = false;
              return;
            }

            const existingDraft = autoSaveInvoiceId
              ? invoices.find((i) => i.id === autoSaveInvoiceId)
              : null;
            const payload = {
              id: autoSaveInvoiceId || generateId(),
              invoiceNumber:
                existingDraft?.invoiceNumber ||
                ((invoiceMode === "auto" && !invoiceNumber) ||
                !invoiceNumber
                  ? ""
                  : invoiceNumber),
              sellerInvoiceNumber: sellerInvoiceNumber || "",
              title: invoiceTitle,
              description: invoiceDescription,
          note: invoiceNote,
              warehouseId: invoiceWarehouseId,
              type: invoiceType,
              currency: invoiceCurrency,
              date:
                typeof date?.toDate === "function"
                  ? date.toDate().toISOString()
                  : new Date(date || new Date()).toISOString(),
                              
              customerId,
              sourceInvoiceId,
              items: cleanItems.map((item) => ({
                ...item,
                warehouseId:
                  (storeSettings?.requireWarehouse ||
                    activeTab.includes("warehouse") ||
                    activeTab === "create_sale" ||
                    invoiceType === "sale") &&
                  invoiceWarehouseId
                    ? invoiceWarehouseId
                    : item.warehouseId,
              })),
              overallDiscountPercent,
              totalAmount: calculateFinalTotal(),
              paymentStatus: invoicePaymentStatus,
              paidAmount: Number(invoicePaidAmount) || 0,
              isDraft: true,
              status: "draft",
            };

            if (autoSaveInvoiceId) {
              await updateInvoice(autoSaveInvoiceId, payload);
            } else {
              const added = await addInvoice(payload);
              setAutoSaveInvoiceId(added.id);
              if (added.invoiceNumber) {
                setInvoiceNumber(added.invoiceNumber);
              }
            }

            // Silent fetch to keep the list up to date in the background
            const updatedInvoices = await getInvoices();
            setInvoices(updatedInvoices);
          } catch (e) {
            console.error("Auto save to DB failed", e);
          } finally {
            isAutoSavingDb.current = false;
          }
        }, 1500);
      }
    }
  }, [
    items,
    customerId,
    invoiceNumber,
    sellerInvoiceNumber,
    sourceInvoiceId,
    overallDiscountPercent,
    invoiceCurrency,
    exchangeRate,
    invoiceMode,
    invoiceType,
    invoiceTitle,
    invoiceDescription,
    invoiceNote,
    activeTab,
    editingInvoiceId,
    invoiceWarehouseId,
    date,
    invoicePaymentStatus,
    invoicePaidAmount,
    autoSaveInvoiceId,
    submitting,
  ]);

  useEffect(() => {
    if (localStorage.getItem("invoice_draft")) {
      setHasDraft(true);
    }
  }, []);

  const restoreDraft = () => {
    const d = localStorage.getItem("invoice_draft");
    if (d) {
      try {
        const parsed = JSON.parse(d);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
        setInvoiceMode(parsed.invoiceMode || "auto");
        setInvoiceNumber(parsed.invoiceNumber || "");
        setSellerInvoiceNumber(parsed.sellerInvoiceNumber || "");
        setCustomerId(parsed.customerId || "");
        setSourceInvoiceId(parsed.sourceInvoiceId || "");
        setItems((parsed.items || []).map(i => ({ ...i, id: i.id || generateId() })));
        setOverallDiscountPercent(parsed.overallDiscountPercent || 0);
        setInvoiceCurrency(parsed.invoiceCurrency || "تومان");
        setExchangeRate(parsed.exchangeRate || 1);
        setExchangeRateInput(parsed.exchangeRateInput || "1");
        setInvoiceDescription(parsed.invoiceDescription || "");
        setInvoiceNote(parsed.invoiceNote || "");
        setAutoSaveInvoiceId(parsed.autoSaveInvoiceId || null);

        // Timeout to let activeTab's effect finish, then override
        setTimeout(() => {
          setInvoiceType(parsed.invoiceType || "sale");
          setInvoiceTitle(parsed.invoiceTitle || "");
        }, 50);

        showNotification("وضعیت ثبت نشده فاکتور، بازیابی شد.", "info");
      } catch (e) {}
    }
  };

  const clearDraft = async () => {
    localStorage.removeItem("invoice_draft");
    setHasDraft(false);
    setCustomerId("");
    setItems([]);
    setOverallDiscountPercent(0);
    setSourceInvoiceId("");
    setSellerInvoiceNumber("");
    if (invoiceMode === "manual") setInvoiceNumber("");
    setEditingInvoiceId(null);
    if (autoSaveInvoiceId) {
      await deleteInvoice(autoSaveInvoiceId);
      setAutoSaveInvoiceId(null);
      const updatedInvoices = await getInvoices();
      setInvoices(updatedInvoices);
    }
  };

  // Redirect to financial_years if no active financial year is set
  useEffect(() => {
    if (hasCheckedFinancialYears && !activeFinancialYear) {
      if (activeTab !== "financial_years" && activeTab !== "settings") {
        setActiveTab("financial_years");
      }
    }
  }, [hasCheckedFinancialYears, activeFinancialYear, activeTab]);

  // Re-fetch financial year info when tab changes to 'financial_years' or 'settings'
  useEffect(() => {
    if (activeTab === "financial_years") {
      fetchFinancialYearInfo();
    }
  }, [activeTab]);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
  ) => {
    playAudioFeedback(type);
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const setSuccessMsg = (msg: string) =>
    msg ? showNotification(msg, "success") : null;
  const setReceiptSuccessMsg = (msg: string) =>
    msg ? showNotification(msg, "success") : null;
  const setSalarySuccessMsg = (msg: string) =>
    msg ? showNotification(msg, "success") : null;
  const customAlert = (msg: string) => showNotification(msg, "error");

  const successMsg = false;

  // Product state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const handleBulkImportItems = (importedItems: any[]) => {
    if (!importedItems || importedItems.length === 0) return;

    setItems((currentItems) => {
      const newItems = [...currentItems];

      importedItems.forEach((imported) => {
        const { product, quantity, unitPrice, discountPercent } = imported;
        if (!product) return;

        // Check if exists
        const existingItemIndex = newItems.findIndex(
          (i) => i.productId?.toString() === product.id?.toString(),
        );

        if (
          existingItemIndex > -1 &&
          !storeSettings.allowDuplicateInvoiceRows
        ) {
          // Update existing
          newItems[existingItemIndex].quantity += quantity;
          if (unitPrice > 0) newItems[existingItemIndex].unitPrice = unitPrice;
          if (discountPercent > 0)
            newItems[existingItemIndex].discountPercent = discountPercent;

          newItems[existingItemIndex].totalPrice = Math.max(
            0,
            newItems[existingItemIndex].quantity *
              newItems[existingItemIndex].unitPrice *
              (1 - newItems[existingItemIndex].discountPercent / 100),
          );
        } else {
          // Add new
          const pPrice = unitPrice > 0 ? unitPrice : product.price || 0;
          const convertedPrice =
            exchangeRate > 0 ? pPrice / exchangeRate : pPrice;
          const unitPriceRounded = Number(convertedPrice.toFixed(4));

          newItems.push({
            id: generateId(),
            productId: product.id.toString(),
            productName: product.name,
            quantity: quantity > 0 ? quantity : 1,
            unitPrice: unitPriceRounded,
            discountPercent: discountPercent || 0,
            totalPrice:
              unitPriceRounded *
              (quantity > 0 ? quantity : 1) *
              (1 - (discountPercent || 0) / 100),
            selectedUnit: product.unit || "",
            unitRatio: product.unitRatio || 1,
            isSecondaryUnit: false,
          });
        }
      });
      return newItems;
    });

    showNotification(
      `${toPersianDigits(importedItems.length)} کالا با موفقیت اضافه شد.`,
      "success",
    );
  };
  const handleBarcodeScan = (code: string) => {
    setIsScannerOpen(false);
    const product = products.find((p) => p.barcode === code);
    if (product) {
      handleFastAddProduct(String(product.id));
      showNotification("کالا با موفقیت اضافه شد", "success");
    } else {
      showNotification("کالا با این بارکد یافت نشد", "error");
    }
  };
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFastProductModalOpen, setIsFastProductModalOpen] = useState(false);
  const [isProductActionsMenuOpen, setIsProductActionsMenuOpen] =
    useState(false);
  const [isGenerateBarcodesModalOpen, setIsGenerateBarcodesModalOpen] =
    useState(false);
  const [isAIProductSearchOpen, setIsAIProductSearchOpen] = useState(false);
  const [barcodeFormat, setBarcodeFormat] = useState("prefix_serial");
  const [barcodePrefix, setBarcodePrefix] = useState("PRD-");
  const [barcodeLength, setBarcodeLength] = useState(6);
  const [barcodeStartNumber, setBarcodeStartNumber] = useState(1000);
  const [isGroupPriceModalOpen, setIsGroupPriceModalOpen] = useState(false);
  const [groupUpdateType, setGroupUpdateType] = useState<"category" | "single" | "selected">(
    "category",
  );
  const [groupUpdateTargetCategory, setGroupUpdateTargetCategory] =
    useState<string>("all");
  const [groupUpdateTargetProduct, setGroupUpdateTargetProduct] =
    useState<string>("");

  const [groupUpdateAmount, setGroupUpdateAmount] = useState<string>("");
  const [groupUpdateDate, setGroupUpdateDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [groupUpdatePriceTarget, setGroupUpdatePriceTarget] = useState<
    "sell" | "buy" | "both"
  >("sell");

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductPriceDate, setNewProductPriceDate] = useState(new Date().toISOString().split("T")[0]);
  const [newProductType, setNewProductType] = useState<"product" | "service">(
    "product",
  );
  const [newProductCategoryId, setNewProductCategoryId] = useState("");

  // Extended product fields
  const [newProductCode, setNewProductCode] = useState("");
  const [newProductBarcode, setNewProductBarcode] = useState("");
  const [newProductPurchasePrice, setNewProductPurchasePrice] = useState("");
  const [newProductWarehouseId, setNewProductWarehouseId] = useState("");
  const [newProductStock, setNewProductStock] = useState("");
  const [newProductMinStock, setNewProductMinStock] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("");
  const [newProductSecondaryUnit, setNewProductSecondaryUnit] = useState("");
  const [newProductUnitRatio, setNewProductUnitRatio] = useState("");
  const [productFormTab, setProductFormTab] = useState<
    "general" | "financial" | "inventory" | "history"
  >("general");
  const [currentProductPriceHistory, setCurrentProductPriceHistory] = useState<any[]>([]);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [editingHistoryDate, setEditingHistoryDate] = useState<string>("");
  const [newProductDesc, setNewProductDesc] = useState("");

  // Categories list
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatParentId, setNewCatParentId] = useState<string | number | "">(
    "",
  );
  const [categorySearch, setCategorySearch] = useState("");

  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Person state
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [personLedgerActionsOpen, setPersonLedgerActionsOpen] = useState(false);
  const [openPersonActionsId, setOpenPersonActionsId] = useState<
    string | number | null
  >(null);
  const [newPersonType, setNewPersonType] = useState<"real" | "legal">("real");
  const [newPersonGender, setNewPersonGender] = useState<
    "male" | "female" | "none"
  >("none");
  const [newPersonTitle, setNewPersonTitle] = useState("");
  const [newPersonAlias, setNewPersonAlias] = useState("");
  const [newPersonFirstName, setNewPersonFirstName] = useState("");
  const [newPersonLastName, setNewPersonLastName] = useState("");
  const [newPersonCompanyName, setNewPersonCompanyName] = useState("");
  const [newPersonFatherName, setNewPersonFatherName] = useState("");
  const [newPersonNationalId, setNewPersonNationalId] = useState("");
  const [newPersonAddress, setNewPersonAddress] = useState("");
  const [newPersonImage, setNewPersonImage] = useState("");
  const [newPersonRole, setNewPersonRole] = useState<string>("");
  const [newPersonAccountingCode, setNewPersonAccountingCode] = useState("");
  const [newPersonPhone, setNewPersonPhone] = useState("");
  const [newPersonGroup, setNewPersonGroup] = useState("");
  const [newPersonProvince, setNewPersonProvince] = useState("");
  const [newPersonCity, setNewPersonCity] = useState("");
  const [newPersonIsActive, setNewPersonIsActive] = useState(true);
  const [newPersonRegistrationDate, setNewPersonRegistrationDate] = useState<
    Date | any
  >(new Date());
  const [newPersonInitialBalance, setNewPersonInitialBalance] = useState("");
  const [newPersonInitialBalanceType, setNewPersonInitialBalanceType] =
    useState<"debtor" | "creditor" | "settled">("settled");
  const [newPersonCreditLimit, setNewPersonCreditLimit] = useState("");

  const [submittingPerson, setSubmittingPerson] = useState(false);
  const [personModalActiveTab, setPersonModalActiveTab] = useState<
    "basic" | "contact" | "financial" | "settings"
  >("basic");
  const [isPersonExtraModalOpen, setIsPersonExtraModalOpen] = useState(false);
  const [personExtraId, setPersonExtraId] = useState<string | number | null>(
    null,
  );
  const [personBankName, setPersonBankName] = useState("");
  const [personBankAcc, setPersonBankAcc] = useState("");
  const [personCard, setPersonCard] = useState("");
  const [personSheba, setPersonSheba] = useState("");
  const [personNotes, setPersonNotes] = useState("");

  // Persons Import/Export Modal states
  const [isPersonIOModalOpen, setIsPersonIOModalOpen] = useState(false);
  const [personIOAction, setPersonIOAction] = useState<"import" | "export">("export");

  // Bank Account modal & form state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [newAccountBankName, setNewAccountBankName] = useState("");
  const [newAccountBranchName, setNewAccountBranchName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountCardNumber, setNewAccountCardNumber] = useState("");
  const [newAccountShebaNumber, setNewAccountShebaNumber] = useState("");
  const [newAccountBalance, setNewAccountBalance] = useState("");
  const [newAccountHolder, setNewAccountHolder] = useState("");
  const [submittingAccount, setSubmittingAccount] = useState(false);

  // Cashbox modal & form state
  const [isCashboxModalOpen, setIsCashboxModalOpen] = useState(false);
  const [newCashboxName, setNewCashboxName] = useState("");
  const [newCashboxManager, setNewCashboxManager] = useState("");
  const [newCashboxBalance, setNewCashboxBalance] = useState("");
  const [submittingCashbox, setSubmittingCashbox] = useState(false);

  // Warehouse modal & form state
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newWarehouseManager, setNewWarehouseManager] = useState("");
  const [newWarehouseLocation, setNewWarehouseLocation] = useState("");
  const [newWarehouseIsActive, setNewWarehouseIsActive] = useState(true);
  const [submittingWarehouse, setSubmittingWarehouse] = useState(false);

  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [editingProductId, setEditingProductId] = useState<
    string | number | null
  >(null);
  const [editingPersonId, setEditingPersonId] = useState<
    string | number | null
  >(null);
  const [editingAccountId, setEditingAccountId] = useState<
    string | number | null
  >(null);
  const [editingCashboxId, setEditingCashboxId] = useState<
    string | number | null
  >(null);
  const [editingWarehouseId, setEditingWarehouseId] = useState<
    string | number | null
  >(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<any>({
    storeName: "",
    address: "",
    phone: "",
    logoUrl: "",
    currency: "تومان",
    fontFamily: "Vazirmatn",
    theme: "classic",
    allowNegativeStock: false,
    requireWarehouse: false,
    prefix_warehouse_receipt: "REC-",
    prefix_warehouse_remittance: "REM-",
    prefix_purchase: "PUR-",
    prefix_sale: "INV-",
    prefix_receive_receipt: "RD-",
    prefix_pay_receipt: "PD-",
    prefix_proforma: "PF-",
    prefix_salary: "PAY-",
    print_footer_note: "",
    print_signature_1: "",
    print_signature_2: "",
    print_signature_3: "",
  });
  const [submittingSettings, setSubmittingSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<string>("general");
  const [smsPanelTab, setSmsPanelTab] = useState<"send_history" | "templates">(
    "send_history",
  );

  // Fetch API data on mount
  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data as any);
    } catch (error) {
      console.error("Error fetching invoices", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data as any);

      const cats = await getProductCategories();
      setProductCategories(cats as any);
    } catch (error) {
      console.error("Error fetching products or categories", error);
    }
  };

  const handleExportProductsData = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      (products || []).map((p) => {
        const mapped = { ...p };
        delete (mapped as any).priceHistory;
        return mapped;
      }),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    const filename = `products_export_${new Date().toLocaleDateString(storeSettings?.calendarType === "gregorian" ? "en-US" : "fa-IR").replace(/\//g, "-")}.xlsx`;
    XLSX.writeFile(workbook, filename);
    showNotification("خروجی اکسل کالاها با موفقیت دریافت شد.", "success");
  };

  const handleDownloadProductsTemplate = () => {
    const templateData = [
      {
        "نام کالا/خدمات (الزامی)": "کالای نمونه",
        "کد کالا": "1001",
        بارکد: "1234567890123",
        "نوع (product/service) (الزامی)": "product",
        دسته‌بندی: "نوشیدنی‌ها",
        "قیمت خرید (ریال)": 20000,
        "قیمت فروش (ریال) (الزامی)": 25000,
        "موجودی فعلی": 50,
        "حداقل موجودی": 10,
        "واحد اصلی (الزامی)": "عدد",
        "واحد فرعی": "بسته",
        "تعداد واحد اصلی در فرعی": 10,
        توضیحات: "این یک کالای نمونه است",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "products_import_template.xlsx");
    showNotification(
      "قالب استاندارد با موفقیت دانلود شد. لطفا اطلاعات را در این قالب وارد کرده و سپس درون‌ریزی کنید.", "success"
    );
  };

  const handleImportProductsData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx, .xls";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const imported = XLSX.utils.sheet_to_json(worksheet);

          if (!Array.isArray(imported) || imported.length === 0) {
            customAlert("فایل نامعتبر یا خالی است.");
            return;
          }
          if (
            !confirm(
              `تعداد ${imported.length} کالا آماده درون‌ریزی است. ادامه می‌دهید؟`,
            )
          )
            return;

          setSubmittingProduct(true);

          let successCount = 0;
          let skippedCount = 0;
          let duplicateMsgs: string[] = [];
          const currentProducts = [...products];

          for (const p of imported as any[]) {
            // Check if it's the standard template format
            if (p["نام کالا/خدمات (الزامی)"] !== undefined) {
              if (
                !p["نام کالا/خدمات (الزامی)"] ||
                !p["نوع (product/service) (الزامی)"] ||
                !p["قیمت فروش (ریال) (الزامی)"] ||
                !p["واحد اصلی (الزامی)"]
              ) {
                continue; // Skip invalid rows
              }

              // Duplicate checking before inserting
              const pName = String(p["نام کالا/خدمات (الزامی)"]);
              const pCode = p["کد کالا"] ? String(p["کد کالا"]) : "";
              const pBarcode = p["بارکد"] ? String(p["بارکد"]) : "";

              if (currentProducts.some((pr) => pr.name === pName)) {
                duplicateMsgs.push(
                  `نام تکراری: ${pName} - پیشنهاد: تغییر نام کالا`,
                );
                skippedCount++;
                continue;
              }
              if (pCode && currentProducts.some((pr) => pr.code === pCode)) {
                duplicateMsgs.push(
                  `کد تکراری: ${pCode} (برای ${pName}) - پیشنهاد: تغییر کد`,
                );
                skippedCount++;
                continue;
              }
              if (
                pBarcode &&
                currentProducts.some((pr) => pr.barcode === pBarcode)
              ) {
                duplicateMsgs.push(`بارکد تکراری: ${pBarcode} (برای ${pName})`);
                skippedCount++;
                continue;
              }

              // Handle category
              let catId = "";
              const catName = p["دسته‌بندی"];
              if (catName) {
                const existingCat = productCategories.find(
                  (c) => c.name === catName,
                );
                if (existingCat) {
                  catId = existingCat.id;
                } else {
                  // Create category if it doesn't exist
                  const newCat = await addProductCategory({
                    name: String(catName),
                  });
                  if (newCat) {
                    catId = newCat.id;
                    const fetchedCats = await getProductCategories();
                    setProductCategories(fetchedCats as any); // refresh categories list
                  }
                }
              }

              const payload = {
                name: pName,
                code: pCode,
                barcode: pBarcode,
                type:
                  p["نوع (product/service) (الزامی)"] === "service"
                    ? "service"
                    : "product",
                categoryId: catId,
                category: catName ? String(catName) : "",
                purchasePrice: Number(p["قیمت خرید (ریال)"] || 0),
                buyPrice: Number(p["قیمت خرید (ریال)"] || 0),
                sellPrice: Number(p["قیمت فروش (ریال) (الزامی)"] || 0),
                price: Number(p["قیمت فروش (ریال) (الزامی)"] || 0),
                stock: Number(p["موجودی فعلی"] || 0),
                minStock: Number(p["حداقل موجودی"] || 0),
                unit: String(p["واحد اصلی (الزامی)"]),
                secondaryUnit: p["واحد فرعی"] ? String(p["واحد فرعی"]) : "",
                unitRatio: Number(p["تعداد واحد اصلی در فرعی"] || 1),
                description: p["توضیحات"] ? String(p["توضیحات"]) : "",
                isActive: true,
              };
              const newProd = await addProduct(payload as any);
              currentProducts.push(newProd as any);
              successCount++;
            } else {
              // Legacy/Exported format
              const payload = { ...p };
              delete payload.id;
              delete payload.createdAt;
              delete payload.updatedAt;

              const pName = payload.name;
              const pCode = payload.code;
              const pBarcode = payload.barcode;

              if (currentProducts.some((pr) => pr.name === pName)) {
                duplicateMsgs.push(`نام تکراری: ${pName}`);
                skippedCount++;
                continue;
              }
              if (pCode && currentProducts.some((pr) => pr.code === pCode)) {
                duplicateMsgs.push(`کد تکراری: ${pCode} (برای ${pName})`);
                skippedCount++;
                continue;
              }
              if (
                pBarcode &&
                currentProducts.some((pr) => pr.barcode === pBarcode)
              ) {
                duplicateMsgs.push(`بارکد تکراری: ${pBarcode} (برای ${pName})`);
                skippedCount++;
                continue;
              }

              const newProd = await addProduct(payload);
              currentProducts.push(newProd as any);
              successCount++;
            }
          }
          await fetchDataSilent();
          setSubmittingProduct(false);
          let finalMsg = `${successCount} کالا با موفقیت درون‌ریزی شد.`;
          if (skippedCount > 0) {
            finalMsg +=
              `

تعداد ${skippedCount} کالا به دلیل تکراری بودن رد شدند:
` +
              duplicateMsgs.slice(0, 10).join("\n")
            if (duplicateMsgs.length > 10) finalMsg += "\n...";
          }
          customAlert(finalMsg);
        } catch (err) {
          console.error(err);
          customAlert("خطا در خواندن فایل اکسل!");
          setSubmittingProduct(false);
        }
      };
      reader.readAsArrayBuffer(file);
    };
    input.click();
  };

  const handleGenerateDemoData = async () => {
    if (
      !confirm(
        "آیا از ایجاد اطلاعات نمونه (دسته‌بندی و کالا) اطمینان دارید؟ اطلاعات فعلی شما دست‌نخورده باقی می‌ماند.",
      )
    )
      return;

    setSubmittingProduct(true);
    try {
      const cat1 = await addProductCategory({
        name: "نوشیدنی‌ها",
        description: "انواع نوشیدنی‌های گرم و سرد",
      });
      const cat2 = await addProductCategory({
        name: "تنقلات",
        description: "چیپس، پفک، بیسکویت...",
      });

      await addProduct({
        name: "نوشابه خانواده کوکاکولا",
        type: "product",
        categoryId: cat1.id,
        category: "نوشیدنی‌ها",
        price: 25000,
        purchasePrice: 20000,
        buyPrice: 20000,
        sellPrice: 25000,
        stock: 50,
        unit: "بطری",
        secondaryUnit: "باکس",
        unitRatio: 6,
      });

      await addProduct({
        name: "آب معدنی کوچک دماوند",
        type: "product",
        categoryId: cat1.id,
        category: "نوشیدنی‌ها",
        price: 5000,
        purchasePrice: 3500,
        buyPrice: 3500,
        sellPrice: 5000,
        stock: 120,
        unit: "بطری",
        secondaryUnit: "باکس",
        unitRatio: 12,
      });

      await addProduct({
        name: "چیپس نمکی مزمز",
        type: "product",
        categoryId: cat2.id,
        category: "تنقلات",
        price: 35000,
        purchasePrice: 28000,
        buyPrice: 28000,
        sellPrice: 35000,
        stock: 45,
        unit: "بسته",
        secondaryUnit: "کارتن",
        unitRatio: 10,
      });

      await fetchDataSilent();
    } catch (err) {
      console.error("Error generating demo data", err);
      alert("خطا در ایجاد دیتای نمونه");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    setSubmittingProduct(true);
    try {
      const isEdit = editingProductId !== null;
      const catName =
        productCategories.find(
          (c) => String(c.id) === String(newProductCategoryId),
        )?.name || "عمومی";

      let finalCode = newProductCode;
      if (!isEdit && !finalCode) {
        const cat = productCategories.find(
          (c) => String(c.id) === String(newProductCategoryId),
        );
        let catCode = cat?.code;
        if (!catCode) {
          catCode = "GEN";
        }
        const existingProducts = (products || []).filter(
          (p) => typeof p.code === "string" && p.code.startsWith(catCode),
        );
        const maxCode = existingProducts
          .map((p) => parseInt(p.code.replace(catCode, ""), 10))
          .filter((n) => !isNaN(n))
          .reduce((a, b) => Math.max(a, b), 0);
        finalCode = `${catCode}${String(maxCode + 1).padStart(4, "0")}`;
      }

      const duplicateName = products.find(
        (p) => p.name === newProductName && p.id !== editingProductId,
      );
      if (duplicateName) {
        customAlert(
          `کالایی با نام "${newProductName}" قبلا ثبت شده است. لطفا نام دیگری انتخاب کنید.`,
        );
        setSubmittingProduct(false);
        return;
      }

      const duplicateCode = products.find(
        (p) => p.code === finalCode && p.id !== editingProductId,
      );
      if (duplicateCode) {
        customAlert(
          `کد کالا (${finalCode}) تکراری است. لطفا کد دیگری وارد کنید.`,
        );
        setSubmittingProduct(false);
        return;
      }

      if (newProductBarcode) {
        const duplicateBarcode = products.find(
          (p) => p.barcode === newProductBarcode && p.id !== editingProductId,
        );
        if (duplicateBarcode) {
          customAlert(`بارکد (${newProductBarcode}) تکراری است.`);
          setSubmittingProduct(false);
          return;
        }
      }

      const payload = {
        name: newProductName,
        price: Number(newProductPrice || 0),
        buyPrice: Number(newProductPurchasePrice || 0),
        sellPrice: Number(newProductPrice || 0),
        priceChangeDate: newProductPriceDate ? new Date(newProductPriceDate).toISOString() : new Date().toISOString(),
        type: newProductType,
        categoryId: newProductCategoryId,
        category: catName,
        code: finalCode,
        barcode: newProductBarcode,
        purchasePrice: Number(newProductPurchasePrice || 0),
        stock: Number(newProductStock || 0),
        warehouseId: newProductWarehouseId,
        minStock: Number(newProductMinStock || 0),
        unit: newProductUnit || "عدد",
        secondaryUnit: newProductSecondaryUnit,
        unitRatio: Number(newProductUnitRatio || 1),
        description: newProductDesc,
      };

      if (isEdit) {
        await updateProduct(editingProductId.toString(), payload);
        setSuccessMsg("کالا با موفقیت ویرایش شد.");
      } else {
        const addedProduct = await addProduct(payload);
        setSuccessMsg("کالای جدید با موفقیت ثبت شد.");

        if (
          ["create_sale", "create_purchase", "create_warehouse_doc"].includes(
            activeTab,
          )
        ) {
          handleFastAddProduct(addedProduct.id.toString(), addedProduct);
          setNotification({
            message: "کالا به عنوان ردیف جدید به فاکتور اضافه شد.",
            type: "info",
          });
          setTimeout(() => setNotification(null), 3000);
        }
      }

      await fetchDataSilent();
      setNewProductName("");
      setNewProductPrice("");
      setNewProductType("product");
      setNewProductCategoryId("");
      setNewProductCode("");
      setNewProductBarcode("");
      setNewProductPurchasePrice("");
      setNewProductWarehouseId("");
      setNewProductStock("");
      setNewProductMinStock("");
      setNewProductUnit("");
      setNewProductSecondaryUnit("");
      setNewProductUnitRatio("");
      setNewProductDesc("");
      setProductFormTab("general");
      setEditingProductId(null);
      setIsProductModalOpen(false);
    } catch (error) {
      console.error("Error saving product", error);
      setSuccessMsg("خطا در ثبت کالا."); // We don't have showError apparently
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleFastSaveProduct = async (productData: any): Promise<boolean> => {
    try {
      const addedProduct = await addProduct(productData);

      if (
        ["create_sale", "create_purchase", "create_warehouse_doc"].includes(
          activeTab,
        )
      ) {
        handleFastAddProduct(addedProduct.id.toString(), addedProduct);
        setNotification({
          message: "کالا ثبت و به عنوان ردیف جدید به فاکتور اضافه شد.",
          type: "info",
        });
        setTimeout(() => setNotification(null), 3000);
      }

      await fetchDataSilent();
      return true;
    } catch (error) {
      console.error("Error fast saving product", error);
      showNotification("خطا در ثبت سریع کالا.", "error");
      return false;
    }
  };

  const handleSaveCategory = async () => {
    if (!newCatName) return;

    try {
      if (editingCategoryId) {
        await updateProductCategory(editingCategoryId, {
          name: newCatName,
          description: newCatDesc,
          parentId: newCatParentId || null,
        });
        setSuccessMsg("گروه‌بندی با موفقیت ویرایش شد.");
      } else {
        const codechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let newCode = "";
        for (let i = 0; i < 3; i++) {
          newCode += codechars.charAt(
            Math.floor(Math.random() * codechars.length),
          );
        }
        await addProductCategory({
          code: newCode,
          name: newCatName,
          description: newCatDesc,
          parentId: newCatParentId || null,
        });
        setSuccessMsg("گروه‌بندی جدید ثبت شد.");
      }
      // re-fetch categories
      const fetchedCats = await getProductCategories();
      setProductCategories(fetchedCats as any);
      setIsCategoryModalOpen(false);
    } catch (err) {
      console.error("Error saving category", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("آیا از حذف این گروه‌بندی اطمینان دارید؟")) return;
    try {
      await deleteProductCategory(id);
      setSuccessMsg("گروه‌بندی حذف شد.");
      const fetchedCats = await getProductCategories();
      setProductCategories(fetchedCats as any);
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  const handleEditCategory = (cat: any) => {
    setEditingCategoryId(cat.id);
    setNewCatName(cat.name);
    setNewCatDesc(cat.description || "");
    setNewCatParentId(cat.parentId || "");
    setIsCategoryModalOpen(true);
  };

  const handleDeleteProduct = async (id: number | string) => {
    const isUsedInInvoices = invoices.some(
      (inv) =>
        inv.items &&
        inv.items.some(
          (item: any) => item.productId?.toString() === id.toString(),
        ),
    );
    if (isUsedInInvoices) {
      alert("این کالا در فاکتورها استفاده شده است و قابل حذف نمی‌باشد.");
      return;
    }
    if (!confirm("آیا از حذف این کالا اطمینان دارید؟")) return;
    try {
      await deleteProduct(id.toString());
      await fetchDataSilent();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleGenerateBarcodes = async () => {
    const productsToUpdate = (products || []).filter(
      (p) => !p.barcode || p.barcode.trim() === "",
    );
    if (productsToUpdate.length === 0) {
      showNotification("تمامی کالاها دارای بارکد هستند.", "success");
      setIsGenerateBarcodesModalOpen(false);
      return;
    }

    let currentNumber = Number(barcodeStartNumber) || 1000;

    // To ensure unique barcodes with what's already existing:
    const existingBarcodes = new Set(
      (products || []).map((p) => p.barcode).filter(Boolean),
    );

    let updatedCount = 0;
    setSubmittingProduct(true);
    try {
      for (const p of productsToUpdate) {
        let newBarcode = "";
        let attempts = 0;
        do {
          if (barcodeFormat === "prefix_serial") {
            newBarcode = `${barcodePrefix}${String(currentNumber).padStart(Number(barcodeLength), "0")}`;
            currentNumber++;
          } else if (barcodeFormat === "numeric_only") {
            newBarcode = `${String(currentNumber).padStart(Number(barcodeLength), "0")}`;
            currentNumber++;
          } else if (barcodeFormat === "date_prefix") {
            const yy = new Date().getFullYear().toString().substring(2);
            const mm = String(new Date().getMonth() + 1).padStart(2, "0");
            newBarcode = `${yy}${mm}-${String(currentNumber).padStart(Number(barcodeLength), "0")}`;
            currentNumber++;
          } else if (barcodeFormat === "random_alphanumeric") {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let randStr = "";
            for (let i = 0; i < Number(barcodeLength); i++) {
              randStr += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            newBarcode = `${barcodePrefix}${randStr}`;
          }
          attempts++;
          if (attempts > 1000) {
            newBarcode += "-" + Math.floor(Math.random() * 1000);
          }
        } while (existingBarcodes.has(newBarcode));

        existingBarcodes.add(newBarcode);
        await updateProduct(p.id.toString(), { ...p, barcode: newBarcode });
        updatedCount++;
      }
      showNotification(
        `${updatedCount} کالا با موفقیت بارکدگذاری شدند.`,
        "success",
      );
    } catch (e) {
      console.error(e);
      showNotification("خطا در بارکدگذاری کالاها", "error");
    } finally {
      setSubmittingProduct(false);
      setIsGenerateBarcodesModalOpen(false);
      fetchProducts();
    }
  };

  const fetchPersonGroups = async () => {
    try {
      const data = await getPersonGroups();
      setPersonGroups(data as any);
    } catch (error) {
      console.error("Error fetching person groups", error);
    }
  };

  const fetchPersonRoles = async () => {
    try {
      const data = await getPersonRoles();
      setPersonRoles(data as any);
    } catch (error) {
      console.error("Error fetching person roles", error);
    }
  };

  const fetchPersons = async () => {
    try {
      const data = await getPersons();
      setPersons(data as any);
    } catch (error) {
      console.error("Error fetching persons", error);
    }
  };

  const fetchPersonOpeningBalances = async () => {
    try {
      const data = await getPersonOpeningBalances();
      setPersonOpeningBalances(data as any);
    } catch (error) {
      console.error("Error fetching person opening balances", error);
    }
  };

  const handleSubmitPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonType === "real" && (!newPersonFirstName || !newPersonLastName))
      return;
    if (newPersonType === "legal" && !newPersonCompanyName) return;

    setSubmittingPerson(true);
    try {
      const isEdit = editingPersonId !== null;
      let name = "";
      let generatedAlias = "";
      if (newPersonType === "legal") {
        name = newPersonCompanyName || "";
        generatedAlias = newPersonAlias || newPersonCompanyName || "";
      } else {
        name = `${newPersonFirstName || ""} ${newPersonLastName || ""}`.trim();
        let defaultAlias =
          `${newPersonTitle ? newPersonTitle + " " : ""}${name}`.trim();
        if (newPersonFatherName) {
          defaultAlias += `(${newPersonFatherName})`;
        }

        let shouldOverrideAlias = false;
        if (isEdit) {
          const existingPerson = persons.find((p) => p.id === editingPersonId);
          if (existingPerson) {
            const oldName =
              `${existingPerson.firstName || ""} ${existingPerson.lastName || ""}`.trim();
            const oldDefaultAlias =
              `${existingPerson.title ? existingPerson.title + " " : ""}${oldName}`.trim();
            const oldDefaultAliasWithFather = existingPerson.fatherName
              ? `${oldDefaultAlias}(${existingPerson.fatherName})`
              : oldDefaultAlias;

            if (
              newPersonAlias === oldDefaultAlias ||
              newPersonAlias === oldDefaultAliasWithFather
            ) {
              shouldOverrideAlias = true;
            }
          }
        }

        if (!newPersonAlias || shouldOverrideAlias) {
          generatedAlias = defaultAlias;
        } else {
          generatedAlias = newPersonAlias;
        }
      }

      const duplicateNationalId = newPersonNationalId
        ? persons.find(
            (p) =>
              p.nationalId === newPersonNationalId &&
              (!isEdit || p.id.toString() !== editingPersonId.toString()),
          )
        : null;
      const duplicatePhone = newPersonPhone
        ? persons.find(
            (p) =>
              p.phone === newPersonPhone &&
              (!isEdit || p.id.toString() !== editingPersonId.toString()),
          )
        : null;
      const duplicateAlias = generatedAlias
        ? persons.find(
            (p) =>
              (p.alias === generatedAlias || p.name === generatedAlias) &&
              (!isEdit || p.id.toString() !== editingPersonId.toString()),
          )
        : null;

      let warningMessage = "";
      if (duplicateAlias)
        warningMessage +=
          "نام مستعار یا نام وارد شده تکراری است (مربوط به: " +
          (duplicateAlias.name || duplicateAlias.alias) +
          ").\n";
      if (duplicateNationalId)
        warningMessage +=
          "کد/شناسه ملی وارد شده تکراری است (مربوط به: " +
          duplicateNationalId.name +
          ").\n";
      if (duplicatePhone)
        warningMessage +=
          "شماره تماس وارد شده تکراری است (مربوط به: " +
          duplicatePhone.name +
          ").\n";

      if (warningMessage) {
        if (
          !window.confirm(
            warningMessage +
              "\nآیا مطمئن هستید که می‌خواهید این شخص را با اطلاعات تکراری ثبت کنید؟",
          )
        ) {
          setSubmittingPerson(false);
          return;
        }
      }

      const payload = {
        type: newPersonRole, // Firebase db maps roles to type
        name: name,
        fullName: name,
        title: newPersonTitle,
        alias: generatedAlias,
        personType: newPersonType,
        firstName: newPersonFirstName,
        lastName: newPersonLastName,
        companyName: newPersonCompanyName,
        fatherName: newPersonFatherName,
        nationalId: newPersonNationalId,
        gender: newPersonGender,
        accountingCode: newPersonAccountingCode,
        address: newPersonAddress,
        imageUrl: newPersonImage,
        role: newPersonRole,
        phone: newPersonPhone,
        initialBalance: Number(newPersonInitialBalance || 0),
        initialBalanceType: newPersonInitialBalanceType,
        creditLimit: Number(newPersonCreditLimit || 0),
        group: newPersonGroup,
        province: newPersonProvince,
        city: newPersonCity,
        isActive: newPersonIsActive,
        registrationDate:
          typeof newPersonRegistrationDate.toDate === "function"
            ? newPersonRegistrationDate.toDate().toISOString()
            : new Date(newPersonRegistrationDate).toISOString(),
      };

      if (isEdit) {
        await updatePerson(editingPersonId.toString(), payload as any);
      } else {
        await addPerson(payload as any);
      }

      await fetchDataSilent();
      setNewPersonTitle("");
      setNewPersonAlias("");
      setNewPersonGender("none");
      setNewPersonFirstName("");
      setNewPersonLastName("");
      setNewPersonCompanyName("");
      setNewPersonFatherName("");
      setNewPersonNationalId("");
      setNewPersonAccountingCode("");
      setNewPersonAddress("");
      setNewPersonImage("");
      setNewPersonPhone("");
      setNewPersonGroup("");
      setNewPersonProvince("");
      setNewPersonCity("");
      setNewPersonIsActive(true);
      setNewPersonRegistrationDate(new Date());
      setNewPersonRole("customer");
      setNewPersonInitialBalance("");
      setNewPersonInitialBalanceType("settled");
      setNewPersonCreditLimit("");
      setPersonModalActiveTab("basic");
      setEditingPersonId(null);
      setIsPersonModalOpen(false);
      setSuccessMsg(
        isEdit ? "شخص با موفقیت ویرایش شد" : "شخص با موفقیت اضافه شد",
      );
    } catch (error) {
      console.error("Error saving person", error);
    } finally {
      setSubmittingPerson(false);
    }
  };

  const handleDeletePerson = async (id: number | string) => {
    const isUsedInInvoices = invoices.some(
      (inv) => inv.customerId?.toString() === id.toString(),
    );
    if (isUsedInInvoices) {
      alert("این شخص در فاکتورها استفاده شده است و قابل حذف نمی‌باشد.");
      return;
    }
    const isUsedInTransactions = transactions.some(
      (tx) => tx.personId?.toString() === id.toString(),
    );
    if (isUsedInTransactions) {
      alert(
        "برای این شخص در تراکنش‌های مالی سابقه ثبت شده است و قابل حذف نمی‌باشد.",
      );
      return;
    }
    const isUsedInIssuedChecks = issuedChecks.some(
      (chk) => chk.payeeId?.toString() === id.toString(),
    );
    const isUsedInReceivedChecks = receivedChecks.some(
      (chk) => chk.payerId?.toString() === id.toString(),
    );
    if (isUsedInIssuedChecks || isUsedInReceivedChecks) {
      alert("این شخص دارای چک ثبت شده است و قابل حذف نمی‌باشد.");
      return;
    }
    if (!confirm("آیا از حذف این شخص اطمینان دارید؟")) return;
    try {
      await deletePerson(id.toString());
      await fetchDataSilent();
    } catch (error) {
      console.error("Error deleting person", error);
    }
  };

  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
  const handleGenerateMissingAccountingCodes = async () => {
    setIsGeneratingCodes(true);
    try {
      const personsWithoutCode = (persons || []).filter(
        (p) => !p.accountingCode || String(p.accountingCode).trim() === "",
      );
      if (personsWithoutCode.length === 0) {
        alert("تمام اشخاص در حال حاضر دارای کد حسابداری هستند.");
        setIsGeneratingCodes(false);
        return;
      }

      let generated = 0;
      for (const p of personsWithoutCode) {
        await updatePerson(p.id as string, p);
        generated++;
      }

      setSuccessMsg(`کد حسابداری برای ${generated} شخص با موفقیت صادر شد.`);
      await fetchDataSilent();
    } catch (error) {
      console.error(error);
      alert("خطا در صدور کدهای حسابداری");
    } finally {
      setIsGeneratingCodes(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data as any);
    } catch (error) {
      console.error("Error fetching accounts", error);
    }
  };

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountBankName) return;
    setSubmittingAccount(true);
    try {
      const isEdit = editingAccountId !== null;
      const payload = {
        bankName: newAccountBankName,
        branchName: newAccountBranchName,
        accountNumber: newAccountNumber,
        cardNumber: newAccountCardNumber,
        sheba: newAccountShebaNumber,
        shebaNumber: newAccountShebaNumber,
        initialBalance: Number(newAccountBalance) || 0,
        balance: Number(newAccountBalance) || 0,
        accountHolder: newAccountHolder,
      };

      if (isEdit) {
        await updateAccount(editingAccountId.toString(), payload as any);
      } else {
        await addAccount(payload as any);
      }

      await fetchAccounts();
      setNewAccountBankName("");
      setNewAccountBranchName("");
      setNewAccountNumber("");
      setNewAccountCardNumber("");
      setNewAccountShebaNumber("");
      setNewAccountBalance("");
      setNewAccountHolder("");
      setEditingAccountId(null);
      setIsAccountModalOpen(false);
      setSuccessMsg(
        isEdit
          ? "حساب بانکی با موفقیت ویرایش شد"
          : "حساب بانکی با موفقیت ثبت شد",
      );
    } catch (error) {
      console.error("Error saving account", error);
    } finally {
      setSubmittingAccount(false);
    }
  };

  const handleDeleteAccount = async (id: number | string) => {
    if (!confirm("آیا از حذف این حساب بانکی اطمینان دارید؟")) return;
    try {
      await deleteAccount(id.toString());
      await fetchAccounts();
    } catch (error) {
      console.error("Error deleting account", error);
    }
  };

  const fetchCashboxes = async () => {
    try {
      const data = await getCashboxes();
      setCashboxes(data as any);
    } catch (error) {
      console.error("Error fetching cashboxes", error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data as any);

      const stocks = await getWarehouseStocks();
      setWarehouseStocks(stocks as any);
    } catch (error) {
      console.error("Error fetching warehouses", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data as any);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const fetchAccountingDocuments = async () => {
    try {
      const data = await getAccountingDocuments();
      setAccountingDocuments(data as any);
    } catch (error) {
      console.error("Error fetching accounting documents", error);
    }
  };

  const checkDebtThreshold = async (personId: string | number) => {
    if (
      !storeSettings?.smsDebtThresholdEnabled ||
      storeSettings.smsDebtThresholdAmount === undefined ||
      !storeSettings?.notify_method ||
      storeSettings.notify_method === "none"
    )
      return;

    try {
      const [
        allPersons,
        allInvoices,
        allTransactions,
        allIssuedChecks,
        allReceivedChecks,
      ] = await Promise.all([
        getPersons(),
        getInvoices(),
        getTransactions(),
        getIssuedChecks(),
        getReceivedChecks(),
      ]);

      const person = allPersons.find(
        (p: any) => p.id.toString() === personId.toString(),
      );
      if (!person || !person.phone) return;

      let balance = 0;
      if (person.initialBalance && person.initialBalanceType !== "settled") {
        balance +=
          person.initialBalanceType === "debtor"
            ? person.initialBalance
            : -person.initialBalance;
      }

      allInvoices
        .filter(
          (i: any) =>
            i.customerId?.toString() === personId.toString() &&
            i.type !== "warehouse_receipt" &&
            i.type !== "warehouse_remittance" &&
            i.type !== "proforma" &&
            i.status !== "draft" && i.status !== "voided",
        )
        .forEach((inv: any) => {
          const amount =
            (inv.totalAmount || 0) *
            getDefaultExchangeRate(
              inv.currency,
              storeSettings?.currency || "تومان",
            );
          if (inv.type === "sale") balance += amount;
          else if (inv.type === "purchase") balance -= amount;
          else if (inv.type === "sale_return") balance -= amount;
          else if (inv.type === "purchase_return") balance += amount;
        });

      allTransactions
        .filter(
          (t: any) =>
            t.personId?.toString() === personId.toString() &&
            t.method !== "check",
        )
        .forEach((t: any) => {
          if (t.type === "receive") balance -= t.amount || 0;
          else if (t.type === "pay") balance += t.amount || 0;
          else if (t.type === "salary") balance -= t.amount || 0;
        });

      allIssuedChecks
        .filter(
          (c: any) =>
            c.payeeId?.toString() === personId.toString() &&
            c.status !== "cancelled" &&
            c.status !== "bounced" &&
            c.status !== "cashed",
        )
        .forEach((c: any) => {
          balance += c.amount || 0;
        });

      allReceivedChecks
        .filter(
          (c: any) =>
            c.payerId?.toString() === personId.toString() &&
            c.status !== "returned" &&
            c.status !== "bounced" &&
            c.status !== "cashed",
        )
        .forEach((c: any) => {
          balance -= c.amount || 0;
        });

      if (balance > storeSettings.smsDebtThresholdAmount) {
        const amt =
          typeof formatNumber === "function"
            ? formatNumber(balance)
            : addCommas(balance);
        let msg =
          storeSettings.smsDebtThresholdMessage ||
          "مشتری گرامی، مانده بدهی شما از سقف مجاز عبور کرده است. لطفا نسبت به تسویه حساب اقدام نمایید.";
        msg = msg
          .replace(/{name}/g, person.name)
          .replace(/{amount}/g, String(amt))
          .replace(/{date}/g, new Date().toLocaleDateString("fa-IR"));
        sendNotification(msg, person.phone, storeSettings.notify_method);
      }
    } catch (err) {
      console.error("Error checking debt threshold:", err);
    }
  };

  const handleSubmitReceipt = (type: "receive" | "pay", e: React.FormEvent) => {
    e.preventDefault();
    if (receiptMethod === "cash") {
      if (
        !receiptPersonId ||
        !receiptAmount ||
        !receiptResourceType ||
        !receiptResourceId
      ) {
        customAlert("لطفا تمام اطلاعات الزامی فرم را وارد کنید.");
        return;
      }
    } else {
      if (
        !receiptPersonId ||
        !receiptAmount ||
        !receiptCheckNumber ||
        !receiptCheckDueDate ||
        (type === "receive" && !receiptCheckBankName) ||
        (type === "pay" && !receiptCheckbookId)
      ) {
        customAlert("لطفا تمام اطلاعات الزامی فرم چک را وارد کنید.");
        return;
      }
    }

    if (type === "pay") {
      const person = persons.find(
        (p) => p.id.toString() === receiptPersonId.toString(),
      );
      if (person && person.creditLimit && person.creditLimit > 0) {
        const currentBalanceObj = calculatePersonBalance(receiptPersonId);
        let currentDebt =
          currentBalanceObj.status === "بدهکار"
            ? currentBalanceObj.amount
            : -currentBalanceObj.amount;

        // type === "pay" means we are paying them, so their debt to us INCREASES.
        const newDebt = currentDebt + Number(receiptAmount);

        if (newDebt > person.creditLimit) {
          customAlert(
            `خطا: ثبت این سند باعث عبور از سقف اعتبار شخص می‌شود.
سقف اعتبار: ${addCommas(person.creditLimit)}
مبلغ بدهی بعد از ثبت: ${addCommas(newDebt)}`,
          );
          return;
        }
      }
    }

    // Validate allocated amounts
    const totalAllocated = Object.values(receiptLinkedInvoices).reduce(
      (a, b) => a + b,
      0,
    );
    if (totalAllocated > Number(receiptAmount)) {
      customAlert(
        `جمع مبالغ تخصیص داده شده (${totalAllocated}) از مبلغ کل رسید (${receiptAmount}) بیشتر است.`,
      );
      return;
    }

    // Generate simple receipt number for review
    const typeKey = type === "receive" ? "receive_receipt" : "pay_receipt";
    const defaultPrefix = type === "receive" ? "RD-" : "PD-";
    const receiptPrefix =
      typeof storeSettings[`prefix_${typeKey}`] !== "undefined"
        ? storeSettings[`prefix_${typeKey}`]
        : defaultPrefix;

    const existingRelated = (transactions || []).filter(
      (t: any) => t.type === type && t.receiptNumber,
    );

    // Calculate sequential number based on settings
    const startNumStr =
      storeSettings[`start_${typeKey}`] ||
      storeSettings.invoiceStartNumber ||
      "1000";
    const lenStr =
      storeSettings[`len_${typeKey}`] ||
      storeSettings.invoiceNumberLength ||
      "6";

    const startNum = parseInt(startNumStr, 10);
    const numLength = Math.max(1, parseInt(lenStr, 10));

    let maxNum = startNum - 1;

    if (existingRelated.length > 0) {
      const nums = existingRelated.map((t: any) => {
        let numStr = String(t.receiptNumber);
        if (numStr.startsWith(receiptPrefix)) {
          numStr = numStr.substring(receiptPrefix.length);
        }
        const match = numStr.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      });
      const maxExisting = Math.max(...nums);
      if (maxExisting > maxNum) maxNum = maxExisting;
    }
    const nextNum = maxNum + 1;
    const formattedNum = String(nextNum).padStart(numLength, "0");
    const receiptNumber = `${receiptPrefix}${formattedNum}`;

    const basePayload: any = {
      type,
      method: receiptMethod,
      personId: receiptPersonId,
      amount: Number(receiptAmount),
      date:
        typeof receiptDate.toDate === "function"
          ? receiptDate.toDate().toISOString()
          : new Date(receiptDate).toISOString(),
description: receiptDescription,
      note: receiptNote,
      receiptNumber: receiptNumber,
    };

    if (receiptMethod === "cash") {
      basePayload.resourceType = receiptResourceType;
      basePayload.resourceId = receiptResourceId;
    } else {
      basePayload.checkNumber = receiptCheckNumber;
      basePayload.checkDueDate =
        typeof receiptCheckDueDate.toDate === "function"
          ? new Date(
              receiptCheckDueDate.toDate().toISOString(),
            ).toLocaleDateString("fa-IR")
          : new Date(receiptCheckDueDate).toLocaleDateString("fa-IR");
      if (type === "receive") {
        basePayload.checkBankName = receiptCheckBankName;
      } else {
        basePayload.checkbookId = receiptCheckbookId;
      }
    }

    setPreviewReceiptData(basePayload);
  };

  const confirmReceiptSubmit = async () => {
    if (!previewReceiptData) return;
    setSubmittingReceipt(true);
    try {
      const txPayload = {
        ...previewReceiptData,
        linkedInvoices: receiptLinkedInvoices,
      };
      let createdReceiptObj: any = { ...previewReceiptData };
      if (previewReceiptData.method === "check") {
        if (previewReceiptData.type === "receive") {
          const savedCheck = await addReceivedCheck({
            checkNumber: previewReceiptData.checkNumber,
            bankName: previewReceiptData.checkBankName,
            branchName: "",
            amount: previewReceiptData.amount,
            payerId: previewReceiptData.personId,
            receiveDate: previewReceiptData.date || previewReceiptData.jalaliDate,
            dueDate: previewReceiptData.checkDueDate,
            status: "received",
            description:
              previewReceiptData.description ||
              `چک دریافتی شماره ${previewReceiptData.checkNumber} (سررسید ${previewReceiptData.checkDueDate}) بابت رسید ${previewReceiptData.receiptNumber}`,
            receiptNumber: previewReceiptData.receiptNumber,
          });
          createdReceiptObj.id = savedCheck.id;
        } else {
          const blankCheck = issuedChecks.find((c: any) => c.status === 'blank' && c.checkbookId?.toString() === previewReceiptData.checkbookId?.toString() && c.checkNumber === previewReceiptData.checkNumber);
          
          let savedCheckId;
          const issuedCheckPayload = {
            checkbookId: previewReceiptData.checkbookId,
            checkNumber: previewReceiptData.checkNumber,
            amount: previewReceiptData.amount,
            payeeId: previewReceiptData.personId,
            issueDate: previewReceiptData.date || previewReceiptData.jalaliDate,
            dueDate: previewReceiptData.checkDueDate,
            status: "issued",
            description:
              previewReceiptData.description ||
              `چک صادره شماره ${previewReceiptData.checkNumber} (سررسید ${previewReceiptData.checkDueDate}) بابت رسید ${previewReceiptData.receiptNumber}`,
            receiptNumber: previewReceiptData.receiptNumber,
          };
          
          if (blankCheck) {
            await updateIssuedCheck(blankCheck.id.toString(), { ...blankCheck, ...issuedCheckPayload, status: "issued" });
            savedCheckId = blankCheck.id;
          } else {
            const savedCheck = await addIssuedCheck(issuedCheckPayload);
            savedCheckId = savedCheck.id;
          }
        }
        const savedTx = await addTransaction(txPayload as any);
        createdReceiptObj = savedTx;
      } else {
        const savedTx = await addTransaction(txPayload as any);
        createdReceiptObj = savedTx;
      }

      // Update actual invoices payment status and paid amount out of linkedInvoices
      for (const [invId, amount] of Object.entries(receiptLinkedInvoices)) {
        const inv = invoices.find((i) => i.id.toString() === invId);
        if (inv && amount > 0) {
          const newPaid = (inv.paidAmount || 0) + amount;
          const newStatus =
            newPaid >= (inv.totalAmount || 0) ? "paid" : "partial";
          await updateInvoice(inv.id, {
            ...inv,
            paidAmount: newPaid,
            paymentStatus: newStatus,
          });
        }
      }

      const typeTmp = previewReceiptData.type;

      setReceiptPersonId("");
      setReceiptAmount("");
      setReceiptResourceType("bank");
      setReceiptResourceId("");
      setReceiptCheckNumber("");
      setReceiptCheckBankName("");
      setReceiptCheckbookId("");
      setReceiptCheckDueDate(new Date());
      setReceiptMethod("cash");
      setReceiptDescription("");
      setReceiptNote("");
      setReceiptDate(new Date());
      setReceiptLinkedInvoices({});
      setPreviewReceiptData(null);
      setReceiptPersonSearchText("");
      
      localStorage.removeItem("receipt_draft");
      setReceiptHasDraft(false);

      await Promise.all([
        fetchTransactions(),
        import("./services/dataService").then(({ getLoans, getInstallments }) =>
          Promise.all([
            getLoans().then(setLoans),
            getInstallments().then(setInstallments),
          ]),
        ),
        fetchInvoices(),
        fetchAccountingDocuments(),
        fetchPersons(),
        fetchAccounts(),
        fetchCashboxes(),
        fetchChecks(),
      ]);

      setLastCreatedReceipt(createdReceiptObj);
      setReceiptSuccessMsg(
        typeTmp === "receive"
          ? "رسید دریافت با موفقیت صادر شد"
          : "رسید پرداخت با موفقیت صادر شد",
      );
      if (storeSettings?.notify_on_receipt) {
        const person = persons.find(
          (p) => p.id === previewReceiptData.personId,
        );
        if (person && person.phone) {
          const amt =
            typeof formatNumber === "function"
              ? formatNumber(previewReceiptData.amount)
              : previewReceiptData.amount;
          const isRec = typeTmp === "receive";
          let msg = `${person.name} گرامی، رسید ${isRec ? "دریافت از" : "پرداخت به"} شما به مبلغ ${amt} ${storeSettings?.currency || "تومان"} با موفقیت ثبت شد.`;
          if (storeSettings?.smsTemplateReceipt) {
            msg = storeSettings.smsTemplateReceipt
              .replace(/{name}/g, person.name)
              .replace(/{amount}/g, String(amt))
              .replace(
                /{receipt_number}/g,
                String(createdReceiptObj?.receiptNumber || ""),
              )
              .replace(/{date}/g, new Date().toLocaleDateString("fa-IR"));
          }
          sendNotification(msg, person.phone, storeSettings?.notify_method);
        }
      }

      await checkDebtThreshold(previewReceiptData.personId);
    } catch (err: any) {
      console.error(err);
      customAlert(err.message || "خطا در ارتباط با سرور.");
    } finally {
      setSubmittingReceipt(false);
    }
  };

  const handleSaveReceipt = async (updatedFields: any) => {
    if (!editingReceipt) return;
    try {
      await updateTransaction(editingReceipt.id, updatedFields);

      // Keep related checks in sync
      if (editingReceipt.method === "check") {
        const checkNum = editingReceipt.checkNumber;
        const receiptNo = editingReceipt.receiptNumber;
        if (editingReceipt.type === "receive") {
          const matchedCheck = receivedChecks.find(
            (c) => c.receiptNumber === receiptNo || c.checkNumber === checkNum,
          );
          if (matchedCheck) {
            await updateReceivedCheck(matchedCheck.id, {
              ...matchedCheck,
              checkNumber:
                updatedFields.checkNumber || matchedCheck.checkNumber,
              bankName: updatedFields.checkBankName || matchedCheck.bankName,
              amount: updatedFields.amount || matchedCheck.amount,
              payerId: updatedFields.personId || matchedCheck.payerId,
              dueDate: updatedFields.checkDueDate || matchedCheck.dueDate,
              receiveDate: updatedFields.jalaliDate || matchedCheck.receiveDate,
            });
          }
        } else {
          const matchedCheck = issuedChecks.find(
            (c) => c.receiptNumber === receiptNo || c.checkNumber === checkNum,
          );
          if (matchedCheck) {
            await updateIssuedCheck(matchedCheck.id, {
              ...matchedCheck,
              checkNumber:
                updatedFields.checkNumber || matchedCheck.checkNumber,
              checkbookId:
                updatedFields.checkbookId || matchedCheck.checkbookId,
              amount: updatedFields.amount || matchedCheck.amount,
              payeeId: updatedFields.personId || matchedCheck.payeeId,
              dueDate: updatedFields.checkDueDate || matchedCheck.dueDate,
              issueDate: updatedFields.jalaliDate || matchedCheck.issueDate,
            });
          }
        }
      }

      await Promise.all([
        fetchDataSilent(),
        fetchAccountingDocuments(),
        fetchPersons(),
        fetchAccounts(),
        fetchCashboxes(),
        fetchChecks(),
      ]);
      showNotification(
        "تغییرات با موفقیت روی رسید ذخیره گردید و اسناد مربوطه بروز شدند.",
        "success",
      );
      await checkDebtThreshold(editingReceipt.personId);
    } catch (err) {
      console.error(err);
      customAlert("خطا در بروزرسانی سند رسید.");
    }
  };

  const handleSubmitSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salaryPersonId || !salaryBaseAmount) {
      customAlert("لطفا کارمند و مبلغ حقوق پایه را تعیین کنید");
      return;
    }

    if (
      !window.confirm(
        "آیا از ثبت و صدور این فیش حقوقی اطمینان دارید؟ در صورت تایید، سند و گردش مالی به ثبت می‌رسد.",
      )
    )
      return;

    const base = Number(salaryBaseAmount) || 0;
    const housing = Number(salaryHousingAllowance) || 0;
    const grocery = Number(salaryGroceryAllowance) || 0;
    const otherAllow = Number(salaryOtherAllowances) || 0;
    const insDeduct = Number(salaryInsuranceDeduction) || 0;
    const taxDeduct = Number(salaryTaxDeduction) || 0;
    const penaltyDeduct = Number(salaryOtherDeductions) || 0;

    const netSalary =
      base +
      housing +
      grocery +
      otherAllow -
      (insDeduct + taxDeduct + penaltyDeduct);

    if (netSalary <= 0) {
      customAlert("مبلغ خالص حقوق باید بزرگتر از صفر باشد");
      return;
    }

    setSubmittingSalary(true);
    try {
      const p = persons.find(
        (item) => item.id.toString() === salaryPersonId.toString(),
      );
      const personName = p ? getPersonDisplayName(p) : "کارمند";

      // Build payslip breakdown to store in description as JSON string
      const pMonthName = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
      const mName = pMonthName[parseInt(salaryPeriodMonth, 10) - 1];
      const normalDescription = `سند حقوق ${mName} ماه ${salaryPeriodYear}`;
      const payslipObj: any = {
        isPayslip: true,
        employeeName: personName,
        personId: salaryPersonId,
        periodMonth: salaryPeriodMonth,
        periodYear: salaryPeriodYear,
        base,
        allowances: {
          housing,
          grocery,
          other: otherAllow,
        },
        deductions: {
          insurance: insDeduct,
          tax: taxDeduct,
          penalty: penaltyDeduct,
        },
        netSalary,
        userNote: salaryDescription || "سند حقوق و دستمزد کارمند",
      };
      const payloadDescription = normalDescription;

      // Auto-assign receipt number for salary
      const salaryPrefix =
        storeSettings.prefix_salary !== undefined
          ? storeSettings.prefix_salary
          : "PAY-";

      const startNumStr =
        storeSettings.start_salary ||
        storeSettings.invoiceStartNumber ||
        "1000";
      const lenStr =
        storeSettings.len_salary || storeSettings.invoiceNumberLength || "6";

      const startNum = parseInt(startNumStr, 10);
      const numLength = Math.max(1, parseInt(lenStr, 10));

      let maxNum = startNum - 1;

      const existingRelated = (transactions || []).filter(
        (t: any) => t.type === "salary" && t.receiptNumber,
      );
      if (existingRelated.length > 0) {
        const nums = existingRelated.map((t: any) => {
          let numStr = String(t.receiptNumber);
          if (numStr.startsWith(salaryPrefix)) {
            numStr = numStr.substring(salaryPrefix.length);
          }
          const match = numStr.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        });
        const maxExisting = Math.max(...nums);
        if (maxExisting > maxNum) maxNum = maxExisting;
      }

      const nextNum = maxNum + 1;
      const receiptNumber = `${salaryPrefix}${String(nextNum).padStart(numLength, "0")}`;

      const payload = {
        type: "salary",
        receiptNumber,
        personId: salaryPersonId,
        amount: netSalary,
        date:
          typeof salaryDate.toDate === "function"
            ? salaryDate.toDate().toISOString()
            : new Date(salaryDate).toISOString(),
                  
        resourceType: "none",
        resourceId: 0,
        description: payloadDescription,
      };
      const savedTx = await addTransaction(payload as any);
      payslipObj.transactionId = savedTx.id;
      payslipObj.receiptNumber = receiptNumber;
      payslipObj.date = payload.date;
      const savedPayslip = await addPayslip(payslipObj);
      setPayslips([...payslips, savedPayslip]);

      setSalarySuccessMsg("سند حقوق و دستمزد با موفقیت صادر شد.");
      setSalaryBaseAmount("");
      setSalaryHousingAllowance("");
      setSalaryGroceryAllowance("");
      setSalaryOtherAllowances("");
      setSalaryInsuranceDeduction("");
      setSalaryTaxDeduction("");
      setSalaryOtherDeductions("");
      setSalaryDescription("");
      setSalaryPeriodMonth("1");
      setSalaryPeriodYear("1403");
      setSalaryResourceId("");

      await Promise.all([
        fetchDataSilent(),
        fetchAccounts(),
        fetchCashboxes(),
      ]);
    } catch (error: any) {
      console.error("Error submitting salary", error);
      customAlert(error.message || "خطای سیستمی رخ داد");
    } finally {
      setSubmittingSalary(false);
    }
  };
  const handleDeleteTransaction = async (id: number | string) => {
    const tx = transactions.find((t) => t.id.toString() === id.toString());
    
    let typeLabel = "سند";
    if (tx?.type === "receive") typeLabel = "دریافت";
    else if (tx?.type === "pay") typeLabel = "پرداخت";
    else if (tx?.type === "salary") typeLabel = "حقوق و دستمزد";
    else if (tx?.type === "cost") typeLabel = "هزینه";

    const personName = persons.find(p => p.id === tx?.personId)?.name;
    const accountName = accounts.find(a => a.id === tx?.accountId)?.title || accounts.find(a => a.id === tx?.accountId)?.bankName;
    const boxName = cashboxes.find(b => b.id === tx?.cashboxId)?.name;
    
    const details = tx ? (
      <div className="flex flex-col gap-2">
        <div><strong>نوع سند:</strong> {typeLabel}</div>
        {personName && <div><strong>شخص:</strong> {personName}</div>}
        {accountName && <div><strong>حساب بانکی:</strong> {accountName}</div>}
        {boxName && <div><strong>صندوق:</strong> {boxName}</div>}
        {tx.amount !== undefined && <div><strong>مبلغ:</strong> {Number(tx.amount).toLocaleString()} ریال</div>}
        <div><strong>تاریخ:</strong> {tx.date}</div>
        {tx.description && <div><strong>توضیحات:</strong> {tx.description}</div>}
      </div>
    ) : undefined;

    confirmAction(
      "آیا از حذف این سند اطمینان دارید؟ مانده حساب مربوطه اصلاح خواهد شد.",
      async () => {
        try {
          if (tx && tx.method === "check" && tx.checkNumber) {
            if (tx.type === "receive") {
              const rc = receivedChecks.find(
                (c) =>
                  c.checkNumber === tx.checkNumber && c.payerId === tx.personId,
              );
              if (rc) await deleteReceivedCheck(rc.id.toString());
            } else {
              const ic = issuedChecks.find(
                (c) =>
                  c.checkNumber === tx.checkNumber && c.payeeId === tx.personId,
              );
              if (ic) await deleteIssuedCheck(ic.id.toString());
            }
          }
          await deleteTransaction(id.toString());
          await Promise.all([
            fetchTransactions(),
            fetchAccounts(),
            fetchCashboxes(),
            fetchChecks(),
          ]);
        } catch (error) {
          console.error("Error deleting transaction", error);
        }
      },
      details
    );
  };
  const handleSubmitCashbox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCashboxName) return;
    setSubmittingCashbox(true);
    try {
      const isEdit = editingCashboxId !== null;
      const payload = {
        name: newCashboxName,
        manager: newCashboxManager,
        description: newCashboxManager, // For firebase checking description
        initialBalance: Number(newCashboxBalance) || 0,
        balance: Number(newCashboxBalance) || 0,
      };

      if (isEdit) {
        await updateCashbox(editingCashboxId.toString(), payload as any);
      } else {
        await addCashbox(payload as any);
      }

      await fetchCashboxes();
      setNewCashboxName("");
      setNewCashboxManager("");
      setNewCashboxBalance("");
      setEditingCashboxId(null);
      setIsCashboxModalOpen(false);
      setSuccessMsg(
        isEdit ? "صندوق با موفقیت ویرایش شد" : "صندوق با موفقیت ثبت شد",
      );
    } catch (error) {
      console.error("Error saving cashbox", error);
    } finally {
      setSubmittingCashbox(false);
    }
  };

  const handleDeleteCashbox = async (id: number | string) => {
    if (!confirm("آیا از حذف این صندوق اطمینان دارید؟")) return;
    try {
      await deleteCashbox(id.toString());
      await fetchCashboxes();
    } catch (error) {
      console.error("Error deleting cashbox", error);
    }
  };

  const handleSubmitWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarehouseName) return;
    setSubmittingWarehouse(true);
    try {
      const isEdit = editingWarehouseId !== null;
      const payload = {
        name: newWarehouseName,
        manager: newWarehouseManager,
        location: newWarehouseLocation,
        isActive: newWarehouseIsActive,
      };

      if (isEdit) {
        await updateWarehouse(editingWarehouseId.toString(), payload as any);
      } else {
        await addWarehouse(payload as any);
      }

      await fetchWarehouses();
      setNewWarehouseName("");
      setNewWarehouseManager("");
      setNewWarehouseLocation("");
      setNewWarehouseIsActive(true);
      setEditingWarehouseId(null);
      setIsWarehouseModalOpen(false);
      setSuccessMsg(
        isEdit ? "انبار با موفقیت ویرایش شد" : "انبار با موفقیت ثبت شد",
      );
    } catch (error) {
      console.error("Error saving warehouse", error);
      setSuccessMsg("خطا در ثبت انبار");
    } finally {
      setSubmittingWarehouse(false);
    }
  };

  const handleDeleteWarehouse = async (id: number | string) => {
    if (!confirm("آیا از حذف این انبار اطمینان دارید؟")) return;
    try {
      await deleteWarehouse(id.toString());
      await fetchWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse", error);
    }
  };

  const handleRecalculateStocks = async () => {
    try {
      setRecalculating(true);
      await recalculateAllWarehouseStocks();
      const stocks = await getWarehouseStocks();
      setWarehouseStocks(stocks as any);

      const fetchedProds = await getProducts();
      setProducts(fetchedProds as any);

      showNotification(
        "موجودی انبارها و کارت‌های کالا با موفقیت بر اساس اسناد فاکتورها، ورود و خروج‌ها محاسبه مجدد شد.",
        "success",
      );
    } catch (e) {
      console.error(e);
      showNotification("خطا در محاسبه مجدد موجودی انبار.", "error");
    } finally {
      setRecalculating(false);
    }
  };

  const handleEditWarehouse = (w: Warehouse) => {
    setEditingWarehouseId(w.id);
    setNewWarehouseName(w.name);
    setNewWarehouseManager(w.manager || "");
    setNewWarehouseLocation(w.location || "");
    setNewWarehouseIsActive(w.isActive !== undefined ? w.isActive : true);
    setIsWarehouseModalOpen(true);
  };


  const handleSaveHistoryDate = async (h: any) => {
    try {
      const updatedData = { ...h, date: new Date(editingHistoryDate).toISOString() };
      await updateProductPriceHistory(h.id.toString(), updatedData);
      setEditingHistoryId(null);
      if (editingProductId) {
        const history = await getProductPriceHistory(editingProductId.toString());
        setCurrentProductPriceHistory(history);
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ذخیره تغییرات");
    }
  };

  const handleEditProduct = async (p: Product | any) => {
    setEditingProductId(p.id);
    const history = await getProductPriceHistory(p.id);
    setCurrentProductPriceHistory(history);
    setNewProductName(p.name);
    setNewProductPrice(p.price.toString());
    setNewProductPurchasePrice(p.purchasePrice?.toString() || "");
    setNewProductPriceDate(new Date().toISOString().split("T")[0]);
    setNewProductType(p.type);
    setNewProductCategoryId(p.categoryId || "");
    setNewProductCode(p.code || "");
    setNewProductBarcode(p.barcode || "");
    setNewProductWarehouseId(p.warehouseId?.toString() || "");
    setNewProductStock(p.stock?.toString() || "");
    setNewProductMinStock(p.minStock?.toString() || "");
    setNewProductUnit(p.unit || "");
    setNewProductSecondaryUnit(p.secondaryUnit || "");
    setNewProductUnitRatio(p.unitRatio?.toString() || "");
    setNewProductDesc(p.description || "");
    setProductFormTab("general");
    setIsProductModalOpen(true);
  };

  const handleDuplicateProduct = (p: Product | any) => {
    setEditingProductId(null);
    setNewProductName(p.name + " (کپی)");
    setNewProductPrice(p.price.toString());
    setNewProductPurchasePrice(p.purchasePrice?.toString() || "");
    setNewProductPriceDate(new Date().toISOString().split("T")[0]);
    setNewProductType(p.type);
    setNewProductCategoryId(p.categoryId || "");
    setNewProductCode("");
    setNewProductBarcode("");
    setNewProductWarehouseId(p.warehouseId?.toString() || "");
    setNewProductStock(p.stock?.toString() || "");
    setNewProductMinStock(p.minStock?.toString() || "");
    setNewProductUnit(p.unit || "");
    setNewProductSecondaryUnit(p.secondaryUnit || "");
    setNewProductUnitRatio(p.unitRatio?.toString() || "");
    setNewProductDesc(p.description || "");
    setProductFormTab("general");
    setIsProductModalOpen(true);
  };

  const handleAIProductsAdd = async (
    selectedProducts: any[],
    categoryId: string,
  ) => {
    try {
      let isSuccess = false;
      for (const prod of selectedProducts) {
        const newProduct = {
          name: prod.name,
          description: prod.description || "",
          price: prod.price || 0,
          type: "product",
          categoryId: categoryId || "",
          code: "",
          barcode: "",
          purchasePrice: 0,
          stock: 0,
          minStock: 0,
          unit: "عدد",
          secondaryUnit: "",
          unitRatio: 1,
        };
        await addProduct(newProduct as any);
        isSuccess = true;
      }
      if (isSuccess) {
        await fetchDataSilent();
        setSuccessMsg("کالاهای انتخاب شده با موفقیت افزوده شدند.");
      }
    } catch (e: any) {
      alert("خطا در ثبت کالاها: " + e.message);
    }
  };

  const handleSavePersonRole = async () => {
    if (!newPersonRoleName.trim() || !newPersonRoleCode.trim()) {
      alert("تمامی فیلدها الزامی است");
      return;
    }
    try {
      if (editingPersonRoleId) {
        await updatePersonRole(editingPersonRoleId, {
          name: newPersonRoleName,
          code: newPersonRoleCode,
        });
      } else {
        await addPersonRole({
          name: newPersonRoleName,
          code: newPersonRoleCode,
        });
      }
      await fetchPersonRoles();
      setNewPersonRoleName("");
      setNewPersonRoleCode("");
      setEditingPersonRoleId(null);
    } catch (e) {
      console.error("Error saving role", e);
    }
  };

  const handleDeletePersonRole = async (id: string) => {
    if (["customer", "supplier", "employee"].includes(id)) {
      alert("نقش‌های سیستمی پیش‌فرض قابل حذف نیستند.");
      return;
    }
    confirmAction("آیا از حذف این نقش اطمینان دارید؟", async () => {
      try {
        await deletePersonRole(id);
        await fetchPersonRoles();
      } catch (e) {
        console.error("Error deleting role", e);
      }
    });
  };

  const handleSavePersonGroup = async () => {
    if (!newPersonGroupName.trim()) {
      alert("نام گروه الزامی است");
      return;
    }
    try {
      if (editingPersonGroupId) {
        await updatePersonGroup(editingPersonGroupId, {
          name: newPersonGroupName,
          color: newPersonGroupColor,
        });
      } else {
        await addPersonGroup({
          name: newPersonGroupName,
          color: newPersonGroupColor,
        });
      }
      await fetchPersonGroups();
      setNewPersonGroupName("");
      setNewPersonGroupColor("indigo");
      setEditingPersonGroupId(null);
    } catch (e) {
      console.error("Error saving group", e);
    }
  };

  const handleDeletePersonGroup = async (id: string) => {
    confirmAction(
      "آیا از حذف این گروه اطمینان دارید؟ تمامی اشخاص این گروه فاقد گروه خواهند شد.",
      async () => {
        try {
          await deletePersonGroup(id);

          // Remove group from all persons in this group
          const affectedPersons = (persons || []).filter((p) => p.group === id);
          for (const p of affectedPersons) {
            await updatePerson(p.id as string, { ...p, group: "" });
          }

          await fetchPersonGroups();
          await fetchDataSilent();
        } catch (e) {
          console.error("Error deleting group", e);
        }
      },
    );
  };

  const handleEditPerson = (p: Person) => {
    setEditingPersonId(p.id);
    setNewPersonType(p.personType);
    setNewPersonGender((p.gender as any) || "none");
    setNewPersonTitle(p.title || "");
    setNewPersonAlias(p.alias || "");
    setNewPersonFirstName(p.firstName || "");
    setNewPersonLastName(p.lastName || "");
    setNewPersonCompanyName(p.companyName || "");
    setNewPersonFatherName(p.fatherName || "");
    setNewPersonNationalId(p.nationalId || "");
    setNewPersonAccountingCode(p.accountingCode || "");
    setNewPersonAddress(p.address || "");
    setNewPersonImage(p.imageUrl || "");
    setNewPersonPhone(p.phone || "");
    setNewPersonGroup(p.group || "");
    setNewPersonRole(p.role);
    setNewPersonProvince(p.province || "");
    setNewPersonCity(p.city || "");
    setNewPersonIsActive(p.isActive !== undefined ? p.isActive : true);
    setNewPersonRegistrationDate(
      p.registrationDate ? new Date(p.registrationDate) : new Date(),
    );
    setNewPersonInitialBalance(p.initialBalance?.toString() || "");
    setNewPersonInitialBalanceType(p.initialBalanceType || "settled");
    setNewPersonCreditLimit(p.creditLimit?.toString() || "");
    setPersonModalActiveTab("basic");
    setIsPersonModalOpen(true);
  };

  const handleEditAccount = (acc: Account) => {
    setEditingAccountId(acc.id);
    setNewAccountBankName(acc.bankName);
    setNewAccountBranchName(acc.branchName || "");
    setNewAccountNumber(acc.accountNumber || "");
    setNewAccountCardNumber(acc.cardNumber || "");
    setNewAccountShebaNumber(acc.shebaNumber || "");
    setNewAccountBalance(acc.balance.toString());
    setNewAccountHolder(acc.accountHolder || "");
    setIsAccountModalOpen(true);
  };

  const handleEditCashbox = (box: Cashbox) => {
    setEditingCashboxId(box.id);
    setNewCashboxName(box.name);
    setNewCashboxManager(box.manager || "");
    setNewCashboxBalance(box.balance.toString());
    setIsCashboxModalOpen(true);
  };

  const fetchSettings = async () => {
    try {
      const data = await getStoreSettings();
      const docCounters = await getLocalData<Record<string, number>>('doc_counters', {});
      if (data && (data as any).isSetup) {
        const savedData = data as any;
        const mergedSettings = {
          ...savedData,
          doc_counters: docCounters,
          theme: savedData.theme ?? "classic",
          prefix_warehouse_receipt:
            savedData.prefix_warehouse_receipt ?? "REC-",
          prefix_warehouse_remittance:
            savedData.prefix_warehouse_remittance ?? "REM-",
          prefix_purchase: savedData.prefix_purchase ?? "PUR-",
          prefix_sale: savedData.prefix_sale ?? "INV-",
          prefix_receive_receipt: savedData.prefix_receive_receipt ?? "RD-",
          prefix_pay_receipt: savedData.prefix_pay_receipt ?? "PD-",
        };
        setStoreSettings(mergedSettings);
        setSettingsForm(mergedSettings);
        setInvoiceCurrency(mergedSettings.currency || "تومان");
        setExchangeRate(1);
        setExchangeRateInput("1");
        setRequiresInitSetup(false);
        // Apply store-wide visual settings if set in Settings menu
        if (mergedSettings.menuLayout) setMenuLayout(mergedSettings.menuLayout);
        if (mergedSettings.isFullWidth !== undefined) setIsFullWidth(mergedSettings.isFullWidth);
      } else {
        setRequiresInitSetup(true);
      }
    } catch (error) {
      console.error("Error fetching settings", error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSettings(true);
    try {
      const payload = { ...settingsForm, isSetup: true };
      const counters = payload.doc_counters || {};
      delete payload.doc_counters;
      await saveStoreSettings(payload as any);
      await saveLocalData('doc_counters', counters);
      await fetchSettings();
      setSuccessMsg("تنظیمات فروشگاه با موفقیت ذخیره شد");
      setRequiresInitSetup(false);
    } catch (error) {
      console.error("Error saving settings", error);
    } finally {
      setSubmittingSettings(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        customAlert("حجم تصویر نباید بیشتر از 2 مگابایت باشد.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm({ ...settingsForm, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCurrencyChange = (newCurrency: string) => {
    const oldRate = exchangeRate;
    const newRate = getDefaultExchangeRate(newCurrency, storeSettings.currency);
    setInvoiceCurrency(newCurrency);
    setExchangeRate(newRate);
    setExchangeRateInput(newRate.toString());

    if (oldRate > 0 && newRate > 0) {
      setItems((prevItems) =>
        prevItems.map((item) => {
          const updatedPrice = item.unitPrice * (oldRate / newRate);
          const subtotal = item.quantity * updatedPrice;
          const total = subtotal * (1 - item.discountPercent / 100);
          return {
            ...item,
            unitPrice: Number(updatedPrice.toFixed(4)),
            totalPrice: Number(total.toFixed(4)),
          };
        }),
      );
    }
  };

  const handleSourceInvoiceChange = (invoiceId: string | number) => {
    setSourceInvoiceId(invoiceId);
    if (!invoiceId) {
      setInvoiceDescription("");
    setInvoiceNote("");
      return;
    }

    const sourceInv = invoices.find(
      (i) => i.id.toString() === invoiceId.toString(),
    );
    if (sourceInv) {
      if (activeTab === "create_warehouse_doc") {
        const dbDraftsStr = localStorage.getItem("drafts");
        let drafts = dbDraftsStr ? JSON.parse(dbDraftsStr) : {};
        delete drafts[invoiceId];
        localStorage.setItem("drafts", JSON.stringify(drafts));
      }

      if (sourceInv.customerId) setCustomerId(sourceInv.customerId);
      if (sourceInv.currency) {
        setInvoiceCurrency(sourceInv.currency);
        setExchangeRate(sourceInv.exchangeRate || 1);
        setExchangeRateInput(String(sourceInv.exchangeRate || 1));
      }
      if (sourceInv.items && Array.isArray(sourceInv.items)) {
        const isRemittance =
          activeTab === "create_warehouse_doc" &&
          invoiceType === "warehouse_remittance";

        // Calculate previously received/remitted amounts
        const pastDocs = (invoices || []).filter(
          (i) =>
            i.sourceInvoiceId?.toString() === invoiceId.toString() &&
            (isRemittance
              ? i.type === "warehouse_remittance"
              : i.type === "warehouse_receipt"),
        );
        const processedAmounts: Record<string, number> = {};
        pastDocs.forEach((doc) => {
          if (doc.items) {
            doc.items.forEach((rt: any) => {
              const key = String(rt.productId || rt.productName || "");
              if (!key) return;
              if (!processedAmounts[key]) processedAmounts[key] = 0;
              processedAmounts[key] += Number(rt.quantity) || 0;
            });
          }
        });

        const remainingItems = sourceInv.items
          .map((it: any) => {
            const key = String(it.productId || it.productName || "");
            const processed = key ? processedAmounts[key] || 0 : 0;
            const remaining = (Number(it.quantity) || 0) - processed;
            return {
              ...it,
              id: generateId(),
              maxQuantity: remaining > 0 ? remaining : 0, // Save max
              quantity: remaining > 0 ? remaining : 0,
              warehouseId: "", // User will select destination warehouse
            };
          })
          .filter((it: any) => it.quantity > 0);

        setItems(remainingItems);
      }
    }
  };

  const handleExchangeRateChange = (newRate: number) => {
    const oldRate = exchangeRate;
    setExchangeRate(newRate);

    if (oldRate > 0 && newRate > 0) {
      setItems((prevItems) =>
        prevItems.map((item) => {
          const updatedPrice = item.unitPrice * (oldRate / newRate);
          const subtotal = item.quantity * updatedPrice;
          const total = subtotal * (1 - item.discountPercent / 100);
          return {
            ...item,
            unitPrice: Number(updatedPrice.toFixed(4)),
            totalPrice: Number(total.toFixed(4)),
          };
        }),
      );
    }
  };

  useEffect(() => {
    if (storeSettings?.storeName) {
      document.title = storeSettings.storeName;
    }
  }, [storeSettings?.storeName]);

  useEffect(() => {
    const font =
      activeTab === "settings" && settingsForm?.fontFamily
        ? settingsForm.fontFamily
        : storeSettings?.fontFamily || "IRANYekanXFaNum";
    document.documentElement.style.setProperty(
      "--font-sans",
      `"${font}", "Vazirmatn", ui-sans-serif, system-ui, sans-serif`,
    );
    document.body.style.fontFamily = `"${font}", "Vazirmatn", sans-serif`;
  }, [settingsForm?.fontFamily, activeTab, storeSettings?.fontFamily]);

  const fetchChecks = async () => {
    try {
      const cb = await getCheckbooks();
      setCheckbooks(cb as any);
      const ic = await getIssuedChecks();
      setIssuedChecks(ic as any);
      const rc = await getReceivedChecks();
      setReceivedChecks(rc as any);
    } catch (err) {
      console.error("fetchChecks error", err);
    }
  };

  const fetchSmsMessages = async () => {
    try {
      const msgs = await getSmsMessages();
      setSmsMessages(msgs || []);
    } catch (err) {
      console.error("fetchSmsMessages error", err);
    }
  };

  const fetchDataSilent = async () => {
    try {
      await Promise.all([
        fetchPersonRoles(),
        fetchPersonGroups(),
        fetchPersons(),
        fetchPersonOpeningBalances(),
        fetchProducts(),
        fetchAccounts(),
        fetchCashboxes(),
        fetchWarehouses(),
        fetchSettings(),
        fetchTransactions(),
        fetchAccountingDocuments(),
        fetchChecks(),
        fetchSmsMessages(),
        fetchFinancialYearInfo(),
      ]);
      await fetchInvoices();
    } catch (error) {
      console.error("Error silently fetching data:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPersonRoles(),
        fetchPersonGroups(),
        fetchPersons(),
        fetchPersonOpeningBalances(),
        fetchProducts(),
        fetchAccounts(),
        fetchCashboxes(),
        fetchWarehouses(),
        fetchSettings(),
        fetchTransactions(),
        fetchAccountingDocuments(),
        fetchChecks(),
        fetchSmsMessages(),
        fetchFinancialYearInfo(),
      ]);
      await fetchDataSilent();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAddItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: generateId(),
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        discountPercent: 0,
        totalPrice: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((items || []).filter((item) => item.id !== id));
  };

  const getLastPriceForProduct = (
    productId: string | number,
    isPurchase: boolean,
  ) => {
    let lastPrice = 0;
    let latestDate = 0;
    const targetTypes = isPurchase
      ? ["purchase", "warehouse_receipt"]
      : ["sale", "warehouse_remittance"];

    invoices.forEach((inv) => {
      if (targetTypes.includes(inv.type) && inv.items) {
        inv.items.forEach((item: any) => {
          if (item.productId?.toString() === productId.toString()) {
            const invDate = new Date(inv.date || inv.createdAt || 0).getTime();
            if (invDate > latestDate && (item.unitPrice || 0) > 0) {
              latestDate = invDate;
              // Normalize unit prices assuming the standard is the same unless exchange rate applies
              const rate = inv.exchangeRate || 1;
              lastPrice = (Number(item.unitPrice) || 0) * rate;
            }
          }
        });
      }
    });
    return lastPrice;
  };

  const handleFastAddProduct = (
    productIdStr: string,
    forceProductObj?: any,
  ) => {
    if (!productIdStr) return;
    const product =
      forceProductObj || products.find((p) => p.id.toString() === productIdStr);
    if (!product) return;

    if (activeTab === "create_warehouse_doc" && product.type === "service") {
      customAlert("کالای خدماتی فاقد عملیات انبارداری و مدیریت تعداد است.");
      return;
    }

    const isPurchase =
      activeTab === "create_purchase" ||
      (activeTab === "create_warehouse_doc" &&
        invoiceType === "warehouse_receipt");
    let pPrice =
      isPurchase && product.purchasePrice
        ? product.purchasePrice
        : product.price;
    if (!pPrice || pPrice === 0) {
      pPrice = getLastPriceForProduct(product.id, isPurchase);
    }
    const convertedPrice = exchangeRate > 0 ? pPrice / exchangeRate : pPrice;
    const unitPriceRounded = Number(convertedPrice.toFixed(4));

    setItems((currentItems) => {
      // Check if it exists
      const existingItemIndex = currentItems.findIndex(
        (i) => i.productId?.toString() === productIdStr,
      );
      if (existingItemIndex > -1 && !storeSettings.allowDuplicateInvoiceRows) {
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity =
          Number(newItems[existingItemIndex].quantity || 0) + 1;
        newItems[existingItemIndex].totalPrice = Math.max(
          0,
          newItems[existingItemIndex].quantity *
            newItems[existingItemIndex].unitPrice *
            (1 - newItems[existingItemIndex].discountPercent / 100),
        );
        return newItems;
      } else {
        return [
          ...currentItems,
          {
            id: generateId(),
            productId: productIdStr,
            productName: product.name,
            quantity: 1,
            unitPrice: unitPriceRounded,
            discountPercent: 0,
            totalPrice: unitPriceRounded,
            selectedUnit: product.unit || "",
            unitRatio: product.unitRatio || 1,
            isSecondaryUnit: false,
          },
        ];
      }
    });
  };

  const handleFastBarcodeScan = (code: string) => {
    const product = products.find((p) => p.barcode === code || p.code === code);
    if (product) {
      handleFastAddProduct(String(product.id), product);
      showNotification(`کالا "${product.name}" اضافه شد`, "success");
    } else {
      showNotification("کالایی با این بارکد/کد یافت نشد", "error");
    }
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: any,
  ) => {
    setItems(
      (items || []).map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Special handling for product selection to auto-fill details
          if (field === "productId" && value !== "") {
            const product = products.find(
              (p) => p.id.toString() === String(value),
            );
            if (product) {
              if (
                activeTab === "create_warehouse_doc" &&
                product.type === "service"
              ) {
                customAlert(
                  "کالای خدماتی فاقد عملیات انبارداری و مدیریت تعداد است.",
                );
                return item;
              }
              updatedItem.productName = product.name;
              updatedItem.selectedUnit = product.unit || "";
              updatedItem.unitRatio = product.unitRatio || 1;
              updatedItem.isSecondaryUnit = false;

              const isPurchase =
                activeTab === "create_purchase" ||
                (activeTab === "create_warehouse_doc" &&
                  invoiceType === "warehouse_receipt");
              let pPrice =
                isPurchase && product.purchasePrice
                  ? product.purchasePrice
                  : product.price;
              if (!pPrice || pPrice === 0) {
                pPrice = getLastPriceForProduct(product.id, isPurchase);
              }
              const convertedPrice =
                exchangeRate > 0 ? pPrice / exchangeRate : pPrice;

              updatedItem.unitPrice = Number(convertedPrice.toFixed(4));
              const subtotal = convertedPrice * updatedItem.quantity;
              updatedItem.totalPrice = Math.max(
                0,
                subtotal * (1 - updatedItem.discountPercent / 100),
              );
            }
          }

          // Special handling for pricing calculation
          if (
            field === "quantity" ||
            field === "unitPrice" ||
            field === "discountPercent" ||
            field === "isSecondaryUnit"
          ) {
            const isSec =
              field === "isSecondaryUnit"
                ? Boolean(value)
                : Boolean(updatedItem.isSecondaryUnit);

            // If we toggled the unit type, adjust the unit price relative to base price
            if (field === "isSecondaryUnit" && updatedItem.productId) {
              const product = products.find(
                (p) => p.id.toString() === String(updatedItem.productId),
              );
              if (product) {
                const ratio = product.unitRatio || 1;
                const prevSec = Boolean(item.isSecondaryUnit);
                if (prevSec === false && isSec === true) {
                  updatedItem.unitPrice = Number(
                    (Number(item.unitPrice) * ratio).toFixed(4),
                  );
                } else if (prevSec === true && isSec === false) {
                  updatedItem.unitPrice = Number(
                    (Number(item.unitPrice) / ratio).toFixed(4),
                  );
                }
                updatedItem.selectedUnit = isSec
                  ? product.secondaryUnit || ""
                  : product.unit || "";
              }
            }

            let qty =
              field === "quantity"
                ? Number(value)
                : Number(updatedItem.quantity);
            const isWarehouseTab = activeTab === "create_warehouse_doc";
            if (isWarehouseTab && sourceInvoiceId) {
              const sourceInv = invoices.find(
                (i) => i.id.toString() === sourceInvoiceId.toString(),
              );
              if (sourceInv) {
                const pastDocs = (invoices || []).filter(
                  (i) =>
                    i.sourceInvoiceId?.toString() ===
                      sourceInvoiceId.toString() &&
                    (invoiceType === "warehouse_remittance"
                      ? i.type === "warehouse_remittance"
                      : i.type === "warehouse_receipt"),
                );
                const processedAmounts: Record<string, number> = {};
                pastDocs.forEach((doc) => {
                  if (doc.items) {
                    doc.items.forEach((rt: any) => {
                      const key = String(rt.productId || rt.productName || "");
                      if (!key) return;
                      if (!processedAmounts[key]) processedAmounts[key] = 0;
                      processedAmounts[key] += Number(rt.quantity) || 0;
                    });
                  }
                });
                const key = String(
                  updatedItem.productId || updatedItem.productName || "",
                );
                const srcItem = sourceInv.items.find(
                  (si: any) => (si.productId || si.productName) === key,
                );
                if (srcItem) {
                  const processed = processedAmounts[key] || 0;
                  let maxQty = (Number(srcItem.quantity) || 0) - processed;
                  if (typeof updatedItem.maxQuantity !== "undefined") {
                    if (qty > updatedItem.maxQuantity)
                      qty = updatedItem.maxQuantity;
                  } else {
                    if (qty > maxQty) qty = maxQty;
                    updatedItem.maxQuantity = maxQty;
                  }
                }
              }
            } else if (
              isWarehouseTab &&
              typeof updatedItem.maxQuantity !== "undefined"
            ) {
              if (qty > updatedItem.maxQuantity) qty = updatedItem.maxQuantity;
            }
            updatedItem.quantity = qty;
            const price =
              field === "unitPrice"
                ? Number(value)
                : Number(updatedItem.unitPrice);
            const discPercent =
              field === "discountPercent"
                ? Number(value)
                : Number(updatedItem.discountPercent);

            const subtotal = qty * price;
            const total = subtotal * (1 - discPercent / 100);
            updatedItem.totalPrice = total > 0 ? total : 0;
          }

          return updatedItem;
        }
        return item;
      }),
    );
  };

  const getPersonDisplayName = (person: any) => {
    if (!person) return "نامشخص";
    if (person.alias) return person.alias;
    if (person.name) return person.name;
    if (person.firstName || person.lastName) return `${person.firstName || ''} ${person.lastName || ''}`.trim();
    if (person.companyName) return person.companyName;
    return "نامشخص";
  };

  const getPersonDisplayNameById = (personId: string | number | undefined) => {
    if (!personId) return "نامشخص";
    const person = persons.find((p) => p.id.toString() === personId.toString());
    return getPersonDisplayName(person);
  };

  // helper to render clickable person link
  const renderPersonLink = (
    personId: string | number | undefined,
    fallbackName: string | undefined = undefined,
  ) => {
    let name = "نامشخص";
    if (personId) {
      name = getPersonDisplayNameById(personId);
    }
    if (name === "نامشخص" && fallbackName) {
      name = fallbackName;
    }

    if (!personId || name === "نامشخص") return <span>{name}</span>;
    return (
      <span
        className="cursor-pointer text-indigo-600 hover:text-indigo-800 transition-colors font-bold border-b border-dashed border-indigo-300 hover:border-indigo-600 pb-[1px]"
        onClick={(e) => {
          e.stopPropagation();
          setLedgerPersonId(personId);
          setActiveTab("person_ledger");
          setDrawerPersonId("");
          setViewingInvoice(null);
          setPreviewInvoiceData(null);
          setPreviewReceiptData(null);
          setViewingPayslip(null);
        }}
        title="مشاهده کارت حساب"
      >
        {name}
      </span>
    );
  };

  const handleDeleteInvoice = async (id: string | number) => {
    const invoice = invoices.find((inv) => inv.id.toString() === id.toString());
    if (!invoice) return;

    const hasLinkedWarehouseOp = invoices.some(
      (inv) =>
        (inv.type === "warehouse_receipt" ||
          inv.type === "warehouse_remittance") &&
        inv.sourceInvoiceId?.toString() === id.toString() &&
        !inv.isAutoGenerated,
    );
    if (hasLinkedWarehouseOp) {
      alert(
        "برای این فاکتور عملیات انبار (رسید/حواله) ثبت شده است و قابل حذف نمی‌باشد.",
      );
      return;
    }

    
    const typeLabel =
      invoice.type === "sale" ? "فاکتور فروش" :
      invoice.type === "purchase" ? "فاکتور خرید" :
      invoice.type === "return_sale" ? "برگشت از فروش" :
      invoice.type === "return_purchase" ? "برگشت از خرید" :
      invoice.type === "warehouse_receipt" ? "رسید انبار" :
      invoice.type === "warehouse_remittance" ? "حواله انبار" : "فاکتور";
      
    const personName = persons.find(p => p.id === invoice.personId)?.name || "نامشخص";
    
    const details = (
      <div className="flex flex-col gap-2">
        <div><strong>نوع:</strong> {typeLabel}</div>
        <div><strong>شماره:</strong> {invoice.invoiceNumber}</div>
        <div><strong>شخص:</strong> {personName}</div>
        {invoice.totalAmount !== undefined && <div><strong>مبلغ کل:</strong> {Number(invoice.totalAmount).toLocaleString()} ریال</div>}
        <div><strong>تاریخ:</strong> {invoice.date}</div>
      </div>
    );

    confirmAction("حذف این مورد غیرقابل بازگشت است. آیا اطمینان دارید؟", async () => {
      try {
        await deleteInvoice(id.toString());
        await fetchInvoices();
      } catch (err: any) {
        customAlert(err.message);
      }
    }, details);
  };

  const handleVoidInvoice = async (id: string | number) => {
    
    const invoice = invoices.find((inv) => inv.id.toString() === id.toString());
    const typeLabel = invoice ? (
      invoice.type === "sale" ? "فاکتور فروش" :
      invoice.type === "purchase" ? "فاکتور خرید" :
      invoice.type === "return_sale" ? "برگشت از فروش" :
      invoice.type === "return_purchase" ? "برگشت از خرید" :
      invoice.type === "warehouse_receipt" ? "رسید انبار" :
      invoice.type === "warehouse_remittance" ? "حواله انبار" : "فاکتور"
    ) : "";
      
    const personName = invoice ? (persons.find(p => p.id === invoice.personId)?.name || "نامشخص") : "";
    
    const details = invoice ? (
      <div className="flex flex-col gap-2">
        <div><strong>نوع:</strong> {typeLabel}</div>
        <div><strong>شماره:</strong> {invoice.invoiceNumber}</div>
        <div><strong>شخص:</strong> {personName}</div>
        {invoice.totalAmount !== undefined && <div><strong>مبلغ کل:</strong> {Number(invoice.totalAmount).toLocaleString()} ریال</div>}
        <div><strong>تاریخ:</strong> {invoice.date}</div>
      </div>
    ) : undefined;

    confirmAction("آیا از ابطال این فاکتور اطمینان دارید؟ فاکتور ابطال شده در محاسبات لحاظ نخواهد شد اما در سوابق باقی می‌ماند.", async () => {
      try {
        await voidInvoice(id.toString());
        await fetchInvoices();
      } catch (err: any) {
        customAlert(err.message);
      }
    }, details);
  };

  const handleEditInvoiceAction = async (inv: any) => {
    const hasLinkedWarehouseOp = invoices.some(
      (val) =>
        (val.type === "warehouse_receipt" ||
          val.type === "warehouse_remittance") &&
        val.sourceInvoiceId?.toString() === inv.id.toString() &&
        !val.isAutoGenerated,
    );
    if (hasLinkedWarehouseOp) {
      alert(
        "برای این فاکتور عملیات انبار (رسید/حواله) مبدا ثبت شده است و قابل ویرایش نمی‌باشد.",
      );
      return;
    }

    const isDraft = inv.isDraft || inv.status === "draft";
    if (!isDraft) {
      if (
        !confirm(
          "آیا می‌خواهید این فاکتور را ویرایش کنید؟ نسخه قبلی پس از ذخیره نهایی حذف و با نسخه جدید جایگزین خواهد شد.",
        )
      )
        return;
    } else {
      if (!confirm("آیا می‌خواهید این فاکتور پیش‌نویس را ویرایش کنید؟")) return;
    }

    setEditingInvoiceId(inv.id);
    setInvoiceMode("manual");
    setInvoiceNumber(inv.invoiceNumber);
    setSellerInvoiceNumber(inv.sellerInvoiceNumber || "");
    setInvoiceTitle(inv.title || "");
    setInvoiceType(inv.type);
    setInvoiceCurrency(inv.currency || storeSettings.currency);
    setCustomerId(inv.customerId);
    setSourceInvoiceId(inv.sourceInvoiceId || "");
    setItems((inv.items || []).map((i: any) => ({ ...i, id: i.id || generateId() })));
    setOverallDiscountPercent(inv.overallDiscountPercent || 0);

    if (inv.date) {
      try {
        setDate(new Date(inv.date));
      } catch (e) {}
    }

    setActiveTab(
      inv.type === "sale_return"
        ? "create_sale_return"
        : inv.type === "purchase_return"
          ? "create_purchase_return"
          : inv.type === "sale"
            ? "create_sale"
            : inv.type === "purchase"
              ? "create_purchase"
              : "create_warehouse_doc",
      true,
    );
  };

  const hasRemainingWarehouseItems = (invoiceId: string | number) => {
    const sourceInv = invoices.find(
      (i) => i.id.toString() === invoiceId.toString(),
    );
    if (!sourceInv || !sourceInv.items) return false;

    const isRemittance =
      (activeTab === "create_warehouse_doc" &&
        invoiceType === "warehouse_remittance") ||
      activeTab === "list_warehouse_docs";
    const pastDocs = (invoices || []).filter(
      (i) =>
        i.sourceInvoiceId?.toString() === invoiceId.toString() &&
        (isRemittance
          ? i.type === "warehouse_remittance"
          : i.type === "warehouse_receipt"),
    );
    const processedAmounts: Record<string, number> = {};
    pastDocs.forEach((doc) => {
      if (doc.items) {
        doc.items.forEach((rt: any) => {
          const key = String(rt.productId || rt.productName || "");
          if (!key) return;
          if (!processedAmounts[key]) processedAmounts[key] = 0;
          processedAmounts[key] += Number(rt.quantity) || 0;
        });
      }
    });

    const hasAny = sourceInv.items.some((it: any) => {
      const prod = products.find(
        (p) => p.id?.toString() === it.productId?.toString(),
      );
      if (prod?.type === "service") return false;

      const key = String(it.productId || it.productName || "");
      const processed = key ? processedAmounts[key] || 0 : 0;
      const remaining = (Number(it.quantity) || 0) - processed;
      return remaining > 0;
    });
    return hasAny;
  };

  const getInvoiceNumber = (typeOverride?: string) => {
    let typeKey = typeOverride || "sale";
    if (!typeOverride) {
      if (
        (activeTab === "create_warehouse_doc" &&
          invoiceType === "warehouse_receipt") ||
        invoiceType === "warehouse_receipt"
      )
        typeKey = "warehouse_receipt";
      else if (
        (activeTab === "create_warehouse_doc" &&
          invoiceType === "warehouse_remittance") ||
        invoiceType === "warehouse_remittance"
      )
        typeKey = "warehouse_remittance";
      else if (activeTab === "create_purchase" || invoiceType === "purchase")
        typeKey = "purchase";
      else if (invoiceType === "proforma") typeKey = "proforma";
      else if (
        activeTab === "create_sale_return" ||
        invoiceType === "sale_return"
      )
        typeKey = "sale_return";
      else if (
        activeTab === "create_purchase_return" ||
        invoiceType === "purchase_return"
      )
        typeKey = "purchase_return";
    }

    // Default prefixes if not configured
    const defaultPrefixes: Record<string, string> = {
      sale: "INV-",
      purchase: "PUR-",
      proforma: "PF-",
      warehouse_receipt: "REC-",
      warehouse_remittance: "REM-",
      sale_return: "RTN-S-",
      purchase_return: "RTN-P-",
    };

    const prefix =
      (storeSettings as any)["prefix_" + typeKey] !== undefined &&
      (storeSettings as any)["prefix_" + typeKey] !== null
        ? String((storeSettings as any)["prefix_" + typeKey])
        : defaultPrefixes[typeKey] || "";

    // Calculate sequential number based on settings
    const startNumStr =
      (storeSettings as any)["start_" + typeKey] ||
      storeSettings.invoiceStartNumber ||
      "1000";
    const lenStr =
      (storeSettings as any)["len_" + typeKey] ||
      storeSettings.invoiceNumberLength ||
      "6";

    const startNum = parseInt(startNumStr, 10);
    const numLength = Math.max(1, parseInt(lenStr, 10));

    let maxNum = startNum - 1;

    invoices.forEach((inv) => {
      // Determine this invoice type
      let invType = "sale";
      if (inv.type) invType = inv.type;

      if (invType === typeKey && inv.invoiceNumber) {
        let numStr = String(inv.invoiceNumber);
        if (prefix && numStr.startsWith(prefix)) {
          numStr = numStr.substring(prefix.length);
        }
        const num = parseInt(numStr.replace(/\D/g, ""), 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });

    const nextNum = maxNum + 1;
    const formattedNum = String(nextNum).padStart(numLength, "0");
    return prefix + formattedNum;
  };

  const saveInvoiceData = async (
    customPayload?: any,
    isDraftOverride?: boolean,
  ) => {
    setSubmitting(true);
    setSuccessMsg("");

    const isDraft =
      isDraftOverride ||
      (customPayload &&
        (customPayload.isDraft || customPayload.status === "draft"));

    let finalInvoiceNumber = String(invoiceNumber || "");

    if (
      (invoiceMode === "auto" && !autoSaveInvoiceId && !editingInvoiceId) ||
      !finalInvoiceNumber
    ) {
      // Allow backend to generate the number on first save
      finalInvoiceNumber = "";
    }

    if (activeTab === "create_warehouse_doc" && !invoiceWarehouseId) {
      customAlert(
        "لطفاً در قسمت توضیحات مبدا/مقصد فرم، یک انبار را مشخص کنید.",
      );
      setSubmitting(false);
      return;
    }

    // Always enforce sales warehouse for sales
    if (
      (activeTab === "create_sale" || invoiceType === "sale") &&
      items.some(
        (i) => products.find((p) => p.id === i.productId)?.type !== "service",
      ) &&
      !invoiceWarehouseId
    ) {
      customAlert(
        "لطفاً برای فاکتور فروش، انبار فروش را انتخاب کنید. فروش حتماً باید از یک انبار مشخص انجام شود.",
      );
      setSubmitting(false);
      return;
    }

    if (
      storeSettings.requireWarehouse &&
      !activeTab.includes("warehouse") &&
      activeTab !== "create_sale" &&
      items.some(
        (i) => products.find((p) => p.id === i.productId)?.type !== "service",
      ) &&
      !invoiceWarehouseId
    ) {
      customAlert(
        "لطفاً برای فاکتور فروش/خریدِ شامل کالا، انبار را انتخاب کنید.",
      );
      setSubmitting(false);
      return;
    }

    const cleanItems = (items || []).filter(
      (item) =>
        item.productName ||
        item.productId ||
        (item.quantity > 0 && item.unitPrice > 0),
    );

    const actualCustomerId = customPayload?.customerId || customerId;
    const actualType = customPayload?.type || invoiceType;
    if (
      !isDraft &&
      actualCustomerId &&
      (actualType === "sale" || actualType === "purchase_return")
    ) {
      const person = persons.find(
        (p) => p.id.toString() === actualCustomerId.toString(),
      );
      if (person && person.creditLimit && person.creditLimit > 0) {
        const currentBalanceObj = calculatePersonBalance(actualCustomerId);
        let currentDebt =
          currentBalanceObj.status === "بدهکار"
            ? currentBalanceObj.amount
            : -currentBalanceObj.amount;

        let invTotal = 0;
        if (customPayload) {
          invTotal = customPayload.totalAmount || 0;
        } else {
          invTotal = calculateFinalTotal();
        }

        const newDebt = currentDebt + invTotal;
        if (newDebt > person.creditLimit) {
          customAlert(
            `خطا: ثبت این سند باعث عبور از سقف اعتبار شخص می‌شود.
سقف اعتبار: ${addCommas(person.creditLimit)}
مبلغ بدهی بعد از ثبت: ${addCommas(newDebt)}`,
          );
          setSubmitting(false);
          return;
        }
      }
    }

    const payload = customPayload
      ? {
          ...customPayload,
          isDraft,
          status: isDraft ? "draft" : "final",
          invoiceNumber: (function () {
            let num = customPayload.invoiceNumber;
            if (!num || num.includes("خودکار") || num.includes("تولید خودکار")) {
                num = ""; // allow backend to generate
            }
            return num;
          })(),
        }
      : {
          invoiceNumber: finalInvoiceNumber,
          sellerInvoiceNumber: sellerInvoiceNumber || "",
          title: invoiceTitle,
          description: invoiceDescription,
          note: invoiceNote,
          warehouseId: invoiceWarehouseId,
          type: invoiceType,
          currency: invoiceCurrency,
          date:
            typeof date.toDate === "function"
              ? date.toDate().toISOString()
              : new Date(date).toISOString(),
                      
          customerId,
          sourceInvoiceId,
          items: cleanItems.map((item) => ({
            ...item,
            warehouseId:
              (storeSettings.requireWarehouse ||
                activeTab.includes("warehouse") ||
                activeTab === "create_sale" ||
                invoiceType === "sale") &&
              invoiceWarehouseId
                ? invoiceWarehouseId
                : item.warehouseId,
          })),
          overallDiscountPercent,
          totalAmount: calculateFinalTotal(),
          paymentStatus: invoicePaymentStatus,
          paidAmount: Number(invoicePaidAmount) || 0,
          isDraft,
          status: isDraft ? "draft" : "final",
        };

    // 1. If it's a sale and not a draft, perform the Sales Warehouse check and identify shortages
    if (payload.type === "sale" && !isDraft) {
      const shortages: any[] = [];
      const requiredQty: Record<string, number> = {};

      for (const item of payload.items) {
        if (!item.productId) continue;
        const productObj = products.find((p) => p.id === item.productId);
        if (productObj?.type === "service") continue;
        const q =
          (Number(item.quantity) || 0) *
          (item.isSecondaryUnit && item.unitRatio ? Number(item.unitRatio) : 1);
        requiredQty[item.productId] = (requiredQty[item.productId] || 0) + q;
      }

      for (const productId of Object.keys(requiredQty)) {
        const q = requiredQty[productId];
        const stockInfo = getProductStockInfo(productId);
        const targetWhId = invoiceWarehouseId
          ? invoiceWarehouseId.toString()
          : "";
        const physicalInWh = targetWhId
          ? stockInfo.warehouses[targetWhId]?.physical || 0
          : 0;

        if (physicalInWh < q) {
          const deficit = q - physicalInWh;
          const productObj = products.find(
            (p) => p.id.toString() === productId.toString(),
          );

          // Collect potential transfers from other active warehouses
          let remainingDeficit = deficit;
          const transfersList: any[] = [];

          const otherActiveWhs = (warehouses || []).filter(
            (w) => w.isActive !== false && w.id.toString() !== targetWhId,
          );
          for (const otherWh of otherActiveWhs) {
            if (remainingDeficit <= 0) break;
            const otherPhys =
              stockInfo.warehouses[otherWh.id.toString()]?.physical || 0;
            if (otherPhys > 0) {
              const transferQty = Math.min(remainingDeficit, otherPhys);
              transfersList.push({
                fromWarehouseId: otherWh.id,
                fromWarehouseName: otherWh.name,
                toWarehouseId: targetWhId,
                toWarehouseName:
                  warehouses.find((w) => w.id.toString() === targetWhId)
                    ?.name || "انبار فروش",
                qty: transferQty,
              });
              remainingDeficit -= transferQty;
            }
          }

          shortages.push({
            productId,
            productName: productObj?.name || "کالای نامشخص",
            unit: productObj?.unit || "عدد",
            required: q,
            availableInTarget: physicalInWh,
            deficit,
            remainingDeficit,
            transfers: transfersList,
          });
        }
      }

      if (shortages.length > 0) {
        // Shortage exists in sales warehouse! Propose transfer
        setTransferProposal({
          show: true,
          items: shortages,
          payload: payload,
        });
        setSubmitting(false);
        return false;
      }
    }

    // 2. Standard validation for other conditions or warehouse remittances
    if (
      !storeSettings.allowNegativeStock &&
      payload.type === "warehouse_remittance"
    ) {
      const requiredQty: Record<string, number> = {};

      for (const item of payload.items) {
        if (!item.productId) continue;
        const productObj = products.find((p) => p.id === item.productId);
        if (productObj?.type === "service") continue;
        const q =
          (Number(item.quantity) || 0) *
          (item.isSecondaryUnit && item.unitRatio ? Number(item.unitRatio) : 1);
        const key = item.productId + "_" + (item.warehouseId || "global");
        requiredQty[key] = (requiredQty[key] || 0) + q;
      }

      for (const key of Object.keys(requiredQty)) {
        const [productId, whId] = key.split("_");
        const q = requiredQty[key];
        const stockInfo = getProductStockInfo(productId);

        const avail = stockInfo.warehouses[whId]?.physical || 0;
        if (avail < q) {
          alert(
            `موجودی فیزیکی در انبار انتخاب شده کافی نیست. (موجودی: ${avail})`,
          );
          setSubmitting(false);
          return false;
        }
      }
    }

    try {
      let addedInvoice;
      if (editingInvoiceId) {
        addedInvoice = await updateInvoice(editingInvoiceId, payload as any, true);
        if (!isDraftOverride) {
          setEditingInvoiceId(null);
        }
      } else {
        if (autoSaveInvoiceId) {
          await deleteInvoice(autoSaveInvoiceId, true, true);
          setAutoSaveInvoiceId(null);
        }
        addedInvoice = await addInvoice(payload as any, true);
        if (isDraftOverride) {
          setEditingInvoiceId(addedInvoice.id);
        }
      }

      // Auto-create warehouse remittance for purchase return
      if (!editingInvoiceId && payload.type === "purchase_return" && !isDraft) {
        const startNum = parseInt(
          storeSettings.invoiceStartNumber || "1000",
          10,
        );
        const autoPrefix = storeSettings.prefix_warehouse_remittance || "REM-";
        const numLength = Math.max(
          1,
          parseInt(storeSettings.invoiceNumberLength || "6", 10),
        );
        let maxNum = startNum - 1;
        invoices.forEach((inv) => {
          if (inv.invoiceNumber && inv.invoiceNumber.startsWith(autoPrefix)) {
            const num = parseInt(
              inv.invoiceNumber.substring(autoPrefix.length),
              10,
            );
            if (!isNaN(num) && num > maxNum) maxNum = num;
          }
        });
        const autoDocNumber =
          autoPrefix + String(maxNum + 1).padStart(numLength, "0");

        const autoDocPayload = {
          isAutoGenerated: true,
          invoiceNumber: autoDocNumber,
          title:
            "حواله خروج خودکار (مرتبط با برگشت خرید " +
            payload.invoiceNumber +
            ")",
          type: "warehouse_remittance",
          warehouseId: payload.warehouseId,
          currency: payload.currency,
          date: payload.date,
                    customerId: payload.customerId,
          sourceInvoiceId: addedInvoice?.id || payload.invoiceNumber,
          items: payload.items.map((item) => ({
            ...item,
            warehouseId: item.warehouseId || payload.warehouseId,
          })),
          overallDiscountPercent: 0,
          totalAmount: 0,
        };
        await addInvoice(autoDocPayload as any, true);
      }

      // Auto-create warehouse remittance for sales
      if (!editingInvoiceId && payload.type === "sale" && !isDraft) {
        const startNum = parseInt(
          storeSettings.invoiceStartNumber || "1000",
          10,
        );
        const remPrefix = storeSettings.prefix_warehouse_remittance || "REM-";
        const numLength = Math.max(
          1,
          parseInt(storeSettings.invoiceNumberLength || "6", 10),
        );
        let maxNum = startNum - 1;
        invoices.forEach((inv) => {
          if (inv.invoiceNumber && inv.invoiceNumber.startsWith(remPrefix)) {
            const num = parseInt(
              inv.invoiceNumber.substring(remPrefix.length),
              10,
            );
            if (!isNaN(num) && num > maxNum) maxNum = num;
          }
        });
        const autoRemittanceNumber = `${remPrefix}${String(maxNum + 1).padStart(numLength, "0")}`;

        const remittancePayload = {
          isAutoGenerated: true,
          invoiceNumber: autoRemittanceNumber,
          title:
            "حواله خروج خودکار (مرتبط با فاکتور " + payload.invoiceNumber + ")",
          type: "warehouse_remittance",
          warehouseId: payload.warehouseId,
          currency: payload.currency,
          date: payload.date,
                    customerId: payload.customerId,
          sourceInvoiceId: addedInvoice?.id || payload.invoiceNumber,
          items: payload.items.map((item) => ({
            ...item,
            warehouseId: item.warehouseId || payload.warehouseId,
          })),
          overallDiscountPercent: 0,
          totalAmount: 0,
        };
        await addInvoice(remittancePayload as any, true);
      }

      // Single recalculate at the end to save network overhead
      await recalculateAllWarehouseStocks();

      const successTypeName =
        payload.type === "warehouse_receipt"
          ? "رسید انبار"
          : payload.type === "warehouse_remittance"
            ? "حواله انبار"
            : "فاکتور";

      setSuccessMsg(
        isDraft
          ? `پیش‌نویس ${successTypeName} با موفقیت ذخیره شد!`
          : `${successTypeName} با موفقیت ثبت شد!`,
      );
      if (
        storeSettings?.notify_on_invoice &&
        (payload.type === "sale" || payload.type === "purchase") &&
        !isDraft
      ) {
        const person = persons.find((p) => p.id === payload.customerId);
        if (person && person.phone) {
          const amt =
            typeof formatNumber === "function"
              ? formatNumber(payload.totalAmount)
              : payload.totalAmount;
          const mTitle =
            payload.type === "sale" ? "مشتری گرامی" : "همکار گرامی";
          const mWord = payload.type === "sale" ? "خرید" : "فروش";
          let msg = `${mTitle}، فاکتور ${mWord} شما به مبلغ ${amt} ${storeSettings?.currency || "تومان"} در سیستم ثبت شد.`;
          if (storeSettings?.smsTemplateInvoice) {
            msg = storeSettings.smsTemplateInvoice
              .replace(/{name}/g, person.name)
              .replace(/{amount}/g, String(amt))
              .replace(/{invoice_number}/g, String(payload.invoiceNumber || ""))
              .replace(/{date}/g, new Date().toLocaleDateString("fa-IR"));
          }
          sendNotification(msg, person.phone, storeSettings?.notify_method);
        }
      }
      await fetchDataSilent();
      await checkDebtThreshold(payload.customerId);

      // Reset form after short delay
      clearDraft();
      setTimeout(() => {
        if (payload.type === "purchase") {
          // Open pricing wizard with the added invoice items (excluding services if possible, or all items)
          const newWizardItems = payload.items
            .filter((it: any) => {
              const prod = products.find((p) => p.id === it.productId);
              return prod && prod.type !== "service";
            })
            .map((it: any) => {
              const prod = products.find((p) => p.id === it.productId);
              return {
                productId: it.productId,
                productName: it.productName,
                purchasePrice: Number(it.unitPrice) || 0,
                marginPercent: 0,
                salePrice: prod ? Number(prod.price) : 0,
              };
            });
          if (newWizardItems.length > 0) {
            setPricingWizardItems(newWizardItems);
            setPricingWizardInvoice(payload);
          }
        }

        if (invoiceMode === "manual") setInvoiceNumber("");
        setSellerInvoiceNumber("");
        setCustomerId("");
        setSourceInvoiceId("");
        setItems([]);
        setOverallDiscountPercent(0);
        setInvoiceCurrency(storeSettings.currency || "تومان");
        setExchangeRate(1);
        setExchangeRateInput("1");
        // Re-initialize based on active tab
        if (activeTab === "create_sale") {
          setInvoiceType("sale");
          setInvoiceTitle("فاکتور فروش کالا");
          setInvoicePaymentStatus("unpaid");
          setInvoicePaidAmount(0);
        } else if (activeTab === "create_sale_return") {
          setInvoiceType("sale_return");
          setInvoiceTitle("فاکتور برگشت از فروش");
          setInvoicePaymentStatus("unpaid");
          setInvoicePaidAmount(0);
        } else if (activeTab === "create_purchase_return") {
          setInvoiceType("purchase_return");
          setInvoiceTitle("فاکتور برگشت از خرید");
          setInvoicePaymentStatus("unpaid");
          setInvoicePaidAmount(0);
        } else if (activeTab === "create_purchase") {
          setInvoiceType("purchase");
          setInvoiceTitle("فاکتور خرید کالا");
          setInvoicePaymentStatus("unpaid");
          setInvoicePaidAmount(0);
        } else if (activeTab === "create_warehouse_doc") {
          const storedDraftStr = localStorage.getItem("invoice_draft");
          const storedDraft = storedDraftStr
            ? JSON.parse(storedDraftStr)
            : null;
          if (storedDraft && storedDraft.type === "warehouse_receipt") {
            setInvoiceType("warehouse_receipt");
            setInvoiceTitle("رسید انبار (ورود کالا)");
            setWarehouseOperationType("purchase_invoice");
          } else {
            setInvoiceType("warehouse_remittance");
            setInvoiceTitle("حواله انبار (خروج کالا)");
            setWarehouseOperationType("sales_invoice");
          }
          setWarehouseWizardStep(1);
        } else {
          setInvoiceType("sale");
          setInvoiceTitle("فاکتور فروش کالا");
        }
        setSuccessMsg("");
        setPreviewInvoiceData(null); // Clear preview modal
      }, 1500);
      return true;
    } catch (error: any) {
      console.error("Error submitting invoice:", error);
      customAlert(error.message || "خطا در ارتباط با سرور.");
    } finally {
      setSubmitting(false);
    }
    return false;
  };

  const handleExecuteTransferAndSubmit = async () => {
    if (!transferProposal) return;
    setSubmitting(true);

    try {
      const { items: proposalItems, payload: originalPayload } =
        transferProposal;

      // Let's create the transfer documents for each suggested transfer
      for (const item of proposalItems) {
        for (const tr of item.transfers) {
          // Generate warehouse remittance (exit from source warehouse) and warehouse receipt (entry to sales warehouse)
          const startNum = parseInt(
            storeSettings.invoiceStartNumber || "1000",
            10,
          );
          const remPrefix = storeSettings.prefix_warehouse_remittance || "REM-";
          const recPrefix = storeSettings.prefix_warehouse_receipt || "REC-";
          const numLength = Math.max(
            1,
            parseInt(storeSettings.invoiceNumberLength || "6", 10),
          );

          let maxNumRem = startNum - 1;
          let maxNumRec = startNum - 1;
          invoices.forEach((inv) => {
            if (inv.invoiceNumber) {
              if (inv.invoiceNumber.startsWith(remPrefix)) {
                const num = parseInt(
                  inv.invoiceNumber.substring(remPrefix.length),
                  10,
                );
                if (!isNaN(num) && num > maxNumRem) maxNumRem = num;
              }
              if (inv.invoiceNumber.startsWith(recPrefix)) {
                const num = parseInt(
                  inv.invoiceNumber.substring(recPrefix.length),
                  10,
                );
                if (!isNaN(num) && num > maxNumRec) maxNumRec = num;
              }
            }
          });

          const remNumber = `${remPrefix}${String(maxNumRem + 1).padStart(numLength, "0")}`;
          const recNumber = `${recPrefix}${String(maxNumRec + 1).padStart(numLength, "0")}`;

          const product = products.find(
            (p) => p.id.toString() === item.productId.toString(),
          );
          const transferDate = new Date();
          

          // 1. Warehouse Remittance (خروج از انبار مبدا)
          const remittancePayload = {
            isAutoGenerated: true,
            invoiceNumber: remNumber,
            title: `حواله انتقال کالا به انبار فروش (خودکار بابت فاکتور فروش ${originalPayload.invoiceNumber})`,
            description: `انتقال خودکار کالا به انبار فروش (${tr.toWarehouseName}) بابت کسر موجودی`,
            type: "warehouse_remittance",
            warehouseId: tr.fromWarehouseId,
            currency: originalPayload.currency || "تومان",
            date: transferDate.toISOString(),
                        customerId: originalPayload.customerId || "",
            items: [
              {
                id: generateId(),
                productId: item.productId,
                productName: item.productName,
                quantity: tr.qty,
                unitPrice: product?.price || 0,
                discountPercent: 0,
                totalPrice: (product?.price || 0) * tr.qty,
                selectedUnit: product?.unit || "",
                unitRatio: product?.unitRatio || 1,
                isSecondaryUnit: false,
                warehouseId: tr.fromWarehouseId,
              },
            ],
            overallDiscountPercent: 0,
            totalAmount: 0,
          };

          // 2. Warehouse Receipt (ورود به انبار مقصد/فروش)
          const receiptPayload = {
            isAutoGenerated: true,
            invoiceNumber: recNumber,
            title: `رسید انتقال کالا به انبار فروش (خودکار بابت فاکتور فروش ${originalPayload.invoiceNumber})`,
            description: `انتقال خودکار کالا از انبار مبدا (${tr.fromWarehouseName}) بابت کسر موجودی`,
            type: "warehouse_receipt",
            warehouseId: tr.toWarehouseId,
            currency: originalPayload.currency || "تومان",
            date: transferDate.toISOString(),
                        customerId: originalPayload.customerId || "",
            items: [
              {
                id: generateId(),
                productId: item.productId,
                productName: item.productName,
                quantity: tr.qty,
                unitPrice: product?.price || 0,
                discountPercent: 0,
                totalPrice: (product?.price || 0) * tr.qty,
                selectedUnit: product?.unit || "",
                unitRatio: product?.unitRatio || 1,
                isSecondaryUnit: false,
                warehouseId: tr.toWarehouseId,
              },
            ],
            overallDiscountPercent: 0,
            totalAmount: 0,
          };

          await addInvoice(remittancePayload as any);
          await addInvoice(receiptPayload as any);
        }
      }

      // Recalculate stock
      await recalculateAllWarehouseStocks();
      setTransferProposal(null);

      // Submit original invoice with bypass of shortage checks (since stock is now in target warehouse!)
      const addedInvoice = await addInvoice(originalPayload);

      // Code to automatically construct warehouse remittance for the sale:
      const startNum = parseInt(storeSettings.invoiceStartNumber || "1000", 10);
      const remPrefix = storeSettings.prefix_warehouse_remittance || "REM-";
      const numLength = Math.max(
        1,
        parseInt(storeSettings.invoiceNumberLength || "6", 10),
      );

      let maxNum = startNum - 1;
      const latestInvoices = await getInvoices();
      latestInvoices.forEach((inv: any) => {
        if (inv.invoiceNumber && inv.invoiceNumber.startsWith(remPrefix)) {
          const num = parseInt(
            inv.invoiceNumber.substring(remPrefix.length),
            10,
          );
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
      const autoRemittanceNumber = `${remPrefix}${String(maxNum + 1).padStart(numLength, "0")}`;

      const remittancePayload = {
        isAutoGenerated: true,
        invoiceNumber: autoRemittanceNumber,
        title:
          "حواله خروج خودکار (مرتبط با فاکتور " +
          originalPayload.invoiceNumber +
          ")",
        type: "warehouse_remittance",
        warehouseId: originalPayload.warehouseId,
        currency: originalPayload.currency,
        date: originalPayload.date,
                customerId: originalPayload.customerId,
        sourceInvoiceId: addedInvoice?.id || originalPayload.invoiceNumber,
        items: originalPayload.items.map((it: any) => ({
          ...it,
          warehouseId: originalPayload.warehouseId,
        })),
        overallDiscountPercent: 0,
        totalAmount: 0,
      };
      await addInvoice(remittancePayload as any);

      setSuccessMsg(
        `سند انتقال موجودی و فاکتور فروش شماره ${originalPayload.invoiceNumber} با موفقیت ثبت شدند!`,
      );

      if (storeSettings?.notify_on_invoice && originalPayload.customerId) {
        const person = persons.find((p) => p.id === originalPayload.customerId);
        if (person && person.phone) {
          const amt =
            typeof formatNumber === "function"
              ? formatNumber(originalPayload.totalAmount)
              : originalPayload.totalAmount;
          let msg = `مشتری گرامی، فاکتور خرید شما به مبلغ ${amt} ${storeSettings?.currency || "تومان"} در سیستم ثبت شد.`;
          if (storeSettings?.smsTemplateInvoice) {
            msg = storeSettings.smsTemplateInvoice
              .replace(/{name}/g, person.name)
              .replace(/{amount}/g, String(amt))
              .replace(
                /{invoice_number}/g,
                String(originalPayload.invoiceNumber || ""),
              )
              .replace(/{date}/g, new Date().toLocaleDateString("fa-IR"));
          }
          sendNotification(msg, person.phone, storeSettings?.notify_method);
        }
      }

      await fetchDataSilent();
      clearDraft();

      setTimeout(() => {
        if (invoiceMode === "manual") setInvoiceNumber("");
        setSellerInvoiceNumber("");
        setCustomerId("");
        setSourceInvoiceId("");
        setItems([]);
        setOverallDiscountPercent(0);
        setInvoiceCurrency(storeSettings.currency || "تومان");
        setExchangeRate(1);
        setExchangeRateInput("1");

        setInvoiceType("sale");
        setInvoiceTitle("فاکتور فروش کالا");
        setInvoicePaymentStatus("unpaid");
        setInvoicePaidAmount(0);

        setSuccessMsg("");
        setPreviewInvoiceData(null);
      }, 1500);

      setActiveTab("list_sale", true);
    } catch (err: any) {
      console.error(err);
      customAlert(err.message || "خطایی در اجرای انتقال و ثبت فاکتور پیش آمد.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerId ||
      (items || []).length === 0 ||
      items.some((i) => !i.productId && !i.productName)
    ) {
      customAlert("لطفاً همه فیلدهای ضروری را پر کنید.");
      return;
    }
    if (activeTab === "create_warehouse_doc" && !invoiceWarehouseId) {
      customAlert("لطفاً انبار را مشخص کنید.");
      return;
    }
    if (
      storeSettings.requireWarehouse &&
      !activeTab.includes("warehouse") &&
      items.some(
        (i) => products.find((p) => p.id === i.productId)?.type !== "service",
      ) &&
      !invoiceWarehouseId
    ) {
      customAlert(
        "لطفاً برای فاکتور فروش/خریدِ شامل کالا، انبار را انتخاب کنید.",
      );
      return;
    }
    await saveInvoiceData();
  };

  const handleInvoicePreviewTrigger = () => {
    if (
      !customerId ||
      (items || []).length === 0 ||
      items.some((i) => !i.productId && !i.productName)
    ) {
      customAlert("لطفاً همه فیلدهای ضروری را پر کنید.");
      return;
    }

    if (activeTab === "create_warehouse_doc" && !invoiceWarehouseId) {
      customAlert("لطفاً انبار را مشخص کنید.");
      return;
    }

    if (
      storeSettings.requireWarehouse &&
      !activeTab.includes("warehouse") &&
      items.some(
        (i) => products.find((p) => p.id === i.productId)?.type !== "service",
      ) &&
      !invoiceWarehouseId
    ) {
      customAlert(
        "لطفاً برای فاکتور فروش/خریدِ شامل کالا، انبار را انتخاب کنید.",
      );
      return;
    }

    const finalInvoiceNumber =
      invoiceMode === "auto" || !invoiceNumber
        ? getInvoiceNumber(invoiceType)
        : invoiceNumber;
    const selectedCustomer = persons.find((p) => p.id === customerId);

    const tempPayload = {
      invoiceNumber: finalInvoiceNumber,
      sellerInvoiceNumber: sellerInvoiceNumber || "",
      title:
        invoiceTitle ||
        (invoiceType === "sale" ? "فاکتور فروش کالا" : "فاکتور خرید کالا"),
      description: invoiceDescription,
      note: invoiceNote,
      warehouseId: invoiceWarehouseId,
      type: invoiceType,
      currency: invoiceCurrency,
      date:
        typeof date.toDate === "function"
          ? date.toDate().toISOString()
          : new Date(date).toISOString(),
              
      customerId,
      
      sourceInvoiceId, // Pass it correctly
      items: (items || []).map((item) => {
        const prod = products.find(
          (p) => p.id.toString() === String(item.productId),
        );
        return {
          ...item,
          warehouseId:
            (storeSettings.requireWarehouse ||
              activeTab.includes("warehouse")) &&
            invoiceWarehouseId
              ? invoiceWarehouseId
              : item.warehouseId,
          productName: prod ? prod.name : item.productName || "کالای سفارشی",
        };
      }),
      overallDiscountPercent,
      totalAmount: calculateFinalTotal(),
      paymentStatus: invoicePaymentStatus,
      paidAmount: Number(invoicePaidAmount) || 0,
    };

    setPreviewInvoiceData(tempPayload);
  };

  const getProductStockInfo = (productId: string | number) => {
    let baseStock = 0;
    const product = products.find(
      (p) => p.id.toString() === productId.toString(),
    );
    if (product?.stock) {
      baseStock = Number(product.stock);
    }
    const defaultWhId = product?.warehouseId?.toString() || "unknown";

    const info = {
      totalPhysical: baseStock,
      totalReserved: 0,
      totalAvailable: baseStock,
      warehouses: {} as Record<
        string,
        { physical: number; reserved: number; available: number }
      >,
    };

    if (baseStock !== 0) {
      info.warehouses[defaultWhId] = {
        physical: baseStock,
        reserved: 0,
        available: baseStock,
      };
    }

    const saleQtys: Record<string, number> = {};
    const remittedSaleQtys: Record<string, number> = {};
    const saleReturnQtys: Record<string, number> = {};

    invoices.forEach((inv) => {
      if (
        !inv.items ||
        inv.isDraft ||
        inv.status === "draft" ||
        inv.type === "proforma"
      )
        return;
      inv.items.forEach((i: any) => {
        if (i.productId?.toString() === productId.toString()) {
          let q = Number(i.quantity) || 0;
          if (i.isSecondaryUnit && product?.unitRatio) {
            q = q * product.unitRatio;
          }

          const whId = (
            i.warehouseId ||
            inv.warehouseId ||
            defaultWhId
          ).toString();
          if (!info.warehouses[whId]) {
            info.warehouses[whId] = { physical: 0, reserved: 0, available: 0 };
          }

          if (inv.type === "warehouse_receipt") {
            info.totalPhysical += q;
            info.warehouses[whId].physical += q;
          } else if (inv.type === "warehouse_remittance") {
            info.totalPhysical -= q;
            info.warehouses[whId].physical -= q;

            if (inv.sourceInvoiceId) {
              const sourceInv = invoices.find(
                (sinv) =>
                  sinv.id.toString() === inv.sourceInvoiceId?.toString(),
              );
              if (sourceInv && sourceInv.type === "sale") {
                remittedSaleQtys[whId] = (remittedSaleQtys[whId] || 0) + q;
              }
            } else {
              remittedSaleQtys[whId] = (remittedSaleQtys[whId] || 0) + q;
            }
          } else if (inv.type === "sale") {
            saleQtys[whId] = (saleQtys[whId] || 0) + q;
          } else if (inv.type === "sale_return") {
            saleReturnQtys[whId] = (saleReturnQtys[whId] || 0) + q;
          }
        }
      });
    });

    const totalSaleRaw = Object.values(saleQtys).reduce((a, b) => a + b, 0);
    const totalSaleReturn = Object.values(saleReturnQtys).reduce(
      (a, b) => a + b,
      0,
    );
    const totalSale = Math.max(0, totalSaleRaw - totalSaleReturn);
    const totalRemittedForSale = Object.values(remittedSaleQtys).reduce(
      (a, b) => a + b,
      0,
    );
    const globalUnremitted = Math.max(0, totalSale - totalRemittedForSale);

    if (globalUnremitted > 0) {
      if (!info.warehouses[defaultWhId])
        info.warehouses[defaultWhId] = {
          physical: 0,
          reserved: 0,
          available: 0,
        };
      info.warehouses[defaultWhId].reserved += globalUnremitted;
      info.totalReserved += globalUnremitted;
    }

    Object.keys(info.warehouses).forEach((whId) => {
      info.warehouses[whId].available =
        info.warehouses[whId].physical - info.warehouses[whId].reserved;
    });
    info.totalAvailable = info.totalPhysical - info.totalReserved;

    return info;
  };

  const formatProductStockDetails = (product: any) => {
    const info = getProductStockInfo(product.id);
    let details = "";
    const whCount = Object.keys(info.warehouses).filter(
      (wid) => info.warehouses[wid].available > 0,
    ).length;

    if (whCount > 0) {
      details =
        ` | ` +
        Object.keys(info.warehouses)
          .filter((wid) => info.warehouses[wid].available > 0)
          .map((wid) => {
            const wName =
              warehouses.find((w) => w.id.toString() === wid)?.name ||
              "انبار نامشخص";
            return `${wName}: ${info.warehouses[wid].available}`;
          })
          .join("، ");
    }

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={
            info.totalAvailable > 0
              ? "text-emerald-600 font-bold"
              : "text-rose-500 font-bold"
          }
        >
          موجودی در دسترس: {info.totalAvailable} {product.unit || ""}
        </span>
        {info.totalReserved > 0 && (
          <span className="text-amber-500 font-bold bg-amber-50 px-1 rounded">
            (رزرو شده: {info.totalReserved})
          </span>
        )}
        {(product.code || product.barcode) && (
          <span className="text-slate-400 font-mono text-[10px] pr-1 border-r border-slate-200">
            {product.code ? `کد: ${product.code}` : ""}{" "}
            {product.barcode ? `| بارکد: ${product.barcode}` : ""}
          </span>
        )}
        <span className="text-gray-400">{details}</span>
      </div>
    );
  };

  const calculateProductCurrentStock = (productId: string | number) => {
    return getProductStockInfo(productId).totalAvailable;
  };

  const calculatePersonBalance = (personId: string | number) => {
    const person = persons.find((p) => p.id.toString() === personId.toString());
    if (!person) return { amount: 0, status: "بی‌حساب" };

    let balance = 0; // positive for debtor, negative for creditor

    // Calculate purely from approved accounting documents
    accountingDocuments.forEach(doc => {
      if (doc.status === 'draft' || doc.isDeleted) return;
      if (doc.items && Array.isArray(doc.items)) {
        doc.items.forEach(item => {
          if (item.detailedAccountId?.toString() === personId.toString()) {
            balance += (Number(item.debit) || 0) - (Number(item.credit) || 0);
          }
        });
      }
    });

    if (balance > 0)
      return {
        amount: balance,
        status: "بدهکار",
        color: "text-rose-600",
        bg: "bg-rose-50",
      };
    if (balance < 0)
      return {
        amount: Math.abs(balance),
        status: "بستانکار",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      };
    return {
      amount: 0,
      status: "بی‌حساب",
      color: "text-gray-500",
      bg: "bg-gray-100",
    };
  };

  const renderPersonInfoBox = (
    personId: string | number,
    themeClass: string = "bg-gray-50 border-gray-100 text-gray-600",
  ) => {
    const person = persons.find(
      (p) => p.id?.toString() === personId?.toString(),
    );
    if (!person) return null;
    const bal = calculatePersonBalance(personId);
    return (
      <div
        className={`mt-2 text-xs font-bold w-full ${themeClass} border rounded-lg p-3 flex flex-col gap-2`}
      >
        {(person.phone || person.address) && (
          <div className="flex flex-col gap-1.5 pb-2 border-b border-black/5">
            {person.phone && (
              <div className="flex items-center gap-1.5 opacity-90 font-medium">
                <Phone className="w-3.5 h-3.5" />
                <span dir="ltr" className="text-right w-full">
                  {person.phone}
                </span>
              </div>
            )}
            {person.address && (
              <div className="flex gap-1.5 opacity-90 font-medium leading-relaxed">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{person.address}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between items-center text-[11px] sm:text-xs">
          <span className="opacity-80">مانده حساب فعلی:</span>
          <span
            className={`${bal.bg || "bg-white"} ${bal.color || "text-slate-800"} px-2.5 py-0.5 rounded shadow-sm border border-black/5`}
          >
            {bal.amount === 0
              ? "صفر (بی‌حساب)"
              : `${formatCurrency(bal.amount)} ${storeSettings.currency || "تومان"} (${bal.status})`}
          </span>
        </div>
      </div>
    );
  };

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    const final = subtotal * (1 - overallDiscountPercent / 100);
    return final > 0 ? final : 0;
  };

  const invoiceOriginalTotal = () => {
    return items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
      0,
    );
  };

  const invoiceTotalDiscount = () => {
    const original = invoiceOriginalTotal();
    const final = calculateFinalTotal();
    return Math.max(0, original - final);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount);
  };

  const toPersianDigits = (str: string | number | undefined | null) => {
    if (str === null || str === undefined) return "";
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return str.toString().replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
  };

  const currencyLabel =
    activeTab === "create_sale" ||
    activeTab === "create_purchase" ||
    activeTab === "create_warehouse_doc" ||
    activeTab === "create_sale_return" ||
    activeTab === "create_purchase_return"
      ? invoiceCurrency
      : storeSettings.currency;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const openPayslip = (tx: any) => {
    let parsed = null;
    try {
      parsed = tx.description ? JSON.parse(tx.description) : null;
    } catch (e) {
      console.error(e);
    }
    const employeeName =
      persons.find((p) => p.id.toString() === tx.personId?.toString())?.name ||
      "کارمند";
    setViewingPayslip({
      ...tx,
      parsed,
      computedPersonName: employeeName,
    });
  };

  const handleSystemUpdate = async () => {
    setUpdatingStr(true);
    setUpdateProgress(0);
    setUpdateLog("");

    setUpdateStepsStatus({
      connecting: "running",
      checking: "idle",
      downloading: "idle",
      verifying: "idle",
    });
    setUpdateStepName(
      "در حال برقراری ارتباط ایمن با سرور اصلی برای دریافت بروزرسانی...",
    );

    // We can run an interval to smoothly simulate the loading from 0 to 95 over ~6 seconds
    let currentPercent = 0;
    const intervalTime = 60; // ms
    const totalSimulatedTime = 6000; // 6 seconds to reach ~95%
    const increment = 100 / (totalSimulatedTime / intervalTime);

    let fetchPromise = fetch("/api/system/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then(async (res) => {
      const data = await res.json();
      return { ok: res.ok, data };
    });

    const updateInterval = setInterval(() => {
      currentPercent += increment;
      if (currentPercent >= 95) {
        currentPercent = 95;
        clearInterval(updateInterval);
      }
      const progress = Math.round(currentPercent);
      setUpdateProgress(progress);

      // Determine step
      if (progress < 25) {
        setUpdateStepName("در حال برقراری ارتباط ایمن با سرور اصلی...");
        setUpdateStepsStatus((prev) => ({ ...prev, connecting: "running" }));
      } else if (progress >= 25 && progress < 50) {
        setUpdateStepName("بررسی بسته‌ها و تفاوت ساختارهای فایلی سیستم...");
        setUpdateStepsStatus((prev) => ({
          ...prev,
          connecting: "success",
          checking: "running",
        }));
      } else if (progress >= 50 && progress < 78) {
        setUpdateStepName(
          "در حال دریافت بسته‌های تغییر یافته فاکتور و خدمات جدید...",
        );
        setUpdateStepsStatus((prev) => ({
          ...prev,
          connecting: "success",
          checking: "success",
          downloading: "running",
        }));
      } else if (progress >= 78) {
        setUpdateStepName(
          "در حال ثبت تنظیمات پایگاه داده و پرونده‌های سیستم...",
        );
        setUpdateStepsStatus((prev) => ({
          ...prev,
          connecting: "success",
          checking: "success",
          downloading: "success",
          verifying: "running",
        }));
      }
    }, intervalTime);

    try {
      // Wait for both the minimum time (say 3.5 seconds) and the fetch to complete
      const [fetchResult] = await Promise.all([
        fetchPromise,
        new Promise((resolve) => setTimeout(resolve, 3800)), // delay to let progress showcase nicely
      ]);

      clearInterval(updateInterval);

      if (fetchResult.ok) {
        setUpdateProgress(100);
        setUpdateStepName("بروزرسانی با موفقیت به پایان رسید!");
        setUpdateStepsStatus({
          connecting: "success",
          checking: "success",
          downloading: "success",
          verifying: "success",
        });

        if (latestGithubSha) {
          localStorage.setItem("localCommitSha", latestGithubSha);
          setLatestCommits([]);
        }
        if (latestVersion) {
          localStorage.setItem("localAppVersion", latestVersion);
        }

        setUpdateLog(
          `نسخه اصلی نرم‌افزار حسابداری و فاکتور با موفقیت به آخرین بیلد سیستم ارتقا یافت.
تغییرات نرم‌افزاری جدید با موفقیت همگام‌سازی شدند.

سیستم تا لحظاتی دیگر به صورت خودکار مجدداً راه‌اندازی و بارگذاری می‌شود...`,
        );

        // Auto-reloading after 4 seconds
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else {
        // Error handling
        setUpdateStepsStatus((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((k) => {
            if (updated[k] === "running") updated[k] = "error";
          });
          return updated;
        });
        setUpdateStepName("بروزرسانی متوقف شد.");
        const errMsg =
          fetchResult.data?.error ||
          fetchResult.data?.message ||
          "خطای غیرمنتظره در همگام‌سازی فایل‌ها.";
        setUpdateLog(`مشکلی در بروزرسانی پیش آمد:
${errMsg}`);
      }
    } catch (e) {
      clearInterval(updateInterval);
      setUpdateStepName("بروزرسانی با خطا مواجه شد.");
      setUpdateLog(
        `خطای ارتباط با شبکه یا اختلال موقت در سرویس مرکزی بروزرسانی.`,
      );
    } finally {
      setUpdatingStr(false);
    }
  };

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "create_warehouse_doc":
        return (
          <WarehouseDocCreate invoiceNumber={invoiceNumber} persons={persons} date={date} setDate={setDate} persian={persian} persian_fa={persian_fa} items={items} setItems={setItems} handleItemChange={handleItemChange} products={products} handleRemoveItem={handleRemoveItem} storeSettings={storeSettings} Package={Package} invoiceWarehouseId={invoiceWarehouseId} setInvoiceWarehouseId={setInvoiceWarehouseId} warehouses={warehouses} FastBarcodeScanner={FastBarcodeScanner} handleFastBarcodeScan={handleFastBarcodeScan} SearchableSelect={SearchableSelect} handleFastAddProduct={handleFastAddProduct} invoiceTitle={invoiceTitle} invoiceMode={invoiceMode} setInvoiceMode={setInvoiceMode} setInvoiceNumber={setInvoiceNumber} setInvoiceTitle={setInvoiceTitle} User={User} activePersonsOnly={activePersonsOnly} getRoleName={getRoleName} customerId={customerId} setCustomerId={setCustomerId} renderPersonInfoBox={renderPersonInfoBox} formatCurrency={formatCurrency} submitting={submitting} handleInvoicePreviewTrigger={handleInvoicePreviewTrigger} Plus={Plus} Trash2={Trash2} Save={Save} RefreshCw={RefreshCw} FileText={FileText} Tag={Tag} setInvoiceType={setInvoiceType} DatePicker={DatePicker} invoiceDescription={invoiceDescription} setInvoiceDescription={setInvoiceDescription} invoiceNote={invoiceNote} setInvoiceNote={setInvoiceNote} formatProductStockDetails={formatProductStockDetails} warehouseOperationType={warehouseOperationType} setWarehouseOperationType={setWarehouseOperationType} warehouseWizardStep={warehouseWizardStep} setWarehouseWizardStep={setWarehouseWizardStep} setSourceInvoiceId={setSourceInvoiceId} customAlert={customAlert} invoices={invoices} hasRemainingWarehouseItems={hasRemainingWarehouseItems} sourceInvoiceId={sourceInvoiceId} deletePreviousDocs={deletePreviousDocs} setDeletePreviousDocs={setDeletePreviousDocs} setInvoiceCurrency={setInvoiceCurrency} setExchangeRate={setExchangeRate} setExchangeRateInput={setExchangeRateInput} deleteInvoice={deleteInvoice} setInvoices={setInvoices} fetchInvoices={fetchInvoices} generateId={generateId} handleAddItem={handleAddItem} />
        );

      case "create_purchase_return":
        return (
          <PurchaseReturnInvoiceCreate hasDraft={hasDraft} restoreDraft={restoreDraft} clearDraft={clearDraft} successMsg={successMsg} editingInvoiceId={editingInvoiceId} invoiceNumber={invoiceNumber} toPersianDigits={toPersianDigits} persons={persons} date={date} setDate={setDate} persian={persian} persian_fa={persian_fa} items={items} setItems={setItems} handleItemChange={handleItemChange} products={products} handleRemoveItem={handleRemoveItem} calculateFinalTotal={calculateFinalTotal} accounts={accounts} storeSettings={storeSettings} CurrencyInput={CurrencyInput} Package={Package} invoiceWarehouseId={invoiceWarehouseId} setInvoiceWarehouseId={setInvoiceWarehouseId} warehouses={warehouses} FastBarcodeScanner={FastBarcodeScanner} handleFastBarcodeScan={handleFastBarcodeScan} SearchableSelect={SearchableSelect} handleFastAddProduct={handleFastAddProduct} setIsScannerOpen={setIsScannerOpen} ScanLine={ScanLine} setIsProductModalOpen={setIsProductModalOpen} Box={Box} invoiceTitle={invoiceTitle} invoiceMode={invoiceMode} setInvoiceMode={setInvoiceMode} setInvoiceNumber={setInvoiceNumber} setInvoiceTitle={setInvoiceTitle} User={User} activePersonsOnly={activePersonsOnly} getRoleName={getRoleName} customerId={customerId} setCustomerId={setCustomerId} renderPersonInfoBox={renderPersonInfoBox} Wallet={Wallet} invoicePaymentStatus={invoicePaymentStatus} setInvoicePaymentStatus={setInvoicePaymentStatus} setInvoicePaidAmount={setInvoicePaidAmount} DollarSign={DollarSign} invoicePaidAmount={invoicePaidAmount} overallDiscountPercent={overallDiscountPercent} setOverallDiscountPercent={setOverallDiscountPercent} formatCurrency={formatCurrency} invoiceOriginalTotal={invoiceOriginalTotal} invoiceCurrency={invoiceCurrency} invoiceTotalDiscount={invoiceTotalDiscount} numToPersianWords={numToPersianWords} submitting={submitting} saveInvoiceData={saveInvoiceData} handleInvoicePreviewTrigger={handleInvoicePreviewTrigger} formatNumber={formatNumber} Calculator={Calculator} calculateSubtotal={calculateSubtotal} />
        );
      case "create_purchase":
        return (
          <PurchaseInvoiceCreate hasDraft={hasDraft} restoreDraft={restoreDraft} clearDraft={clearDraft} successMsg={successMsg} editingInvoiceId={editingInvoiceId} invoiceNumber={invoiceNumber} toPersianDigits={toPersianDigits} persons={persons} date={date} setDate={setDate} persian={persian} persian_fa={persian_fa} items={items} setItems={setItems} handleItemChange={handleItemChange} products={products} handleRemoveItem={handleRemoveItem} calculateFinalTotal={calculateFinalTotal} accounts={accounts} storeSettings={storeSettings} CurrencyInput={CurrencyInput} Package={Package} invoiceWarehouseId={invoiceWarehouseId} setInvoiceWarehouseId={setInvoiceWarehouseId} warehouses={warehouses} FastBarcodeScanner={FastBarcodeScanner} handleFastBarcodeScan={handleFastBarcodeScan} SearchableSelect={SearchableSelect} handleFastAddProduct={handleFastAddProduct} setIsScannerOpen={setIsScannerOpen} ScanLine={ScanLine} setIsProductModalOpen={setIsProductModalOpen} Box={Box} invoiceTitle={invoiceTitle} sellerInvoiceNumber={sellerInvoiceNumber} setSellerInvoiceNumber={setSellerInvoiceNumber} invoiceMode={invoiceMode} setInvoiceMode={setInvoiceMode} setInvoiceNumber={setInvoiceNumber} setInvoiceTitle={setInvoiceTitle} User={User} activePersonsOnly={activePersonsOnly} getRoleName={getRoleName} customerId={customerId} setCustomerId={setCustomerId} renderPersonInfoBox={renderPersonInfoBox} Wallet={Wallet} invoicePaymentStatus={invoicePaymentStatus} setInvoicePaymentStatus={setInvoicePaymentStatus} setInvoicePaidAmount={setInvoicePaidAmount} DollarSign={DollarSign} invoicePaidAmount={invoicePaidAmount} overallDiscountPercent={overallDiscountPercent} setOverallDiscountPercent={setOverallDiscountPercent} formatCurrency={formatCurrency} invoiceOriginalTotal={invoiceOriginalTotal} invoiceCurrency={invoiceCurrency} invoiceTotalDiscount={invoiceTotalDiscount} numToPersianWords={numToPersianWords} submitting={submitting} saveInvoiceData={saveInvoiceData} handleInvoicePreviewTrigger={handleInvoicePreviewTrigger} formatNumber={formatNumber} Calculator={Calculator} calculateSubtotal={calculateSubtotal} />
        );
      case "create_sale_return":
        return (
          <SaleReturnInvoiceCreate hasDraft={hasDraft} restoreDraft={restoreDraft} clearDraft={clearDraft} successMsg={successMsg} editingInvoiceId={editingInvoiceId} invoiceNumber={invoiceNumber} toPersianDigits={toPersianDigits} date={date} setDate={setDate} persian={persian} persian_fa={persian_fa} items={items} handleItemChange={handleItemChange} products={products} handleRemoveItem={handleRemoveItem} calculateFinalTotal={calculateFinalTotal} storeSettings={storeSettings} CurrencyInput={CurrencyInput} Package={Package} invoiceWarehouseId={invoiceWarehouseId} setInvoiceWarehouseId={setInvoiceWarehouseId} warehouses={warehouses} FastBarcodeScanner={FastBarcodeScanner} handleFastBarcodeScan={handleFastBarcodeScan} SearchableSelect={SearchableSelect} handleFastAddProduct={handleFastAddProduct} setIsScannerOpen={setIsScannerOpen} ScanLine={ScanLine} setIsProductModalOpen={setIsProductModalOpen} Box={Box} invoiceTitle={invoiceTitle} invoiceMode={invoiceMode} setInvoiceMode={setInvoiceMode} setInvoiceNumber={setInvoiceNumber} setInvoiceTitle={setInvoiceTitle} User={User} activePersonsOnly={activePersonsOnly} getRoleName={getRoleName} customerId={customerId} setCustomerId={setCustomerId} renderPersonInfoBox={renderPersonInfoBox} overallDiscountPercent={overallDiscountPercent} setOverallDiscountPercent={setOverallDiscountPercent} formatCurrency={formatCurrency} invoiceOriginalTotal={invoiceOriginalTotal} invoiceCurrency={invoiceCurrency} invoiceTotalDiscount={invoiceTotalDiscount} numToPersianWords={numToPersianWords} submitting={submitting} saveInvoiceData={saveInvoiceData} handleInvoicePreviewTrigger={handleInvoicePreviewTrigger} formatNumber={formatNumber} Plus={Plus} Trash2={Trash2} CheckCircle={CheckCircle} History={History} Save={Save} RefreshCw={RefreshCw} FileText={FileText} Info={Info} Tag={Tag} invoiceType={invoiceType} setInvoiceType={setInvoiceType} DatePicker={DatePicker} invoiceDescription={invoiceDescription} setInvoiceDescription={setInvoiceDescription} invoiceNote={invoiceNote} setInvoiceNote={setInvoiceNote} calculateProductCurrentStock={calculateProductCurrentStock} formatProductStockDetails={formatProductStockDetails} activeTab={activeTab} calculateSubtotal={calculateSubtotal} />
        );


      case "create_sale":
        return (
          <SaleInvoiceCreate hasDraft={hasDraft} restoreDraft={restoreDraft} clearDraft={clearDraft} successMsg={successMsg} editingInvoiceId={editingInvoiceId} invoiceNumber={invoiceNumber} toPersianDigits={toPersianDigits} date={date} setDate={setDate} persian={persian} persian_fa={persian_fa} items={items} handleItemChange={handleItemChange} products={products} handleRemoveItem={handleRemoveItem} calculateFinalTotal={calculateFinalTotal} storeSettings={storeSettings} CurrencyInput={CurrencyInput} Package={Package} invoiceWarehouseId={invoiceWarehouseId} setInvoiceWarehouseId={setInvoiceWarehouseId} warehouses={warehouses} FastBarcodeScanner={FastBarcodeScanner} handleFastBarcodeScan={handleFastBarcodeScan} SearchableSelect={SearchableSelect} handleFastAddProduct={handleFastAddProduct} setIsScannerOpen={setIsScannerOpen} ScanLine={ScanLine} setIsProductModalOpen={setIsProductModalOpen} Box={Box} invoiceTitle={invoiceTitle} invoiceMode={invoiceMode} setInvoiceMode={setInvoiceMode} setInvoiceNumber={setInvoiceNumber} setInvoiceTitle={setInvoiceTitle} User={User} activePersonsOnly={activePersonsOnly} getRoleName={getRoleName} customerId={customerId} setCustomerId={setCustomerId} renderPersonInfoBox={renderPersonInfoBox} overallDiscountPercent={overallDiscountPercent} setOverallDiscountPercent={setOverallDiscountPercent} formatCurrency={formatCurrency} invoiceOriginalTotal={invoiceOriginalTotal} invoiceCurrency={invoiceCurrency} invoiceTotalDiscount={invoiceTotalDiscount} numToPersianWords={numToPersianWords} submitting={submitting} saveInvoiceData={saveInvoiceData} handleInvoicePreviewTrigger={handleInvoicePreviewTrigger} formatNumber={formatNumber} Plus={Plus} Trash2={Trash2} CheckCircle={CheckCircle} History={History} Save={Save} ShoppingCart={ShoppingCart} RefreshCw={RefreshCw} FileText={FileText} Info={Info} Tag={Tag} invoiceType={invoiceType} setInvoiceType={setInvoiceType} DatePicker={DatePicker} invoiceDescription={invoiceDescription} setInvoiceDescription={setInvoiceDescription} invoiceNote={invoiceNote} setInvoiceNote={setInvoiceNote} calculateProductCurrentStock={calculateProductCurrentStock} formatProductStockDetails={formatProductStockDetails} activeTab={activeTab} calculateSubtotal={calculateSubtotal} />
        );

      case "list_sale":
      case "list_sale_return":
      case "list_purchase":
      case "list_purchase_return":
      case "list_warehouse_docs": {
        return (
          <InvoicesList
             invoices={invoices} invoiceSearchQuery={invoiceSearchQuery} setInvoiceSearchQuery={setInvoiceSearchQuery} persons={persons} activeTab={activeTab} setActiveTab={setActiveTab} purchaseFilter={purchaseFilter} setPurchaseFilter={setPurchaseFilter} formatCurrency={formatCurrency} getPersonDisplayName={getPersonDisplayName} formatDateDisplay={formatDateDisplay}  numToPersianWords={numToPersianWords} setInvoiceWarehouseId={setInvoiceWarehouseId} warehouses={warehouses} setCustomerId={setCustomerId}  getRoleName={getRoleName} setEditingInvoiceId={setEditingInvoiceId} handleDeleteInvoice={handleDeleteInvoice}     storeSettings={storeSettings} invoiceCurrentPage={invoiceCurrentPage} setInvoiceCurrentPage={setInvoiceCurrentPage} invoicePageSize={invoicePageSize} setInvoicePageSize={setInvoicePageSize} toPersianDigits={toPersianDigits} listFilter={listFilter} setListFilter={setListFilter} invoiceGroupMode={invoiceGroupMode} setInvoiceGroupMode={setInvoiceGroupMode} List={List} clearDraft={clearDraft} setInvoiceType={setInvoiceType} setWarehouseOperationType={setWarehouseOperationType} Calendar={Calendar} renderPersonLink={renderPersonLink} products={products} setPricingWizardItems={setPricingWizardItems} setPricingWizardInvoice={setPricingWizardInvoice} setSuccessMsg={setSuccessMsg} setReceiptPersonId={setReceiptPersonId} setViewingInvoice={setViewingInvoice} handleEditInvoiceAction={handleEditInvoiceAction} handleVoidInvoice={handleVoidInvoice}
          />
        );
      }
      case "create_receive_receipt":
      case "create_pay_receipt": {
        return (
          <ReceiptPaymentForm
            activeTab={activeTab}
            receiptHasDraft={receiptHasDraft}
            restoreReceiptDraft={restoreReceiptDraft}
            discardReceiptDraft={discardReceiptDraft}
            handleSubmitReceipt={handleSubmitReceipt}
            receiptPersonId={receiptPersonId}
            setReceiptPersonId={setReceiptPersonId}
            persons={persons}
            getPersonDisplayName={getPersonDisplayName}
            receiptMethod={receiptMethod}
            setReceiptMethod={setReceiptMethod}
            accounts={accounts}
            cashboxes={cashboxes}
            receiptAmount={receiptAmount}
            setReceiptAmount={setReceiptAmount}
            receiptDate={receiptDate}
            setReceiptDate={setReceiptDate}
            receiptNumber={receiptNumber}
            receiptCheckNumber={receiptCheckNumber}
            setReceiptCheckNumber={setReceiptCheckNumber}
            receiptCheckDueDate={receiptCheckDueDate}
            setReceiptCheckDueDate={setReceiptCheckDueDate}
            receiptCheckBankName={receiptCheckBankName}
            setReceiptCheckBankName={setReceiptCheckBankName}
            receiptNote={receiptNote}
            setReceiptNote={setReceiptNote}
            formatNumber={formatNumber}
            submittingReceipt={submittingReceipt}
            lastCreatedReceipt={lastCreatedReceipt}
            toPersianDigits={toPersianDigits}
            storeSettings={storeSettings}
            setPrintingTransaction={setPrintingTransaction}
            setLastCreatedReceipt={setLastCreatedReceipt}
            receiptSuccessMsg={receiptSuccessMsg}
            setReceiptLinkedInvoices={setReceiptLinkedInvoices}
            activePersonsOnly={activePersonsOnly}
            mapPersonToOption={mapPersonToOption}
            customPersonFilter={customPersonFilter}
            renderPersonInfoBox={renderPersonInfoBox}
            numToPersianWords={numToPersianWords}
            receiptResourceType={receiptResourceType}
            setReceiptResourceType={setReceiptResourceType}
            receiptResourceId={receiptResourceId}
            setReceiptResourceId={setReceiptResourceId}
            invoices={invoices}
            getDefaultExchangeRate={getDefaultExchangeRate}
            receiptLinkedInvoices={receiptLinkedInvoices}
            formatDateDisplay={formatDateDisplay}
            formatCurrency={formatCurrency}
            customAlert={customAlert}
            receiptCheckbookId={receiptCheckbookId}
            setReceiptCheckbookId={setReceiptCheckbookId}
            checkbooks={checkbooks}
            issuedChecks={issuedChecks}
          />
        );
      }

      case "list_receive_receipt":
      case "list_pay_receipt": {
        return (
          <ReceiptsList
             transactions={transactions} activeTab={activeTab} persons={persons} getPersonDisplayName={getPersonDisplayName} formatCurrency={formatCurrency} formatDateDisplay={formatDateDisplay}  renderPersonLink={renderPersonLink} storeSettings={storeSettings} List={List} setActiveTab={setActiveTab} invoiceSearchQuery={invoiceSearchQuery} setInvoiceSearchQuery={setInvoiceSearchQuery} toPersianDigits={toPersianDigits} accounts={accounts} cashboxes={cashboxes} formatNumber={formatNumber} numToPersianWords={numToPersianWords} openPayslip={openPayslip} setPrintingTransaction={setPrintingTransaction} setEditingReceipt={setEditingReceipt} setIsEditReceiptModalOpen={setIsEditReceiptModalOpen} confirmAction={confirmAction} deleteTransaction={deleteTransaction} fetchTransactions={fetchTransactions}
          />
        );
      }
      case "create_salary_payroll":
        return (
          <CreateSalaryPayroll persian={persian} persian_fa={persian_fa} storeSettings={storeSettings} formatCurrency={formatCurrency} DatePicker={DatePicker} SearchableSelect={SearchableSelect} DollarSign={DollarSign} User={User} Save={Save} RefreshCw={RefreshCw} FileSpreadsheet={FileSpreadsheet} handleSubmitSalary={handleSubmitSalary} activePersonsOnly={activePersonsOnly} getRoleName={getRoleName} salaryPersonId={salaryPersonId} setSalaryPersonId={setSalaryPersonId} renderPersonInfoBox={renderPersonInfoBox} Calendar={Calendar} salaryPeriodMonth={salaryPeriodMonth} setSalaryPeriodMonth={setSalaryPeriodMonth} salaryPeriodYear={salaryPeriodYear} setSalaryPeriodYear={setSalaryPeriodYear} salaryDate={salaryDate} setSalaryDate={setSalaryDate} salaryBaseAmount={salaryBaseAmount} setSalaryBaseAmount={setSalaryBaseAmount} numToPersianWords={numToPersianWords} PlusCircle={PlusCircle} salaryHousingAllowance={salaryHousingAllowance} setSalaryHousingAllowance={setSalaryHousingAllowance} salaryGroceryAllowance={salaryGroceryAllowance} setSalaryGroceryAllowance={setSalaryGroceryAllowance} salaryOtherAllowances={salaryOtherAllowances} setSalaryOtherAllowances={setSalaryOtherAllowances} MinusCircle={MinusCircle} salaryInsuranceDeduction={salaryInsuranceDeduction} setSalaryInsuranceDeduction={setSalaryInsuranceDeduction} salaryTaxDeduction={salaryTaxDeduction} setSalaryTaxDeduction={setSalaryTaxDeduction} salaryOtherDeductions={salaryOtherDeductions} setSalaryOtherDeductions={setSalaryOtherDeductions} Info={Info} salaryDescription={salaryDescription} setSalaryDescription={setSalaryDescription} submittingSalary={submittingSalary} />
        );


      case "list_salary_payroll":
        return (
          <ListSalaryPayroll transactions={transactions} persons={persons} storeSettings={storeSettings} formatCurrency={formatCurrency} Trash2={Trash2} confirmAction={confirmAction} List={List} toPersianDigits={toPersianDigits} renderPersonLink={renderPersonLink} formatDateDisplay={formatDateDisplay} payslips={payslips} numToPersianWords={numToPersianWords} openPayslip={openPayslip} Eye={Eye} deleteTransaction={deleteTransaction} fetchTransactions={fetchTransactions} />
        );


      case "product_categories": {
        return (
          <ProductCategoriesView products={products}
            productCategories={productCategories}
           
            recalculating={recalculating}
            submittingProduct={submittingProduct}
            handleRecalculateStocks={handleRecalculateStocks}
            handleGenerateDemoData={handleGenerateDemoData}
            addProductCategory={addProductCategory}
            updateProductCategory={updateProductCategory}
            deleteProductCategory={deleteProductCategory}
            getProductCategories={getProductCategories}
            setProductCategories={setProductCategories}
            confirmAction={confirmAction}
            setSuccessMsg={setSuccessMsg}
          />
        );
      }
      default:
        return (
          <div className="text-center p-8 bg-white rounded-xl">
            این بخش در حال بازسازی است
          </div>
        );
    }
  };

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
                  setActiveTab("create_receive_receipt");
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
                  setActiveTab("create_pay_receipt");
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
                    {/* Main Content Area */}
          <div
            className={`flex-1 flex flex-col w-full min-w-0 min-h-0 transition-all duration-300 overflow-hidden print:overflow-visible print:bg-white print:h-auto ${isGmailTheme ? "bg-white md:rounded-3xl md:border md:border-slate-200/80 md:m-3 md:shadow-xs" : ""}`}
          >
            {/* Top Header */}
            <div
              className={`flex flex-col sticky top-0 z-[60] print:hidden ${isGmailTheme ? "bg-[#f6f8fc]" : "bg-white border-b border-gray-100 shadow-sm"}`}
            >
              <div
                className={`flex flex-row items-center justify-between p-4 sticky top-0 ${
                  isGmailTheme
                    ? "bg-[#f6f8fc] border-none"
                    : "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-xs"
                }`}
                dir="rtl"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors cursor-pointer shadow-3xs border border-slate-100 bg-white"
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
            <main className="flex-1 overflow-y-auto min-h-0 p-4 md:p-8 bg-slate-50/50 print:overflow-visible print:bg-white print:p-0">
              <div
                className={`mx-auto transition-all duration-300 print:max-w-none print:w-full print:px-0 ${isFullWidth ? "max-w-full xl:px-14" : "max-w-6xl"}`}
              >
                {activeTab === "products" ? (
                  <ProductsTab 
                    products={products}
                    setProducts={setProducts}
                    
                    
                    formatCurrency={formatCurrency}
                    toPersianDigits={toPersianDigits}
                    fetchProducts={fetchProducts}
                    confirmAction={confirmAction}
                    customAlert={customAlert}
                    showNotification={showNotification}
                    handleExportProductsData={handleExportProductsData}
                    handleDownloadProductsTemplate={handleDownloadProductsTemplate}
                    handleImportProductsData={handleImportProductsData}
                    handleDuplicateProduct={handleDuplicateProduct}
                    handleFastBarcodeScan={handleFastBarcodeScan}
                    
                    numToPersianWords={numToPersianWords}
                    DatePicker={DatePicker}
                    persian={persian}
                    persian_fa={persian_fa}
                    storeSettings={storeSettings}
                    user={user}
                    setNewProductSecondaryUnit={setNewProductSecondaryUnit} setNewProductUnitRatio={setNewProductUnitRatio} setNewProductDesc={setNewProductDesc} setProductFormTab={setProductFormTab} setIsProductModalOpen={setIsProductModalOpen} successMsg={successMsg} CheckCircle={CheckCircle} BarcodeIcon={BarcodeIcon} setIsGenerateBarcodesModalOpen={setIsGenerateBarcodesModalOpen} Tag={Tag} productCategories={productCategories} setActiveTab={setActiveTab} productSearchTerm={productSearchTerm} setProductSearchTerm={setProductSearchTerm} setSelectedProductCategory={setSelectedProductCategory} selectedProductCategory={selectedProductCategory} productPageSize={productPageSize} productCurrentPage={productCurrentPage} selectedProductIds={selectedProductIds} setSelectedProductIds={setSelectedProductIds} calculateProductCurrentStock={calculateProductCurrentStock} formatNumber={formatNumber} setViewingProduct={setViewingProduct} setPriceChangeProduct={setPriceChangeProduct} handleEditProduct={handleEditProduct} Edit2={Edit2} setHistoryProductId={setHistoryProductId} Activity={Activity} setPrintingBarcodeProduct={setPrintingBarcodeProduct} Printer={Printer} handleDeleteProduct={handleDeleteProduct} setProductCurrentPage={setProductCurrentPage} AIProductSearchModal={AIProductSearchModal} isAIProductSearchOpen={isAIProductSearchOpen} setIsAIProductSearchOpen={setIsAIProductSearchOpen} handleAIProductsAdd={handleAIProductsAdd} setGroupUpdateType={setGroupUpdateType} setIsGroupPriceModalOpen={setIsGroupPriceModalOpen} Percent={Percent} setShowProductBarcodesList={setShowProductBarcodesList} setIsProductActionsMenuOpen={setIsProductActionsMenuOpen} isProductActionsMenuOpen={isProductActionsMenuOpen} Menu={Menu} ArrowDownToLine={ArrowDownToLine} ArrowUpFromLine={ArrowUpFromLine} FileSpreadsheet={FileSpreadsheet} Sparkles={Sparkles} setIsFastProductModalOpen={setIsFastProductModalOpen} Zap={Zap} setEditingProductId={setEditingProductId} setNewProductName={setNewProductName} setNewProductPrice={setNewProductPrice} setNewProductType={setNewProductType} setNewProductCategoryId={setNewProductCategoryId} setNewProductCode={setNewProductCode} setNewProductBarcode={setNewProductBarcode} setNewProductPurchasePrice={setNewProductPurchasePrice} setNewProductStock={setNewProductStock} setNewProductMinStock={setNewProductMinStock} setNewProductUnit={setNewProductUnit}
                  />
                ) : activeTab === "person_opening_balances" ? (
                  <PersonOpeningBalances 
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
                    filteredPersons={filteredPersons} personPageSize={personPageSize} personCurrentPage={personCurrentPage} calculatePersonBalance={calculatePersonBalance} formatNumber={formatNumber} personSearchTerm={personSearchTerm} setPersonSearchTerm={setPersonSearchTerm} selectedPersonGroup={selectedPersonGroup} setSelectedPersonGroup={setSelectedPersonGroup} personGroups={personGroups} selectedPersonRole={selectedPersonRole} setSelectedPersonRole={setSelectedPersonRole} personRoles={personRoles} personsViewMode={personsViewMode} setPersonsViewMode={setPersonsViewMode} setIsPersonModalOpen={setIsPersonModalOpen} setPersonCurrentPage={setPersonCurrentPage} getRoleBadgeClasses={getRoleBadgeClasses} getRoleName={getRoleName} handleEditPerson={handleEditPerson} setProfilePersonId={setProfilePersonId} setLedgerPersonId={setLedgerPersonId} setRawActiveTab={setRawActiveTab} handleDeletePerson={handleDeletePerson} setPrintingPersonLedger={setPrintingPersonLedger} fetchPersons={fetchPersons} activePersonsOnly={activePersonsOnly} clearDraft={clearDraft} handleGenerateMissingAccountingCodes={handleGenerateMissingAccountingCodes} isGeneratingCodes={isGeneratingCodes} setPersonIOAction={setPersonIOAction} setIsPersonIOModalOpen={setIsPersonIOModalOpen} setEditingPersonId={setEditingPersonId} setNewPersonType={setNewPersonType} setNewPersonTitle={setNewPersonTitle} setNewPersonAlias={setNewPersonAlias} setNewPersonFirstName={setNewPersonFirstName} setNewPersonLastName={setNewPersonLastName} setNewPersonCompanyName={setNewPersonCompanyName} setNewPersonFatherName={setNewPersonFatherName} setNewPersonNationalId={setNewPersonNationalId} setNewPersonAccountingCode={setNewPersonAccountingCode} setNewPersonAddress={setNewPersonAddress} setNewPersonImage={setNewPersonImage} setNewPersonPhone={setNewPersonPhone} setNewPersonRole={setNewPersonRole} setNewPersonInitialBalance={setNewPersonInitialBalance} setNewPersonInitialBalanceType={setNewPersonInitialBalanceType} setNewPersonCreditLimit={setNewPersonCreditLimit} successMsg={successMsg} getPersonDisplayName={getPersonDisplayName} toPersianDigits={toPersianDigits} storeSettings={storeSettings} setCustomerId={setCustomerId} setReceiptPersonId={setReceiptPersonId} setPersonExtraId={setPersonExtraId} setPersonBankName={setPersonBankName} setPersonBankAcc={setPersonBankAcc} setPersonCard={setPersonCard} setPersonSheba={setPersonSheba} setPersonNotes={setPersonNotes} setIsPersonExtraModalOpen={setIsPersonExtraModalOpen} confirmAction={confirmAction} setPersonPageSize={setPersonPageSize} setActiveTab={setActiveTab}
                  />
                ) : activeTab === "person_groups" ? (
                  <PersonGroupsManager showNotification={showNotification} />
                ) : activeTab === "person_roles" ? (
                  <PersonRolesManager showNotification={showNotification} />
                ) : activeTab === "accounts" ? (
                  <AccountsManager
                    fetchAccounts={fetchAccounts}
                    customAlert={customAlert}
                    confirmAction={confirmAction}
                    showNotification={showNotification}
                    formatCurrency={formatCurrency}
                  />
                ) : activeTab === "cashboxes" ? (
                  <CashboxesManager
                    fetchCashboxes={fetchCashboxes}
                    customAlert={customAlert}
                    confirmAction={confirmAction}
                    showNotification={showNotification}
                    formatCurrency={formatCurrency}
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
                      showNotification={showNotification}
                      currentUser={user?.name || "کاربر سیستم"}
                      sendNotification={sendNotification}
                      storeSettings={storeSettings}
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
                  <SettingsTab 
                    storeSettings={storeSettings}
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
                ) : activeTab === "crm_dashboard" ? (
                  <CRMDashboard persons={persons} showNotification={showNotification} />
                ) : activeTab === "analytical_dashboard" ? (
                  <AnalyticalDashboard showNotification={showNotification} />
                ) : activeTab === "sms_panel" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-5xl mx-auto"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          پنل پیامک
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          مدیریت و ارسال پیامک‌های وب‌سرویس یا دستگاه GSM
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActiveTab("settings");
                            setSettingsTab("notification");
                          }}
                          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium text-sm hover:bg-indigo-100 transition-colors"
                        >
                          تنظیمات پیامک
                        </button>
                      </div>
                    </div>

                    <div className="flex border-b border-gray-200 mb-6 gap-6">
                      <button
                        onClick={() => setSmsPanelTab("send_history")}
                        className={`py-3 px-1 font-bold text-sm border-b-2 transition-all ${smsPanelTab === "send_history" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                      >
                        ارسال و تاریخچه پیامک
                      </button>
                      <button
                        onClick={() => setSmsPanelTab("templates")}
                        className={`py-3 px-1 font-bold text-sm border-b-2 transition-all ${smsPanelTab === "templates" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                      >
                        قالب‌های متنی آماده
                      </button>
                    </div>

                    {smsPanelTab === "send_history" ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                          <h3 className="font-bold text-gray-800 mb-4">
                            ارسال پیامک جدید
                          </h3>
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const target = e.target as any;
                              const phone = target.phone.value;
                              const msg = target.message.value;
                              if (!phone || !msg)
                                return customAlert(
                                  "شماره و متن پیامک الزامی است.",
                                );
                              const provider =
                                storeSettings?.notify_method === "gsm"
                                  ? "gsm"
                                  : "sms";
                              await sendNotification(msg, phone, provider);
                              target.reset();
                            }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                شماره موبایل گیرنده
                              </label>
                              <input
                                name="phone"
                                type="text"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                placeholder="09..."
                                dir="ltr"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                متن پیام
                              </label>
                              <textarea
                                name="message"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 h-32"
                                placeholder="متن پیامک خود را بنویسید..."
                                required
                              ></textarea>
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                            >
                              ارسال پیامک
                            </button>
                          </form>
                        </div>
                        <div className="md:col-span-2">
                          <h3 className="font-bold text-gray-800 mb-4">
                            تاریخچه پیامک‌ها
                          </h3>
                          <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl">
                            <table className="w-full text-right text-sm">
                              <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                                  <th className="p-4 font-semibold">گیرنده</th>
                                  <th className="p-4 font-semibold">
                                    متن پیام
                                  </th>
                                  <th className="p-4 font-semibold">وضعیت</th>
                                  <th className="p-4 font-semibold">توسط</th>
                                  <th className="p-4 font-semibold">
                                    تاریخ و زمان
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {smsMessages.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan={5}
                                      className="p-8 text-center text-gray-500"
                                    >
                                      هیچ پیامکی در سیستم ثبت نشده است.
                                    </td>
                                  </tr>
                                ) : (
                                  [...smsMessages]
                                    .sort((a, b) => b.timestamp - a.timestamp)
                                    .map((msg) => (
                                      <tr
                                        key={msg.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                      >
                                        <td
                                          className="p-4 font-bold text-gray-800"
                                          dir="ltr"
                                        >
                                          {msg.recipient}
                                        </td>
                                        <td
                                          className="p-4 text-gray-600 max-w-xs truncate"
                                          title={msg.message}
                                        >
                                          {msg.message}
                                        </td>
                                        <td className="p-4">
                                          <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${msg.status === "sent" ? "bg-emerald-100 text-emerald-700" : msg.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}
                                          >
                                            {msg.status === "sent"
                                              ? "ارسال شده"
                                              : msg.status === "pending"
                                                ? "در انتظار"
                                                : "خطا"}
                                          </span>
                                        </td>
                                        <td className="p-4">
                                          <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${msg.provider === "online" || msg.provider === "sms" ? "bg-blue-100 text-blue-700" : msg.provider === "gsm" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}
                                          >
                                            {msg.provider === "sms" ||
                                            msg.provider === "online"
                                              ? "وب‌سرویس"
                                              : msg.provider === "gsm"
                                                ? "دستگاه GSM"
                                                : "نامشخص"}
                                          </span>
                                        </td>
                                        <td
                                          className="p-4 text-gray-500"
                                          dir="ltr"
                                        >
                                          {new Date(
                                            msg.timestamp,
                                          ).toLocaleString("fa-IR")}
                                        </td>
                                      </tr>
                                    ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-gray-800">
                            قالب‌های متنی پیامک
                          </h3>
                          <button
                            onClick={async () => {
                              await saveStoreSettings(storeSettings);
                              setSuccessMsg(
                                "قالب‌های پیامک با موفقیت ذخیره شدند.",
                              );
                            }}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            ذخیره قالب‌ها
                          </button>
                        </div>

                        <div className="space-y-8">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              قالب فاکتور فروش
                            </label>
                            <div className="text-xs text-gray-500 mb-2 space-y-1">
                              <p>متغیرهای قابل استفاده:</p>
                              <div className="flex flex-wrap gap-2" dir="ltr">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{name}`}</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{amount}`}</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{invoice_number}`}</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{date}`}</span>
                              </div>
                            </div>
                            <textarea
                              value={storeSettings?.smsTemplateInvoice || ""}
                              onChange={(e) =>
                                setStoreSettings({
                                  ...storeSettings,
                                  smsTemplateInvoice: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 h-24 text-sm"
                              placeholder="مثال: جناب/سرکار {name}، فاکتور شما به شماره {invoice_number} و مبلغ {amount} ثبت شد."
                            ></textarea>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              قالب رسید دریافت وجه
                            </label>
                            <div className="text-xs text-gray-500 mb-2 space-y-1">
                              <p>متغیرهای قابل استفاده:</p>
                              <div className="flex flex-wrap gap-2" dir="ltr">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{name}`}</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{amount}`}</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{receipt_number}`}</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{date}`}</span>
                              </div>
                            </div>
                            <textarea
                              value={storeSettings?.smsTemplateReceipt || ""}
                              onChange={(e) =>
                                setStoreSettings({
                                  ...storeSettings,
                                  smsTemplateReceipt: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 h-24 text-sm"
                              placeholder="مثال: جناب/سرکار {name}، مبلغ {amount} طی رسید شماره {receipt_number} دریافت شد."
                            ></textarea>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              قالب یادآوری سررسید چک
                            </label>
                            <div className="text-xs text-gray-500 mb-2 space-y-1">
                              <p>متغیرهای قابل استفاده:</p>
                              <div className="flex flex-wrap gap-2" dir="ltr">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{name}`}</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{amount}`}</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{check_number}`}</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{`{due_date}`}</span>
                              </div>
                            </div>
                            <textarea
                              value={storeSettings?.smsTemplateCheck || ""}
                              onChange={(e) =>
                                setStoreSettings({
                                  ...storeSettings,
                                  smsTemplateCheck: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 h-24 text-sm"
                              placeholder="مثال: جناب/سرکار {name}، یادآوری چک شماره {check_number} به مبلغ {amount} در تاریخ {due_date}."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
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
                ) : activeTab === "update" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden max-w-3xl mx-auto"
                  >
                    <div className="bg-gradient-to-r from-indigo-50/50 to-slate-50/30 px-6 py-5 border-b border-gray-100">
                      <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin-slow" />
                        بروزرسانی هوشمند سیستم
                      </h2>
                      <p className="mt-2 text-xs font-semibold text-gray-500 leading-relaxed">
                        این بخش به صورت زنده و کاملاً خودکار فایل‌ها، جداول
                        پایگاه داده و بهبودهای جدید هسته سیستم حسابداری را
                        دریافت و بر روی سرور شما مستقر می‌سازد. لطفاً در حین
                        فرآیند بروزرسانی از بستن پنجره خودداری کنید.
                      </p>
                    </div>
                    <div className="p-8 flex flex-col items-center">
                      {/* Progress indicators with stepwise checkpoints */}
                      {updatingStr || updateProgress > 0 ? (
                        <div className="w-full space-y-6 mb-8" dir="rtl">
                          {/* Progress Bar Header */}
                          <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                            <span className="text-indigo-600 font-extrabold flex items-center gap-2.5">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1.5,
                                  ease: "linear",
                                }}
                                className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full"
                              />
                              {updateStepName}
                            </span>
                            <span className="font-mono bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-0.5 rounded-full font-extrabold text-[13px]">
                              {updateProgress}%
                            </span>
                          </div>

                          {/* Progress Line */}
                          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner border border-gray-200">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${updateProgress}%` }}
                              transition={{ duration: 0.1 }}
                              className="bg-indigo-600 h-full rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]"
                            />
                          </div>

                          {/* Step-by-step visual checkboxes */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            {/* Step 1 */}
                            <div
                              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                                updateStepsStatus.connecting === "success"
                                  ? "bg-emerald-50/40 border-emerald-100 text-emerald-800"
                                  : updateStepsStatus.connecting === "running"
                                    ? "bg-indigo-50/40 border-indigo-100 text-indigo-800 shadow-sm"
                                    : updateStepsStatus.connecting === "error"
                                      ? "bg-rose-50 border-rose-100 text-rose-800"
                                      : "bg-slate-50/50 border-slate-100 text-slate-400"
                              }`}
                            >
                              <span className="text-xs font-bold">
                                ۱. اتصال ایمن به هسته سرور
                              </span>
                              {updateStepsStatus.connecting === "success" ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : updateStepsStatus.connecting === "running" ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1,
                                    ease: "linear",
                                  }}
                                  className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full shrink-0"
                                />
                              ) : updateStepsStatus.connecting === "error" ? (
                                <X className="w-4 h-4 text-rose-500 shrink-0" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                              )}
                            </div>

                            {/* Step 2 */}
                            <div
                              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                                updateStepsStatus.checking === "success"
                                  ? "bg-emerald-50/40 border-emerald-100 text-emerald-800"
                                  : updateStepsStatus.checking === "running"
                                    ? "bg-indigo-50/40 border-indigo-100 text-indigo-800 shadow-sm"
                                    : updateStepsStatus.checking === "error"
                                      ? "bg-rose-50 border-rose-100 text-rose-800"
                                      : "bg-slate-50/50 border-slate-100 text-slate-400"
                              }`}
                            >
                              <span className="text-xs font-bold">
                                ۲. تحلیل تفاوت ساختار فایل‌ها
                              </span>
                              {updateStepsStatus.checking === "success" ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : updateStepsStatus.checking === "running" ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1,
                                    ease: "linear",
                                  }}
                                  className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full shrink-0"
                                />
                              ) : updateStepsStatus.checking === "error" ? (
                                <X className="w-4 h-4 text-rose-500 shrink-0" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                              )}
                            </div>

                            {/* Step 3 */}
                            <div
                              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                                updateStepsStatus.downloading === "success"
                                  ? "bg-emerald-50/40 border-emerald-100 text-emerald-800"
                                  : updateStepsStatus.downloading === "running"
                                    ? "bg-indigo-50/40 border-indigo-100 text-indigo-800 shadow-sm"
                                    : updateStepsStatus.downloading === "error"
                                      ? "bg-rose-50 border-rose-100 text-rose-800"
                                      : "bg-slate-50/50 border-slate-100 text-slate-400"
                              }`}
                            >
                              <span className="text-xs font-bold">
                                ۳. دانلود و الحاق ملحقات جدید
                              </span>
                              {updateStepsStatus.downloading === "success" ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : updateStepsStatus.downloading ===
                                "running" ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1,
                                    ease: "linear",
                                  }}
                                  className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full shrink-0"
                                />
                              ) : updateStepsStatus.downloading === "error" ? (
                                <X className="w-4 h-4 text-rose-500 shrink-0" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                              )}
                            </div>

                            {/* Step 4 */}
                            <div
                              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                                updateStepsStatus.verifying === "success"
                                  ? "bg-emerald-50/40 border-emerald-100 text-emerald-800"
                                  : updateStepsStatus.verifying === "running"
                                    ? "bg-indigo-50/40 border-indigo-100 text-indigo-800 shadow-sm"
                                    : updateStepsStatus.verifying === "error"
                                      ? "bg-rose-50 border-rose-100 text-rose-800"
                                      : "bg-slate-50/50 border-slate-100 text-slate-400"
                              }`}
                            >
                              <span className="text-xs font-bold">
                                ۴. ری‌استارت ایمن دیتابیس
                              </span>
                              {updateStepsStatus.verifying === "success" ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : updateStepsStatus.verifying === "running" ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1,
                                    ease: "linear",
                                  }}
                                  className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full shrink-0"
                                />
                              ) : updateStepsStatus.verifying === "error" ? (
                                <X className="w-4 h-4 text-rose-500 shrink-0" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full text-center space-y-4 mb-8 p-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                          <RefreshCw className="w-10 h-10 text-slate-350 mx-auto animate-spin-slow" />
                          <div>
                            <p className="text-xs text-slate-500 font-extrabold">
                              بسته‌های بروزرسانی هسته حسابداری به صورت خودکار
                              تطبیق داده می‌شوند.
                            </p>
                          </div>
                        </div>
                      )}

                      {!updatingStr &&
                        latestCommits &&
                        latestCommits.length > 0 && (
                          <div className="w-full mb-8" dir="rtl">
                            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-500" />
                              لیست تغییرات بسته آپدیت
                            </h3>
                            <div className="space-y-3">
                              {latestCommits.map(
                                (commitData: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="bg-white border text-right border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <p className="text-sm font-bold text-gray-800 mb-2 truncate">
                                      {commitData.commit?.message?.split("\n")[0] || "بروزرسانی سیستم"}
                                    </p>
                                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                                      <span className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                          <Shield className="w-3 h-3" />
                                        </div>
                                        تیم توسعه مرکز
                                      </span>
                                      <span className="font-sans font-bold text-indigo-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                        {new Date(
                                          commitData.commit?.author?.date,
                                        ).toLocaleDateString(
                                          storeSettings?.calendarType ===
                                            "gregorian"
                                            ? "en-US"
                                            : "fa-IR",
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-xs font-bold flex items-start gap-3 w-full">
                              <AlertCircle className="w-5 h-5 shrink-0" />
                              <p className="leading-relaxed text-right">
                                تغییرات فوق در نسخه جدید اعمال شده‌اند. در صورت
                                تایید، می‌توانید با دکمه زیر سیستم را اسکن و
                                آپدیت کنید.
                              </p>
                            </div>
                          </div>
                        )}

                      {updateLog && (
                        <div className="mb-8 p-5 bg-indigo-50/45 text-indigo-900 border border-indigo-100/50 rounded-xl w-full text-xs font-black leading-relaxed whitespace-pre-wrap flex items-start gap-3 shadow-2xs">
                          <div className="p-1.5 bg-indigo-100/70 rounded-lg shrink-0 text-indigo-650">
                            <FileText className="w-4.5 h-4.5" />
                          </div>
                          <div
                            className="font-bold text-right leading-relaxed flex-1"
                            dir="rtl"
                          >
                            {updateLog}
                          </div>
                        </div>
                      )}

                      {latestCommits.length > 0 ||
                      checkingUpdateVersion ||
                      updatingStr ? (
                        <button
                          id="auto-update-btn"
                          onClick={handleSystemUpdate}
                          disabled={updatingStr || checkingUpdateVersion}
                          className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[240px] cursor-pointer"
                        >
                          {updatingStr || checkingUpdateVersion ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  ease: "linear",
                                }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              />
                              <span>در حال بررسی وضعیت سیستم...</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-5 h-5" />
                              <span>دریافت و بروزرسانی به آخرین نسخه</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-4 items-center w-full justify-center mt-4">
                          <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-bold flex items-center gap-3 justify-center text-center flex-1">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                            شما در حال استفاده از آخرین و جدیدترین نسخه سیستم
                            هستید. نیازی به بروزرسانی نیست.
                          </div>
                          <button
                            onClick={() => {
                              setCheckingUpdateVersion(false);
                              setHasPromptedUpdate(false);
                              setLatestCommits([]);
                              localStorage.removeItem("localCommitSha");
                            }}
                            className="px-6 py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <RefreshCw className="w-5 h-5" />
                            بررسی مجدد و اسکن مستقیم
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : activeTab === "quick_price_inquiry" ? (
                  <QuickPriceInquiry products={products}
                   
                    settings={storeSettings}
                  />
                ) : activeTab === "product_view" ? (
                  viewingProduct ? (
                    <ProductCardModal
                      product={viewingProduct}
                      warehouses={warehouses}
                      currency={storeSettings?.currency || "تومان"}
                      isModal={false}
                      onClose={() => {
                        setViewingProduct(null);
                      }}
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto mt-10"
                    >
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Package className="w-8 h-8 text-indigo-600" />
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
                          value=""
                          onChange={(val) => {
                            const p = products.find(
                              (prod) => prod.id.toString() === val,
                            );
                            if (p) setViewingProduct(p);
                          }}
                          placeholder="جستجو کالا (نام، کد، بارکد)..."
                          searchPlaceholder="نام، کد یا بارکد کالا را وارد کنید..."
                        />
                      </div>
                      <div className="mt-8 text-center text-gray-500 text-sm">
                        جهت مشاهده تاریخچه و گردش کالا، جستجو و انتخاب کنید
                      </div>
                    </motion.div>
                  )
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
                  "product_view",
                  "persons",
                  "accounts",
                  "cashboxes",
                  "settings",
                  "financial_report",
                  "analytical_dashboard",
                  "person_ledger",
                  "inventory_report",
                  "database",
                  "update",
                  "checklist",
                  "check_panel",
                  "check_panel",
                  "checkbooks",
                  "issued_checks",
                  "received_checks",
                  "check_calendar",
                  "check_charts",
                  "transfer",
                  "quick_refund",
                  "stocktaking",
                  "financial_years",
                  "chart_of_accounts",
                  "accounting_docs_list",
                  "accounting_doc_create",
                  "accounting_doc_view",
                  "accounting_auto_sync",
                  "accounting_verification",
                  "accounting_opening_balances",
                ].includes(activeTab) && renderTabContent()}
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
                            ].map((fmt) => (
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

              {isProductModalOpen && (
                <div key="isProductModalOpen-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col"
                  >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-500" />
                        ثبت کالا / خدمات جدید
                      </h3>
                      <button
                        onClick={() => setIsProductModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-0 overflow-y-auto flex-1">
                      <div className="flex border-b border-gray-200 px-6 pt-4 gap-6 sticky top-0 bg-white z-10">
                        <button
                          type="button"
                          onClick={() => setProductFormTab("general")}
                          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${productFormTab === "general" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                        >
                          اطلاعات عمومی
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductFormTab("financial")}
                          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${productFormTab === "financial" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                        >
                          اطلاعات مالی
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductFormTab("inventory")}
                          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${productFormTab === "inventory" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                        >
                          انبار و تکمیلی
                        </button>
                        {editingProductId && (
                          <button
                            type="button"
                            onClick={() => setProductFormTab("history")}
                            className={`pb-3 font-bold text-sm border-b-2 transition-colors ${productFormTab === "history" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                          >
                            تاریخچه قیمت‌ها
                          </button>
                        )}
                      </div>

                      <form
                        id="productForm"
                        onSubmit={(e) => {
                          e.preventDefault();
                          confirmAction(
                            "آیا از ثبت اطلاعات کالا/خدمات اطمینان دارید؟",
                            () => handleSubmitProduct(e as any),
                          );
                        }}
                        className="p-6"
                      >
                        {/* General Info Tab */}
                        {productFormTab === "general" && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="w-full md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  عنوان کالا / خدمات{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={newProductName}
                                  onChange={(e) =>
                                    setNewProductName(e.target.value)
                                  }
                                  placeholder="مثال: گوشی موبایل سامسونگ S23"
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 bg-gray-50 focus:bg-white"
                                  required
                                />
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  نوع <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={newProductType}
                                  onChange={(e) =>
                                    setNewProductType(
                                      e.target.value as "product" | "service",
                                    )
                                  }
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 bg-white"
                                >
                                  <option value="product">کالا (فیزیکی)</option>
                                  <option value="service">
                                    خدمات (غیرفیزیکی)
                                  </option>
                                </select>
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  گروه‌بندی
                                </label>
                                <select
                                  value={newProductCategoryId}
                                  onChange={(e) =>
                                    setNewProductCategoryId(e.target.value)
                                  }
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 bg-white"
                                >
                                  <option value="">بدون گروه (عمومی)</option>
                                  {productCategories.map((cat) => (
                                    <option key={cat.id || `cat-${Math.random()}`} value={cat.id}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                              <h4 className="text-sm font-black text-blue-800 mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                تعریف واحد شمارش
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="w-full">
                                  <label className="block text-xs font-bold text-blue-800 mb-2">
                                    واحد اصلی (کوچکترین جزء)
                                  </label>
                                  <input
                                    type="text"
                                    value={newProductUnit}
                                    onChange={(e) =>
                                      setNewProductUnit(e.target.value)
                                    }
                                    placeholder="مثال: عدد، کیلوگرم"
                                    className="w-full px-3 py-2.5 rounded-lg border border-blue-200 focus:ring-max focus:ring-blue-500 shadow-sm text-sm"
                                  />
                                </div>
                                <div className="w-full">
                                  <label className="block text-xs font-bold text-blue-800 mb-2">
                                    واحد فرعی (بسته‌بندی بزرگتر)
                                  </label>
                                  <input
                                    type="text"
                                    value={newProductSecondaryUnit}
                                    onChange={(e) =>
                                      setNewProductSecondaryUnit(e.target.value)
                                    }
                                    placeholder="مثال: کارتن، بسته"
                                    className="w-full px-3 py-2.5 rounded-lg border border-blue-200 focus:ring-max focus:ring-blue-500 shadow-sm text-sm"
                                  />
                                  <p className="text-[10px] text-blue-600 mt-1 opacity-80">
                                    (اختیاری)
                                  </p>
                                </div>
                                <div className="w-full">
                                  <label className="block text-xs font-bold text-blue-800 mb-2">
                                    ضریب تبدیل (هر واحد فرعی چند واحد اصلی است؟)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={newProductUnitRatio}
                                    onChange={(e) =>
                                      setNewProductUnitRatio(e.target.value)
                                    }
                                    placeholder="مثال: 2.5 یا 24"
                                    className="w-full px-3 py-2.5 rounded-lg border border-blue-200 focus:ring-max focus:ring-blue-500 shadow-sm text-sm"
                                    disabled={!newProductSecondaryUnit}
                                  />
                                  {newProductSecondaryUnit &&
                                    newProductUnitRatio &&
                                    Number(newProductUnitRatio) > 0 &&
                                    newProductUnit && (
                                      <p className="text-xs font-bold text-emerald-600 mt-2">
                                        1 {newProductSecondaryUnit} ={" "}
                                        {newProductUnitRatio} {newProductUnit}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Financial Info Tab */}
                        {productFormTab === "financial" && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="w-full md:col-span-2">
                                <label className="block text-sm font-bold text-emerald-950 mb-2">
                                  تاریخ ثبت / تغییر قیمت
                                </label>
                                <input
                                  type="date"
                                  value={newProductPriceDate}
                                  onChange={(e) => setNewProductPriceDate(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors text-emerald-900 font-mono text-left bg-white"
                                />
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-bold text-emerald-950 mb-2">
                                  قیمت خرید بر اساس کوچکترین واحد (
                                  {newProductUnit || "واحد اصلی"}) (
                                  {storeSettings?.currency || "تومان"})
                                </label>
                                <CurrencyInput
                                  value={newProductPurchasePrice}
                                  onChange={(e: any) =>
                                    setNewProductPurchasePrice(e.target.value)
                                  }
                                  placeholder="مثال: 100000"
                                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors text-emerald-900 font-mono text-left font-bold bg-white"
                                />
                                {newProductSecondaryUnit &&
                                  newProductUnitRatio &&
                                  Number(newProductUnitRatio) > 0 &&
                                  newProductPurchasePrice && (
                                    <p className="text-xs font-bold text-emerald-700 mt-1.5 bg-emerald-100/50 px-3 py-1.5 rounded-lg border border-emerald-200">
                                      معادل{" "}
                                      <span className="font-mono text-sm font-black text-indigo-700">
                                        {formatNumber(
                                          Number(
                                            newProductPurchasePrice.replace(
                                              /,/g,
                                              "",
                                            ),
                                          ) * Number(newProductUnitRatio),
                                        )}
                                      </span>{" "}
                                      {storeSettings?.currency || "تومان"} به
                                      ازای هر{" "}
                                      <span className="underline">
                                        {newProductSecondaryUnit}
                                      </span>{" "}
                                      (ضریب {newProductUnitRatio})
                                    </p>
                                  )}
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-bold text-emerald-950 mb-2">
                                  قیمت فروش بر اساس کوچکترین واحد (
                                  {newProductUnit || "واحد اصلی"}) (
                                  {storeSettings?.currency || "تومان"})
                                </label>
                                <CurrencyInput
                                  value={newProductPrice}
                                  onChange={(e: any) =>
                                    setNewProductPrice(e.target.value)
                                  }
                                  placeholder="مثال: 150000"
                                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors text-emerald-900 font-mono text-left font-bold bg-white"
                                />
                                {newProductSecondaryUnit &&
                                  newProductUnitRatio &&
                                  Number(newProductUnitRatio) > 0 &&
                                  newProductPrice && (
                                    <p className="text-xs font-bold text-indigo-700 mt-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                      معادل{" "}
                                      <span className="font-mono text-sm font-black text-indigo-800">
                                        {formatNumber(
                                          Number(
                                            newProductPrice.replace(/,/g, ""),
                                          ) * Number(newProductUnitRatio),
                                        )}
                                      </span>{" "}
                                      {storeSettings?.currency || "تومان"} به
                                      ازای هر{" "}
                                      <span className="underline">
                                        {newProductSecondaryUnit}
                                      </span>{" "}
                                      (ضریب {newProductUnitRatio})
                                    </p>
                                  )}
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-xl">
                              <div>
                                <p className="text-sm font-bold text-gray-700">
                                  حاشیه سود حدودی:
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  تفاوت قیمت فروش و خرید
                                </p>
                              </div>
                              <div
                                className="font-mono text-lg font-black text-indigo-600"
                                dir="ltr"
                              >
                                {newProductPrice && newProductPurchasePrice ? (
                                  (() => {
                                    const diff =
                                      Number(newProductPrice) -
                                      Number(newProductPurchasePrice);
                                    const percent =
                                      Number(newProductPurchasePrice) > 0
                                        ? (
                                            (diff /
                                              Number(newProductPurchasePrice)) *
                                            100
                                          ).toFixed(1)
                                        : 100;
                                    return (
                                      <span
                                        className={
                                          diff > 0
                                            ? "text-emerald-600"
                                            : "text-rose-600"
                                        }
                                      >
                                        {formatNumber(diff)}{" "}
                                        {storeSettings.currency}{" "}
                                        <span className="text-sm">
                                          ({percent}%)
                                        </span>
                                      </span>
                                    );
                                  })()
                                ) : (
                                  <span className="text-gray-400">---</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Inventory & Advanced Tab */}
                        {productFormTab === "inventory" && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {newProductType === "product" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <div className="w-full">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    انبار مرجع
                                  </label>
                                  <select
                                    value={newProductWarehouseId}
                                    onChange={(e) =>
                                      setNewProductWarehouseId(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 bg-white"
                                  >
                                    <option value="">
                                      بدون انبار (موجودی کلی)
                                    </option>
                                    {warehouses
                                      .filter((w) => w.isActive)
                                      .map((wh) => (
                                        <option key={wh.id || `wh-${Math.random()}`} value={wh.id}>
                                          {wh.name}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                                <div className="w-full">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    موجودی اولیه در انبار
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={newProductStock}
                                    onChange={(e) =>
                                      setNewProductStock(e.target.value)
                                    }
                                    placeholder="تعداد در انبار"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 font-mono text-left"
                                  />
                                </div>
                                <div className="w-full">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    حداقل موجودی (هشدار شارژ)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={newProductMinStock}
                                    onChange={(e) =>
                                      setNewProductMinStock(e.target.value)
                                    }
                                    placeholder="مثال: 5"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 font-mono text-left"
                                  />
                                </div>
                                <div className="w-full">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    کد کالا (سیستمی)
                                  </label>
                                  <input
                                    type="text"
                                    value={newProductCode}
                                    onChange={(e) =>
                                      setNewProductCode(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 font-mono text-left"
                                    dir="ltr"
                                  />
                                </div>
                                <div className="w-full">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    بارکد
                                  </label>
                                  <input
                                    type="text"
                                    value={newProductBarcode}
                                    onChange={(e) =>
                                      setNewProductBarcode(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 font-mono text-left tracking-widest"
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                            )}

                            <div className="w-full">
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                توضیحات تکمیلی
                              </label>
                              <textarea
                                value={newProductDesc}
                                onChange={(e) =>
                                  setNewProductDesc(e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 min-h-[100px] resize-y"
                                rows={3}
                                placeholder="توضیحات کالا که ممکن است در فاکتور چاپ شود..."
                              />
                            </div>
                          </div>
                        )}

                        {/* History Tab */}
                        {productFormTab === "history" && (
                          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            
                            {/* Purchase Price History */}
                            <div className="space-y-3">
                              <h3 className="text-lg font-extrabold text-gray-900">
                                تاریخچه تغییرات قیمت خرید
                              </h3>
                              <div className="bg-white border flex-1 border-gray-100 shadow-sm rounded-xl overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                  <thead className="bg-gray-50/50">
                                    <tr>
                                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">
                                        تاریخ و زمان
                                      </th>
                                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">
                                        قیمت خرید
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {(() => {
                                      const purchaseHistory = currentProductPriceHistory.filter(h => h.type === 'purchase');
                                      if (purchaseHistory.length === 0) {
                                        return (
                                          <tr>
                                            <td
                                              colSpan={2}
                                              className="text-center py-6 text-sm text-gray-500"
                                            >
                                              تاریخچه‌ای برای این کالا ثبت نشده
                                              است.
                                            </td>
                                          </tr>
                                        );
                                      }
                                      return purchaseHistory
                                        .sort(
                                          (a, b) =>
                                            new Date(b.date).getTime() -
                                            new Date(a.date).getTime(),
                                        )
                                        .map((h, i) => (
                                          <tr
                                            key={i}
                                            className="hover:bg-slate-50"
                                          >
                                            <td className="px-4 py-3 text-sm text-gray-700" dir="ltr">
                                              {editingHistoryId === h.id ? (
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="date"
                                                    value={editingHistoryDate.split('T')[0]}
                                                    onChange={(e) => setEditingHistoryDate(e.target.value)}
                                                    className="w-full px-2 py-1 rounded border border-gray-300 text-sm"
                                                  />
                                                </div>
                                              ) : (
                                                new Date(h.date).toLocaleString("fa-IR")
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900 flex justify-between items-center">
                                              <span>{addCommas(h.price)}</span>
                                              {editingHistoryId === h.id ? (
                                                <div className="flex gap-2">
                                                  <button onClick={() => handleSaveHistoryDate(h)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                                    <Check className="w-4 h-4" />
                                                  </button>
                                                  <button onClick={() => setEditingHistoryId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                                                    <X className="w-4 h-4" />
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={() => {
                                                    setEditingHistoryId(h.id);
                                                    setEditingHistoryDate(h.date);
                                                  }}
                                                  className="text-gray-400 hover:text-indigo-600 p-1 rounded"
                                                >
                                                  <Pencil className="w-4 h-4" />
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        ));
                                    })()}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Sale Price History */}
                            <div className="space-y-3">
                              <h3 className="text-lg font-extrabold text-gray-900">
                                تاریخچه تغییرات قیمت فروش
                              </h3>
                              <div className="bg-white border flex-1 border-gray-100 shadow-sm rounded-xl overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                  <thead className="bg-gray-50/50">
                                    <tr>
                                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">
                                        تاریخ و زمان
                                      </th>
                                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">
                                        قیمت فروش
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {(() => {
                                      const saleHistory = currentProductPriceHistory.filter(h => h.type === 'sale');
                                      if (saleHistory.length === 0) {
                                        return (
                                          <tr>
                                            <td
                                              colSpan={2}
                                              className="text-center py-6 text-sm text-gray-500"
                                            >
                                              تاریخچه‌ای برای این کالا ثبت نشده
                                              است.
                                            </td>
                                          </tr>
                                        );
                                      }
                                      return saleHistory
                                        .sort(
                                          (a, b) =>
                                            new Date(b.date).getTime() -
                                            new Date(a.date).getTime(),
                                        )
                                        .map((h, i) => (
                                          <tr
                                            key={i}
                                            className="hover:bg-slate-50"
                                          >
                                            <td className="px-4 py-3 text-sm text-gray-700" dir="ltr">
                                              {editingHistoryId === h.id ? (
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="date"
                                                    value={editingHistoryDate.split('T')[0]}
                                                    onChange={(e) => setEditingHistoryDate(e.target.value)}
                                                    className="w-full px-2 py-1 rounded border border-gray-300 text-sm"
                                                  />
                                                </div>
                                              ) : (
                                                new Date(h.date).toLocaleString("fa-IR")
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900 flex justify-between items-center">
                                              <span>{addCommas(h.price)}</span>
                                              {editingHistoryId === h.id ? (
                                                <div className="flex gap-2">
                                                  <button onClick={() => handleSaveHistoryDate(h)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                                    <Check className="w-4 h-4" />
                                                  </button>
                                                  <button onClick={() => setEditingHistoryId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                                                    <X className="w-4 h-4" />
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={() => {
                                                    setEditingHistoryId(h.id);
                                                    setEditingHistoryDate(h.date);
                                                  }}
                                                  className="text-gray-400 hover:text-indigo-600 p-1 rounded"
                                                >
                                                  <Pencil className="w-4 h-4" />
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        ));
                                    })()}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Hidden required fields for HTML5 validation validation to still work across tabs */}
                        <div className="hidden">
                          <input
                            type="text"
                            required
                            value={newProductName}
                            onChange={() => {}}
                          />
                        </div>
                      </form>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => setIsProductModalOpen(false)}
                        className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors shadow-sm"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        form="productForm"
                        disabled={submittingProduct}
                        className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submittingProduct ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                        <span>ثبت کالا / خدمات</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {isPersonExtraModalOpen && (
                <div key="isPersonExtraModalOpen-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-lg flex flex-col"
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
                    <div className="p-6">
                      <form
                        id="personExtraForm"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          confirmAction(
                            "آیا از ذخیره اطلاعات بانکی و تکمیلی اطمینان دارید؟",
                            async () => {
                              if (personExtraId) {
                                const existing = persons.find(
                                  (p) => p.id === personExtraId,
                                );
                                if (existing) {
                                  const updated = await updatePerson(
                                    personExtraId as string,
                                    {
                                      ...existing,
                                      bankName: personBankName,
                                      bankAccountNumber: personBankAcc,
                                      cardNumber: personCard,
                                      shebaNumber: personSheba,
                                      additionalNotes: personNotes,
                                    },
                                  );
                                  if (updated) {
                                    setPersons(
                                      (persons || []).map((p, index) =>
                                        p.id === personExtraId ? updated : p,
                                      ),
                                    );
                                  }
                                }
                              }
                              setIsPersonExtraModalOpen(false);
                            },
                          );
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              نام بانک
                            </label>
                            <input
                              type="text"
                              value={personBankName}
                              onChange={(e) =>
                                setPersonBankName(e.target.value)
                              }
                              className="w-full px-4 py-2 border rounded-xl"
                              placeholder="مثال: ملت"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              شماره حساب
                            </label>
                            <input
                              type="text"
                              value={personBankAcc}
                              onChange={(e) => setPersonBankAcc(e.target.value)}
                              className="w-full px-4 py-2 border rounded-xl"
                              dir="ltr"
                              placeholder="123456789"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              شماره کارت
                            </label>
                            <input
                              type="text"
                              value={personCard}
                              onChange={(e) => setPersonCard(e.target.value)}
                              className="w-full px-4 py-2 border rounded-xl"
                              dir="ltr"
                              placeholder="6104-337X-XXXX-XXXX"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              شماره شبا
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-mono">
                                IR
                              </span>
                              <input
                                type="text"
                                value={personSheba}
                                onChange={(e) => setPersonSheba(e.target.value)}
                                className="w-full px-4 py-2 pl-9 border rounded-xl text-left"
                                dir="ltr"
                                placeholder="123456..."
                              />
                            </div>
                          </div>
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
              {isPersonModalOpen && (
                <div key="isPersonModalOpen-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col"
                  >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-500" />
                        ثبت شخص جدید
                      </h3>
                      <button
                        onClick={() => setIsPersonModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex border-b border-gray-100 mt-2 px-6">
                      <button
                        type="button"
                        onClick={() => setPersonModalActiveTab("basic")}
                        className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors cursor-pointer ${personModalActiveTab === "basic" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        اطلاعات پایه
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonModalActiveTab("contact")}
                        className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors cursor-pointer ${personModalActiveTab === "contact" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        اطلاعات تماس
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonModalActiveTab("financial")}
                        className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors cursor-pointer ${personModalActiveTab === "financial" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        وضعیت مالی اولیه (افتتاحیه)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonModalActiveTab("settings")}
                        className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors cursor-pointer ${personModalActiveTab === "settings" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        تنظیمات و وضعیت
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                      <form
                        id="personForm"
                        onSubmit={(e) => {
                          e.preventDefault();
                          confirmAction(
                            "آیا از ثبت اطلاعات شخص اطمینان دارید؟",
                            () => handleSubmitPerson(e as any),
                          );
                        }}
                        className="flex flex-col gap-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {personModalActiveTab === "basic" && (
                            <>
                              <div className="w-full text-right md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-4 rounded-xl border border-slate-100 items-center">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-white">
                                    {newPersonImage ? (
                                      <img
                                        src={newPersonImage}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <User className="w-8 h-8 text-gray-300" />
                                    )}
                                    <input
                                      type="file"
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      accept="image/*"
                                      onChange={(e) => {
                                        if (
                                          e.target.files &&
                                          e.target.files.length > 0
                                        ) {
                                          const file = e.target.files[0];
                                          const reader = new FileReader();
                                          reader.onload = (event) => {
                                            if (
                                              event.target &&
                                              event.target.result
                                            ) {
                                              setNewPersonImage(
                                                event.target.result as string,
                                              );
                                            }
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    تصویر پروفایل
                                  </span>
                                </div>
                                <div className="w-full text-right">
                                  <label className="block text-sm font-bold text-slate-700 mb-2">
                                    نوع موجودیت
                                  </label>
                                  <select
                                    value={newPersonType}
                                    onChange={(e) =>
                                      setNewPersonType(
                                        e.target.value as "real" | "legal",
                                      )
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-colors text-slate-900 bg-white font-bold"
                                  >
                                    <option value="real">حقیقی (فرد)</option>
                                    <option value="legal">
                                      حقوقی (شرکت / سازمان)
                                    </option>
                                  </select>
                                </div>

                                <div className="w-full text-right">
                                  <label className="block text-sm font-bold text-slate-700 mb-2">
                                    نقش ارتباطی
                                  </label>
                                  <select
                                    value={newPersonRole}
                                    onChange={(e) =>
                                      setNewPersonRole(e.target.value)
                                    }
                                    disabled={!!editingPersonId}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-colors text-slate-900 bg-white font-bold disabled:bg-slate-100 disabled:cursor-not-allowed"
                                  >
                                    {!newPersonRole && (
                                      <option value="">انتخاب نقش...</option>
                                    )}
                                    {(personRoles || []).map((r, index) => (
                                      <option key={r.id ? `id-${r.id}` : `idx-${index}`} value={r.id}>
                                        {r.name} (کد: {r.code})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {newPersonType === "real" ? (
                                <>
                                  <div className="w-full text-right md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="w-full text-right">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        عنوان
                                      </label>
                                      <select
                                        value={newPersonTitle}
                                        onChange={(e) =>
                                          setNewPersonTitle(e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 bg-white"
                                      >
                                        <option value="">
                                          -- انتخاب کنید --
                                        </option>
                                        <option value="آقای">آقای</option>
                                        <option value="خانم">خانم</option>
                                        <option value="دکتر">دکتر</option>
                                        <option value="مهندس">مهندس</option>
                                        <option value="سید">سید</option>
                                        <option value="سیده">سیده</option>
                                        <option value="استاد">استاد</option>
                                      </select>
                                    </div>

                                    <div className="w-full text-right">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        نام مستعار / نمایشی
                                      </label>
                                      <input
                                        type="text"
                                        value={newPersonAlias}
                                        onChange={(e) =>
                                          setNewPersonAlias(e.target.value)
                                        }
                                        placeholder={
                                          `مثال: ${newPersonTitle ? newPersonTitle + " " : ""}${newPersonFirstName ? newPersonFirstName + " " : ""}${newPersonLastName || ""}`.trim() ||
                                          "خودکار ایجاد می‌شود"
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                      />
                                    </div>
                                  </div>

                                  <div className="w-full text-right">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      نام{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={newPersonFirstName}
                                      onChange={(e) =>
                                        setNewPersonFirstName(e.target.value)
                                      }
                                      placeholder="نام"
                                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                      required
                                    />
                                  </div>
                                  <div className="w-full text-right">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      نام خانوادگی{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={newPersonLastName}
                                      onChange={(e) =>
                                        setNewPersonLastName(e.target.value)
                                      }
                                      placeholder="نام خانوادگی"
                                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                      required
                                    />
                                  </div>
                                  <div className="w-full text-right">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      جنسیت
                                    </label>
                                    <select
                                      value={newPersonGender}
                                      onChange={(e) =>
                                        setNewPersonGender(
                                          e.target.value as any,
                                        )
                                      }
                                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                    >
                                      <option value="none">نامشخص</option>
                                      <option value="male">مرد</option>
                                      <option value="female">زن</option>
                                    </select>
                                  </div>
                                  <div className="w-full text-right">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      نام پدر
                                    </label>
                                    <input
                                      type="text"
                                      value={newPersonFatherName}
                                      onChange={(e) =>
                                        setNewPersonFatherName(e.target.value)
                                      }
                                      placeholder="اختیاری"
                                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                    />
                                  </div>
                                  <div className="w-full text-right">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      کد ملی
                                    </label>
                                    <input
                                      type="text"
                                      value={newPersonNationalId}
                                      onChange={(e) =>
                                        setNewPersonNationalId(e.target.value)
                                      }
                                      placeholder="کد ملی 10 رقمی"
                                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 text-left"
                                      dir="ltr"
                                    />
                                  </div>
                                  <div className="w-full text-right">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      کد حسابداری (اختیاری)
                                    </label>
                                    <input
                                      type="text"
                                      value={newPersonAccountingCode}
                                      onChange={(e) =>
                                        setNewPersonAccountingCode(
                                          e.target.value,
                                        )
                                      }
                                      placeholder="مانند: 1205001"
                                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 text-left"
                                      dir="ltr"
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-full text-right md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="w-full text-right">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        نام شرکت / سازمان{" "}
                                        <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={newPersonCompanyName}
                                        onChange={(e) =>
                                          setNewPersonCompanyName(
                                            e.target.value,
                                          )
                                        }
                                        placeholder="مثال: شرکت توسعه تجارت البرز"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                        required
                                      />
                                    </div>

                                    <div className="w-full text-right">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        نام مستعار / تجاری
                                      </label>
                                      <input
                                        type="text"
                                        value={newPersonAlias}
                                        onChange={(e) =>
                                          setNewPersonAlias(e.target.value)
                                        }
                                        placeholder={`مثال: ${newPersonCompanyName || "شرکت البرز"}`}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full text-right md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      شناسه ملی شرکت
                                    </label>
                                    <input
                                      type="text"
                                      value={newPersonNationalId}
                                      onChange={(e) =>
                                        setNewPersonNationalId(e.target.value)
                                      }
                                      placeholder="شناسه ملی"
                                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 text-left"
                                      dir="ltr"
                                    />
                                  </div>
                                  <div className="w-full text-right md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      کد حسابداری (اختیاری)
                                    </label>
                                    <input
                                      type="text"
                                      value={newPersonAccountingCode}
                                      onChange={(e) =>
                                        setNewPersonAccountingCode(
                                          e.target.value,
                                        )
                                      }
                                      placeholder="مانند: 1205001"
                                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 text-left"
                                      dir="ltr"
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          )}

                          {personModalActiveTab === "contact" && (
                            <>
                              <div className="w-full text-right">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  استان
                                </label>
                                <input
                                  type="text"
                                  value={newPersonProvince}
                                  onChange={(e) =>
                                    setNewPersonProvince(e.target.value)
                                  }
                                  placeholder="نام استان"
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                />
                              </div>
                              <div className="w-full text-right">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  شهر
                                </label>
                                <input
                                  type="text"
                                  value={newPersonCity}
                                  onChange={(e) =>
                                    setNewPersonCity(e.target.value)
                                  }
                                  placeholder="نام شهر"
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                />
                              </div>
                              <div className="w-full text-right md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  آدرس پستی
                                </label>
                                <textarea
                                  value={newPersonAddress}
                                  onChange={(e) =>
                                    setNewPersonAddress(e.target.value)
                                  }
                                  placeholder="آدرس دقیق و کامل"
                                  rows={3}
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                />
                              </div>
                              <div className="w-full text-right md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  شماره تماس (تلفن / موبایل)
                                </label>
                                <input
                                  type="text"
                                  value={newPersonPhone}
                                  onChange={(e) =>
                                    setNewPersonPhone(e.target.value)
                                  }
                                  placeholder="مثال: 09120000000"
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 text-left font-mono"
                                  dir="ltr"
                                />
                              </div>
                            </>
                          )}

                          {personModalActiveTab === "financial" && (
                            <div className="w-full text-right md:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <div className="w-full text-right bg-blue-50/50 p-6 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="mb-4 relative z-10 border-b border-blue-100 pb-4">
                                  <h4 className="text-sm font-black text-blue-900 mb-2">
                                    سقف اعتبار / بدهی
                                  </h4>
                                  <p className="text-xs text-blue-700/80 leading-relaxed max-w-2xl">
                                    با تعیین سقف اعتبار، در صورتی که بدهی این
                                    شخص از مبلغ تعیین شده بیشتر شود، سیستم اجازه
                                    ثبت فاکتور یا سند جدید برای ایشان را نخواهد
                                    داد.
                                  </p>
                                </div>
                                <div className="w-full relative z-10">
                                  <label className="block text-sm font-bold text-blue-900 mb-2">
                                    سقف مجاز (
                                    {storeSettings?.currency || "تومان"})
                                  </label>
                                  <CurrencyInput
                                    value={newPersonCreditLimit}
                                    onChange={(e: any) =>
                                      setNewPersonCreditLimit(e.target.value)
                                    }
                                    placeholder="مثلا: 50000000 (خالی به معنی بدون سقف)"
                                    className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors text-blue-950 font-mono text-left font-bold bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {personModalActiveTab === "settings" && (
                            <>
                              <div className="w-full text-right md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2">
                                <div className="flex justify-between items-center mb-4">
                                  <label className="block text-xs font-black text-slate-700">
                                    وضعیت فعالیت
                                  </label>
                                </div>
                                <div className="flex items-center gap-3">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      checked={newPersonIsActive}
                                      onChange={(e) =>
                                        setNewPersonIsActive(e.target.checked)
                                      }
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                  </label>
                                  <span className="text-sm font-bold text-gray-800">
                                    {newPersonIsActive
                                      ? "حساب فعال است"
                                      : "حساب غیرفعال"}
                                  </span>
                                </div>
                              </div>

                              <div className="w-full text-right z-50 relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  تاریخ عضویت / ثبت
                                </label>
                                <DatePicker
                                  value={newPersonRegistrationDate}
                                  onChange={(date: any) =>
                                    setNewPersonRegistrationDate(
                                      date?.toDate?.() || new Date(),
                                    )
                                  }
                                  calendar={
                                    storeSettings?.calendarType === "gregorian"
                                      ? undefined
                                      : persian
                                  }
                                  locale={
                                    storeSettings?.calendarType === "gregorian"
                                      ? undefined
                                      : persian_fa
                                  }
                                  calendarPosition="bottom-right"
                                  inputClass="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 font-mono text-center outline-none"
                                  containerClassName="w-full"
                                />
                              </div>

                              <div className="w-full text-right bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                  <label className="block text-xs font-black text-slate-700">
                                    گروه‌بندی شخص
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsPersonModalOpen(false);
                                      setActiveTab("person_groups" as any);
                                    }}
                                    className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-bold transition-colors border border-indigo-200 cursor-pointer"
                                  >
                                    مدیریت گروه‌ها
                                  </button>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 mt-1">
                                  <select
                                    value={newPersonGroup}
                                    onChange={(e) =>
                                      setNewPersonGroup(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-950 font-bold text-sm bg-white"
                                  >
                                    <option value="">بدون گروه</option>
                                    {(personGroups || []).map((g, index) => (
                                      <option key={g.id ? `id-${g.id}` : `idx-${index}`} value={g.id}>
                                        {g.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </form>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => setIsPersonModalOpen(false)}
                        className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors shadow-sm"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        form="personForm"
                        disabled={submittingPerson}
                        className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submittingPerson ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                        <span>ثبت شخص</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {isAccountModalOpen && (
                <div key="isAccountModalOpen-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col"
                  >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-indigo-500" />
                        ثبت حساب بانکی جدید
                      </h3>
                      <button
                        onClick={() => setIsAccountModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                      <form
                        id="accountForm"
                        onSubmit={(e) => {
                          e.preventDefault();
                          confirmAction(
                            "آیا از ثبت حساب بانکی اطمینان دارید؟",
                            () => handleSubmitAccount(e as any),
                          );
                        }}
                        className="flex flex-col gap-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نام بانک <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newAccountBankName}
                              onChange={(e) =>
                                setNewAccountBankName(e.target.value)
                              }
                              placeholder="مثال: بانک ملی، بانک ملت"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                              required
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نام صاحب حساب{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newAccountHolder}
                              onChange={(e) =>
                                setNewAccountHolder(e.target.value)
                              }
                              placeholder="مثال: علی محمدی"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                              required
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              شماره حساب
                            </label>
                            <input
                              type="text"
                              value={newAccountNumber}
                              onChange={(e) =>
                                setNewAccountNumber(e.target.value)
                              }
                              placeholder="مثال: 0102030405"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 text-left"
                              dir="ltr"
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              شماره کارت
                            </label>
                            <input
                              type="text"
                              value={newAccountCardNumber}
                              onChange={(e) =>
                                setNewAccountCardNumber(e.target.value)
                              }
                              placeholder="16 رقمی"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 text-left"
                              dir="ltr"
                            />
                          </div>

                          <div className="w-full text-right md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              شماره شبا (IBAN)
                            </label>
                            <input
                              type="text"
                              value={newAccountShebaNumber}
                              onChange={(e) =>
                                setNewAccountShebaNumber(e.target.value)
                              }
                              placeholder="مثال: IR12017000000000..."
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 text-left"
                              dir="ltr"
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نام شعبه
                            </label>
                            <input
                              type="text"
                              value={newAccountBranchName}
                              onChange={(e) =>
                                setNewAccountBranchName(e.target.value)
                              }
                              placeholder="مثال: شعبه مرکزی"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              موجودی اولیه (تومان)
                            </label>
                            <CurrencyInput
                              value={newAccountBalance}
                              onChange={(e: any) =>
                                setNewAccountBalance(e.target.value)
                              }
                              placeholder="مثال: 1000000"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 text-left"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => setIsAccountModalOpen(false)}
                        className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors shadow-sm"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        form="accountForm"
                        disabled={submittingAccount}
                        className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submittingAccount ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                        <span>ثبت حساب</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {isCashboxModalOpen && (
                <div key="isCashboxModalOpen-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-md max-h-[90vh] flex flex-col"
                  >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-indigo-500" />
                        ثبت صندوق یا تنخواه جدید
                      </h3>
                      <button
                        onClick={() => setIsCashboxModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                      <form
                        id="cashboxForm"
                        onSubmit={(e) => {
                          e.preventDefault();
                          confirmAction("آیا از ثبت صندوق اطمینان دارید؟", () =>
                            handleSubmitCashbox(e as any),
                          );
                        }}
                        className="flex flex-col gap-5"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نام صندوق / تنخواه{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newCashboxName}
                              onChange={(e) =>
                                setNewCashboxName(e.target.value)
                              }
                              placeholder="مثال: صندوق اصلی، تنخواه دفتر"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                              required
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نام مسئول صندوق
                            </label>
                            <input
                              type="text"
                              value={newCashboxManager}
                              onChange={(e) =>
                                setNewCashboxManager(e.target.value)
                              }
                              placeholder="مثال: سارا احمدی"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              موجودی اولیه (تومان)
                            </label>
                            <CurrencyInput
                              value={newCashboxBalance}
                              onChange={(e: any) =>
                                setNewCashboxBalance(e.target.value)
                              }
                              placeholder="مثال: 500000"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 text-left"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => setIsCashboxModalOpen(false)}
                        className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors shadow-sm"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        form="cashboxForm"
                        disabled={submittingCashbox}
                        className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submittingCashbox ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                        <span>ثبت صندوق</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {isWarehouseModalOpen && (
                <div key="isWarehouseModalOpen-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-md max-h-[90vh] flex flex-col"
                  >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Box className="w-5 h-5 text-indigo-500" />
                        ثبت انبار جدید
                      </h3>
                      <button
                        onClick={() => setIsWarehouseModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                      <form
                        id="warehouseForm"
                        onSubmit={(e) => {
                          e.preventDefault();
                          confirmAction("آیا از ثبت انبار اطمینان دارید؟", () =>
                            handleSubmitWarehouse(e as any),
                          );
                        }}
                        className="flex flex-col gap-5"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نام انبار <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newWarehouseName}
                              onChange={(e) =>
                                setNewWarehouseName(e.target.value)
                              }
                              placeholder="مثال: انبار مرکزی"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                              required
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              مسئول انبار (انباردار)
                            </label>
                            <input
                              type="text"
                              value={newWarehouseManager}
                              onChange={(e) =>
                                setNewWarehouseManager(e.target.value)
                              }
                              placeholder="مثال: علی احمدی"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              موقعیت مکانی یا آدرس
                            </label>
                            <input
                              type="text"
                              value={newWarehouseLocation}
                              onChange={(e) =>
                                setNewWarehouseLocation(e.target.value)
                              }
                              placeholder="مثال: سوله‌ی شماره ۲"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                            />
                          </div>

                          <div className="w-full text-right flex items-center justify-between border border-gray-100 p-4 rounded-xl mt-2 bg-slate-50">
                            <label
                              className="text-sm font-bold text-gray-700 cursor-pointer select-none"
                              onClick={() =>
                                setNewWarehouseIsActive(!newWarehouseIsActive)
                              }
                            >
                              وضعیت انبار (فعال / غیرفعال)
                            </label>
                            <div
                              className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors flex items-center ${newWarehouseIsActive ? "bg-emerald-500" : "bg-gray-300"}`}
                              onClick={() =>
                                setNewWarehouseIsActive(!newWarehouseIsActive)
                              }
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${newWarehouseIsActive ? "-translate-x-[24px]" : "translate-x-0"}`}
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => setIsWarehouseModalOpen(false)}
                        className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors shadow-sm"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        form="warehouseForm"
                        disabled={submittingWarehouse}
                        className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submittingWarehouse ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                        {editingWarehouseId ? "ذخیره انبار" : "ثبت انبار"}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

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

              {/* Person Ledger Drawer overlay */}
              <AnimatePresence>
                {drawerPersonId &&
                  (() => {
                    const selectedPerson = persons.find(
                      (p) => p.id.toString() === drawerPersonId.toString(),
                    );
                    if (!selectedPerson) return null;

                    // Calculations
                    const accountingDocEntries = accountingDocuments
                      .filter((doc) =>
                        doc.items?.some((item) => String(item.detailedAccountId) === String(selectedPerson.id))
                      )
                      .map((doc) => {
                        const personItems = doc.items.filter((item) => String(item.detailedAccountId) === String(selectedPerson.id));
                        const debit = personItems.reduce((sum, item) => sum + Number(item.debit || 0), 0);
                        const credit = personItems.reduce((sum, item) => sum + Number(item.credit || 0), 0);
                        
                        const descriptions = personItems.map((item) => item.description).filter(Boolean);
                        let desc = doc.description || descriptions.join(" - ") || "سند حسابداری";
                        let isPayslip = false;
                        try {
                          const p = JSON.parse(desc);
                          if (p.isPayslip) {
                            isPayslip = true;
                            const pMonthName = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
                            const mName = p.periodMonth ? pMonthName[parseInt(p.periodMonth, 10) - 1] : "";
                            desc = `سند حقوق ${mName} ماه ${p.periodYear}`;
                          }
                        } catch (e) {}
                        
                        let entryType = "accounting_document";
                          let typeName = "سند حسابداری";
                          if (doc.sourceType && doc.sourceType.startsWith("invoice_")) {
                            entryType = "invoice";
                            const invoice = invoices.find(inv => inv.id.toString() === doc.sourceId?.toString());
                            if (invoice) {
                                if (invoice.type === "sale") typeName = "فاکتور فروش";
                                else if (invoice.type === "purchase") typeName = "فاکتور خرید";
                                else if (invoice.type === "sale_return") typeName = "برگشت از فروش";
                                else if (invoice.type === "purchase_return") typeName = "برگشت از خرید";
                            } else {
                                if (doc.sourceType === "invoice_sale") typeName = "فاکتور فروش";
                                else if (doc.sourceType === "invoice_purchase") typeName = "فاکتور خرید";
                                else if (doc.sourceType === "invoice_sale_return") typeName = "برگشت از فروش";
                                else if (doc.sourceType === "invoice_purchase_return") typeName = "برگشت از خرید";
                            }
                          }
                          else if (doc.sourceType === "receipt") { entryType = "transaction"; typeName = "رسید دریافت"; }
                          else if (doc.sourceType === "payment") { entryType = "transaction"; typeName = (typeof isPayslip !== "undefined" && isPayslip) ? "فیش حقوقی" : "رسید پرداخت"; }
                          else if (doc.sourceType === "opening_balance") { entryType = "opening_balance"; typeName = "افتتاحیه"; }
                          else if (doc.sourceType?.startsWith("check_issued")) { entryType = "issued_check"; typeName = "چک پرداختی"; }
                          else if (doc.sourceType?.startsWith("check_received")) { entryType = "received_check"; typeName = "چک دریافتی"; }
                          
                          return {
                            id: doc.id,
                            refId: doc.documentNumber?.toString() || "-",
                            date: doc.date || new Date().toISOString(),
                            
                            type: typeName,
                          desc,
                          debit,
                          credit,
                          rawItem: doc,
                          entryType,
                        };
                      });

                    const getJalaliSortValue = (jalaliStr) => {
                      if (!jalaliStr || jalaliStr === "-") return 0;
                      const normalized = jalaliStr.replace(
                        /[۰-۹]/g,
                        (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString(),
                      );
                      const parts = normalized.split("/");
                      if (parts.length === 3) {
                        const y = parts[0];
                        const m = parts[1].padStart(2, "0");
                        const d = parts[2].split(" ")[0].padStart(2, "0");
                        return parseInt(y + m + d, 10);
                      }
                      return 0;
                    };

                    let allEntries = [...accountingDocEntries].sort((a, b) => {
                      const tA = new Date(convertToGregorian(a.date)).getTime();
                      const tB = new Date(convertToGregorian(b.date)).getTime();
                      const dateDiff = (isNaN(tA) ? 0 : tA) - (isNaN(tB) ? 0 : tB);
                      if (dateDiff === 0) {
                        return (a.rawItem?.createdAt || 0) - (b.rawItem?.createdAt || 0);
                      }
                      return dateDiff;
                    });

                    let runningSum = 0;
                    const ledgerEntries = allEntries.map((entry) => {
                      runningSum += entry.debit - entry.credit;
                      return {
                        ...entry,
                        runningBalance: runningSum,
                      };
                    });

                    const totalDebits = allEntries.reduce(
                      (sum, entry) => sum + entry.debit,
                      0,
                    );
                    const totalCredits = allEntries.reduce(
                      (sum, entry) => sum + entry.credit,
                      0,
                    );
                    const finalBalance = totalDebits - totalCredits;

                    const isOwedToUs = finalBalance > 0;
                    const isClear = finalBalance === 0;

                    return (
                      <div key="person-drawer-container">
                        <motion.div
                          key="overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setDrawerPersonId("")}
                          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]"
                        />
                        <motion.div
                          key="drawer"
                          initial={{ x: "100%", opacity: 0.5 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: "100%", opacity: 0.5 }}
                          transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                          }}
                          className="fixed top-0 bottom-0 right-0 w-full md:w-[700px] bg-gray-50 z-[160] shadow-2xl flex flex-col border-l border-slate-200"
                          dir="rtl"
                        >
                          {/* Header */}
                          <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0 shadow-sm z-10">
                            <div>
                              <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-600" />
                                پیش‌نمایش گردش حساب: {selectedPerson.name}
                              </h3>
                            </div>
                            <button
                              onClick={() => setDrawerPersonId("")}
                              className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-colors border border-transparent shadow-none"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="overflow-y-auto flex-1 p-6 space-y-6">
                            {(() => {
                              const personActiveLoans = loans.filter(
                                (l: any) =>
                                  l.personId?.toString() ===
                                    selectedPerson.id.toString() &&
                                  l.status !== "completed",
                              );
                              if (personActiveLoans.length === 0) return null;
                              const totalLoanAmount = personActiveLoans.reduce(
                                (sum: number, loan: any) =>
                                  sum + (loan.amount || loan.totalAmount || 0),
                                0,
                              );
                              const relatedInstallments = installments.filter(
                                (inst: any) =>
                                  (inst.status === "pending" ||
                                    inst.status === "overdue") &&
                                  personActiveLoans.some(
                                    (l: any) =>
                                      l.id.toString() ===
                                      inst.loanId.toString(),
                                  ),
                              );
                              return (
                                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-amber-100/80 text-amber-600 rounded-xl">
                                      <Wallet className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <span className="text-xs font-bold text-amber-700 block mb-0.5">
                                        وضعیت وام‌های فعال
                                      </span>
                                      <span className="text-sm font-black text-amber-900 block">
                                        مبلغ کل:{" "}
                                        {toPersianDigits(
                                          formatNumber(totalLoanAmount),
                                        )}{" "}
                                        <span className="text-[10px] font-medium">
                                          {storeSettings.currency}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right sm:text-left">
                                    <span className="text-xs font-bold text-amber-700/80 block mb-0.5">
                                      اقساط باقیمانده
                                    </span>
                                    <span className="text-lg font-black text-amber-900 block tracking-tight">
                                      {toPersianDigits(
                                        relatedInstallments.length,
                                      )}{" "}
                                      <span className="text-[10px] font-medium text-amber-700">
                                        قسط پرداخت نشده
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Status Card */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                              <div
                                className={`absolute right-0 top-0 bottom-0 w-1.5 ${isClear ? "bg-slate-500" : isOwedToUs ? "bg-rose-500" : "bg-emerald-500"}`}
                              ></div>
                              <div>
                                <span className="text-xs font-bold text-gray-400 block mb-2">
                                  وضعیت نهایی تراز حساب شخص
                                </span>
                                <div className="py-2 font-semibold">
                                  <span
                                    className={`text-[11px] font-extrabold px-2.5 py-1 rounded-md inline-block mb-2 ${
                                      isClear
                                        ? "bg-slate-50 text-slate-700"
                                        : isOwedToUs
                                          ? "bg-rose-50 text-rose-700"
                                          : "bg-emerald-50 text-emerald-700"
                                    }`}
                                  >
                                    {isClear
                                      ? "✔ کاملاً تسویه شده"
                                      : isOwedToUs
                                        ? "🔺 بدهی شخص به فروشگاه"
                                        : "🔻 طلب شخص از فروشگاه"}
                                  </span>

                                  <span
                                    className={`text-2xl font-black block tracking-tight ${
                                      isClear
                                        ? "text-slate-700"
                                        : isOwedToUs
                                          ? "text-rose-700"
                                          : "text-emerald-700"
                                    }`}
                                  >
                                    {formatNumber(Math.abs(finalBalance))}{" "}
                                    <span className="text-xs font-medium text-gray-500">
                                      {storeSettings.currency}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Timeline / Simplified Table */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                              <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-extrabold text-gray-800 text-sm">
                                  ریز ۵۰ تراکنش اخیر
                                </h3>
                              </div>
                              <div className="overflow-x-auto">
                                {ledgerEntries.length === 0 ? (
                                  <div className="p-8 text-center text-gray-400 text-sm">
                                    هیچ گردش مالی یا سندی برای این شخص یافت نشد.
                                  </div>
                                ) : (
                                  <table className="w-full text-right text-xs whitespace-nowrap min-w-[600px]">
                                    <thead>
                                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                        <th className="py-3 px-4 font-bold">
                                          تاریخ / ردیف
                                        </th>
                                        <th className="py-3 px-4 font-bold">
                                          نوع سند
                                        </th>
                                        <th className="py-3 px-4 font-bold text-left">
                                          مبلغ رویداد
                                        </th>
                                        <th className="py-3 px-4 font-bold text-left">
                                          مانده نهایی
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-gray-700">
                                      {ledgerEntries
                                        .slice(-50)
                                        .reverse()
                                        .map((entry, idx) => {
                                          const isDeb = entry.debit > 0;
                                          const isCred = entry.credit > 0;
                                          const isTxBalZero =
                                            entry.runningBalance === 0;
                                          const isTxDeb =
                                            entry.runningBalance > 0;

                                          return (
                                            <tr
                                              key={entry.id}
                                              className="hover:bg-slate-50 cursor-pointer transition-colors"
                                              onClick={() => {
                                                if (entry.entryType === "invoice" && entry.rawItem) {
                                                  const actualInvoice = invoices.find(i => String(i.id) === String(entry.rawItem.sourceId));
                                                  if (actualInvoice) setViewingInvoice(actualInvoice);
                                                } else if (entry.entryType === "transaction" && entry.rawItem) {
                                                  const actualTx = transactions.find(t => String(t.id) === String(entry.rawItem.sourceId));
                                                  if (actualTx) {
                                                    if (actualTx.type === "salary") {
                                                      try {
                                                        let parsedDesc = payslips.find(p => String(p.transactionId) === String(actualTx.id));
                                                        if (!parsedDesc && typeof actualTx.description === "string" && actualTx.description.includes("isPayslip")) {
                                                          parsedDesc = JSON.parse(actualTx.description);
                                                        }
                                                        if (parsedDesc && parsedDesc.isPayslip) {
                                                          setViewingPayslip({
                                                            ...actualTx,
                                                            parsed: parsedDesc,
                                                            computedPersonName: selectedPerson.name,
                                                          });
                                                          return;
                                                        }
                                                      } catch (e) {}
                                                    }
                                                    setPreviewReceiptData({
                                                      ...actualTx,
                                                                                                            personId: selectedPerson.id,
                                                      _isReadOnly: true,
                                                    });
                                                  }
                                                } else if (entry.entryType === "issued_check") {
                                                  const check = issuedChecks.find(c => String(c.id) === String(entry.rawItem?.sourceId));
                                                  if (check) setViewingCheck({ ...check, _type: 'issued' });
                                                } else if (entry.entryType === "received_check") {
                                                  const check = receivedChecks.find(c => String(c.id) === String(entry.rawItem?.sourceId));
                                                  if (check) setViewingCheck({ ...check, _type: 'received' });
                                                }
                                              }}
                                            >
                                              <td className="py-3 px-4">
                                                <div className="font-mono text-gray-500 font-bold flex items-center gap-1.5 justify-end">
                                                  <span>
                                                    {formatDateDisplay(
                                                       entry.date || (entry as any).jalaliDate,
                                                       storeSettings?.calendarType
                                                    )}
                                                  </span>
                                                  {entry.rawItem?.createdAt && (
                                                    <span className="text-[9px] font-medium bg-gray-100 px-1.5 py-0.5 rounded-md" dir="ltr">
                                                      {toPersianDigits(new Date(entry.rawItem.createdAt).toLocaleTimeString(storeSettings?.calendarType === 'gregorian' ? 'en-US' : 'fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false }))}
                                                    </span>
                                                  )}
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-0.5">
                                                  {entry.refId}
                                                </div>
                                              </td>
                                              <td className="py-3 px-4">
                                                <div className="font-bold">
                                                  {entry.type}
                                                </div>
                                                <div
                                                  className="text-[10px] text-gray-400 font-normal whitespace-pre-wrap line-clamp-1 max-w-[200px]"
                                                  title={entry.desc}
                                                >
                                                  {entry.desc}
                                                </div>
                                              </td>
                                              <td
                                                className="py-3 px-4 text-left font-mono"
                                                dir="ltr"
                                              >
                                                {isDeb ? (
                                                  <span className="text-rose-600 font-bold block">
                                                    {formatNumber(entry.debit)}
                                                  </span>
                                                ) : isCred ? (
                                                  <span className="text-emerald-600 font-bold block">
                                                    {formatNumber(entry.credit)}
                                                  </span>
                                                ) : (
                                                  <span className="text-gray-400">
                                                    ---
                                                  </span>
                                                )}
                                              </td>
                                              <td
                                                className="py-3 px-4 text-left font-mono"
                                                dir="ltr"
                                              >
                                                <div className="flex flex-col items-end">
                                                  {isTxBalZero ? (
                                                    <span className="text-slate-500 font-bold">
                                                      ۰
                                                    </span>
                                                  ) : (
                                                    <span
                                                      className={`font-bold ${isTxDeb ? "text-rose-600" : "text-emerald-600"}`}
                                                    >
                                                      {formatNumber(
                                                        Math.abs(
                                                          entry.runningBalance,
                                                        ),
                                                      )}
                                                    </span>
                                                  )}
                                                  <span className="text-[9px] text-gray-400 mt-0.5">
                                                    {isTxBalZero
                                                      ? "تسویه"
                                                      : isTxDeb ? "افزایش بدهی" : "کاهش بدهی"}
                                                  </span>
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                    </tbody>
                                    <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-[13px]">
                                      {(() => {
                                        const filteredEntries = ledgerEntries.slice(-50).reverse();
                                        const totalDebit = filteredEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
                                        const totalCredit = filteredEntries.reduce((sum, e) => sum + (e.credit || 0), 0);
                                        const totalBalance = totalDebit - totalCredit;
                                        return (
                                          <tr>
                                            <td colSpan={2} className="py-3 px-4 text-left text-slate-700">
                                              جمع کل ({filteredEntries.length} رکورد):
                                            </td>
                                            <td className="py-3 px-4 text-left">
                                              <div className="flex flex-col gap-1 font-mono" dir="ltr">
                                                <span className="text-rose-600 text-xs text-right">
                                                  افزایش بدهی: {toPersianDigits(formatNumber(totalDebit))}
                                                </span>
                                                <span className="text-emerald-600 text-xs text-right">
                                                  کاهش بدهی (پرداختی): {toPersianDigits(formatNumber(totalCredit))}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="py-3 px-4 text-left font-mono" dir="ltr">
                                              <div className="flex flex-col items-end">
                                                {totalBalance === 0 ? (
                                                  <span className="text-slate-500 font-bold">۰</span>
                                                ) : (
                                                  <span className={`font-bold ${totalBalance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                                    {formatNumber(Math.abs(totalBalance))}
                                                  </span>
                                                )}
                                                <span className="text-[9px] text-gray-400 mt-0.5">
                                                  {totalBalance === 0 ? "تسویه" : totalBalance > 0 ? "بدهی شخص" : "طلب شخص"}
                                                </span>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })()}
                                    </tfoot>
                                  </table>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0 flex justify-end gap-3 z-10">
                            <button
                              onClick={() => {
                                setLedgerPersonId(selectedPerson.id);
                                setActiveTab("person_ledger");
                                setDrawerPersonId("");
                              }}
                              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors w-full"
                            >
                              مشاهده در کارت حساب بصورت کامل
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })()}
              </AnimatePresence>

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
                        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
                      >
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
                    className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-4xl max-h-[95vh] flex flex-col print-section print:max-h-none print:h-auto print:overflow-visible print:border-none print:shadow-none print:rounded-none"
                  >
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
            <footer className="w-full bg-white border-t border-gray-200 py-6 mt-auto shrink-0 no-print">
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

          return (
            <div
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
          );
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
    </>
  );
}