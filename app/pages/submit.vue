<template>
  <div class="submit-page">
    <div class="container">
      <h1 class="page-title">Đăng lỗi mới</h1>
      <p class="page-subtitle">Chia sẻ kinh nghiệm về lỗi xe của bạn với cộng đồng</p>

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
      <form @submit.prevent="handleSubmit" class="error-form card">
        <!-- Step 1: Car Information -->
        <div v-show="currentStep === 0" class="form-step">
          <h2 class="step-title">Thông tin xe</h2>
          
          <div class="form-group">
            <label class="form-label">Hãng xe *</label>
            <input 
              v-model="formData.car.make" 
              type="text" 
              class="form-input"
              placeholder="VD: Toyota, Honda, Ford..."
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Mẫu xe *</label>
            <input 
              v-model="formData.car.model" 
              type="text" 
              class="form-input"
              placeholder="VD: Camry, Civic, Ranger..."
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Năm sản xuất *</label>
            <input 
              v-model.number="formData.car.year" 
              type="number" 
              class="form-input"
              placeholder="VD: 2020"
              :min="1950"
              :max="new Date().getFullYear() + 1"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Phiên bản (tùy chọn)</label>
            <input 
              v-model="formData.car.variant" 
              type="text" 
              class="form-input"
              placeholder="VD: 2.5Q, RS, XLT..."
            />
          </div>
        </div>

        <!-- Step 2: Error Information -->
        <div v-show="currentStep === 1" class="form-step">
          <h2 class="step-title">Mô tả lỗi</h2>
          
          <div class="form-group">
            <label class="form-label">Tiêu đề *</label>
            <input 
              v-model="formData.title" 
              type="text" 
              class="form-input"
              placeholder="VD: Động cơ rung giật khi tăng tốc"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Triệu chứng *</label>
            <textarea 
              v-model="formData.symptoms" 
              class="form-textarea"
              placeholder="Mô tả chi tiết các triệu chứng bạn gặp phải..."
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Mã lỗi OBD-II (tùy chọn)</label>
            <input 
              v-model="formData.errorCode" 
              type="text" 
              class="form-input"
              placeholder="VD: P0300, P0420..."
              pattern="[A-Z][0-9]{4}"
              @input="formatErrorCode"
            />
            <p class="form-hint">Nhập mã lỗi nếu bạn đã quét OBD-II (dạng P0000, C0000...)</p>
          </div>
        </div>

        <!-- Step 3: Additional Details -->
        <div v-show="currentStep === 2" class="form-step">
          <h2 class="step-title">Thông tin bổ sung</h2>
          
          <div class="form-group">
            <label class="form-label">Mô tả chi tiết (tùy chọn)</label>
            <textarea 
              v-model="formData.description" 
              class="form-textarea"
              placeholder="Thêm bất kỳ thông tin nào khác có thể hữu ích..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Hình ảnh & Video (tùy chọn)</label>
            <FileUpload 
              v-model="uploadedFiles"
              accept="image/*,video/*"
              :multiple="true"
              hint="PNG, JPG, GIF, WebP hoặc MP4, WebM (tối đa 10MB mỗi file)"
            />
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="form-actions">
          <button 
            v-if="currentStep > 0"
            type="button" 
            class="btn btn-outline"
            @click="previousStep"
          >
            Quay lại
          </button>
          
          <button 
            v-if="currentStep < steps.length - 1"
            type="button" 
            class="btn btn-primary"
            @click="nextStep"
          >
            Tiếp theo
          </button>
          
          <button 
            v-else
            type="submit" 
            class="btn btn-accent"
            :disabled="submitting"
          >
            {{ submitting ? 'Đang gửi...' : 'Đăng lỗi' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
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
