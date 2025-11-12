<template>
  <div class="community-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Hỏi & Đáp</h1>
          <p class="page-subtitle">Đặt câu hỏi và nhận câu trả lời từ cộng đồng</p>
        </div>
        <button class="btn btn-accent" @click="showAskQuestion = !showAskQuestion">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Đặt câu hỏi
        </button>
      </div>

      <!-- Ask Question Form -->
      <div v-if="showAskQuestion" class="ask-question-card card">
        <h3 class="section-title">Đặt câu hỏi mới</h3>
        <div class="form-group">
          <label class="form-label">Tiêu đề câu hỏi</label>
          <input 
            v-model="newQuestion.title" 
            type="text" 
            class="form-input" 
            placeholder="VD: Làm thế nào để kiểm tra lỗi động cơ?"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Mô tả chi tiết</label>
          <textarea 
            v-model="newQuestion.description" 
            class="form-textarea" 
            rows="5"
            placeholder="Mô tả chi tiết vấn đề của bạn..."
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Danh mục</label>
          <select v-model="newQuestion.category" class="form-select">
            <option value="general">Chung</option>
            <option value="maintenance">Bảo dưỡng</option>
            <option value="repair">Sửa chữa</option>
            <option value="diagnosis">Chẩn đoán</option>
            <option value="parts">Phụ tùng</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="btn btn-outline" @click="showAskQuestion = false">Hủy</button>
          <button class="btn btn-primary" @click="submitQuestion">Đăng câu hỏi</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="filter-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            class="tab-button"
            :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value; fetchQuestions()"
          >
            {{ tab.label }}
          </button>
        </div>
        <select v-model="sortBy" class="sort-select" @change="fetchQuestions">
          <option value="recent">Mới nhất</option>
          <option value="popular">Phổ biến</option>
          <option value="unanswered">Chưa trả lời</option>
        </select>
      </div>

      <!-- Questions List -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Đang tải...</p>
      </div>

      <div v-else-if="questions.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>Chưa có câu hỏi nào</h3>
        <p>Hãy là người đầu tiên đặt câu hỏi!</p>
      </div>

      <div v-else class="questions-list">
        <div v-for="question in questions" :key="question._id" class="question-card card">
          <div class="question-header">
            <h3 class="question-title">
              <NuxtLink :to="`/community/${question._id}`">{{ question.title }}</NuxtLink>
            </h3>
            <span class="badge" :class="`badge-${question.status}`">
              {{ getStatusText(question.status) }}
            </span>
          </div>
          <p class="question-description">{{ truncate(question.description, 150) }}</p>
          <div class="question-meta">
            <div class="meta-left">
              <span class="badge badge-outline">{{ getCategoryText(question.category) }}</span>
              <div class="author-info-compact">
                <div class="author-avatar-small">
                  {{ question.author?.username?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="author-name">{{ question.author?.username || 'Người dùng' }}</span>
              </div>
              <span class="time-ago">{{ formatDate(question.createdAt) }}</span>
            </div>
            <div class="meta-right">
              <div class="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ question.answers?.length || 0 }}</span>
              </div>
              <div class="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>{{ question.views || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

// SEO
useSeo({
  title: 'Hỏi & Đáp',
  description: 'Cộng đồng hỏi đáp về ô tô. Đặt câu hỏi và nhận câu trả lời từ các chuyên gia và người dùng có kinh nghiệm về bảo dưỡng, sửa chữa, chẩn đoán xe.',
  keywords: 'hỏi đáp ô tô, tư vấn sửa xe, bảo dưỡng xe, cộng đồng ô tô, chẩn đoán lỗi xe',
  ogType: 'website'
})

const showAskQuestion = ref(false)
const activeTab = ref('all')
const sortBy = ref('recent')
const loading = ref(false)
const questions = ref([])

const newQuestion = ref({
  title: '',
  description: '',
  category: 'general'
})

const tabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'open', label: 'Đang mở' },
  { value: 'answered', label: 'Đã trả lời' }
]

onMounted(() => {
  fetchQuestions()
})

const fetchQuestions = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/questions', {
      query: {
        status: activeTab.value === 'all' ? '' : activeTab.value,
        sort: sortBy.value
      }
    })
    questions.value = data || []
  } catch (error) {
    console.error('Error fetching questions:', error)
    questions.value = []
  } finally {
    loading.value = false
  }
}

const submitQuestion = async () => {
  if (!newQuestion.value.title.trim() || !newQuestion.value.description.trim()) {
    alert('Vui lòng điền đầy đủ tiêu đề và mô tả')
    return
  }

  try {
    await $fetch('/api/questions', {
      method: 'POST',
      body: newQuestion.value
    })

    showAskQuestion.value = false
    newQuestion.value = { title: '', description: '', category: 'general' }
    alert('Câu hỏi đã được đăng thành công!')
    await fetchQuestions()
  } catch (error) {
    console.error('Error submitting question:', error)
    alert('Có lỗi xảy ra. Vui lòng thử lại.')
  }
}

const getStatusText = (status) => {
  const statusMap = {
    open: 'Đang mở',
    answered: 'Đã trả lời',
    closed: 'Đã đóng'
  }
  return statusMap[status] || status
}

const getCategoryText = (category) => {
  const categoryMap = {
    general: 'Chung',
    maintenance: 'Bảo dưỡng',
    repair: 'Sửa chữa',
    diagnosis: 'Chẩn đoán',
    parts: 'Phụ tùng',
    other: 'Khác'
  }
  return categoryMap[category] || category
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 60) return `${diffMins} phút trước`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} ngày trước`
  
  return d.toLocaleDateString('vi-VN')
}

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped>
.community-page {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - 160px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-md);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.ask-question-card {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-md);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-xs);
}

.tab-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  background: white;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.tab-button:hover {
  background-color: var(--color-surface);
}

.tab-button.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
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

.questions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.question-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.question-card:hover {
  box-shadow: var(--shadow-lg);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.question-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  flex: 1;
}

.question-title a {
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

.question-title a:hover {
  color: var(--color-primary);
}

.question-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.meta-left,
.meta-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.author-info-compact {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.author-avatar-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--font-size-xs);
}

.author-name {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  font-weight: 500;
}

.time-ago {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.badge-open {
  background-color: var(--color-info);
  color: white;
}

.badge-answered {
  background-color: var(--color-success);
  color: white;
}

.badge-closed {
  background-color: var(--color-text-secondary);
  color: white;
}

.badge-outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
  }

  .page-header .btn {
    width: 100%;
  }

  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-tabs {
    overflow-x: auto;
  }

  .meta-left {
    flex-wrap: wrap;
  }
}
</style>
