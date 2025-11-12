<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-card card">
          <div class="auth-header">
            <h1 class="auth-title">{{ isLogin ? 'Đăng nhập' : 'Đăng ký' }}</h1>
            <p class="auth-subtitle">{{ isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới' }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="auth-form">
            <div v-if="!isLogin" class="form-group">
              <label class="form-label">Tên người dùng</label>
              <input 
                v-model="formData.username" 
                type="text" 
                class="form-input" 
                placeholder="Nhập tên người dùng"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <input 
                v-model="formData.email" 
                type="email" 
                class="form-input" 
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Mật khẩu</label>
              <input 
                v-model="formData.password" 
                type="password" 
                class="form-input" 
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div v-if="!isLogin" class="form-group">
              <label class="form-label">Xác nhận mật khẩu</label>
              <input 
                v-model="formData.confirmPassword" 
                type="password" 
                class="form-input" 
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
              <svg v-if="loading" class="spinner-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span v-else>{{ isLogin ? 'Đăng nhập' : 'Đăng ký' }}</span>
            </button>
          </form>

          <div class="auth-footer">
            <p>
              {{ isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
              <button @click="toggleMode" class="toggle-btn">
                {{ isLogin ? 'Đăng ký ngay' : 'Đăng nhập' }}
              </button>
            </p>
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

const isLogin = ref(true)
const loading = ref(false)
const errorMessage = ref('')

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
  formData.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  // Validation
  if (!isLogin.value) {
    if (!formData.value.username.trim()) {
      errorMessage.value = 'Vui lòng nhập tên người dùng'
      return
    }
    if (formData.value.password !== formData.value.confirmPassword) {
      errorMessage.value = 'Mật khẩu xác nhận không khớp'
      return
    }
    if (formData.value.password.length < 6) {
      errorMessage.value = 'Mật khẩu phải có ít nhất 6 ký tự'
      return
    }
  }

  loading.value = true

  try {
    const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/register'
    const response = await $fetch(endpoint, {
      method: 'POST',
      body: {
        username: formData.value.username,
        email: formData.value.email,
        password: formData.value.password
      }
    })

    if (response.success) {
      // Store user session
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // Redirect to home
      navigateTo('/')
    }
  } catch (error) {
    console.error('Auth error:', error)
    errorMessage.value = error.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  padding: var(--spacing-2xl) 0;
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-background) 100%);
}

.auth-container {
  max-width: 480px;
  margin: 0 auto;
}

.auth-card {
  box-shadow: var(--shadow-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.auth-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.auth-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.auth-form {
  margin-bottom: var(--spacing-xl);
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.spinner-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  padding: var(--spacing-md);
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
}

.auth-footer {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.auth-footer p {
  color: var(--color-text-secondary);
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin-left: var(--spacing-xs);
}

.toggle-btn:hover {
  color: var(--color-primary-dark);
}
</style>
