import { Person, Bill } from "./types";
import { formatISO, parseISO, isValid } from "date-fns";

const STORAGE_KEYS = {
  PEOPLE: "pro-rateio-people",
  BILLS: "pro-rateio-bills",
} as const;

export function savePeople(people: Person[]): void {
  try {
    const serialized = JSON.stringify(
      people.map((person) => ({
        ...person,
        periods: person.periods.map((period) => ({
          ...period,
          startDate: formatISO(period.startDate),
          endDate: formatISO(period.endDate),
        })),
      }))
    );
    localStorage.setItem(STORAGE_KEYS.PEOPLE, serialized);
  } catch (error) {
    console.error("Erro ao salvar pessoas no localStorage:", error);
  }
}

export function loadPeople(): Person[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PEOPLE);
    if (!stored) return [];

    const data = JSON.parse(stored);
    return data.map((person: any) => ({
      ...person,
      periods: person.periods.map((period: any) => {
        const startDate = parseISO(period.startDate);
        const endDate = parseISO(period.endDate);

        // Validar se as datas são válidas
        return {
          ...period,
          startDate: isValid(startDate) ? startDate : new Date(),
          endDate: isValid(endDate) ? endDate : new Date(),
        };
      }),
    }));
  } catch (error) {
    console.error("Erro ao carregar pessoas do localStorage:", error);
    return [];
  }
}

export function saveBills(bills: Bill[]): void {
  try {
    const serialized = JSON.stringify(
      bills.map((bill) => ({
        ...bill,
        startDate: formatISO(bill.startDate),
        endDate: formatISO(bill.endDate),
      }))
    );
    localStorage.setItem(STORAGE_KEYS.BILLS, serialized);
  } catch (error) {
    console.error("Erro ao salvar contas no localStorage:", error);
  }
}

export function loadBills(): Bill[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BILLS);
    if (!stored) return [];

    const data = JSON.parse(stored);
    return data.map((bill: any) => {
      const startDate = parseISO(bill.startDate);
      const endDate = parseISO(bill.endDate);

      // Validar se as datas são válidas
      return {
        ...bill,
        startDate: isValid(startDate) ? startDate : new Date(),
        endDate: isValid(endDate) ? endDate : new Date(),
      };
    });
  } catch (error) {
    console.error("Erro ao carregar contas do localStorage:", error);
    return [];
  }
}
