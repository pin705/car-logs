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

        <!-- Recent Activity -->
        <div class="activity-section">
          <h2 class="section-title">Hoạt động gần đây</h2>
          <div class="empty-state card">
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

onMounted(() => {
  // Load user from localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }
})

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

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
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
}
</style>
