<template>
  <div class="py-8">
    <div class="container">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Chẩn đoán mã lỗi</h1>
        <p class="text-muted-foreground">Tra cứu mã lỗi OBD-II và tìm hiểu nguyên nhân</p>
      </div>
      <Card class="text-center">
        <CardContent class="p-12">
          <p class="text-muted-foreground">Chức năng chẩn đoán sẽ được triển khai trong giai đoạn tiếp theo</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'

definePageMeta({
  layout: 'default'
})

// SEO
useSeo({
  title: 'Chẩn đoán mã lỗi',
  description: 'Tra cứu và chẩn đoán mã lỗi OBD-II của xe. Tìm hiểu nguyên nhân và cách khắc phục các mã lỗi động cơ, hộp số, phanh và các hệ thống khác.',
  keywords: 'chẩn đoán mã lỗi, OBD-II, mã lỗi động cơ, tra cứu lỗi xe',
  ogType: 'website'
})
</script>

