import { Person, Bill, BillCalculation, PersonShare } from "./types";

/**
 * Calcula o número de dias entre duas datas (inclusive)
 */
export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  return diffDays;
}

/**
 * Verifica se duas datas se sobrepõem
 */
function datesOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 <= end2 && start2 <= end1;
}

/**
 * Calcula a interseção de dois períodos
 */
function getPeriodIntersection(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): { start: Date; end: Date } | null {
  if (!datesOverlap(start1, end1, start2, end2)) {
    return null;
  }

  const start = new Date(Math.max(start1.getTime(), start2.getTime()));
  const end = new Date(Math.min(end1.getTime(), end2.getTime()));

  return { start, end };
}

/**
 * Calcula quantos dias uma pessoa ficou durante o período da conta
 */
export function calculatePersonDaysInBill(
  person: Person,
  billStartDate: Date,
  billEndDate: Date
): number {
  let totalDays = 0;

  for (const period of person.periods) {
    const intersection = getPeriodIntersection(
      period.startDate,
      period.endDate,
      billStartDate,
      billEndDate
    );

    if (intersection) {
      totalDays += calculateDaysBetween(intersection.start, intersection.end);
    }
  }

  return totalDays;
}

/**
 * Calcula o rateio de uma conta entre as pessoas
 */
export function calculateBill(
  bill: Bill,
  people: Person[]
): BillCalculation {
  const billTotalDays = calculateDaysBetween(bill.startDate, bill.endDate);
  
  // Calcula os dias de cada pessoa no período da conta
  const personDaysMap = new Map<string, number>();
  const personNamesMap = new Map<string, string>();

  for (const person of people) {
    const days = calculatePersonDaysInBill(
      person,
      bill.startDate,
      bill.endDate
    );
    personDaysMap.set(person.id, days);
    personNamesMap.set(person.id, person.name);
  }

  // Calcula o total de dias de todas as pessoas
  const totalPersonDays = Array.from(personDaysMap.values()).reduce(
    (sum, days) => sum + days,
    0
  );

  // Calcula a parte de cada pessoa
  const personShares: PersonShare[] = [];
  
  for (const [personId, days] of personDaysMap.entries()) {
    const percentage = totalPersonDays > 0 ? (days / totalPersonDays) * 100 : 0;
    const share = totalPersonDays > 0 ? (days / totalPersonDays) * bill.amount : 0;

    personShares.push({
      personId,
      personName: personNamesMap.get(personId) || "",
      days,
      share: Math.round(share * 100) / 100, // Arredonda para 2 casas decimais
      percentage: Math.round(percentage * 100) / 100,
    });
  }

  // Ordena por nome
  personShares.sort((a, b) => a.personName.localeCompare(b.personName));

  return {
    bill,
    totalDays: billTotalDays,
    personShares,
  };
}
