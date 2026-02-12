import { ref, reactive, computed, watch } from 'vue'
import type { ExpenseHeader } from '../types/expense'
import { useValidations } from './useValidations'
import { useToast } from './useToast'

export function useExpenses() {
    const savedExpenses = ref<ExpenseHeader[]>([])
    const isCreating = ref(false)
    const editingIndex = ref<number | null>(null)
    const { showToast } = useToast()
    const createEmptyExpense = (): ExpenseHeader => ({
        vendorId: '1900000000',
        vendorName: 'Taller',
        taxId: 'CAME840315RH5',
        companyCode: '5510',
        headerText: '',
        postingDate: new Date().toISOString().split('T')[0] || '',
        docDate: new Date().toISOString().split('T')[0] || '',
        reference: '',
        totalAmount: 0,
        currency: 'MXN',
        employeeBp: '',
        fiscalId: '550e8400-e29b-41d4-a716-446655440000',
        items: []
    })

    const activeExpense = reactive<ExpenseHeader>(createEmptyExpense())

    const { isFormValid, totalMismatch, itemsTotal, rfcError, uuidError } = useValidations(activeExpense)

    // Sincronización de fechas
    watch(() => activeExpense.postingDate, (newVal) => {
        activeExpense.docDate = newVal
    })

    const totalTripAmount = computed(() =>
        savedExpenses.value.reduce((acc, curr) => acc + curr.totalAmount, 0)
    )

    // --- MÉTODOS DE ACCIÓN ---

    const startNewExpense = () => {
        editingIndex.value = null
        isCreating.value = true
        Object.assign(activeExpense, createEmptyExpense())
    }

    const editExpense = (index: number) => {
        if (editingIndex.value === index) {
            cancelEdition()
        } else {
            editingIndex.value = index
            isCreating.value = true
            Object.assign(activeExpense, JSON.parse(JSON.stringify(savedExpenses.value[index])))
        }
    }

    const saveExpense = () => {
        // 1. Creamos un array para recolectar los problemas
        const errors: string[] = []

        // 2. Chequeo de Identificación
        if (!activeExpense.vendorName) errors.push("Falta Razón Social")
        if (rfcError.value) errors.push("RFC Inválido")
        if (uuidError.value) errors.push("UUID con formato incorrecto")

        // 3. Chequeo de Contabilidad
        if (activeExpense.totalAmount <= 0) errors.push("El importe total debe ser mayor a 0")
        if (totalMismatch.value) errors.push("Los montos no cuadran (Faltan $" + Math.abs(itemsTotal.value - activeExpense.totalAmount).toFixed(2) + ")")

        // 4. Chequeo de Partidas
        if (activeExpense.items.length === 0) {
            errors.push("Debes agregar al menos un concepto")
        } else {
            const hasEmptyItems = activeExpense.items.some(item => !item.costCenter || item.amount <= 0)
            if (hasEmptyItems) errors.push("Hay partidas con Centro de Costo o Monto vacío")
        }

        // 5. Disparar Toasts inteligentes
        if (errors.length > 0) {
            // Si hay muchos errores, mandamos un resumen pro
            if (errors.length > 2) {
                showToast(`Hay ${errors.length} errores en el formulario`, "error")
            } else {
                // Si son poquitos, mostramos el primero o los unimos
                showToast(errors.join(" | "), "error")
            }
            return false
        }

        // --- Si todo está bien, procedemos a guardar ---
        const expenseCopy = JSON.parse(JSON.stringify(activeExpense))
        if (editingIndex.value !== null) {
            savedExpenses.value[editingIndex.value] = expenseCopy
            showToast("Gasto actualizado correctamente", "success")
        } else {
            savedExpenses.value.push(expenseCopy)
            showToast("Gasto guardado con éxito", "success")
        }

        cancelEdition()
        return true
    }

    const cancelEdition = () => {
        editingIndex.value = null
        isCreating.value = false
        Object.assign(activeExpense, createEmptyExpense())
    }

    // --- MANEJO DE PARTIDAS (ITEMS) ---

    const addLineItem = () => {
        activeExpense.items.push({
            id: crypto.randomUUID(),
            expenseId: '',
            costCenter: '',
            assignment: '',
            amount: 0
        })
    }

    const removeLineItem = (index: number) => {
        activeExpense.items.splice(index, 1)
        showToast("Concepto eliminado", "warning")
    }

    const removeExpense = (index: number) => {
        // Obtenemos el nombre o referencia para el mensaje del toast
        const expenseName = savedExpenses.value[index]?.vendorName || 'Gasto sin nombre'

        // Eliminamos del array
        savedExpenses.value.splice(index, 1)

        // Si estábamos editando JUSTO ese gasto, cancelamos la edición
        if (editingIndex.value === index) {
            cancelEdition()
        } else if (editingIndex.value !== null && editingIndex.value > index) {
            // Ajustamos el índice si borramos uno que estaba antes del que editamos
            editingIndex.value--
        }

        showToast(`Eliminado: ${expenseName}`, 'warning')
    }

    return {
        // Estado
        savedExpenses,
        isCreating,
        editingIndex,
        activeExpense,
        // Computeds
        totalTripAmount,
        isFormValid,
        totalMismatch,
        itemsTotal,
        rfcError,
        uuidError,
        // Métodos
        startNewExpense,
        editExpense,
        saveExpense,
        removeExpense,
        cancelEdition,
        addLineItem,
        removeLineItem
    }
}