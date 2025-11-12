<template>
  <div class="home-page">
    <!-- Search Section -->
    <section class="search-section">
      <div class="container">
        <h1 class="search-title">Tìm lỗi xe của bạn</h1>
        <div class="search-box">
          <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Nhập mã lỗi (P0300) hoặc triệu chứng..."
            class="search-input"
            @input="handleSearch"
          />
        </div>
      </div>
    </section>

    <!-- My Car Section -->
    <section class="my-car-section" v-if="savedCar">
      <div class="container">
        <div class="my-car-card card">
          <div class="car-info">
            <svg class="car-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 17H4a2 2 0 01-2-2v-2a2 2 0 012-2h1m0 0h14m-14 0V9a4 4 0 014-4h6a4 4 0 014 4v2m0 0h1a2 2 0 012 2v2a2 2 0 01-2 2h-1m-14 0a2 2 0 104 0m-4 0a2 2 0 114 0m10 0a2 2 0 104 0m-4 0a2 2 0 114 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
              <h3 class="car-title">Xe của bạn</h3>
              <p class="car-details">{{ savedCar.make }} {{ savedCar.model }} {{ savedCar.year }}</p>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" @click="filterByCar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Lọc
          </button>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions">
      <div class="container">
        <div class="action-buttons">
          <NuxtLink to="/diagnose" class="action-card card">
            <div class="action-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="action-title">Chẩn đoán mã lỗi</h3>
            <p class="action-desc">Tra cứu ngay mã OBD-II</p>
          </NuxtLink>

          <NuxtLink to="/submit" class="action-card card action-card-accent">
            <div class="action-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="action-title">Đăng lỗi mới</h3>
            <p class="action-desc">Chia sẻ kinh nghiệm của bạn</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Hot Errors Today -->
    <section class="errors-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🔥 Lỗi Hot Hôm Nay</h2>
          <select v-model="sortBy" class="sort-select" @change="handleSort">
            <option value="popularity">Phổ biến nhất</option>
            <option value="recent">Mới nhất</option>
            <option value="views">Nhiều lượt xem</option>
          </select>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Đang tải...</p>
        </div>

        <div v-else-if="errors.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>Chưa có lỗi nào</h3>
          <p>Hãy là người đầu tiên đóng góp!</p>
        </div>

        <div v-else class="errors-grid">
          <div v-for="error in errors" :key="error._id" class="error-card card">
            <div class="error-header">
              <h3 class="error-title">{{ error.title }}</h3>
              <span v-if="error.errorCode" class="badge badge-primary">{{ error.errorCode }}</span>
            </div>
            
            <p class="error-description">{{ truncate(error.symptoms, 100) }}</p>
            
            <div class="error-meta">
              <div class="car-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 17H4a2 2 0 01-2-2v-2a2 2 0 012-2h1m0 0h14m-14 0V9a4 4 0 014-4h6a4 4 0 014 4v2m0 0h1a2 2 0 012 2v2a2 2 0 01-2 2h-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ error.car?.make }} {{ error.car?.model }}</span>
              </div>
              
              <div class="stats">
                <div class="stat-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>{{ error.views || 0 }}</span>
                </div>
                <div class="stat-item popularity">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ error.popularity || 0 }}</span>
                </div>
              </div>
            </div>

            <div class="error-footer">
              <span class="error-solutions">{{ error.solutions?.length || 0 }} giải pháp</span>
              <NuxtLink :to="`/errors/${error._id}`" class="btn btn-sm btn-primary">Xem chi tiết</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const searchQuery = ref('')
const sortBy = ref('popularity')
const loading = ref(false)
const errors = ref([])

// Mock saved car data (will be replaced with real data from auth)
const savedCar = ref({
  make: 'Toyota',
  model: 'Camry',
  year: 2020
})

// Utility: Debounce function
const useDebounceFn = (fn, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

// Fetch errors on mount
onMounted(async () => {
  await fetchErrors()
})

const fetchErrors = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/errors', {
      query: { sort: sortBy.value, search: searchQuery.value }
    })
    errors.value = data || []
  } catch (error) {
    console.error('Error fetching errors:', error)
    errors.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = useDebounceFn(() => {
  fetchErrors()
}, 500)

const handleSort = () => {
  fetchErrors()
}

const filterByCar = () => {
  // Apply car filter
  searchQuery.value = `${savedCar.value.make} ${savedCar.value.model}`
  fetchErrors()
}

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped>
.home-page {
  background-color: var(--color-surface);
}

.search-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  padding: var(--spacing-2xl) 0;
}

.search-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.search-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 3.5rem;
  font-size: var(--font-size-lg);
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.my-car-section {
  padding: var(--spacing-xl) 0;
}

.my-car-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.car-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.car-icon {
  color: var(--color-primary);
}

.car-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.car-details {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
}

.btn-sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.quick-actions {
  padding: 0 0 var(--spacing-xl) 0;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.action-card {
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.action-icon {
  width: 64px;
  height: 64px;
  background-color: var(--color-primary-light);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
}

.action-card-accent .action-icon {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
}

.action-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.action-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.errors-section {
  padding: var(--spacing-xl) 0 var(--spacing-2xl) 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.sort-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: var(--spacing-2xl);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
}

.empty-state svg {
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
}

.errors-grid {
  display: grid;
  gap: var(--spacing-lg);
}

.error-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.error-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.error-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  flex: 1;
}

.error-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.error-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.car-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.stats {
  display: flex;
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.stat-item.popularity {
  color: var(--color-accent);
  font-weight: 600;
}

.error-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-solutions {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@media (min-width: 768px) {
  .errors-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
