<template>
  <div class="profile-page">
    <div class="container">
      <div v-if="!user" class="auth-prompt card">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2>Bạn chưa đăng nhập</h2>
        <p>Đăng nhập để xem hồ sơ và quản lý hoạt động của bạn</p>
        <NuxtLink to="/auth" class="btn btn-primary">Đăng nhập / Đăng ký</NuxtLink>
      </div>

      <div v-else>
        <!-- Profile Header -->
        <div class="profile-header card">
          <div class="profile-avatar">
            {{ user.username?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{ user.username }}</h1>
            <p class="profile-email">{{ user.email }}</p>
            <div class="profile-badges">
              <span v-for="badge in user.badges" :key="badge" class="badge badge-accent">
                {{ getBadgeText(badge) }}
              </span>
            </div>
          </div>
          <button @click="logout" class="btn btn-outline btn-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Đăng xuất
          </button>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card card">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Điểm uy tín</p>
              <p class="stat-value">{{ user.reputation || 0 }}</p>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Bài đăng</p>
              <p class="stat-value">0</p>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Giải pháp</p>
              <p class="stat-value">0</p>
            </div>
          </div>
        </div>

        <!-- My Cars -->
        <div class="cars-section">
          <div class="section-header-flex">
            <h2 class="section-title">Xe của tôi</h2>
            <button class="btn btn-primary btn-sm" @click="showAddCar = !showAddCar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Thêm xe
            </button>
          </div>

          <!-- Add Car Form -->
          <div v-if="showAddCar" class="add-car-form card">
            <div class="form-group">
              <label class="form-label">Hãng xe</label>
              <input v-model="newCar.make" type="text" class="form-input" placeholder="VD: Toyota" />
            </div>
            <div class="form-group">
              <label class="form-label">Mẫu xe</label>
              <input v-model="newCar.model" type="text" class="form-input" placeholder="VD: Camry" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Năm sản xuất</label>
                <input v-model.number="newCar.year" type="number" class="form-input" placeholder="VD: 2020" />
              </div>
              <div class="form-group">
                <label class="form-label">Phiên bản (tùy chọn)</label>
                <input v-model="newCar.variant" type="text" class="form-input" placeholder="VD: 2.5Q" />
              </div>
            </div>
            <div class="form-actions">
              <button class="btn btn-outline btn-sm" @click="showAddCar = false">Hủy</button>
              <button class="btn btn-primary btn-sm" @click="addCar">Thêm</button>
            </div>
          </div>

          <!-- Cars List -->
          <div v-if="userCars.length > 0" class="cars-grid">
            <div v-for="car in userCars" :key="car._id" class="car-item card">
              <div class="car-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 17H4a2 2 0 01-2-2v-2a2 2 0 012-2h1m0 0h14m-14 0V9a4 4 0 014-4h6a4 4 0 014 4v2m0 0h1a2 2 0 012 2v2a2 2 0 01-2 2h-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="car-details">
                <div class="car-name">{{ car.make }} {{ car.model }}</div>
                <div class="car-info-text">{{ car.year }} {{ car.variant ? '- ' + car.variant : '' }}</div>
              </div>
              <button class="btn-remove" @click="removeCar(car._id)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div v-else-if="!showAddCar" class="empty-state card">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 17H4a2 2 0 01-2-2v-2a2 2 0 012-2h1m0 0h14m-14 0V9a4 4 0 014-4h6a4 4 0 014 4v2m0 0h1a2 2 0 012 2v2a2 2 0 01-2 2h-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Chưa có xe nào được thêm</p>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="activity-section">
          <h2 class="section-title">Hoạt động gần đây</h2>
          <div v-if="loading" class="loading-state card">
            <div class="spinner"></div>
            <p>Đang tải...</p>
          </div>
          <div v-else-if="activities.length > 0" class="activities-list">
            <div v-for="(activity, index) in activities" :key="index" class="activity-item card">
              <div class="activity-icon" :class="`activity-${activity.type}`">
                <svg v-if="activity.type === 'error_post'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="activity.type === 'question'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="activity.type === 'solution'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="activity-content">
                <div class="activity-type">{{ getActivityTypeText(activity.type) }}</div>
                <NuxtLink 
                  :to="getActivityLink(activity)" 
                  class="activity-title"
                >
                  {{ getActivityTitle(activity) }}
                </NuxtLink>
                <div class="activity-time">{{ formatDate(activity.createdAt) }}</div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state card">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Chưa có hoạt động nào</p>
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
  title: 'Hồ sơ người dùng',
  description: 'Quản lý hồ sơ cá nhân, xem điểm uy tín, bài đăng và hoạt động của bạn trên CarLogs.',
  keywords: 'hồ sơ người dùng, tài khoản, hoạt động, điểm uy tín',
  ogType: 'website'
})

const user = ref(null)
const loading = ref(false)
const activities = ref([])
const userCars = ref([])
const showAddCar = ref(false)
const newCar = ref({
  make: '',
  model: '',
  year: null,
  variant: ''
})

onMounted(async () => {
  // Load user from localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
      await Promise.all([
        loadUserActivity(),
        loadUserCars()
      ])
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }
})

const loadUserActivity = async () => {
  if (!user.value?._id) return
  
  loading.value = true
  try {
    const { data } = await useFetch(`/api/user/activity?userId=${user.value._id}`)
    if (data.value?.success) {
      activities.value = data.value.activities || []
    }
  } catch (error) {
    console.error('Error loading activities:', error)
  } finally {
    loading.value = false
  }
}

const loadUserCars = async () => {
  if (!user.value?._id) return
  
  try {
    const { data } = await useFetch(`/api/user/cars?userId=${user.value._id}`)
    if (data.value?.success) {
      userCars.value = data.value.cars || []
    }
  } catch (error) {
    console.error('Error loading cars:', error)
  }
}

const addCar = async () => {
  if (!user.value?._id) return
  if (!newCar.value.make || !newCar.value.model || !newCar.value.year) {
    alert('Vui lòng nhập đầy đủ thông tin xe')
    return
  }
  
  try {
    const { data } = await useFetch('/api/user/cars', {
      method: 'POST',
      body: {
        userId: user.value._id,
        car: newCar.value
      }
    })
    
    if (data.value?.success) {
      await loadUserCars()
      newCar.value = { make: '', model: '', year: null, variant: '' }
      showAddCar.value = false
    }
  } catch (error) {
    console.error('Error adding car:', error)
    alert('Lỗi khi thêm xe')
  }
}

const removeCar = async (carId) => {
  if (!user.value?._id) return
  if (!confirm('Bạn có chắc muốn xóa xe này?')) return
  
  try {
    const { data } = await useFetch('/api/user/cars', {
      method: 'DELETE',
      body: {
        userId: user.value._id,
        carId
      }
    })
    
    if (data.value?.success) {
      await loadUserCars()
    }
  } catch (error) {
    console.error('Error removing car:', error)
    alert('Lỗi khi xóa xe')
  }
}

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  navigateTo('/')
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

const getActivityTypeText = (type) => {
  const typeMap = {
    error_post: 'Đăng lỗi',
    question: 'Đặt câu hỏi',
    solution: 'Đóng góp giải pháp',
    answer: 'Trả lời câu hỏi'
  }
  return typeMap[type] || type
}

const getActivityTitle = (activity) => {
  if (activity.type === 'solution') {
    return activity.errorPost?.title
  } else if (activity.type === 'answer') {
    return activity.question?.title
  }
  return activity.title
}

const getActivityLink = (activity) => {
  if (activity.type === 'error_post') {
    return `/errors/${activity.slug}`
  } else if (activity.type === 'question') {
    return `/community/${activity.slug}`
  } else if (activity.type === 'solution') {
    return `/errors/${activity.errorPost?.slug}`
  } else if (activity.type === 'answer') {
    return `/community/${activity.question?.slug}`
  }
  return '#'
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) {
    return `${minutes} phút trước`
  } else if (hours < 24) {
    return `${hours} giờ trước`
  } else if (days < 7) {
    return `${days} ngày trước`
  } else {
    return d.toLocaleDateString('vi-VN')
  }
}
</script>

<style scoped>
.profile-page {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - 160px);
}

.auth-prompt {
  text-align: center;
  padding: var(--spacing-2xl);
}

.auth-prompt svg {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.auth-prompt h2 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.auth-prompt p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--font-size-3xl);
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 200px;
}

.profile-name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.profile-email {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.profile-badges {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-accent);
}

.activity-section {
  margin-top: var(--spacing-2xl);
}

.cars-section {
  margin-top: var(--spacing-2xl);
}

.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
}

.add-car-form {
  margin-bottom: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-md);
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.car-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  position: relative;
}

.car-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}

.car-details {
  flex: 1;
}

.car-name {
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.car-info-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.btn-remove {
  padding: var(--spacing-sm);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.btn-remove:hover {
  background-color: var(--color-error);
  color: white;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.activity-item {
  display: flex;
  gap: var(--spacing-md);
  transition: transform 0.2s;
}

.activity-item:hover {
  transform: translateX(4px);
}

.activity-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.activity-error_post {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.activity-icon.activity-question {
  background-color: rgba(0, 122, 255, 0.1);
  color: #007AFF;
}

.activity-icon.activity-solution {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28A745;
}

.activity-icon.activity-answer {
  background-color: rgba(255, 153, 0, 0.1);
  color: #FF9900;
}

.activity-content {
  flex: 1;
}

.activity-type {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.activity-title {
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  display: block;
  margin-bottom: var(--spacing-xs);
  transition: color 0.2s;
}

.activity-title:hover {
  color: var(--color-secondary);
}

.activity-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.loading-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
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
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-header .btn {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .cars-grid {
    grid-template-columns: 1fr;
  }
}
</style>
