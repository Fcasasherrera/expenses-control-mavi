<script setup lang="ts">
import ToastContainer from './components/ToastContainer.vue'

</script>

<template>
  <div class="main-layout font-['Plus Jakarta Sans'] antialiased">
    <ToastContainer />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

  </div>
</template>

<style>
/* Reset global dentro de App.vue para asegurar que el scroll 
   y el tamaño de pantalla sean consistentes */
.main-layout {
  @apply min-h-screen w-full ;
}

/* Una transición suave entre pantallas para que se vea más pro */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ocultar scrollbars molestos pero permitir scroll */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply rounded-full;
}
</style>