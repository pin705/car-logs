<template>
  <div class="file-upload">
    <label class="upload-label">
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileChange"
        class="file-input"
      />
      <div class="upload-area">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1M9 15l3 -3l3 3M12 12v9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="upload-text">
          <span class="upload-link">Nhấp để tải lên</span> hoặc kéo thả file vào đây
        </p>
        <p class="upload-hint">{{ hint }}</p>
      </div>
    </label>

    <div v-if="uploading" class="upload-progress">
      <div class="spinner"></div>
      <p>Đang tải lên...</p>
    </div>

    <div v-if="uploadedFiles.length > 0" class="uploaded-files">
      <h4 class="files-title">File đã tải lên:</h4>
      <div class="files-list">
        <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
          <img v-if="file.type?.startsWith('image/')" :src="file.url" :alt="file.filename" class="file-preview" />
          <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="file-info">
            <p class="file-name">{{ file.filename }}</p>
            <p class="file-size">{{ formatFileSize(file.size) }}</p>
          </div>
          <button @click="removeFile(index)" class="remove-btn" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  accept: {
    type: String,
    default: 'image/*,video/*'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  hint: {
    type: String,
    default: 'PNG, JPG, GIF, WebP hoặc MP4, WebM (tối đa 10MB)'
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const uploading = ref(false)
const uploadedFiles = ref([...props.modelValue])

watch(() => props.modelValue, (newVal) => {
  uploadedFiles.value = [...newVal]
})

const handleFileChange = async (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return

  uploading.value = true

  try {
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i])
    }

    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      uploadedFiles.value.push(...response.files)
      emit('update:modelValue', uploadedFiles.value)
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert('Có lỗi xảy ra khi tải file. Vui lòng thử lại.')
  } finally {
    uploading.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
  emit('update:modelValue', uploadedFiles.value)
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
</script>

<style scoped>
.file-upload {
  margin-bottom: var(--spacing-lg);
}

.upload-label {
  display: block;
  cursor: pointer;
}

.file-input {
  display: none;
}

.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  text-align: center;
  transition: all 0.2s ease;
  background-color: var(--color-surface);
}

.upload-area:hover {
  border-color: var(--color-primary);
  background-color: rgba(30, 58, 138, 0.05);
}

.upload-area svg {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.upload-text {
  font-size: var(--font-size-base);
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.upload-link {
  color: var(--color-primary);
  font-weight: 600;
}

.upload-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.upload-progress {
  text-align: center;
  padding: var(--spacing-lg);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.uploaded-files {
  margin-top: var(--spacing-lg);
}

.files-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: white;
}

.file-preview {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.file-item svg {
  color: var(--color-text-secondary);
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  word-break: break-all;
}

.file-size {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.remove-btn {
  padding: var(--spacing-xs);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background-color: var(--color-error);
  border-color: var(--color-error);
  color: white;
}
</style>
