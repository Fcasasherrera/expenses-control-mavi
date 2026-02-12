<script setup lang="ts">
defineProps<{
    totalAmount: number
    count: number
}>()
</script>

<template>
    <div class="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div
            class="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 text-3xl rotate-3 shadow-sm border border-blue-100">
            📑
        </div>
        <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-3">Gestión de Comprobantes SAP</h2>
        <p class="text-slate-400 font-bold max-w-sm mb-12 text-[14px] leading-relaxed">
            Selecciona un registro de la izquierda o crea uno nuevo para comenzar la carga.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <div
                class="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <p class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Monto Total Acumulado
                </p>
                <p class="text-4xl font-black text-slate-900">${{ totalAmount.toLocaleString() }} <span
                        class="text-sm text-slate-400">MXN</span></p>
            </div>
            <div
                class="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <p class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Documentos Listos</p>
                <p class="text-4xl font-black text-slate-900">{{ count }} <span
                        class="text-sm text-slate-400">Facturas</span></p>
            </div>
        </div>
    </div>
</template>