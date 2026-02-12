<script setup lang="ts">
import { useToast } from '../composables/useToast';
const { toasts } = useToast()
</script>

<template>
    <div class="fixed top-6 right-6 z-[100] space-y-3 pointer-events-none">
        <TransitionGroup 
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform translate-x-10 opacity-0"
            enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div v-for="toast in toasts" :key="toast.id"
                :class="[
                    'pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 min-w-[300px]',
                    toast.type === 'success' ? 'bg-white border-emerald-100 text-emerald-900' : '',
                    toast.type === 'error' ? 'bg-white border-rose-100 text-rose-900' : '',
                    toast.type === 'warning' ? 'bg-white border-amber-100 text-amber-900' : '',
                ]"
            >
                <div v-if="toast.type === 'success'" class="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                <div v-if="toast.type === 'error'" class="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✕</div>
                <div v-if="toast.type === 'warning'" class="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">!</div>
                
                <span class="font-black text-[13px] uppercase tracking-wide">{{ toast.message }}</span>
            </div>
        </TransitionGroup>
    </div>
</template>