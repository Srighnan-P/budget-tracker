import React from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export type TransactionForm = {
  name: string;
  type: 'income' | 'expense';
  amount: string;
  category: string;
};

type Category = {
  id: string;
  name: string;
};

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: TransactionForm) => void;
  categories: Category[];
  form: TransactionForm;
  setForm: React.Dispatch<React.SetStateAction<TransactionForm>>;
  isEditing?: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
  onSubmit,
  categories,
  form,
  setForm,
  isEditing = false,
}) => {
  if (!open) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setForm((prev) => ({ ...prev, type: value as 'income' | 'expense' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-0">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 relative mx-2 sm:mx-0">
        <button className="absolute top-3 right-3 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h2>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select value={form.type} onValueChange={handleTypeChange} name="type">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category <span className="text-xs text-muted-foreground">(optional)</span></label>
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
            >
              <option value="">No category</option>
              {categories.length === 0 ? (
                <option value="" disabled>No categories</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              )}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal; 