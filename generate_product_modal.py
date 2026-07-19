import sys
import re

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

start_idx = app_content.find('isProductModalOpen && (')
end_idx = app_content.find('isPersonExtraModalOpen && (', start_idx)

jsx_start = app_content.find('<div key="isProductModalOpen-modal"')
jsx_end = app_content.rfind('</div>', start_idx, end_idx) + 6
jsx_content = app_content[jsx_start:jsx_end].strip()

handler_start = app_content.find('const handleSubmitProduct = async')
handler_end = app_content.find('const handleFastSaveProduct', handler_start)
handler_content = app_content[handler_start:handler_end]

handler_content = handler_content.replace('await fetchDataSilent();', 'onSuccess();')
handler_content = handler_content.replace('setIsProductModalOpen(false);', 'onClose();')
handler_content = handler_content.replace('setEditingProductId(null);', '')
handler_content = handler_content.replace('setSuccessMsg(', 'showNotification(')
handler_content = handler_content.replace('("کالا با موفقیت ویرایش شد.");', '("کالا با موفقیت ویرایش شد.", "success");')
handler_content = handler_content.replace('("کالای جدید با موفقیت ثبت شد.");', '("کالای جدید با موفقیت ثبت شد.", "success");')

jsx_content = jsx_content.replace('setIsProductModalOpen(false)', 'onClose()')

new_file_content = """import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Package, X, Check, Save, Plus, Trash2, Edit2, History } from "lucide-react";
import { addCommas, removeCommas, toPersianDigits, numToPersianWords } from "../../utils/format";
import { addProduct, updateProduct, getProductPriceHistory, updateProductPriceHistory } from "../../services/dataService";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import CustomDatePicker from "../ui/CustomDatePicker";
const DatePicker = CustomDatePicker;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProductId: string | null;
  products: any[];
  productCategories: any[];
  warehouses: any[];
  onSuccess: (addedProduct?: any) => void;
  showNotification: (msg: string, type?: 'success'|'error'|'info'|'warning') => void;
  confirmAction: (msg: string, onConfirm: () => void) => void;
  activeTab?: string;
  handleFastAddProduct?: (id: string, p: any) => void;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  editingProductId,
  products,
  productCategories,
  warehouses,
  onSuccess,
  showNotification,
  confirmAction,
  activeTab = "",
  handleFastAddProduct
}: ProductFormModalProps) {
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductPriceDate, setNewProductPriceDate] = useState(new Date().toISOString().split("T")[0]);
  const [newProductType, setNewProductType] = useState<"product" | "service">("product");
  const [newProductCategoryId, setNewProductCategoryId] = useState("");
  const [newProductCode, setNewProductCode] = useState("");
  const [newProductBarcode, setNewProductBarcode] = useState("");
  const [newProductPurchasePrice, setNewProductPurchasePrice] = useState("");
  const [newProductWarehouseId, setNewProductWarehouseId] = useState("");
  const [newProductStock, setNewProductStock] = useState("");
  const [newProductMinStock, setNewProductMinStock] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("");
  const [newProductSecondaryUnit, setNewProductSecondaryUnit] = useState("");
  const [newProductUnitRatio, setNewProductUnitRatio] = useState("");
  const [productFormTab, setProductFormTab] = useState<"general" | "inventory" | "sales" | "price_history">("general");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [newProductIsActive, setNewProductIsActive] = useState(true);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  
  const [currentProductPriceHistory, setCurrentProductPriceHistory] = useState<any[]>([]);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [editingHistoryDate, setEditingHistoryDate] = useState<string>("");

  const customAlert = (msg: string) => showNotification(msg, 'error');
  const setNotification = (n: any) => showNotification(n.message, n.type);

  useEffect(() => {
    if (isOpen) {
      if (editingProductId) {
        const product = products.find(p => p.id === editingProductId);
        if (product) {
          setNewProductName(product.name || "");
          setNewProductPrice(product.price ? String(product.price) : "");
          setNewProductType(product.type || "product");
          setNewProductCategoryId(product.categoryId || "");
          setNewProductCode(product.code || "");
          setNewProductBarcode(product.barcode || "");
          setNewProductPurchasePrice(product.buyPrice ? String(product.buyPrice) : "");
          setNewProductWarehouseId(product.warehouseId || "");
          setNewProductStock(product.stock ? String(product.stock) : "");
          setNewProductMinStock(product.minStock ? String(product.minStock) : "");
          setNewProductUnit(product.unit || "");
          setNewProductSecondaryUnit(product.secondaryUnit || "");
          setNewProductUnitRatio(product.unitRatio ? String(product.unitRatio) : "");
          setNewProductDesc(product.description || "");
          setNewProductIsActive(product.isActive !== false);
          
          if (product.id) {
            getProductPriceHistory(product.id.toString()).then(setCurrentProductPriceHistory).catch(console.error);
          }
        }
      } else {
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
        setNewProductIsActive(true);
        setCurrentProductPriceHistory([]);
      }
      setProductFormTab("general");
    }
  }, [isOpen, editingProductId, products]);

__HANDLER__

  const handleSaveHistoryDate = async (h: any) => {
    try {
      await updateProductPriceHistory(h.id, { ...h, changeDate: editingHistoryDate });
      const updatedHistory = await getProductPriceHistory(editingProductId!.toString());
      setCurrentProductPriceHistory(updatedHistory);
      setEditingHistoryId(null);
      setEditingHistoryDate("");
      showNotification("تاریخ با موفقیت ویرایش شد", 'success');
    } catch (error) {
      console.error(error);
      showNotification("خطا در ویرایش تاریخ", 'error');
    }
  };

  if (!isOpen) return null;

  return (
__JSX__
  );
}
"""

new_file_content = new_file_content.replace('__HANDLER__', handler_content).replace('__JSX__', jsx_content)

with open('src/components/modals/ProductFormModal.tsx', 'w') as f:
    f.write(new_file_content)

print("Regenerated src/components/modals/ProductFormModal.tsx")
