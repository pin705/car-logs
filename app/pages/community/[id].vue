<template>
  <div class="question-detail-page">
    <div v-if="loading" class="container loading-state">
      <div class="spinner"></div>
      <p>Đang tải...</p>
    </div>

    <div v-else-if="question" class="container">
      <!-- Question Header -->
      <div class="question-header card">
        <div class="header-top">
          <span class="badge" :class="`badge-${question.status}`">
            {{ getStatusText(question.status) }}
          </span>
          <span class="badge badge-outline">{{ getCategoryText(question.category) }}</span>
        </div>

        <h1 class="question-title">{{ question.title }}</h1>

        <div class="question-meta">
          <div class="author-info">
            <div class="author-avatar">
              {{ question.author?.username?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div>
              <div class="author-name">{{ question.author?.username || 'Người dùng' }}</div>
              <div class="post-time">{{ formatDate(question.createdAt) }}</div>
            </div>
            <div v-if="question.author?.badges?.length" class="author-badges">
              <span v-for="badge in question.author.badges" :key="badge" class="badge badge-accent">
                {{ getBadgeText(badge) }}
              </span>
            </div>
          </div>
          <div class="stats-compact">
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ question.views }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Question Description -->
      <div class="question-section card">
        <h2 class="section-title">Mô tả</h2>
        <p class="section-content">{{ question.description }}</p>
      </div>

      <!-- Answers -->
      <div class="answers-section card">
        <div class="section-header">
          <h2 class="section-title">Câu trả lời ({{ question.answers?.length || 0 }})</h2>
          <button class="btn btn-accent btn-sm" @click="showAddAnswer = !showAddAnswer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Trả lời
          </button>
        </div>

        <!-- Add Answer Form -->
        <div v-if="showAddAnswer" class="add-answer-form">
          <textarea 
            v-model="newAnswer.content"
            class="form-textarea"
            placeholder="Nhập câu trả lời của bạn..."
            rows="4"
          ></textarea>
          <div class="form-actions">
            <button class="btn btn-outline btn-sm" @click="showAddAnswer = false">Hủy</button>
            <button class="btn btn-primary btn-sm" @click="submitAnswer">Gửi câu trả lời</button>
          </div>
        </div>

        <!-- Answers List -->
        <div v-if="question.answers?.length" class="answers-list">
          <div v-for="(answer, index) in question.answers" :key="index" class="answer-card">
            <div class="answer-header">
              <div class="answer-author">
                <div class="author-avatar small">
                  {{ answer.author?.username?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <div>
                  <div class="author-name">{{ answer.author?.username || 'Người dùng' }}</div>
                  <div class="post-time">{{ formatDate(answer.createdAt) }}</div>
                </div>
              </div>
              <div class="answer-votes">
                <button class="vote-btn" @click="upvoteAnswer(index)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 15l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <span class="vote-count">{{ answer.upvotes }}</span>
              </div>
            </div>
            <p class="answer-content">{{ answer.content }}</p>
            <div v-if="answer.accepted" class="accepted-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Đã chấp nhận
            </div>
          </div>
        </div>

        <div v-else class="empty-answers">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>Chưa có câu trả lời nào. Hãy là người đầu tiên trả lời!</p>
        </div>
      </div>
    </div>

    <div v-else class="container error-state">
      <h2>Không tìm thấy câu hỏi</h2>
      <NuxtLink to="/community" class="btn btn-primary">Về trang cộng đồng</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const questionId = route.params.id

const loading = ref(true)
const question = ref(null)
const showAddAnswer = ref(false)
const newAnswer = ref({
  content: ''
})

onMounted(async () => {
  await fetchQuestion()
})

const fetchQuestion = async () => {
  loading.value = true
  try {
    question.value = await $fetch(`/api/questions/${questionId}`)
    
    // Set SEO after data is loaded
    if (question.value) {
      useSeo({
        title: question.value.title,
        description: question.value.description.substring(0, 160),
        keywords: `${question.value.category}, hỏi đáp ô tô, tư vấn xe`,
        ogType: 'article'
      })
    }
  } catch (err) {
    console.error('Error fetching question:', err)
  } finally {
    loading.value = false
  }
}

const submitAnswer = async () => {
  if (!newAnswer.value.content.trim()) {
    alert('Vui lòng nhập nội dung câu trả lời')
    return
  }

  try {
    const response = await $fetch(`/api/questions/${questionId}/answers`, {
      method: 'POST',
      body: {
        content: newAnswer.value.content
      }
    })

    if (response.success) {
      await fetchQuestion()
      showAddAnswer.value = false
      newAnswer.value = { content: '' }
      alert('Câu trả lời đã được thêm thành công!')
    }
  } catch (err) {
    console.error('Error submitting answer:', err)
    alert('Có lỗi xảy ra. Vui lòng thử lại.')
  }
}

const upvoteAnswer = async (index) => {
  try {
    const response = await $fetch(`/api/questions/${questionId}/upvote`, {
      method: 'POST',
      body: {
        answerIndex: index
      }
    })

    if (response.success) {
      await fetchQuestion()
    }
  } catch (err) {
    console.error('Error upvoting answer:', err)
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
  return d.toLocaleDateString('vi-VN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const getBadgeText = (badge) => {
  const badgeMap = {
    beginner: 'Người mới',
    contributor: 'Đóng góp',
    expert: 'Chuyên gia',
    trusted: 'Tin cậy',
    master: 'Bậc thầy'
  }
  return badgeMap[badge] || badge
}
</script>

<style scoped>
.question-detail-page {
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

.question-header {
  margin-bottom: var(--spacing-lg);
}

.header-top {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.question-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  line-height: 1.3;
  color: var(--color-primary);
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.author-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
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
  display: flex;
  gap: var(--spacing-xs);
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

.question-section {
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

.answers-section {
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

.add-answer-form {
  background-color: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xl);
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.answer-card {
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.answer-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.answer-votes {
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

.answer-content {
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
}

.accepted-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-success);
  color: white;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.empty-answers {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
}

.empty-answers svg {
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
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
  .question-title {
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

  .question-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}
</style>
