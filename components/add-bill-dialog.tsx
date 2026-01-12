"use client";

import { useState } from "react";
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

interface AddBillDialogProps {
  onAddBill: (bill: Bill) => void;
}

export function AddBillDialog({ onAddBill }: AddBillDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const bill: Bill = {
      id: generateId(),
      name: name.trim(),
      amount: parseFloat(amount),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    onAddBill(bill);
    setName("");
    setAmount("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date().toISOString().split("T")[0]);
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
