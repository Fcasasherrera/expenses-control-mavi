export interface ExpenseItem {
  id: string;
  expenseId: string; // ZCGASTO
  costCenter: string; // ZCECO
  assignment: string; // ZZOUNR
  amount: number;     // ZAMOUNT
  itemText?: string;  // ZBKTXT_ITEM
}

export interface ExpenseHeader {
  vendorId: string;     // ZID
  vendorName: string;   // ZNOMBRE
  taxId?: string;       // ZRFC
  companyCode: string;  // ZBUKRS
  headerText?: string;  // ZBKTXT
  postingDate: string;  // ZBUDAT
  docDate: string;      // ZBLDAT
  reference: string;    // ZXBLNR
  totalAmount: number;  // ZAMOUNT
  currency: 'MXN' | 'USD'; // ZWAERS
  employeeBp: string;   // ZEMPLEADO
  fiscalId?: string;    // UUID
  items: ExpenseItem[];
}

export interface TravelTrip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'settled';
  totalSpent: number;
  invoiceCount: number;
}