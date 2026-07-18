import React from 'react';
import { motion } from 'motion/react';
import { UserPlus, ArrowDownToLine, ArrowUpFromLine, Wallet, List, Package } from 'lucide-react';

interface MobileRestrictedMenuProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setIsReceiveModalOpen?: (isOpen: boolean) => void;
  setIsPayModalOpen?: (isOpen: boolean) => void;
}

export default function MobileRestrictedMenu({ activeTab, setActiveTab, setIsReceiveModalOpen, setIsPayModalOpen }: MobileRestrictedMenuProps) {
  const tabs = [
    {
      id: 'persons',
      label: 'ثبت شخص',
      icon: UserPlus,
      action: () => setActiveTab('persons')
    },
    {
      id: 'list_receipts',
      label: 'رسیدها',
      icon: List,
      action: () => setActiveTab('list_receive_receipt')
    },
    {
      id: 'receive',
      label: 'دریافت',
      icon: ArrowDownToLine,
      action: () => {
        if (setIsReceiveModalOpen) setIsReceiveModalOpen(true);
        else setActiveTab('create_receive_receipt');
      }
    },
    {
      id: 'pay',
      label: 'پرداخت',
      icon: ArrowUpFromLine,
      action: () => {
        if (setIsPayModalOpen) setIsPayModalOpen(true);
        else setActiveTab('create_pay_receipt');
      }
    },
    {
      id: 'person_ledger',
      label: 'کارت حساب',
      icon: Wallet,
      action: () => setActiveTab('person_ledger')
    },
    {
      id: 'products',
      label: 'کالاها',
      icon: Package,
      action: () => setActiveTab('products')
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-[100] pb-safe">
      <div className="flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id || 
                           (tab.id === 'receive' && activeTab === 'create_receive_receipt') ||
                           (tab.id === 'pay' && activeTab === 'create_pay_receipt') ||
                           (tab.id === 'list_receipts' && (activeTab === 'list_receive_receipt' || activeTab === 'list_pay_receipt'));
          
          return (
            <button
              key={tab.id}
              onClick={tab.action}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <tab.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"
                  />
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
