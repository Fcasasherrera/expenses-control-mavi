<script setup lang="ts">
import { useValidations } from '../composables/useValidations';
import type { ExpenseHeader } from '../types/expense'

const props = defineProps<{
    activeExpense: ExpenseHeader
}>()

const emit = defineEmits(['addLine', 'removeLine'])

// Extraemos todo el poder del hook
const { 
    rfcError, 
    uuidError, 
    totalMismatch, 
    itemsTotal,
} = useValidations(props.activeExpense)
</script>

<template>
    <div class="space-y-6 animate-slide-up">
        <div class="bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div class="col-span-1 md:col-span-3 border-b border-slate-50 pb-4 mb-2 flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-xs">01</div>
                <span class="text-slate-900 font-black text-xs uppercase tracking-widest">Identificación</span>
            </div>

            <div class="col-span-1 md:col-span-2">
                <label class="label-sap">Razón Social *</label>
                <input v-model="activeExpense.vendorName" type="text" 
                    :class="['sap-input', !activeExpense.vendorName ? 'border-amber-200 bg-amber-50/20' : 'border-emerald-100']"
                    placeholder="Nombre del establecimiento">
            </div>

            <div class="col-span-1">
                <label class="label-sap">RFC Emisor *</label>
                <input v-model="activeExpense.taxId" type="text" 
                    :class="['sap-input font-mono uppercase', rfcError ? 'border-red-400 bg-red-50' : 'border-emerald-100']"
                    maxlength="13" placeholder="ABCD000000XXX">
                <p v-if="rfcError" class="text-[10px] text-red-500 font-black mt-1 uppercase tracking-tighter">{{ rfcError }}</p>
            </div>

            <div class="col-span-1">
                <label class="label-sap">Referencia</label>
                <input v-model="activeExpense.reference" type="text" class="sap-input" placeholder="# Factura">
            </div>

            <div class="col-span-1 md:col-span-2">
                <label class="label-sap">Folio Fiscal (UUID)</label>
                <input v-model="activeExpense.fiscalId" type="text"
                    :class="['sap-input font-mono text-xs uppercase', uuidError ? 'border-red-400 bg-red-50' : 'border-emerald-100']"
                    placeholder="00000000-0000-0000-0000-000000000000">
                <p v-if="uuidError" class="text-[10px] text-red-500 font-black mt-1 uppercase tracking-tighter">{{ uuidError }}</p>
            </div>
        </div>

        <div class="bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div class="col-span-1 sm:col-span-2 md:col-span-4 border-b border-slate-50 pb-4 mb-2 flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-xs">02</div>
                <span class="text-slate-900 font-black text-xs uppercase tracking-widest">Contabilidad</span>
            </div>
            
            <div><label class="label-sap">Fecha Contab.</label><input v-model="activeExpense.postingDate" type="date" class="sap-input"></div>
            <div><label class="label-sap">Fecha Doc.</label><input v-model="activeExpense.docDate" type="date" class="sap-input"></div>
            <div><label class="label-sap">Sociedad</label><input v-model="activeExpense.companyCode" type="text" class="sap-input font-bold"></div>
            <div><label class="label-sap">Moneda</label><input v-model="activeExpense.currency" type="text" class="sap-input bg-slate-50" disabled></div>
            
            <div class="col-span-1 sm:col-span-2 md:col-span-4 p-5 rounded-2xl border-2 transition-all"
                :class="totalMismatch ? 'bg-red-50 border-red-200' : 'bg-emerald-50/50 border-emerald-100'">
                <label class="label-sap" :class="totalMismatch ? 'text-red-700' : 'text-emerald-700'">
                    {{ totalMismatch ? '⚠️ El total no coincide con las partidas' : '✓ Importe Total Validado' }}
                </label>
                <div class="flex items-center gap-2">
                    <span class="text-2xl font-black" :class="totalMismatch ? 'text-red-900' : 'text-emerald-900'">$</span>
                    <input v-model="activeExpense.totalAmount" type="number"
                        class="bg-transparent border-none w-full font-black text-2xl focus:ring-0 outline-none"
                        :class="totalMismatch ? 'text-red-900' : 'text-emerald-900'">
                </div>
                <p v-if="totalMismatch" class="text-[11px] font-black text-red-500 uppercase mt-1">
                    Suma de partidas actual: ${{ itemsTotal.toLocaleString() }}
                </p>
            </div>
        </div>

        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
            <div class="p-6 lg:p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-xs">03</div>
                    <span class="font-black text-slate-900 text-xs uppercase tracking-widest">Partidas ({{ activeExpense.items.length }})</span>
                </div>
                <button @click="emit('addLine')"
                    class="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[13px] font-black hover:bg-blue-700 transition-all uppercase tracking-widest shadow-md">
                    + Nuevo Concepto
                </button>
            </div>
            
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm min-w-[700px]">
                    <thead>
                        <tr class="text-left text-[11px] font-black text-slate-400 uppercase bg-slate-50/30 tracking-[0.2em]">
                            <th class="px-6 lg:px-10 py-5">ID Gasto</th>
                            <th class="px-6 lg:px-10 py-5">Centro Costo</th>
                            <th class="px-6 lg:px-10 py-5">Asignación</th>
                            <th class="px-6 lg:px-10 py-5 text-right">Monto</th>
                            <th class="px-6 lg:px-10 py-5 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        <tr v-for="(item, i) in activeExpense.items" :key="item.id" class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 lg:px-10 py-5">
                                <input v-model="item.expenseId" type="text" class="sap-input w-24 text-center font-bold" placeholder="001">
                            </td>
                            <td class="px-6 lg:px-10 py-5">
                                <input v-model="item.costCenter" type="text" 
                                    :class="['sap-input', !item.costCenter ? 'border-amber-200' : '']" placeholder="CECO">
                            </td>
                            <td class="px-6 lg:px-10 py-5">
                                <input v-model="item.assignment" type="text" class="sap-input" placeholder="Opcional">
                            </td>
                            <td class="px-6 lg:px-10 py-5">
                                <input v-model="item.amount" type="number" class="sap-input text-right font-black text-blue-600">
                            </td>
                            <td class="px-6 lg:px-10 py-5 text-right">
                                <button @click="emit('removeLine', i)"
                                    class="text-red-400 hover:text-red-600 transition-colors font-black text-[11px] uppercase tracking-widest">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="activeExpense.items.length === 0" class="p-10 text-center text-slate-400 text-xs font-bold uppercase italic">
                    No hay conceptos agregados. Presiona "+ Nuevo Concepto"
                </div>
            </div>
        </div>
    </div>
</template>