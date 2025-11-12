<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <!-- Search Section -->
    <section class="bg-gradient-to-br from-primary to-primary-dark text-white py-12">
      <div class="container">
        <h1 class="text-3xl md:text-4xl font-bold mb-6 text-center">Tìm lỗi xe của bạn</h1>
        <div class="relative max-w-2xl mx-auto">
          <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Nhập mã lỗi (P0300) hoặc triệu chứng..."
            class="w-full pl-14 pr-4 h-12 text-lg border-none shadow-lg text-gray-900"
            @input="handleSearch"
          />
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="py-6">
      <div class="container">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-primary dark:text-primary-light">
                  <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <CardTitle class="text-primary dark:text-primary-light">Bộ lọc tìm kiếm</CardTitle>
              </div>
              <Button 
                v-if="hasActiveFilters" 
                @click="clearFilters"
                variant="outline"
                size="sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Xóa bộ lọc
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label for="make">Hãng xe</Label>
                <Select id="make" v-model="filters.make" @change="handleFilterChange">
                  <option value="">Tất cả hãng</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Ford">Ford</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="BMW">BMW</option>
                  <option value="Audi">Audi</option>
                  <option value="Vinfast">Vinfast</option>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="model">Mẫu xe</Label>
                <Input 
                  id="model"
                  v-model="filters.model" 
                  type="text" 
                  placeholder="VD: Camry, Civic..."
                  @input="handleFilterChange"
                />
              </div>
              <div class="space-y-2">
                <Label for="errorCode">Mã lỗi</Label>
                <Input 
                  id="errorCode"
                  v-model="filters.errorCode" 
                  type="text" 
                  placeholder="VD: P0300"
                  @input="handleFilterChange"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- My Car Section -->
    <section v-if="savedCar" class="py-6">
      <div class="container">
        <Card class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <svg class="text-primary dark:text-primary-light w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path d="M5 17H4a2 2 0 01-2-2v-2a2 2 0 012-2h1m0 0h14m-14 0V9a4 4 0 014-4h6a4 4 0 014 4v2m0 0h1a2 2 0 012 2v2a2 2 0 01-2 2h-1m-14 0a2 2 0 104 0m-4 0a2 2 0 114 0m10 0a2 2 0 104 0m-4 0a2 2 0 114 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
              <h3 class="text-sm text-muted-foreground mb-1">Xe của bạn</h3>
              <p class="text-lg font-semibold">{{ savedCar.make }} {{ savedCar.model }} {{ savedCar.year }}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" class="w-full sm:w-auto" @click="filterByCar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Lọc
          </Button>
        </Card>
      </div>
    </section>
    <!-- Quick Actions -->
    <section class="py-6">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink to="/diagnose" class="no-underline">
            <Card class="text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <CardContent class="pt-6">
                <div class="w-16 h-16 bg-secondary-light dark:bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-2">Chẩn đoán mã lỗi</h3>
                <p class="text-sm text-muted-foreground">Tra cứu ngay mã OBD-II</p>
              </CardContent>
            </Card>
          </NuxtLink>

          <NuxtLink to="/submit" class="no-underline">
            <Card class="text-center bg-gradient-to-br from-action-50 to-action-100 dark:from-action-900 dark:to-action-800 border-action dark:border-action-light hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <CardContent class="pt-6">
                <div class="w-16 h-16 bg-gradient-to-br from-action to-action-dark text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-2">Đăng lỗi mới</h3>
                <p class="text-sm text-muted-foreground">Chia sẻ kinh nghiệm của bạn</p>
              </CardContent>
            </Card>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Hot Errors Today -->
    <section class="py-6 pb-12">
      <div class="container">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 class="text-2xl md:text-3xl font-bold">🔥 Lỗi Hot Hôm Nay</h2>
          <Select 
            v-model="sortBy" 
            @change="handleSort"
            class="w-full sm:w-48"
          >
            <option value="popularity">Phổ biến nhất</option>
            <option value="recent">Mới nhất</option>
            <option value="views">Nhiều lượt xem</option>
          </Select>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-primary-light rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-muted-foreground">Đang tải...</p>
        </div>

        <div v-else-if="errors.length === 0" class="text-center py-12 text-muted-foreground">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" class="mx-auto mb-6 opacity-50">
            <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3 class="text-xl mb-2">Chưa có lỗi nào</h3>
          <p>Hãy là người đầu tiên đóng góp!</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card v-for="error in errors" :key="error._id" class="flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
            <CardHeader>
              <div class="flex justify-between items-start gap-4">
                <CardTitle class="flex-1">{{ error.title }}</CardTitle>
                <Badge v-if="error.errorCode" variant="secondary" class="font-mono">{{ error.errorCode }}</Badge>
              </div>
            </CardHeader>
            
            <CardContent class="flex-1 flex flex-col gap-4">
              <p class="text-muted-foreground leading-relaxed">{{ truncate(error.symptoms, 100) }}</p>
              
              <Separator />
              
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 17H4a2 2 0 01-2-2v-2a2 2 0 012-2h1m0 0h14m-14 0V9a4 4 0 014-4h6a4 4 0 014 4v2m0 0h1a2 2 0 012 2v2a2 2 0 01-2 2h-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ error.car?.make }} {{ error.car?.model }}</span>
                </div>
                
                <div class="flex gap-4">
                  <div class="flex items-center gap-1 text-sm text-muted-foreground">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>{{ error.views || 0 }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-sm text-action dark:text-action-light font-semibold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ error.popularity || 0 }}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">{{ error.solutions?.length || 0 }} giải pháp</span>
              <Button as="a" :href="`/errors/${error._id}`" size="sm">Xem chi tiết</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'
import CardFooter from '~/components/ui/CardFooter.vue'
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'
import Select from '~/components/ui/Select.vue'
import Label from '~/components/ui/Label.vue'
import Badge from '~/components/ui/Badge.vue'
import Separator from '~/components/ui/Separator.vue'

definePageMeta({
  layout: 'default'
})

// SEO
useSeo({
  title: 'Trang chủ',
  description: 'Cộng đồng chia sẻ và tra cứu lỗi xe, mã OBD-II, triệu chứng và giải pháp sửa chữa. Tìm kiếm lỗi xe của bạn và nhận tư vấn từ cộng đồng.',
  keywords: 'lỗi xe, mã lỗi OBD-II, sửa chữa ô tô, chẩn đoán xe, triệu chứng xe hỏng, giải pháp sửa xe, cộng đồng ô tô Việt Nam',
  ogType: 'website'
})

const searchQuery = ref('')
const sortBy = ref('popularity')
const loading = ref(false)
const errors = ref([])

// Filter state
const filters = ref({
  make: '',
  model: '',
  errorCode: ''
})

// Mock saved car data (will be replaced with real data from auth)
const savedCar = ref({
  make: 'Toyota',
  model: 'Camry',
  year: 2020
})

// Computed: Check if any filters are active
const hasActiveFilters = computed(() => {
  return filters.value.make || filters.value.model || filters.value.errorCode
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
    // Build query parameters
    const queryParams = {
      sort: sortBy.value,
      search: searchQuery.value,
      make: filters.value.make,
      model: filters.value.model
    }

    // If error code filter is set, use it in search
    if (filters.value.errorCode) {
      queryParams.search = filters.value.errorCode
    }

    const data = await $fetch('/api/errors', { query: queryParams })
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

const handleFilterChange = useDebounceFn(() => {
  fetchErrors()
}, 500)

const handleSort = () => {
  fetchErrors()
}

const filterByCar = () => {
  // Apply car filter
  filters.value.make = savedCar.value.make
  filters.value.model = savedCar.value.model
  fetchErrors()
}

const clearFilters = () => {
  filters.value.make = ''
  filters.value.model = ''
  filters.value.errorCode = ''
  fetchErrors()
}

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

