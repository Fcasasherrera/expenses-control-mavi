import { computed } from 'vue'
import type { ExpenseHeader } from '../types/expense'

export function useValidations(expense: ExpenseHeader) {
  
  // 1. Reglas de Validación (Puras)
  const validateRfc = (rfc: string) => /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/i.test(rfc)
  const validateUuid = (uuid: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)

  // 2. Estados Reactivos (Computed)
  const rfcError = computed(() => {
    if (!expense.taxId) return 'El RFC es obligatorio'
    return validateRfc(expense.taxId) ? null : 'Formato de RFC inválido'
  })

  const uuidError = computed(() => {
    if (!expense.fiscalId) return null // Opcional en algunos casos
    return validateUuid(expense.fiscalId) ? null : 'UUID debe tener formato 8-4-4-4-12'
  })

  const itemsTotal = computed(() => 
    expense.items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0)
  )

  const totalMismatch = computed(() => {
    return Math.abs(itemsTotal.value - expense.totalAmount) > 0.01
  })

  // 3. Validador Maestro (Para bloquear el botón Guardar)
  const isFormValid = computed(() => {
    return (
      expense.vendorName.length > 0 &&
      validateRfc(expense.taxId || '') &&
      !totalMismatch.value &&
      expense.items.length > 0 &&
      expense.totalAmount > 0
    )
  })

  return {
    rfcError,
    uuidError,
    itemsTotal,
    totalMismatch,
    isFormValid,
    validateRfc // Por si la necesitas usar manual
  }
}