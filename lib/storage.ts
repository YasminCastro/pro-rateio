import { Person, Bill } from "./types";

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
          startDate: period.startDate.toISOString(),
          endDate: period.endDate.toISOString(),
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
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);

        // Validar se as datas são válidas
        return {
          ...period,
          startDate: isNaN(startDate.getTime()) ? new Date() : startDate,
          endDate: isNaN(endDate.getTime()) ? new Date() : endDate,
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
        startDate: bill.startDate.toISOString(),
        endDate: bill.endDate.toISOString(),
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
      const startDate = new Date(bill.startDate);
      const endDate = new Date(bill.endDate);

      // Validar se as datas são válidas
      return {
        ...bill,
        startDate: isNaN(startDate.getTime()) ? new Date() : startDate,
        endDate: isNaN(endDate.getTime()) ? new Date() : endDate,
      };
    });
  } catch (error) {
    console.error("Erro ao carregar contas do localStorage:", error);
    return [];
  }
}
