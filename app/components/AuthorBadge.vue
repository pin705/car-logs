<script setup lang="ts">
interface Props {
  badge: string
}

const props = defineProps<Props>()

const getBadgeConfig = (badge: string) => {
  const configs = {
    beginner: {
      text: 'Người mới',
      class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    },
    contributor: {
      text: 'Đóng góp',
      class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    expert: {
      text: 'Chuyên gia',
      class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    },
    trusted: {
      text: 'Tin cậy',
      class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    master: {
      text: 'Bậc thầy',
      class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
  }
  
  return configs[badge as keyof typeof configs] || {
    text: badge,
    class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

const config = getBadgeConfig(props.badge)
</script>

<template>
  <span :class="['inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full', config.class]">
    {{ config.text }}
  </span>
</template>
