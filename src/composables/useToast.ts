import { ref } from 'vue'

export interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'warning'
}

const toasts = ref<Toast[]>([])

export function useToast() {
    const showToast = (message: string, type: Toast['type'] = 'success') => {
        const id = crypto.randomUUID()
        toasts.value.push({ id, message, type })

        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            toasts.value = toasts.value.filter(t => t.id !== id)
        }, 3000)
    }

    return { toasts, showToast }
}