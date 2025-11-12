/**
 * Test cases for Vietnamese slug generation
 * Run this with: npx tsx server/utils/slug.test.ts
 */

import { generateSlug } from './slug'

const testCases = [
  {
    input: 'Động cơ rung giật khi tăng tốc',
    expected: 'dong-co-rung-giat-khi-tang-toc'
  },
  {
    input: 'Làm thế nào để kiểm tra lỗi động cơ?',
    expected: 'lam-the-nao-de-kiem-tra-loi-dong-co'
  },
  {
    input: 'Xe Toyota Camry báo lỗi P0300',
    expected: 'xe-toyota-camry-bao-loi-p0300'
  },
  {
    input: 'Phanh ABS không hoạt động đúng',
    expected: 'phanh-abs-khong-hoat-dong-dung'
  },
  {
    input: 'Tiếng kêu từ hộp số tự động',
    expected: 'tieng-keu-tu-hop-so-tu-dong'
  },
  {
    input: 'Hệ thống điều hòa không mát',
    expected: 'he-thong-dieu-hoa-khong-mat'
  }
]

console.log('Testing Vietnamese Slug Generation\n')
console.log('='.repeat(60))

let passed = 0
let failed = 0

testCases.forEach(({ input, expected }, index) => {
  const result = generateSlug(input)
  const isCorrect = result === expected
  
  if (isCorrect) {
    passed++
    console.log(`✅ Test ${index + 1}: PASSED`)
  } else {
    failed++
    console.log(`❌ Test ${index + 1}: FAILED`)
    console.log(`   Input:    "${input}"`)
    console.log(`   Expected: "${expected}"`)
    console.log(`   Got:      "${result}"`)
  }
})

console.log('='.repeat(60))
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests`)

if (failed === 0) {
  console.log('✅ All tests passed!')
  process.exit(0)
} else {
  console.log('❌ Some tests failed')
  process.exit(1)
}
