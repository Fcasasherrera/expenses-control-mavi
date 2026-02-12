<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { exportToExcel } from '../utils/excelExport'
import { useExpenses } from '../composables/useExpenses'
import ExpenseSidebar from '../components/ExpenseSidebar.vue'
import ExpenseDashboard from '../components/ExpenseDashboard.vue'
import ExpenseForm from '../components/ExpenseForm.vue'
import ExpenseHeader from '../components/ExpenseHeader.vue'

// 1. Configuración de Rutas
const route = useRoute()
const router = useRouter()
const tripId = route.params.id as string

// 2. Lógica de Interfaz Local (UI State)
const isSidebarOpen = ref(false)

// 3. Importación de Lógica de Negocio (del Composable)
const {
  savedExpenses,
  isCreating,
  activeExpense,
  editingIndex,
  totalTripAmount,
  startNewExpense,
  saveExpense,
  removeExpense,
  cancelEdition,
  editExpense,
  addLineItem,
  removeLineItem
} = useExpenses()

// 4. Acciones de Orquestación
const handleExport = () => {
  exportToExcel(savedExpenses.value, tripId)
}

const handleEdit = (index: number) => {
  editExpense(index)
  // Cerrar sidebar en móvil tras seleccionar
  if (window.innerWidth < 1024) isSidebarOpen.value = false
}
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden font-['Plus Jakarta Sans'] relative">
    <ExpenseSidebar :isSidebarOpen="isSidebarOpen" :savedExpenses="savedExpenses" :editingIndex="editingIndex" :tripId="tripId" @edit="handleEdit"
      @export="handleExport" @back="router.push('/')" />

    <main class="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar w-full">
      <ExpenseHeader :isSidebarOpen="isSidebarOpen" :editingIndex="editingIndex" :isCreating="isCreating" @new="startNewExpense" @save="saveExpense" @delete="removeExpense" @cancel="cancelEdition" />

      <div class="p-4 lg:p-10">
        <ExpenseDashboard v-if="!isCreating" :totalAmount="totalTripAmount" :count="savedExpenses.length" />
        <ExpenseForm v-else :activeExpense="activeExpense" @addLine="addLineItem" @removeLine="removeLineItem" />
      </div>
    </main>
  </div>
</template>

<style scoped>
@reference "../style.css";

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

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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
</style>