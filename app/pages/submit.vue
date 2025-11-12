<template>
  <div class="py-8 min-h-[calc(100vh-160px)]">
    <div class="container">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Đăng lỗi mới</h1>
        <p class="text-muted-foreground">Chia sẻ kinh nghiệm về lỗi xe của bạn với cộng đồng</p>
      </div>

      <!-- Progress Steps -->
      <div class="steps-indicator">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step"
          :class="{ active: currentStep === index, completed: currentStep > index }"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-label">{{ step }}</div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <Card>
          <!-- Step 1: Car Information -->
          <div v-show="currentStep === 0" class="space-y-6">
            <CardHeader>
              <CardTitle>Thông tin xe</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="space-y-2">
                <Label for="make">Hãng xe *</Label>
                <Input 
                  id="make"
                  v-model="formData.car.make" 
                  type="text" 
                  placeholder="VD: Toyota, Honda, Ford..."
                  required
                />
              </div>

              <div class="space-y-2">
                <Label for="model">Mẫu xe *</Label>
                <Input 
                  id="model"
                  v-model="formData.car.model" 
                  type="text" 
                  placeholder="VD: Camry, Civic, Ranger..."
                  required
                />
              </div>

              <div class="space-y-2">
                <Label for="year">Năm sản xuất *</Label>
                <Input 
                  id="year"
                  v-model.number="formData.car.year" 
                  type="number" 
                  placeholder="VD: 2020"
                  :min="1950"
                  :max="new Date().getFullYear() + 1"
                  required
                />
              </div>

              <div class="space-y-2">
                <Label for="variant">Phiên bản (tùy chọn)</Label>
                <Input 
                  id="variant"
                  v-model="formData.car.variant" 
                  type="text" 
                  placeholder="VD: 2.5Q, RS, XLT..."
                />
              </div>
            </CardContent>
          </div>

          <!-- Step 2: Error Information -->
          <div v-show="currentStep === 1" class="space-y-6">
            <CardHeader>
              <CardTitle>Mô tả lỗi</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="space-y-2">
                <Label for="title">Tiêu đề *</Label>
                <Input 
                  id="title"
                  v-model="formData.title" 
                  type="text" 
                  placeholder="VD: Động cơ rung giật khi tăng tốc"
                  required
                />
              </div>

              <div class="space-y-2">
                <Label for="symptoms">Triệu chứng *</Label>
                <Textarea 
                  id="symptoms"
                  v-model="formData.symptoms" 
                  placeholder="Mô tả chi tiết các triệu chứng bạn gặp phải..."
                  required
                />
              </div>

              <div class="space-y-2">
                <Label for="errorCode">Mã lỗi OBD-II (tùy chọn)</Label>
                <Input 
                  id="errorCode"
                  v-model="formData.errorCode" 
                  type="text" 
                  placeholder="VD: P0300, P0420..."
                  pattern="[A-Z][0-9]{4}"
                  @input="formatErrorCode"
                />
                <p class="text-sm text-muted-foreground">Nhập mã lỗi nếu bạn đã quét OBD-II (dạng P0000, C0000...)</p>
              </div>
            </CardContent>
          </div>

          <!-- Step 3: Additional Details -->
          <div v-show="currentStep === 2" class="space-y-6">
            <CardHeader>
              <CardTitle>Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="space-y-2">
                <Label for="description">Mô tả chi tiết (tùy chọn)</Label>
                <Textarea 
                  id="description"
                  v-model="formData.description" 
                  placeholder="Thêm bất kỳ thông tin nào khác có thể hữu ích..."
                />
              </div>

              <div class="space-y-2">
                <Label>Hình ảnh & Video (tùy chọn)</Label>
                <FileUpload 
                  v-model="uploadedFiles"
                  accept="image/*,video/*"
                  :multiple="true"
                  hint="PNG, JPG, GIF, WebP hoặc MP4, WebM (tối đa 10MB mỗi file)"
                />
              </div>
            </CardContent>
          </div>

          <!-- Navigation Buttons -->
          <CardFooter class="flex gap-2">
            <Button 
              v-if="currentStep > 0"
              type="button" 
              variant="outline"
              @click="previousStep"
            >
              Quay lại
            </Button>
            
            <Button 
              v-if="currentStep < steps.length - 1"
              type="button" 
              @click="nextStep"
              class="ml-auto"
            >
              Tiếp theo
            </Button>
            
            <Button 
              v-else
              type="submit" 
              :disabled="submitting"
              class="ml-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {{ submitting ? 'Đang gửi...' : 'Đăng lỗi' }}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
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
import Textarea from '~/components/ui/Textarea.vue'
import Label from '~/components/ui/Label.vue'

definePageMeta({
  layout: 'default'
})

// SEO
useSeo({
  title: 'Đăng lỗi mới',
  description: 'Chia sẻ kinh nghiệm về lỗi xe của bạn với cộng đồng. Đăng thông tin lỗi xe, triệu chứng, mã OBD-II để nhận giải pháp từ cộng đồng.',
  keywords: 'đăng lỗi xe, báo cáo lỗi ô tô, chia sẻ kinh nghiệm sửa xe',
  ogType: 'website'
})

const router = useRouter()

const steps = ['Thông tin xe', 'Mô tả lỗi', 'Hoàn tất']
const currentStep = ref(0)
const submitting = ref(false)
const uploadedFiles = ref([])

const formData = ref({
  title: '',
  symptoms: '',
  description: '',
  errorCode: '',
  car: {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    variant: ''
  },
  images: [],
  videos: []
})

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const formatErrorCode = (event) => {
  const value = event.target.value.toUpperCase()
  formData.value.errorCode = value
}

const handleSubmit = async () => {
  submitting.value = true
  
  try {
    // Separate images and videos from uploaded files
    const images = uploadedFiles.value
      .filter(file => file.type?.startsWith('image/'))
      .map(file => file.url)
    
    const videos = uploadedFiles.value
      .filter(file => file.type?.startsWith('video/'))
      .map(file => file.url)
    
    const response = await $fetch('/api/errors', {
      method: 'POST',
      body: {
        ...formData.value,
        images,
        videos
      }
    })
    
    // Show success message
    alert('Lỗi đã được đăng thành công!')
    
    // Redirect to error detail page
    router.push(`/errors/${response._id}`)
  } catch (error) {
    console.error('Error submitting:', error)
    alert('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.submit-page {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - 160px);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}

.page-subtitle {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.steps-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-2xl);
  position: relative;
}

.steps-indicator::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 40px;
  right: 40px;
  height: 2px;
  background-color: var(--color-border);
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.step.completed .step-number {
  background-color: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.step-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}

.step.active .step-label {
  color: var(--color-primary);
  font-weight: 600;
}

.error-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-step {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--spacing-xl);
  color: var(--color-primary);
}

.form-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

.file-upload-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-align: center;
}

.file-upload-info svg {
  opacity: 0.5;
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
}

.form-actions .btn {
  min-width: 120px;
}

@media (max-width: 640px) {
  .steps-indicator::before {
    left: 20px;
    right: 20px;
  }
  
  .step-number {
    width: 32px;
    height: 32px;
    font-size: var(--font-size-sm);
  }
  
  .step-label {
    font-size: var(--font-size-xs);
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
}
</style>
