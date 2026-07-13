import React from "react";
import {
  BarChart3,
  ShoppingCart,
  PackagePlus,
  Users,
  Calculator,
  Package,
  Box,
  CreditCard,
  ArrowRightLeft,
  BookOpen,
  Settings,
  Calendar,
} from "lucide-react";

export interface SidebarItem {
  id: string;
  label: string;
  roles: string[];
}

export interface SidebarGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: SidebarItem[];
}

export const allSidebarGroups: SidebarGroup[] = [
  {
    id: "reports",
    label: "داشبورد و گزارشات",
    icon: <BarChart3 className="w-5 h-5" />,
    items: [
      {
        id: "financial_report",
        label: "داشبورد مالی",
        roles: ["admin", "accountant"],
      },
      {
        id: "analytical_dashboard",
        label: "داشبورد تحلیلی",
        roles: ["admin", "accountant", "viewer"],
      },
      {
        id: "crm_dashboard",
        label: "داشبورد مدیریت ارتباطات (CRM)",
        roles: ["admin", "viewer"],
      },
      {
        id: "person_ledger",
        label: "دفتر کل اشخاص",
        roles: ["admin", "accountant", "viewer"],
      },
      {
        id: "debts_credits",
        label: "گزارش وضعیت حساب اشخاص",
        roles: ["admin", "accountant", "viewer"],
      },
      {
        id: "inventory_report",
        label: "گزارش موجودی کالا",
        roles: ["admin", "accountant", "viewer"],
      },
      {
        id: "product_last_prices", label: "آخرین قیمت‌های کالا", roles: ["admin", "accountant", "viewer"] },
      {
        id: "kardex",
        label: "کاردکس کالا (تاریخچه)",
        roles: ["admin", "accountant", "viewer"],
      },
      {
        id: "stocktaking",
        label: "انبارگردانی",
        roles: ["admin", "manager"],
      },
    ],
  },
  {
    id: "sales_operations",
    label: "عملیات فروش",
    icon: <ShoppingCart className="w-5 h-5" />,
    items: [
      {
        id: "create_sale",
        label: "ثبت فاکتور فروش",
        roles: ["admin", "cashier", "accountant"],
      },
      {
        id: "create_sale_return",
        label: "برگشت از فروش",
        roles: ["admin", "cashier", "accountant"],
      },
      {
        id: "list_sale",
        label: "لیست فاکتورهای فروش",
        roles: ["admin", "cashier", "accountant"],
      },
      {
        id: "list_sale_return",
        label: "لیست برگشتی‌های فروش",
        roles: ["admin", "cashier", "accountant"],
      },
    ],
  },
  {
    id: "purchase_operations",
    label: "عملیات خرید",
    icon: <PackagePlus className="w-5 h-5" />,
    items: [
      {
        id: "create_purchase",
        label: "ثبت فاکتور خرید",
        roles: ["admin", "accountant"],
      },
      {
        id: "create_purchase_return",
        label: "برگشت از خرید",
        roles: ["admin", "accountant"],
      },
      {
        id: "list_purchase",
        label: "لیست فاکتورهای خرید",
        roles: ["admin", "accountant"],
      },
      {
        id: "list_purchase_return",
        label: "لیست برگشتی‌های خرید",
        roles: ["admin", "accountant"],
      },
    ],
  },
  {
    id: "persons",
    label: "اشخاص و دسترسی‌ها",
    icon: <Users className="w-5 h-5" />,
    items: [
      {
        id: "persons",
        label: "مدیریت اشخاص",
        roles: ["admin", "accountant", "cashier"],
      },
      {
        id: "person_profile",
        label: "پروفایل شخص",
        roles: ["admin", "accountant", "cashier"],
      },
      {
        id: "person_groups",
        label: "گروه‌بندی اشخاص",
        roles: ["admin", "accountant"],
      },
      {
        id: "person_roles",
        label: "نقش‌های اشخاص",
        roles: ["admin", "accountant"],
      },
      {
        id: "person_opening_balances",
        label: "مانده اول دوره اشخاص",
        roles: ["admin", "accountant"],
      },
    ],
  },
  {
    id: "loans_management",
    label: "وام و اقساط",
    icon: <Calculator className="w-5 h-5" />,
    items: [
      {
        id: "loans",
        label: "مدیریت وام و اقساط",
        roles: ["admin", "accountant", "manager"],
      },
    ],
  },
  {
    id: "salary",
    label: "حقوق و دستمزد",
    icon: <Users className="w-5 h-5" />,
    items: [
      {
        id: "create_salary_payroll",
        label: "ثبت فیش حقوقی",
        roles: ["admin", "accountant", "manager"],
      },
      {
        id: "list_salary_payroll",
        label: "لیست فیش‌های حقوقی",
        roles: ["admin", "accountant", "manager"],
      },
    ],
  },
  {
    id: "products_management",
    label: "کالا و خدمات",
    icon: <Package className="w-5 h-5" />,
    items: [
      {
        id: "products",
        label: "مدیریت کالا و خدمات",
        roles: ["admin", "accountant"],
      },
      {
        id: "quick_price_inquiry",
        label: "استعلام سریع قیمت",
        roles: ["admin", "accountant", "cashier", "viewer"],
      },
      {
        id: "product_view",
        label: "کارت کالا",
        roles: ["admin", "accountant"],
      },
      {
        id: "product_categories",
        label: "گروه‌بندی کالاها",
        roles: ["admin", "accountant"],
      },
    ],
  },
  {
    id: "warehousing",
    label: "انبارداری",
    icon: <Box className="w-5 h-5" />,
    items: [
      { id: "warehouses", label: "انبارها", roles: ["admin", "accountant"] },
      {
        id: "create_warehouse_doc",
        label: "صدور رسید پایانه انبار",
        roles: ["admin", "accountant"],
      },
      {
        id: "list_warehouse_docs",
        label: "لیست اسناد انبار",
        roles: ["admin", "accountant"],
      },
    ],
  },
  {
    id: "banking",
    label: "بانکداری",
    icon: <CreditCard className="w-5 h-5" />,
    items: [
      {
        id: "accounts",
        label: "حساب‌های بانکی",
        roles: ["admin", "accountant"],
      },
      {
        id: "cashboxes",
        label: "صندوق‌ها",
        roles: ["admin", "accountant", "cashier"],
      },
      {
        id: "transfer",
        label: "انتقال بین حساب‌ها",
        roles: ["admin", "accountant"],
      },
    ],
  },
  {
    id: "accounting_core",
    label: "حسابداری دوبل",
    icon: <Calculator className="w-5 h-5" />,
    items: [
      {
        id: "financial_years",
        label: "مدیریت سال‌های مالی",
        roles: ["admin", "accountant"],
      },
      {
        id: "accounting_verification",
        label: "تراز آزمایشی و بررسی اسناد",
        roles: ["admin", "accountant"],
      },
      {
        id: "chart_of_accounts",
        label: "کدینگ حساب‌ها (جدول حساب)",
        roles: ["admin", "accountant"],
      },
      {
        id: "accounting_docs_list",
        label: "اسناد حسابداری",
        roles: ["admin", "accountant"],
      },
      {
        id: "accounting_opening_balances",
        label: "اسناد افتتاحیه",
        roles: ["admin", "accountant"],
      },
      {
        id: "accounting_doc_create",
        label: "صدور سند حسابداری",
        roles: ["admin", "accountant"],
      },
      {
        id: "accounting_auto_sync",
        label: "تولید اسناد معوقه",
        roles: ["admin", "accountant"],
      },
    ],
  },
  {
    id: "receipts_payments",
    label: "دریافت و پرداخت",
    icon: <ArrowRightLeft className="w-5 h-5" />,
    items: [
      {
        id: "create_receive_receipt",
        label: "ثبت رسید دریافت",
        roles: ["admin", "accountant", "cashier"],
      },
      {
        id: "list_receive_receipt",
        label: "لیست رسید دریافت",
        roles: ["admin", "accountant"],
      },
      {
        id: "create_pay_receipt",
        label: "ثبت رسید پرداخت",
        roles: ["admin", "accountant"],
      },
      {
        id: "list_pay_receipt",
        label: "لیست رسید پرداخت",
        roles: ["admin", "accountant"],
      },
      {
        id: "quick_refund",
        label: "استرداد سریع متفرقه",
        roles: ["admin", "accountant", "cashier"],
      },
      {
        id: "invoice_allocation",
        label: "تخصیص اسناد به فاکتور",
        roles: ["admin", "accountant"],
      },
    ],
  },
  {
    id: "checks_management",
    label: "چک و اسناد",
    icon: <BookOpen className="w-5 h-5" />,
    items: [
      {
        id: "check_panel",
        label: "پنل جامع مدیریت چک",
        roles: ["admin", "accountant", "manager"],
      },
    ],
  },
  {
    id: "admin",
    label: "تنظیمات و ادمین",
    icon: <Settings className="w-5 h-5" />,
    items: [
      { id: "users_manager", label: "مدیریت کاربران", roles: ["admin"] },
      { id: "system_diagnostics", label: "عیب‌یابی سیستم", roles: ["admin"] },
      { id: "settings", label: "تنظیمات پایه‌ای", roles: ["admin"] },
      { id: "sms_panel", label: "پنل پیامک", roles: ["admin"] },
      { id: "system_logs", label: "لاگ سیستم", roles: ["admin"] },
      { id: "database_logs", label: "لاگ دیتابیس", roles: ["admin"] },
      { id: "database", label: "پایگاه داده", roles: ["admin"] },
      { id: "data_reconciliation", label: "تطبیق و اصلاح داده‌ها", roles: ["admin"] },
      { id: "update", label: "به‌روزرسانی نرم‌افزار", roles: ["admin"] },
    ],
  },
];

export function getFilteredSidebarGroups(
  systemModule: string,
  hasCheckedFinancialYears: boolean,
  activeFinancialYear: any
): SidebarGroup[] {
  if (hasCheckedFinancialYears && !activeFinancialYear) {
    return [
      {
        id: "financial_years_setup",
        label: "راه‌اندازی سال مالی",
        icon: <Calendar className="w-5 h-5" />,
        items: [
          {
            id: "financial_years",
            label: "تعریف و مدیریت سال مالی",
            roles: ["admin", "accountant"],
          },
          {
            id: "settings",
            label: "تنظیمات پایه‌ای (تعیین تقویم)",
            roles: ["admin"],
          },
        ],
      },
    ];
  }

  return allSidebarGroups
    .filter((g) => {
      if (systemModule === "all" || systemModule === "selector") return true;
      if (systemModule === "commerce") {
        return [
          "reports",
          "sales_operations",
          "purchase_operations",
          "persons",
          "products_management",
        ].includes(g.id);
      }
      if (systemModule === "inventory") {
        return ["reports", "products_management", "warehousing"].includes(g.id);
      }
      if (systemModule === "accounting") {
        return [
          "reports",
          "banking",
          "accounting_core",
          "receipts_payments",
          "checks_management",
          "loans_management",
          "salary",
          "persons",
        ].includes(g.id);
      }
      if (systemModule === "admin") {
        return ["reports", "settings"].includes(g.id);
      }
      if (systemModule === "crm") {
        return ["persons", "sales_operations", "reports"].includes(g.id);
      }
      if (systemModule === "hr") {
        return ["salary", "persons", "reports"].includes(g.id);
      }
      if (systemModule === "reports_module") {
        return ["reports"].includes(g.id);
      }
      return true;
    })
    .map((g) => {
      if (
        g.id === "reports" &&
        systemModule !== "all" &&
        systemModule !== "selector"
      ) {
        return {
          ...g,
          items: g.items.filter((item) => {
            if (systemModule === "commerce")
              return ["analytical_dashboard"].includes(item.id);
            if (systemModule === "inventory")
              return ["inventory_report", "stocktaking"].includes(item.id);
            if (systemModule === "accounting")
              return [
                "financial_report",
                "analytical_dashboard",
                "person_ledger",
                "debts_credits",
              ].includes(item.id);
            if (systemModule === "admin") return true;
            if (systemModule === "crm")
              return ["analytical_dashboard", "crm_dashboard", "person_ledger"].includes(
                item.id,
              );
            if (systemModule === "hr")
              return ["analytical_dashboard"].includes(item.id);
            if (systemModule === "reports_module") return true;
            return true;
          }),
        };
      }
      return g;
    });
}
