"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BillCalculation } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BillCalculationCardProps {
  calculation: BillCalculation;
  onRemove: () => void;
}

export function BillCalculationCard({
  calculation,
  onRemove,
}: BillCalculationCardProps) {
  const { bill, totalDays, personShares } = calculation;
  const totalShare = personShares.reduce((sum, p) => sum + p.share, 0);
  const difference = bill.amount - totalShare;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{bill.name}</CardTitle>
            <CardDescription>
              Período: {format(bill.startDate, "dd/MM/yyyy", { locale: ptBR })}{" "}
              até {format(bill.endDate, "dd/MM/yyyy", { locale: ptBR })} (
              {totalDays} dias)
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Valor Total:</span>
            <span>R$ {bill.amount.toFixed(2)}</span>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pessoa</TableHead>
              <TableHead className="text-right">Dias</TableHead>
              <TableHead className="text-right">Percentual</TableHead>
              <TableHead className="text-right">Valor a Pagar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personShares.map((share) => (
              <TableRow key={share.personId}>
                <TableCell className="font-medium">
                  {share.personName}
                </TableCell>
                <TableCell className="text-right">{share.days}</TableCell>
                <TableCell className="text-right">
                  {share.percentage.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right font-semibold">
                  R$ {share.share.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-semibold">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{totalDays}</TableCell>
              <TableCell className="text-right">100%</TableCell>
              <TableCell className="text-right">
                R$ {totalShare.toFixed(2)}
                {Math.abs(difference) > 0.01 && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (diferença: R$ {difference.toFixed(2)})
                  </span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
