<template>
  <div class="profile-page">
    <div class="container">
      <h1 class="page-title">Hồ sơ</h1>
      <p class="page-subtitle">Quản lý thông tin cá nhân và hoạt động</p>
      <div class="form-placeholder">
        <p>Trang hồ sơ sẽ được triển khai trong giai đoạn tiếp theo</p>
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
.profile-page {
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
