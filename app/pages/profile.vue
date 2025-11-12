<template>
  <div class="profile-page">
    <div class="container max-w-5xl mx-auto py-8 space-y-6">
      <!-- Not logged in state -->
      <Card v-if="!user" class="text-center p-12">
        <CardContent class="space-y-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-auto text-muted-foreground opacity-50">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div>
            <h2 class="text-2xl font-bold mb-2">Bạn chưa đăng nhập</h2>
            <p class="text-muted-foreground mb-6">Đăng nhập để xem hồ sơ và quản lý hoạt động của bạn</p>
            <Button as="a" href="/auth" size="lg">Đăng nhập / Đăng ký</Button>
          </div>
        </CardContent>
      </Card>

      <!-- Logged in state -->
      <div v-else class="space-y-6">
        <!-- Profile Header -->
        <Card>
          <CardContent class="p-6">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div class="profile-avatar shrink-0">
                {{ user.username?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="flex-1 text-center md:text-left space-y-3">
                <h1 class="text-3xl font-bold">{{ user.username }}</h1>
                <p class="text-muted-foreground">{{ user.email }}</p>
                <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                  <AuthorBadge v-for="badge in user.badges" :key="badge" :badge="badge" />
                </div>
              </div>
              <Button @click="logout" variant="outline" size="sm" class="shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent class="p-6 flex items-center gap-4">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm text-muted-foreground">Điểm uy tín</p>
                <p class="text-2xl font-bold text-primary">{{ user.reputation || 0 }}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6 flex items-center gap-4">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm text-muted-foreground">Bài đăng</p>
                <p class="text-2xl font-bold text-primary">0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6 flex items-center gap-4">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm text-muted-foreground">Giải pháp</p>
                <p class="text-2xl font-bold text-primary">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- My Cars -->
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Xe của tôi</CardTitle>
              <Button @click="showAddCar = !showAddCar" size="sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Thêm xe
              </Button>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Add Car Form -->
            <Card v-if="showAddCar" class="border-dashed">
              <CardContent class="p-4 space-y-4">
                <FormItem>
                  <Label for="make">Hãng xe</Label>
                  <Input id="make" v-model="newCar.make" placeholder="VD: Toyota" />
                </FormItem>
                <FormItem>
                  <Label for="model">Mẫu xe</Label>
                  <Input id="model" v-model="newCar.model" placeholder="VD: Camry" />
                </FormItem>
                <div class="grid grid-cols-2 gap-4">
                  <FormItem>
                    <Label for="year">Năm sản xuất</Label>
                    <Input id="year" v-model.number="newCar.year" type="number" placeholder="VD: 2020" />
                  </FormItem>
                  <FormItem>
                    <Label for="variant">Phiên bản (tùy chọn)</Label>
                    <Input id="variant" v-model="newCar.variant" placeholder="VD: 2.5Q" />
                  </FormItem>
                </div>
                <CardFooter class="px-0 pb-0">
                  <Button @click="showAddCar = false" variant="outline" size="sm">Hủy</Button>
                  <Button @click="addCar" size="sm" class="ml-2">Thêm</Button>
                </CardFooter>
              </CardContent>
            </Card>

            <!-- Cars List -->
            <div v-if="userCars.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card v-for="car in userCars" :key="car._id" class="group hover:shadow-md transition-shadow">
                <CardContent class="p-4 flex items-center gap-3">
                  <div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 17H4a2 2 0 01-2-2v-2a2 2 0 012-2h1m0 0h14m-14 0V9a4 4 0 014-4h6a4 4 0 014 4v2m0 0h1a2 2 0 012 2v2a2 2 0 01-2 2h-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold truncate">{{ car.make }} {{ car.model }}</p>
                    <p class="text-sm text-muted-foreground">{{ car.year }} {{ car.variant ? '- ' + car.variant : '' }}</p>
                  </div>
                  <Button 
                    @click="removeCar(car._id)" 
                    variant="ghost" 
                    size="icon"
                    class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card v-else-if="!showAddCar" class="border-dashed">
              <CardContent class="p-12 text-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4 text-muted-foreground opacity-50">
                  <path d="M5 17H4a2 2 0 01-2-2v-2a2 2 0 012-2h1m0 0h14m-14 0V9a4 4 0 014-4h6a4 4 0 014 4v2m0 0h1a2 2 0 012 2v2a2 2 0 01-2 2h-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="text-muted-foreground">Chưa có xe nào được thêm</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <!-- Recent Activity -->
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="flex flex-col items-center justify-center py-12">
              <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p class="text-muted-foreground">Đang tải...</p>
            </div>
            
            <div v-else-if="activities.length > 0" class="space-y-3">
              <Card v-for="(activity, index) in activities" :key="index" class="hover:shadow-md transition-shadow">
                <CardContent class="p-4 flex gap-4">
                  <div :class="['w-12 h-12 rounded-lg flex items-center justify-center shrink-0', getActivityIconClass(activity.type)]">
                    <svg v-if="activity.type === 'error_post'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else-if="activity.type === 'question'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else-if="activity.type === 'solution'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <Badge variant="secondary" class="text-xs mb-2">{{ getActivityTypeText(activity.type) }}</Badge>
                    <NuxtLink 
                      :to="getActivityLink(activity)" 
                      class="block font-semibold hover:text-primary transition-colors mb-1 truncate"
                    >
                      {{ getActivityTitle(activity) }}
                    </NuxtLink>
                    <p class="text-xs text-muted-foreground">{{ formatDate(activity.createdAt) }}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card v-else class="border-dashed">
              <CardContent class="p-12 text-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4 text-muted-foreground opacity-50">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="text-muted-foreground">Chưa có hoạt động nào</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
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

const getActivityIconClass = (type) => {
  const classMap = {
    error_post: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    question: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    solution: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    answer: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
  }
  return classMap[type] || 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
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
.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 2rem;
  flex-shrink: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background-color: hsl(var(--muted));
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsl(var(--primary));
  flex-shrink: 0;
}
</style>
