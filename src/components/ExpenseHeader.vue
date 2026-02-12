<script setup lang="ts">
defineProps<{
    isSidebarOpen: boolean
    isCreating: boolean
    editingIndex: number | null
}>()

const emit = defineEmits(['new', 'save', 'cancel', 'delete'])
</script>

<template>
    <header
        class="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 lg:p-8 flex justify-between items-center sticky top-0 z-10 shadow-sm gap-4">
        <div class="flex items-center gap-4">
            <button @click="isSidebarOpen = true"
                class="lg:hidden p-2 bg-slate-100 rounded-xl text-slate-600 font-bold text-xs uppercase">Menu</button>
            <div>
                <h1 class="text-xl lg:text-3xl font-black text-slate-900 uppercase leading-none">
                    {{ isCreating ? (editingIndex !== null ? 'Editar Gasto' : 'Nuevo Gasto') : 'Resumen del Viaje' }}
                </h1>
                <p class="hidden sm:block text-[14px] font-bold text-slate-400 tracking-widest uppercase mt-2 italic">
                    Registro técnico para contabilidad SAP</p>
            </div>
        </div>

        <div class="flex gap-3">
            <button v-if="!isCreating" @click="emit('new')"
                class="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[14px] hover:bg-blue-700 transition-all shadow-xl uppercase tracking-widest active:scale-95">
                + Nuevo Gasto
            </button>
            <template v-else>
                <button @click="emit('cancel')"
                    class="px-4 py-2 text-[14px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                    Cancelar
                </button>
                <button v-if="editingIndex !== null" @click="emit('delete', editingIndex)"
                    class="px-8 py-3 bg-red-900 text-white rounded-2xl fnt-black text-[14px] hover:bg-red-600 transition-all shadow-xl uppercase tracking-widest active:scale-95">
                    Borrar
                </button>    
                <button @click="emit('save')"
                    class="px-8 py-3 bg-slate-900 text-white rounded-2xl fnt-black text-[14px] hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest active:scale-95">
                    {{ editingIndex !== null ? 'Actualizar' : 'Guardar Gasto' }}
                </button>
            </template>
        </div>
    </header>
</template>