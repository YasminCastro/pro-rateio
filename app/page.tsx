"use client";

import { useState, useEffect, useCallback } from "react";
import { Person, Bill, BillCalculation } from "@/lib/types";
import { calculateBill } from "@/lib/calculations";
import { savePeople, loadPeople, saveBills, loadBills } from "@/lib/storage";
import { AddPersonDialog } from "@/components/add-person-dialog";
import { AddBillDialog } from "@/components/add-bill-dialog";
import { BillCalculationCard } from "@/components/bill-calculation-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Users, Receipt, Pencil } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Componente para item de pessoa com botão de editar
function PersonItem({
  person,
  onEdit,
  onRemove,
  onAddPerson,
}: {
  person: Person;
  onEdit: (person: Person) => void;
  onRemove: (id: string) => void;
  onAddPerson: (person: Person) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <p className="font-medium">{person.name}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {person.periods.length} período
          {person.periods.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex gap-2">
        <AddPersonDialog
          personToEdit={person}
          onEditPerson={onEdit}
          onAddPerson={onAddPerson}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
        <Button variant="ghost" size="sm" onClick={() => onRemove(person.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Componente para item de conta com botão de editar
function BillItem({
  bill,
  onEdit,
  onRemove,
  onAddBill,
}: {
  bill: Bill;
  onEdit: (bill: Bill) => void;
  onRemove: (id: string) => void;
  onAddBill: (bill: Bill) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <p className="font-medium">{bill.name}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          R$ {bill.amount.toFixed(2)} •{" "}
          {format(bill.startDate, "dd/MM/yyyy", { locale: ptBR })} até{" "}
          {format(bill.endDate, "dd/MM/yyyy", { locale: ptBR })}
        </p>
      </div>
      <div className="flex gap-2">
        <AddBillDialog
          billToEdit={bill}
          onEditBill={onEdit}
          onAddBill={onAddBill}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
        <Button variant="ghost" size="sm" onClick={() => onRemove(bill.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [calculations, setCalculations] = useState<BillCalculation[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar dados do localStorage ao montar o componente
  useEffect(() => {
    const loadedPeople = loadPeople();
    const loadedBills = loadBills();

    setPeople(loadedPeople);
    setBills(loadedBills);
    setIsInitialized(true);
  }, []);

  // Salvar pessoas no localStorage sempre que mudarem (após inicialização)
  useEffect(() => {
    if (isInitialized) {
      savePeople(people);
    }
  }, [people, isInitialized]);

  // Salvar contas no localStorage sempre que mudarem (após inicialização)
  useEffect(() => {
    if (isInitialized) {
      saveBills(bills);
    }
  }, [bills, isInitialized]);

  const recalculateAll = useCallback(
    (currentBills?: Bill[], currentPeople?: Person[]) => {
      const billsToUse = currentBills ?? bills;
      const peopleToUse = currentPeople ?? people;

      if (billsToUse.length === 0 || peopleToUse.length === 0) {
        setCalculations([]);
        return;
      }

      const newCalculations = billsToUse.map((bill) =>
        calculateBill(bill, peopleToUse)
      );
      setCalculations(newCalculations);
    },
    [bills, people]
  );

  // Recalcular quando pessoas ou contas mudarem (após inicialização)
  useEffect(() => {
    if (isInitialized) {
      recalculateAll();
    }
  }, [people, bills, isInitialized, recalculateAll]);

  const handleAddPerson = (person: Person) => {
    setPeople([...people, person]);
  };

  const handleAddBill = (bill: Bill) => {
    setBills([...bills, bill]);
  };

  const handleRemovePerson = (personId: string) => {
    setPeople(people.filter((p) => p.id !== personId));
  };

  const handleUpdatePerson = (updatedPerson: Person) => {
    setPeople(
      people.map((p) => (p.id === updatedPerson.id ? updatedPerson : p))
    );
  };

  const handleRemoveBill = (billId: string) => {
    setBills(bills.filter((b) => b.id !== billId));
  };

  const handleUpdateBill = (updatedBill: Bill) => {
    setBills(bills.map((b) => (b.id === updatedBill.id ? updatedBill : b)));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            Pro Rateio
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Divida contas proporcionalmente pelo tempo que cada pessoa ficou
            presente
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  <CardTitle>Contas</CardTitle>
                </div>
                <AddBillDialog onAddBill={handleAddBill} />
              </div>
              <CardDescription>
                Adicione as contas que precisam ser divididas (água, energia,
                etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bills.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
                  Nenhuma conta adicionada ainda
                </p>
              ) : (
                <div className="space-y-2">
                  {bills.map((bill) => (
                    <BillItem
                      key={bill.id}
                      bill={bill}
                      onEdit={handleUpdateBill}
                      onRemove={handleRemoveBill}
                      onAddBill={handleAddBill}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Pessoas</CardTitle>
                </div>
                <AddPersonDialog onAddPerson={handleAddPerson} />
              </div>
              <CardDescription>
                Adicione as pessoas e os períodos em que cada uma esteve
                presente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {people.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
                  Nenhuma pessoa adicionada ainda
                </p>
              ) : (
                <div className="space-y-2">
                  {people.map((person) => (
                    <PersonItem
                      key={person.id}
                      person={person}
                      onEdit={handleUpdatePerson}
                      onRemove={handleRemovePerson}
                      onAddPerson={handleAddPerson}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {calculations.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Resultados do Rateio
            </h2>
            {calculations.map((calculation) => (
              <BillCalculationCard
                key={calculation.bill.id}
                calculation={calculation}
                onRemove={() => handleRemoveBill(calculation.bill.id)}
              />
            ))}
          </div>
        )}

        {people.length === 0 && bills.length === 0 && (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                Comece adicionando pessoas e contas para calcular o rateio
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
