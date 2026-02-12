<script setup lang="ts">
import { ref } from 'vue';
import type { TravelTrip } from '../types/expense';

/**
 * Active tab state for filtering trips
 */
const activeTab = ref<'ACTIVOS' | 'HISTORIAL'>('ACTIVOS');

/**
 * Mock data for the trips list.
 * In a real scenario, this would be fetched from an API based on activeTab.
 */
const trips = ref<TravelTrip[]>([
  {
    id: 'MTY-2026',
    destination: 'Auditoría Monterrey',
    startDate: '2026-02-10',
    endDate: '2026-02-15',
    status: 'active',
    totalSpent: 12450.50,
    invoiceCount: 8
  },
  {
    id: 'GDL-2026',
    destination: 'Reunión Trimestral GDL',
    startDate: '2026-03-01',
    endDate: '2026-03-04',
    status: 'active',
    totalSpent: 5200.00,
    invoiceCount: 3
  }
]);
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <header class="flex justify-between items-end mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase">Control de Gastos</h1>
        <p class="text-slate-500 font-semibold text-sm italic">Bienvenido, Fernando Casas</p>
      </div>
      <button class="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-blue-200">
        + NUEVO VIAJE
      </button>
    </header>

    <nav class="flex gap-8 border-b border-slate-200 mb-8">
      <button 
        v-for="tab in ['ACTIVOS', 'HISTORIAL']" 
        :key="tab"
        @click="activeTab = tab as any"
        :class="[
          'pb-4 px-2 text-xs font-black tracking-widest transition-all relative',
          activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        ]"
      >
        {{ tab }}
        <div v-if="activeTab === tab" 
             class="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full animate-in zoom-in duration-300">
        </div>
      </button>
    </nav>

    <TransitionGroup 
      tag="div" 
      name="list"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div 
        v-for="(trip, index) in trips" 
        :key="trip.id"
        @click="$router.push(`/trip/${trip.id}`)"
        class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-2 relative overflow-hidden"
        :style="{ transitionDelay: `${index * 100}ms` }"
      >
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-0"></div>

        <div class="relative z-10">
          <div class="flex justify-between mb-6">
            <span class="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
              {{ trip.status === 'active' ? 'Activo' : 'Finalizado' }}
            </span>
            <span class="text-slate-200 group-hover:text-blue-600 transition-colors font-black text-xl">→</span>
          </div>
          
          <h2 class="text-2xl font-black text-slate-800 mb-1 leading-tight tracking-tight">{{ trip.destination }}</h2>
          <p class="text-[10px] text-slate-400 font-bold mb-8 italic uppercase tracking-widest">
            {{ trip.startDate }} — {{ trip.endDate }}
          </p>

          <div class="flex justify-between items-center bg-slate-50 p-5 rounded-2xl group-hover:bg-white group-hover:shadow-inner transition-colors">
            <div>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Gastado</p>
              <p class="text-lg font-black text-slate-800">${{ trip.totalSpent.toLocaleString() }}</p>
            </div>
            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm font-black text-blue-600 text-xs border border-slate-50">
              {{ trip.invoiceCount }}
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <div v-if="trips.length === 0" class="text-center py-20 animate-pulse">
      <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">No se encontraron viajes</p>
    </div>
  </div>
</template>

<style scoped>
/* List entrance animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Staggered entry logic handled via :style in v-for */
</style>