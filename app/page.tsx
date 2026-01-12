"use client";

import { useState } from "react";
import { Person, Bill, BillCalculation } from "@/lib/types";
import { calculateBill } from "@/lib/calculations";
import { AddPersonDialog } from "@/components/add-person-dialog";
import { AddBillDialog } from "@/components/add-bill-dialog";
import { BillCalculationCard } from "@/components/bill-calculation-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Users, Receipt } from "lucide-react";

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [calculations, setCalculations] = useState<BillCalculation[]>([]);

  const handleAddPerson = (person: Person) => {
    setPeople([...people, person]);
    recalculateAll();
  };

  const handleAddBill = (bill: Bill) => {
    const newBills = [...bills, bill];
    setBills(newBills);
    recalculateAll(newBills);
  };

  const handleRemovePerson = (personId: string) => {
    const newPeople = people.filter((p) => p.id !== personId);
    setPeople(newPeople);
    recalculateAll(undefined, newPeople);
  };

  const handleRemoveBill = (billId: string) => {
    const newBills = bills.filter((b) => b.id !== billId);
    setBills(newBills);
    recalculateAll(newBills);
  };

  const recalculateAll = (currentBills?: Bill[], currentPeople?: Person[]) => {
    const billsToUse = currentBills ?? bills;
    const peopleToUse = currentPeople ?? people;

    const newCalculations = billsToUse.map((bill) =>
      calculateBill(bill, peopleToUse)
    );
    setCalculations(newCalculations);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            Pro Rateio
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Divida contas proporcionalmente pelo tempo que cada pessoa ficou presente
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
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
                Adicione as pessoas e os períodos em que cada uma esteve presente
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
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {person.periods.length} período
                          {person.periods.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePerson(person.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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
                Adicione as contas que precisam ser divididas (água, energia, etc.)
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
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{bill.name}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          R$ {bill.amount.toFixed(2)} •{" "}
                          {bill.startDate.toLocaleDateString("pt-BR")} até{" "}
                          {bill.endDate.toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBill(bill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
