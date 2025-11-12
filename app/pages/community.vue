<template>
  <div class="community-page">
    <div class="container">
      <h1 class="page-title">Cộng đồng</h1>
      <p class="page-subtitle">Kết nối với những người yêu xe và chuyên gia</p>
      <div class="form-placeholder">
        <p>Khu vực cộng đồng sẽ được triển khai trong giai đoạn tiếp theo</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.community-page {
  padding: var(--spacing-2xl) 0;
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

.form-placeholder {
  text-align: center;
  padding: var(--spacing-2xl);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border);
}
</style>
