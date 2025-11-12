<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-primary dark:bg-primary-800 text-white shadow-md">
      <div class="container">
        <div class="flex items-center justify-between py-4">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 text-white no-underline hover:opacity-90 transition-opacity">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="text-action">
              <path d="M16 4L4 10V22L16 28L28 22V10L16 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 16L4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 16V28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 16L28 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-xl font-bold">CarLogs</span>
          </NuxtLink>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-md hover:bg-primary-dark dark:hover:bg-primary-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            <svg v-if="!isDark" class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 pb-20">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div class="flex justify-around items-center py-2">
        <NuxtLink to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="nav-label">Tìm kiếm</span>
        </NuxtLink>

        <NuxtLink to="/community" class="nav-item" :class="{ active: $route.path.startsWith('/community') }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="nav-label">Cộng đồng</span>
        </NuxtLink>

        <NuxtLink to="/submit" class="nav-item-fab" :class="{ active: $route.path === '/submit' }">
          <div class="fab-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="nav-label">Đăng lỗi</span>
        </NuxtLink>

        <NuxtLink to="/diagnose" class="nav-item" :class="{ active: $route.path === '/diagnose' }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="nav-label">Chẩn đoán</span>
        </NuxtLink>

        <NuxtLink to="/profile" class="nav-item" :class="{ active: $route.path === '/profile' }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="nav-label">Hồ sơ</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
const { isDark, toggleDarkMode, initDarkMode } = useDarkMode()

onMounted(() => {
  initDarkMode()
})
</script>

<style scoped>
.nav-item {
  @apply flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 no-underline px-4 py-2 transition-colors flex-1 max-w-[80px];
}

.nav-item:hover {
  @apply text-secondary dark:text-secondary-light;
}

.nav-item.active {
  @apply text-secondary dark:text-secondary-light;
}

.nav-item svg {
  @apply w-6 h-6;
}

.nav-label {
  @apply text-xs font-medium;
}

.nav-item-fab {
  @apply flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 no-underline px-4 py-2 flex-1 max-w-[80px] -mt-5;
}

.fab-button {
  @apply w-14 h-14 bg-gradient-to-br from-action to-action-dark rounded-full flex items-center justify-center shadow-lg text-white transition-transform hover:scale-105;
}

.nav-item-fab.active .fab-button {
  @apply from-action-dark to-action;
}

.nav-item-fab .nav-label {
  @apply text-xs font-medium mt-1;
}
</style>
