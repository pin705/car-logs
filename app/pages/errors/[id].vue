<template>
  <div class="error-detail-page">
    <div v-if="loading" class="container loading-state">
      <div class="spinner"></div>
      <p>Đang tải...</p>
    </div>

    <div v-else-if="errorData" class="container">
      <!-- Error Header -->
      <div class="error-header card">
        <div class="header-top">
          <div class="error-meta">
            <span v-if="errorData.errorCode" class="badge badge-primary">{{ errorData.errorCode }}</span>
            <span class="badge" :class="`badge-${errorData.status}`">{{ getStatusText(errorData.status) }}</span>
          </div>
          <div class="stats-compact">
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ errorData.views }}</span>
            </div>
            <div class="stat-item popularity">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ errorData.popularity }}</span>
            </div>
          </div>
        </div>

        <h1 class="error-title">{{ errorData.title }}</h1>

        <div class="car-info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 17H4a2 2 0 01-2-2v-2a2 2 0 012-2h1m0 0h14m-14 0V9a4 4 0 014-4h6a4 4 0 014 4v2m0 0h1a2 2 0 012 2v2a2 2 0 01-2 2h-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="car-details">{{ errorData.car.make }} {{ errorData.car.model }} {{ errorData.car.year }}</span>
        </div>

        <div class="author-info">
          <div class="author-avatar">
            {{ errorData.author?.username?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div>
            <div class="author-name">{{ errorData.author?.username || 'Người dùng' }}</div>
            <div class="post-time">{{ formatDate(errorData.createdAt) }}</div>
          </div>
          <div v-if="errorData.author?.badges?.length" class="author-badges">
            <span v-for="badge in errorData.author.badges" :key="badge" class="badge badge-accent">
              {{ badge }}
            </span>
          </div>
        </div>
      </div>

      <!-- Symptoms -->
      <div class="error-section card">
        <h2 class="section-title">Triệu chứng</h2>
        <p class="section-content">{{ errorData.symptoms }}</p>
      </div>

      <!-- Description -->
      <div v-if="errorData.description && errorData.description !== errorData.symptoms" class="error-section card">
        <h2 class="section-title">Mô tả chi tiết</h2>
        <p class="section-content">{{ errorData.description }}</p>
      </div>

      <!-- Solutions -->
      <div class="solutions-section card">
        <div class="section-header">
          <h2 class="section-title">Giải pháp ({{ errorData.solutions?.length || 0 }})</h2>
          <button class="btn btn-accent btn-sm" @click="showAddSolution = !showAddSolution">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Thêm giải pháp
          </button>
        </div>

        <!-- Add Solution Form -->
        <div v-if="showAddSolution" class="add-solution-form">
          <textarea 
            v-model="newSolution.description"
            class="form-textarea"
            placeholder="Mô tả giải pháp của bạn..."
          ></textarea>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Chi phí ước tính (VNĐ)</label>
              <input 
                v-model.number="newSolution.cost"
                type="number"
                class="form-input"
                placeholder="0"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Thời gian cần</label>
              <input 
                v-model="newSolution.timeRequired"
                type="text"
                class="form-input"
                placeholder="VD: 2 giờ"
              />
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-outline btn-sm" @click="showAddSolution = false">Hủy</button>
            <button class="btn btn-primary btn-sm" @click="submitSolution">Gửi giải pháp</button>
          </div>
        </div>

        <!-- Solutions List -->
        <div v-if="errorData.solutions?.length" class="solutions-list">
          <div v-for="(solution, index) in errorData.solutions" :key="index" class="solution-card">
            <div class="solution-header">
              <div class="solution-author">
                <div class="author-avatar small">
                  {{ solution.author?.username?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <div>
                  <div class="author-name">{{ solution.author?.username || 'Người dùng' }}</div>
                  <div class="post-time">{{ formatDate(solution.createdAt) }}</div>
                </div>
              </div>
              <div class="solution-votes">
                <button class="vote-btn" @click="upvoteSolution(index)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 15l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <span class="vote-count">{{ solution.upvotes }}</span>
              </div>
            </div>
            <p class="solution-content">{{ solution.description }}</p>
            <div class="solution-meta">
              <span v-if="solution.cost">
                <strong>Chi phí:</strong> {{ formatCurrency(solution.cost) }}
              </span>
              <span v-if="solution.timeRequired">
                <strong>Thời gian:</strong> {{ solution.timeRequired }}
              </span>
              <span v-if="solution.verified" class="verified-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Đã xác minh
              </span>
            </div>
          </div>
        </div>

        <div v-else class="empty-solutions">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>Chưa có giải pháp nào. Hãy là người đầu tiên đóng góp!</p>
        </div>
      </div>
    </div>

    <div v-else class="container error-state">
      <h2>Không tìm thấy lỗi</h2>
      <NuxtLink to="/" class="btn btn-primary">Về trang chủ</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const errorId = route.params.id

const loading = ref(true)
const errorData = ref(null)
const showAddSolution = ref(false)
const newSolution = ref({
  description: '',
  cost: null,
  timeRequired: ''
})

onMounted(async () => {
  await fetchError()
})

const fetchError = async () => {
  loading.value = true
  try {
    errorData.value = await $fetch(`/api/errors/${errorId}`)
  } catch (err) {
    console.error('Error fetching error:', err)
  } finally {
    loading.value = false
  }
}

const submitSolution = async () => {
  if (!newSolution.value.description.trim()) {
    alert('Vui lòng nhập mô tả giải pháp')
    return
  }

  try {
    // This will be implemented with proper API
    alert('Giải pháp sẽ được thêm trong giai đoạn tiếp theo')
    showAddSolution.value = false
    newSolution.value = { description: '', cost: null, timeRequired: '' }
  } catch (err) {
    console.error('Error submitting solution:', err)
    alert('Có lỗi xảy ra. Vui lòng thử lại.')
  }
}

const upvoteSolution = (index) => {
  // This will be implemented with proper API
  alert('Tính năng upvote sẽ được thêm trong giai đoạn tiếp theo')
}

const getStatusText = (status) => {
  const statusMap = {
    open: 'Đang mở',
    resolved: 'Đã giải quyết',
    pending: 'Đang xử lý'
  }
  return statusMap[status] || status
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount)
}
</script>

<style scoped>
.error-detail-page {
  padding: var(--spacing-xl) 0 var(--spacing-2xl) 0;
  min-height: calc(100vh - 160px);
}

.loading-state,
.error-state {
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

.error-header {
  margin-bottom: var(--spacing-lg);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.error-meta {
  display: flex;
  gap: var(--spacing-sm);
}

.badge-open {
  background-color: var(--color-info);
  color: white;
}

.badge-resolved {
  background-color: var(--color-success);
  color: white;
}

.badge-pending {
  background-color: var(--color-warning);
  color: white;
}

.stats-compact {
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

.error-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  line-height: 1.3;
}

.car-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-weight: 600;
}

.author-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--font-size-xl);
}

.author-avatar.small {
  width: 32px;
  height: 32px;
  font-size: var(--font-size-base);
}

.author-name {
  font-weight: 600;
  color: var(--color-text);
}

.post-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.author-badges {
  margin-left: auto;
  display: flex;
  gap: var(--spacing-xs);
}

.error-section {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.section-content {
  line-height: 1.8;
  color: var(--color-text);
}

.solutions-section {
  margin-bottom: var(--spacing-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.btn-sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.add-solution-form {
  background-color: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xl);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.solutions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.solution-card {
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
}

.solution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.solution-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.solution-votes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.vote-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.vote-btn:hover {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.vote-count {
  font-weight: 600;
  color: var(--color-accent);
}

.solution-content {
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
}

.solution-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.verified-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-success);
  font-weight: 600;
}

.empty-solutions {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
}

.empty-solutions svg {
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

@media (max-width: 640px) {
  .error-title {
    font-size: var(--font-size-2xl);
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .section-header .btn {
    width: 100%;
  }
}
</style>
