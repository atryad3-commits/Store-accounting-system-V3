import sys
import re

file_path = 'src/components/loans/LoansPayment.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target_state = "  const [paymentMethodId, setPaymentMethodId] = useState<string>('');"
replacement_state = """  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);"""

target_handleConfirmPay = """  const handleConfirmPay = async () => {
    if (!selectedInst || !selectedLoan) return;
    if (!paymentMethodId) {
      showNotification('لطفاً روش پرداخت را انتخاب کنید.', 'error');
      return;
    }

    try {"""
replacement_handleConfirmPay = """  const handleConfirmPay = async () => {
    if (!selectedInst || !selectedLoan) return;
    
    if (selectedInst.status === 'paid') {
      showNotification('این قسط قبلاً پرداخت شده است.', 'warning');
      return;
    }

    if (!paymentMethodId) {
      showNotification('لطفاً روش پرداخت را انتخاب کنید.', 'error');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {"""

target_catch = """    } catch(err) {
      showNotification('خطا در پرداخت قسط', 'error');
    }
  };"""
replacement_catch = """    } catch(err) {
      showNotification('خطا در پرداخت قسط', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };"""

target_button = """                  onClick={handleConfirmPay}
                  disabled={!paymentMethodId}
                  className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                >"""
replacement_button = """                  onClick={handleConfirmPay}
                  disabled={!paymentMethodId || isSubmitting}
                  className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                >"""

if target_state in content and target_handleConfirmPay in content and target_catch in content and target_button in content:
    content = content.replace(target_state, replacement_state)
    content = content.replace(target_handleConfirmPay, replacement_handleConfirmPay)
    content = content.replace(target_catch, replacement_catch)
    content = content.replace(target_button, replacement_button)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found")
