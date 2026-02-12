<script setup lang="ts">
import type { ExpenseHeader } from '../types/expense'

defineProps<{
    savedExpenses: ExpenseHeader[]
    editingIndex: number | null
    tripId: string
    isSidebarOpen: boolean
}>()

const emit = defineEmits(['edit', 'export', 'back'])
</script>

<template>
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false"
        class="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"></div>
    <aside :class="[
        'fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl transition-transform duration-300 lg:relative lg:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
        <div class="p-6 bg-slate-900 text-white shadow-lg">
            <button @click="emit('back')"
                class="text-[14px] text-blue-400 font-black mb-3 hover:text-blue-300 transition-colors tracking-widest uppercase">
                ← Volver
            </button>
            <h2 class="text-xl font-black tracking-tighter uppercase leading-none">Gastos del Viaje</h2>
            <p class="text-[13px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-bold">ID: {{ tripId }}</p>
        </div>

        <div class="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <TransitionGroup name="list">
                <div v-for="(exp, index) in savedExpenses" :key="index" @click="emit('edit', index)"
                    class="p-4 mb-4 rounded-2xl border-2 transition-all cursor-pointer group relative overflow-hidden"
                    :class="editingIndex === index
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
                <p class="text-xs font-black italic uppercase tracking-widest leading-relaxed">No hay gastos registrados
                    aún.</p>
            </div>
        </div>

        <div class="p-6 border-t border-slate-100 bg-white">
            <button @click="emit('edit')"
                class="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-[14px] hover:bg-emerald-700 transition-all uppercase tracking-[0.15em] shadow-lg active:scale-95">
                📥 Generar Excel SAP
            </button>
        </div>
    </aside>
</template>