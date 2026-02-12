import * as XLSX from 'xlsx'
import type { ExpenseHeader } from '../types/expense'

export const exportToExcel = (expenses: ExpenseHeader[], tripId: string) => {
  const excelData: any[] = []
  
  expenses.forEach(exp => {
    if (exp.items.length > 0) {
      exp.items.forEach(item => {
        excelData.push({
          'ZID': exp.vendorId, 'ZNOMBRE': exp.vendorName, 'ZRFC': exp.taxId,
          'ZCGASTO': item.expenseId, 'ZBUKRS': exp.companyCode, 'ZAMOUNT': item.amount,
          'ZWAERS': exp.currency, 'ZCECO': item.costCenter, 'UUID': exp.fiscalId
          // ... el resto de tus campos de SAP
        })
      })
    } else {
      excelData.push({
        'ZID': exp.vendorId, 'ZNOMBRE': exp.vendorName, 'ZAMOUNT': exp.totalAmount,
        'ZBUDAT': exp.postingDate, 'ZXBLNR': exp.reference
      })
    }
  })

  const ws = XLSX.utils.json_to_sheet(excelData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Expenses")
  XLSX.writeFile(wb, `Expenses_Trip_${tripId}.xlsx`)
}