<template>
  <transition name="alert-slide">
    <div
      v-if="visible"
      :class="alertClasses"
      class="alert"
      role="alert"
    >
      <div class="flex items-start gap-3">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <svg v-if="type === 'success'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="type === 'error'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="type === 'warning'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h3 v-if="title" class="font-semibold text-sm mb-1">{{ title }}</h3>
          <p class="text-sm">{{ message }}</p>
        </div>

        <!-- Close Button -->
        <button
          v-if="closable"
          @click="close"
          class="flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors"
          aria-label="Close alert"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  closable: {
    type: Boolean,
    default: true
  },
  autoDismiss: {
    type: Boolean,
    default: false
  },
  dismissTimeout: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)
let dismissTimer = null

const alertClasses = computed(() => {
  const baseClasses = 'rounded-lg border-l-4 p-4 shadow-md transition-all duration-200'
  const typeClasses = {
    success: 'bg-success-50 dark:bg-success-900 dark:bg-opacity-20 border-success text-success-800 dark:text-success-200',
    error: 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border-red-500 text-red-800 dark:text-red-200',
    warning: 'bg-action-50 dark:bg-action-900 dark:bg-opacity-20 border-action text-action-800 dark:text-action-200',
    info: 'bg-secondary-50 dark:bg-secondary-900 dark:bg-opacity-20 border-secondary text-secondary-800 dark:text-secondary-200'
  }
  return `${baseClasses} ${typeClasses[props.type]}`
})

const close = () => {
  visible.value = false
  if (dismissTimer) {
    clearTimeout(dismissTimer)
  }
  emit('close')
}

onMounted(() => {
  if (props.autoDismiss) {
    dismissTimer = setTimeout(() => {
      close()
    }, props.dismissTimeout)
  }
})

onUnmounted(() => {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
  }
})
</script>

<style scoped>
.alert {
  position: relative;
}

.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: all 0.3s ease;
}

.alert-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.alert-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
