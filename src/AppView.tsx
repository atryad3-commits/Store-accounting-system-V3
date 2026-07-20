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
  formatDateDisplay, convertToGregorian,
} from "./utils/format";
import CustomDatePicker from "./components/ui/CustomDatePicker";
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

export function AppView(props: any) {
  const {
    
  } = props;

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
}