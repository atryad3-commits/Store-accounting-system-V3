import { StateCreator } from 'zustand';
import {
  getWarehouses,
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseStocks,
  recalculateAllWarehouseStocks
} from '../../services/inventoryService';

export interface WarehouseSlice {
  warehouses: any[];
  warehouseStocks: any[];
  isLoadingWarehouses: boolean;
  isLoadingStocks: boolean;
  selectedWarehouseId: string | null;

  fetchWarehouses: () => Promise<void>;
  fetchWarehouseStocks: () => Promise<void>;
  recalculateWarehouseStocks: () => Promise<any[]>;
  addWarehouse: (warehouse: any) => Promise<any>;
  updateWarehouse: (id: string, warehouse: any) => Promise<any>;
  deleteWarehouse: (id: string) => Promise<void>;
  setSelectedWarehouseId: (id: string | null) => void;
}

export const createWarehouseSlice: StateCreator<WarehouseSlice> = (set, get) => ({
  warehouses: [],
  warehouseStocks: [],
  isLoadingWarehouses: false,
  isLoadingStocks: false,
  selectedWarehouseId: null,

  fetchWarehouses: async () => {
    set({ isLoadingWarehouses: true });
    try {
      const data = await getWarehouses();
      set({ warehouses: data || [] });
    } catch (e) {
      console.error('Error fetching warehouses in store:', e);
    } finally {
      set({ isLoadingWarehouses: false });
    }
  },

  fetchWarehouseStocks: async () => {
    set({ isLoadingStocks: true });
    try {
      const data = await getWarehouseStocks();
      set({ warehouseStocks: data || [] });
    } catch (e) {
      console.error('Error fetching warehouse stocks in store:', e);
    } finally {
      set({ isLoadingStocks: false });
    }
  },

  recalculateWarehouseStocks: async () => {
    set({ isLoadingStocks: true });
    try {
      const stocks = await recalculateAllWarehouseStocks();
      set({ warehouseStocks: stocks || [] });
      return stocks || [];
    } catch (e) {
      console.error('Error recalculating warehouse stocks:', e);
      return [];
    } finally {
      set({ isLoadingStocks: false });
    }
  },

  addWarehouse: async (warehouseData) => {
    const newWh = await addWarehouse(warehouseData);
    await get().fetchWarehouses();
    return newWh;
  },

  updateWarehouse: async (id, warehouseData) => {
    const updated = await updateWarehouse(id, warehouseData);
    await get().fetchWarehouses();
    return updated;
  },

  deleteWarehouse: async (id) => {
    await deleteWarehouse(id);
    await get().fetchWarehouses();
  },

  setSelectedWarehouseId: (id) => set({ selectedWarehouseId: id }),
});
