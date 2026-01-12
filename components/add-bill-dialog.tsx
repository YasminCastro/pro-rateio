"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { Bill } from "@/lib/types";
import { generateId } from "@/lib/id";
import { startOfMonth, endOfMonth, format, parseISO } from "date-fns";

interface AddBillDialogProps {
  onAddBill: (bill: Bill) => void;
  billToEdit?: Bill;
  onEditBill?: (bill: Bill) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Função auxiliar para obter o primeiro dia do mês atual
function getFirstDayOfMonth(): Date {
  return startOfMonth(new Date());
}

// Função auxiliar para obter o último dia do mês atual
function getLastDayOfMonth(): Date {
  return endOfMonth(new Date());
}

// Função auxiliar para formatar data para input type="date"
function formatDateForInput(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function AddBillDialog({
  onAddBill,
  billToEdit,
  onEditBill,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddBillDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(
    formatDateForInput(getFirstDayOfMonth())
  );
  const [endDate, setEndDate] = useState(
    formatDateForInput(getLastDayOfMonth())
  );
  const isEditMode = !!billToEdit;

  // Usar estado controlado se fornecido, caso contrário usar estado interno
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  // Resetar ou carregar dados quando o diálogo é aberto
  useEffect(() => {
    if (open) {
      if (billToEdit) {
        // Modo de edição: carregar dados da conta
        setName(billToEdit.name);
        setAmount(billToEdit.amount.toString());
        setStartDate(formatDateForInput(billToEdit.startDate));
        setEndDate(formatDateForInput(billToEdit.endDate));
      } else {
        // Modo de adição: resetar para valores padrão
        setName("");
        setAmount("");
        setStartDate(formatDateForInput(getFirstDayOfMonth()));
        setEndDate(formatDateForInput(getLastDayOfMonth()));
      }
    }
  }, [open, billToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const bill: Bill = {
      id: isEditMode ? billToEdit!.id : generateId(),
      name: name.trim(),
      amount: parseFloat(amount),
      startDate: parseISO(startDate),
      endDate: parseISO(endDate),
    };

    if (isEditMode && onEditBill) {
      onEditBill(bill);
    } else {
      onAddBill(bill);
    }

    setName("");
    setAmount("");
    setStartDate(formatDateForInput(getFirstDayOfMonth()));
    setEndDate(formatDateForInput(getLastDayOfMonth()));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Conta
          </Button>
        </DialogTrigger>
      )}
      {isEditMode && (
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Conta" : "Adicionar Conta"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edite os dados da conta para recalcular o rateio."
                : "Adicione uma conta (água, energia, etc.) para calcular o rateio."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bill-name">Nome da Conta</Label>
              <Input
                id="bill-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Conta de Água, Conta de Energia"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bill-amount">Valor Total (R$)</Label>
              <Input
                id="bill-amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bill-start">Data de Início</Label>
              <Input
                id="bill-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bill-end">Data de Fim</Label>
              <Input
                id="bill-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">{isEditMode ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
