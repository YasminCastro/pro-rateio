export interface Person {
  id: string;
  name: string;
  periods: Period[];
}

export interface Period {
  id: string;
  startDate: Date;
  endDate: Date;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  startDate: Date;
  endDate: Date;
}

export interface PersonShare {
  personId: string;
  personName: string;
  days: number;
  share: number;
  percentage: number;
}

export interface BillCalculation {
  bill: Bill;
  totalDays: number;
  personShares: PersonShare[];
}
