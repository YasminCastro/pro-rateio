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
import { Person, Period } from "@/lib/types";
import { generateId } from "@/lib/id";
import { startOfMonth, endOfMonth, format, parseISO, isValid } from "date-fns";

interface AddPersonDialogProps {
  onAddPerson: (person: Person) => void;
}

// Função auxiliar para obter o primeiro dia do mês atual
function getFirstDayOfMonth(): Date {
  return startOfMonth(new Date());
}

// Função auxiliar para obter o último dia do mês atual
function getLastDayOfMonth(): Date {
  return endOfMonth(new Date());
}

// Função auxiliar para criar um novo período com datas padrão
function createDefaultPeriod(): Period {
  return {
    id: generateId(),
    startDate: getFirstDayOfMonth(),
    endDate: getLastDayOfMonth(),
  };
}

export function AddPersonDialog({ onAddPerson }: AddPersonDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [periods, setPeriods] = useState<Period[]>([createDefaultPeriod()]);

  // Resetar períodos quando o diálogo é aberto para usar as datas do mês atual
  useEffect(() => {
    if (open) {
      setName("");
      setPeriods([createDefaultPeriod()]);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const person: Person = {
      id: generateId(),
      name: name.trim(),
      periods: periods.map((p) => ({
        ...p,
        startDate: p.startDate instanceof Date ? p.startDate : parseISO(p.startDate as any),
        endDate: p.endDate instanceof Date ? p.endDate : parseISO(p.endDate as any),
      })),
    };

    onAddPerson(person);
    setName("");
    setPeriods([createDefaultPeriod()]);
    setOpen(false);
  };

  const addPeriod = () => {
    setPeriods([...periods, createDefaultPeriod()]);
  };

  const removePeriod = (id: string) => {
    setPeriods(periods.filter((p) => p.id !== id));
  };

  const updatePeriod = (
    id: string,
    field: "startDate" | "endDate",
    value: string
  ) => {
    setPeriods(
      periods.map((p) => (p.id === id ? { ...p, [field]: parseISO(value) } : p))
    );
  };

  // Função auxiliar para formatar data para input type="date"
  const formatDateForInput = (date: Date): string => {
    if (!date || !isValid(date)) {
      return format(new Date(), "yyyy-MM-dd");
    }
    return format(date, "yyyy-MM-dd");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Pessoa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Pessoa</DialogTitle>
            <DialogDescription>
              Adicione uma pessoa e defina os períodos em que ela esteve
              presente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da pessoa"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Períodos de Presença</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPeriod}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Período
                </Button>
              </div>

              {periods.map((period, index) => (
                <div
                  key={period.id}
                  className="grid grid-cols-2 gap-4 p-4 border rounded-lg"
                >
                  <div className="grid gap-2">
                    <Label htmlFor={`start-${period.id}`}>
                      Data de Início {index + 1}
                    </Label>
                    <Input
                      id={`start-${period.id}`}
                      type="date"
                      value={formatDateForInput(period.startDate)}
                      onChange={(e) =>
                        updatePeriod(period.id, "startDate", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`end-${period.id}`}>
                      Data de Fim {index + 1}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`end-${period.id}`}
                        type="date"
                        value={formatDateForInput(period.endDate)}
                        onChange={(e) =>
                          updatePeriod(period.id, "endDate", e.target.value)
                        }
                        required
                      />
                      {periods.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removePeriod(period.id)}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
