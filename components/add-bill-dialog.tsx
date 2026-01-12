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
import { Plus } from "lucide-react";
import { Bill } from "@/lib/types";
import { generateId } from "@/lib/id";
import { startOfMonth, endOfMonth, format, parseISO } from "date-fns";

interface AddBillDialogProps {
  onAddBill: (bill: Bill) => void;
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

export function AddBillDialog({ onAddBill }: AddBillDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(
    formatDateForInput(getFirstDayOfMonth())
  );
  const [endDate, setEndDate] = useState(
    formatDateForInput(getLastDayOfMonth())
  );

  // Resetar campos quando o diálogo é aberto para usar as datas do mês atual
  useEffect(() => {
    if (open) {
      setName("");
      setAmount("");
      setStartDate(formatDateForInput(getFirstDayOfMonth()));
      setEndDate(formatDateForInput(getLastDayOfMonth()));
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const bill: Bill = {
      id: generateId(),
      name: name.trim(),
      amount: parseFloat(amount),
      startDate: parseISO(startDate),
      endDate: parseISO(endDate),
    };

    onAddBill(bill);
    setName("");
    setAmount("");
    setStartDate(formatDateForInput(getFirstDayOfMonth()));
    setEndDate(formatDateForInput(getLastDayOfMonth()));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Conta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Conta</DialogTitle>
            <DialogDescription>
              Adicione uma conta (água, energia, etc.) para calcular o rateio.
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
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
