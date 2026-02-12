<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import type { ExpenseHeader, ExpenseItem } from '../types/expense'

const route = useRoute()
const router = useRouter()
const tripId = route.params.id as string

// Lógica para controlar el sidebar en móvil
const isSidebarOpen = ref(false)

const savedExpenses = ref<ExpenseHeader[]>([])
const editingIndex = ref<number | null>(null)

const createEmptyExpense = (): ExpenseHeader => ({
  vendorId: '1900000000',
  vendorName: '',
  taxId: '',
  companyCode: '5510',
  headerText: '',
  postingDate: new Date().toISOString().split('T')[0],
  docDate: new Date().toISOString().split('T')[0],
  reference: '',
  totalAmount: 0,
  currency: 'MXN',
  employeeBp: '',
  fiscalId: '',
  items: []
})

const activeExpense = reactive<ExpenseHeader>(createEmptyExpense())

watch(() => activeExpense.postingDate, (newVal) => {
  activeExpense.docDate = newVal
})

const addLineItem = (): void => {
  activeExpense.items.push({
    id: crypto.randomUUID(),
    expenseId: '',
    costCenter: '',
    assignment: '',
    amount: 0
  })
}

const removeLineItem = (index: number): void => {
  activeExpense.items.splice(index, 1)
}

const saveExpense = (): void => {
  if (!activeExpense.vendorName || !activeExpense.totalAmount) {
    alert("Vendor Name and Amount are mandatory")
    return
  }

  const expenseCopy = JSON.parse(JSON.stringify(activeExpense))

  if (editingIndex.value !== null) {
    savedExpenses.value[editingIndex.value] = expenseCopy
    editingIndex.value = null
  } else {
    savedExpenses.value.push(expenseCopy)
  }

  Object.assign(activeExpense, createEmptyExpense())
  // Cerramos sidebar al guardar en móvil para ver el mensaje o resultado
  isSidebarOpen.value = false
}

const editExpense = (index: number): void => {
  if (editingIndex.value === index) {
    // Si ya está seleccionado, limpiamos todo
    editingIndex.value = null
    Object.assign(activeExpense, createEmptyExpense())
  } else {
    // Si es uno nuevo, lo cargamos
    editingIndex.value = index
    Object.assign(activeExpense, JSON.parse(JSON.stringify(savedExpenses.value[index])))
  }
  
  // Cerramos sidebar en móvil por comodidad
  if (window.innerWidth < 1024) isSidebarOpen.value = false
}

const exportToExcel = (): void => {
  const excelData: any[] = []
  savedExpenses.value.forEach(exp => {
    if (exp.items.length > 0) {
      exp.items.forEach(item => {
        excelData.push({
          'ZID': exp.vendorId, 'ZNOMBRE': exp.vendorName, 'ZRFC': exp.taxId,
          'ZCGASTO': item.expenseId, 'ZBUKRS': exp.companyCode, 'ZBKTXT': exp.headerText,
          'ZBUDAT': exp.postingDate, 'ZBLDAT': exp.docDate, 'ZXBLNR': exp.reference,
          'ZAMOUNT': item.amount, 'ZWAERS': exp.currency, 'ZCECO': item.costCenter,
          'ZZOUNR': item.assignment, 'ZEMPLEADO': exp.employeeBp, 'UUID': exp.fiscalId
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
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden font-['Plus Jakarta Sans'] relative">

    <div v-if="isSidebarOpen" @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"></div>

    <aside :class="[
      'fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl transition-transform duration-300 lg:relative lg:translate-x-0',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="p-6 bg-slate-900 text-white shadow-lg">
        <button @click="router.push('/')"
          class="text-[14px] text-blue-400 font-black mb-3 hover:text-blue-300 transition-colors tracking-widest">
          ← VOLVER A VIAJES
        </button>
        <h2 class="text-xl font-black tracking-tighter uppercase leading-none">Gastos del Viaje</h2>
        <p class="text-[13px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-bold">Trip ID: {{ tripId }}</p>
      </div>

      <div class="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <TransitionGroup name="list">
          <div v-for="(exp, index) in savedExpenses" :key="index" @click="editExpense(index)"
            class="p-4 mb-4 rounded-2xl border-2 transition-all cursor-pointer group relative overflow-hidden" :class="editingIndex === index
              ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
              : 'border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white hover:shadow-sm'">

            <div class="flex justify-between items-start">
              <span class="font-black text-[13px] transition-colors uppercase tracking-widest"
                :class="editingIndex === index ? 'text-blue-900' : 'text-slate-400 group-hover:text-blue-600'">
                {{ exp.reference || 'SIN FOLIO' }}
              </span>
              <span class="text-[10px] font-black px-2 py-0.5 rounded-lg transition-colors"
                :class="editingIndex === index ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'">
                {{ exp.currency }}
              </span>
            </div>

            <p class="text-[13px] font-bold mt-1 truncate uppercase"
              :class="editingIndex === index ? 'text-blue-700' : 'text-slate-600'">
              {{ exp.vendorName || 'Nuevo Proveedor' }}
            </p>

            <div class="flex justify-between mt-3 items-end">
              <span class="text-[10px] font-mono transition-colors"
                :class="editingIndex === index ? 'text-blue-500' : 'text-slate-400'">
                UUID: {{ exp.fiscalId ? exp.fiscalId.substring(0, 8) + '...' : 'PENDIENTE' }}
              </span>
              <span class="font-black text-sm transition-colors"
                :class="editingIndex === index ? 'text-blue-900 scale-110' : 'text-slate-900'">
                ${{ exp.totalAmount.toLocaleString() }}
              </span>
            </div>

            <div v-if="editingIndex === index" class="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
          </div>
        </TransitionGroup>

        <div v-if="savedExpenses.length === 0" class="text-center py-20 text-slate-300 px-6">
          <p class="text-xs font-black italic uppercase tracking-widest leading-relaxed">No hay gastos registrados aún
            para este viaje.</p>
        </div>
      </div>

      <div class="p-6 border-t border-slate-100 bg-white">
        <button @click="exportToExcel"
          class="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-[14px] hover:bg-emerald-700 transition-all uppercase tracking-[0.15em] shadow-lg active:scale-95 shadow-emerald-100">
          📥 Generar Excel SAP
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar w-full">
      <header
        class="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center sticky top-0 z-10 shadow-sm gap-4">
        <div class="flex items-center gap-4">
          <button @click="isSidebarOpen = true"
            class="lg:hidden p-2 bg-slate-100 rounded-xl text-slate-600 font-bold text-xs">
            MENU
          </button>
          <div>
            <h1 class="text-xl lg:text-3xl font-black text-slate-900 uppercase leading-none">Captura de Factura</h1>
            <p class="hidden sm:block text-[14px] font-bold text-slate-400 tracking-widest uppercase mt-2 italic">
              Registro técnico para contabilidad SAP</p>
          </div>
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <button @click="Object.assign(activeExpense, createEmptyExpense()); editingIndex = null"
            class="flex-1 md:flex-none px-4 lg:px-6 py-2 text-[12px] lg:text-[14px] font-black text-slate-400 hover:text-slate-900 rounded-xl uppercase tracking-widest transition-colors bg-slate-50 md:bg-transparent">
            Limpiar
          </button>
          <button @click="saveExpense"
            class="flex-[2] md:flex-none px-6 lg:px-10 py-3 bg-slate-900 text-white rounded-2xl font-black text-[12px] lg:text-[14px] hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest active:scale-95">
            {{ editingIndex !== null ? 'Actualizar' : 'Confirmar Gasto' }}
          </button>
        </div>
      </header>

      <div class="p-4 lg:p-10 max-w-7xl mx-auto space-y-4">

        <div
          class="bg-white p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div class="col-span-1 md:col-span-3 border-b border-slate-50 pb-4 mb-2 flex items-center gap-3">
            <div
              class="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-xs">
              01</div>
            <span class="text-slate-900 font-black text-xs uppercase tracking-widest">Identificación del
              Proveedor</span>
          </div>
          <div class="col-span-1">
            <label class="label-sap text-blue-600">ID Fijo SAP</label>
            <input v-model="activeExpense.vendorId" type="text" class="sap-input font-black bg-slate-50 text-blue-800"
              disabled>
          </div>
          <div class="col-span-1 md:col-span-2">
            <label class="label-sap">Razón Social / Nombre Real</label>
            <input v-model="activeExpense.vendorName" type="text" class="sap-input"
              placeholder="Nombre completo del establecimiento">
          </div>
          <div class="col-span-1">
            <label class="label-sap">RFC Emisor</label>
            <input v-model="activeExpense.taxId" type="text" class="sap-input font-mono" maxlength="13"
              placeholder="ABCD000000XXX">
          </div>
          <div class="col-span-1">
            <label class="label-sap">Referencia / Folio</label>
            <input v-model="activeExpense.reference" type="text" class="sap-input" placeholder="# Factura o Ticket">
          </div>
          <div class="col-span-1 md:col-span-3">
            <label class="label-sap">Folio Fiscal (UUID)</label>
            <input v-model="activeExpense.fiscalId" type="text"
              class="sap-input font-mono text-xs uppercase tracking-tighter"
              placeholder="00000000-0000-0000-0000-000000000000">
          </div>
        </div>

        <div
          class="bg-white p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div
            class="col-span-1 sm:col-span-2 md:col-span-4 border-b border-slate-50 pb-4 mb-2 flex items-center gap-3">
            <div
              class="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-xs">
              02</div>
            <span class="text-slate-900 font-black text-xs uppercase tracking-widest">Configuración Contable</span>
          </div>
          <div><label class="label-sap">Fecha Contab.</label><input v-model="activeExpense.postingDate" type="date"
              class="sap-input"></div>
          <div><label class="label-sap">Fecha Doc.</label><input v-model="activeExpense.docDate" type="date"
              class="sap-input"></div>
          <div><label class="label-sap">Sociedad</label><input v-model="activeExpense.companyCode" type="text"
              class="sap-input font-bold" placeholder="5510"></div>
          <div><label class="label-sap">Moneda</label><input v-model="activeExpense.currency" type="text"
              class="sap-input bg-slate-50" disabled></div>
          <div class="col-span-1 sm:col-span-2"><label class="label-sap">BP Empleado</label><input
              v-model="activeExpense.employeeBp" type="text" class="sap-input" placeholder="1000..."></div>
          <div class="col-span-1 sm:col-span-2"><label class="label-sap">Texto de Cabecera</label><input
              v-model="activeExpense.headerText" type="text" class="sap-input"
              placeholder="Referencia global del gasto"></div>
          <div class="col-span-1 sm:col-span-2 md:col-span-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <label class="label-sap text-blue-700">Importe Total</label>
            <input v-model="activeExpense.totalAmount" type="number"
              class="bg-transparent border-none w-full font-black text-blue-800 text-xl focus:ring-0 outline-none"
              placeholder="0.00">
          </div>
        </div>

        <div
          class="bg-white rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
          <div
            class="p-6 lg:p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-xs">
                03</div>
              <span class="font-black text-slate-900 text-xs uppercase tracking-widest">Desglose de Partidas</span>
            </div>
            <button @click="addLineItem"
              class="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[13px] font-black hover:bg-blue-700 transition-all uppercase tracking-widest shadow-lg shadow-blue-100">
              + Nuevo Concepto
            </button>
          </div>
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-sm min-w-[700px]">
              <thead>
                <tr class="text-left text-[13px] font-black text-slate-400 uppercase bg-slate-50/30 tracking-[0.2em]">
                  <th class="px-6 lg:px-10 py-5">ID Gasto</th>
                  <th class="px-6 lg:px-10 py-5">Centro Costo</th>
                  <th class="px-6 lg:px-10 py-5">Asignación</th>
                  <th class="px-6 lg:px-10 py-5">Monto</th>
                  <th class="px-6 lg:px-10 py-5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <TransitionGroup name="list">
                  <tr v-for="(item, i) in activeExpense.items" :key="item.id"
                    class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 lg:px-10 py-5"><input v-model="item.expenseId" type="text"
                        class="sap-input w-24 text-center font-bold" placeholder="001"></td>
                    <td class="px-6 lg:px-10 py-5"><input v-model="item.costCenter" type="text" class="sap-input"
                        placeholder="DAYC..."></td>
                    <td class="px-6 lg:px-10 py-5"><input v-model="item.assignment" type="text" class="sap-input"></td>
                    <td class="px-6 lg:px-10 py-5 font-black"><input v-model="item.amount" type="number"
                        class="sap-input text-blue-600 font-black"></td>
                    <td class="px-6 lg:px-10 py-5 text-right">
                      <button @click="removeLineItem(i)"
                        class="text-red-400 hover:text-red-600 transition-colors font-black text-[13px] uppercase tracking-widest">Eliminar</button>
                    </td>
                  </tr>
                </TransitionGroup>
              </tbody>
            </table>
          </div>
          <div v-if="activeExpense.items.length === 0" class="p-20 text-center text-slate-300">
            <p class="text-xs font-bold italic uppercase tracking-[0.2em]">Agrega al menos un concepto para el desglose
              SAP</p>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
@reference "../style.css";

/* Sidebar transition effect */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom scrollbar for a cleaner sidebar look */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>