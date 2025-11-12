/**
 * API endpoint to seed the database with sample data
 * POST /api/seed
 */

import { generateSlug } from '../utils/slug'
import { User } from '../models/User'
import { CarModel } from '../models/CarModel'
import { ErrorPost } from '../models/ErrorPost'

export default defineEventHandler(async (event) => {
  try {
    console.log('🌱 Starting database seeding...')

    // 1. Create admin user
    console.log('📝 Creating admin user...')
    let adminUser = await User.findOne({ username: 'admin' })
    
    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        email: 'admin@carlogs.vn',
        password: 'admin123', // Simple password for demo
        reputation: 1000,
        badges: ['beginner', 'contributor', 'expert', 'trusted', 'master']
      })
      console.log('✅ Admin user created')
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    // 2. Create common car models (popular in Vietnam)
    console.log('📝 Creating car models...')
    const carModelsData = [
      // Toyota
      { make: 'Toyota', model: 'Vios', year: 2023, variant: '1.5G CVT' },
      { make: 'Toyota', model: 'Vios', year: 2022, variant: '1.5E MT' },
      { make: 'Toyota', model: 'Corolla Cross', year: 2023, variant: '1.8V' },
      { make: 'Toyota', model: 'Camry', year: 2023, variant: '2.5Q' },
      { make: 'Toyota', model: 'Fortuner', year: 2023, variant: '2.4AT 4x2' },
      
      // Honda
      { make: 'Honda', model: 'City', year: 2023, variant: 'RS' },
      { make: 'Honda', model: 'City', year: 2022, variant: 'L' },
      { make: 'Honda', model: 'Civic', year: 2023, variant: 'RS' },
      { make: 'Honda', model: 'CR-V', year: 2023, variant: 'L' },
      { make: 'Honda', model: 'Accord', year: 2022, variant: '1.5 Turbo' },
      
      // Mazda
      { make: 'Mazda', model: 'Mazda3', year: 2023, variant: '1.5L Premium' },
      { make: 'Mazda', model: 'Mazda3', year: 2022, variant: '2.0L Luxury' },
      { make: 'Mazda', model: 'CX-5', year: 2023, variant: '2.0 Luxury' },
      { make: 'Mazda', model: 'CX-30', year: 2023, variant: 'Premium' },
      
      // Hyundai
      { make: 'Hyundai', model: 'Accent', year: 2023, variant: '1.4 AT Đặc Biệt' },
      { make: 'Hyundai', model: 'Elantra', year: 2023, variant: '1.6 Turbo' },
      { make: 'Hyundai', model: 'Tucson', year: 2023, variant: '2.0 Đặc Biệt' },
      { make: 'Hyundai', model: 'Santa Fe', year: 2023, variant: '2.5 Calligraphy' },
      
      // Kia
      { make: 'Kia', model: 'Seltos', year: 2023, variant: '1.5 Luxury' },
      { make: 'Kia', model: 'Sonet', year: 2023, variant: 'Deluxe' },
      { make: 'Kia', model: 'Sorento', year: 2023, variant: '2.2D Signature' },
      
      // Mitsubishi
      { make: 'Mitsubishi', model: 'Xpander', year: 2023, variant: 'AT Premium' },
      { make: 'Mitsubishi', model: 'Attrage', year: 2023, variant: 'CVT Premium' },
      
      // VinFast
      { make: 'VinFast', model: 'VF 8', year: 2023, variant: 'Eco' },
      { make: 'VinFast', model: 'Fadil', year: 2022, variant: 'Cao Cấp' }
    ]

    const createdCars: any[] = []
    for (const carData of carModelsData) {
      const existingCar = await CarModel.findOne({
        make: carData.make,
        model: carData.model,
        year: carData.year,
        variant: carData.variant
      })
      
      if (!existingCar) {
        const car = await CarModel.create(carData)
        createdCars.push(car)
      } else {
        createdCars.push(existingCar)
      }
    }
    console.log(`✅ Car models ready (${createdCars.length} models)`)

    // 3. Create common error posts
    console.log('📝 Creating error posts...')
    const errorPostsData = [
      {
        title: 'Động cơ giật cục khi tăng tốc trên cao tốc',
        symptoms: 'Xe bị giật cục khi tăng tốc từ 80km/h lên 120km/h, đèn check engine nhấp nháy. Cảm giác như động cơ mất lực đột ngột rồi lại hoạt động bình thường.',
        errorCode: 'P0300',
        description: 'Hiện tượng này xảy ra đặc biệt khi chạy đường cao tốc. Xe đã đi được 45,000km.',
        carIndex: 0 // Toyota Vios 2023
      },
      {
        title: 'Hộp số CVT giật khi khởi hành',
        symptoms: 'Khi khởi động xe và chuyển số D, cảm giác có tiếng "thụp" và giật nhẹ. Điều này xảy ra đặc biệt vào buổi sáng khi xe để qua đêm.',
        errorCode: '',
        description: 'Xe mới chạy được 15,000km. Tình trạng này xuất hiện khoảng 2 tháng nay và ngày càng rõ hơn.',
        carIndex: 0 // Toyota Vios 2023
      },
      {
        title: 'Điều hòa không lạnh vào buổi trưa',
        symptoms: 'Điều hòa hoạt động bình thường vào sáng sớm và chiều tối, nhưng vào buổi trưa (12h-14h) thì gần như không lạnh. Quạt thổi vẫn hoạt động nhưng gió không mát.',
        errorCode: '',
        description: 'Đã kiểm tra gas và đổ thêm gas nhưng vẫn không khắc phục được. Xe đang ở vùng nhiệt đới.',
        carIndex: 5 // Honda City 2023
      },
      {
        title: 'Đèn báo phanh ABS sáng liên tục',
        symptoms: 'Đèn cảnh báo ABS trên taplo sáng liên tục. Khi phanh gấp thì phanh vẫn hoạt động nhưng không có cảm giác ABS can thiệp như trước.',
        errorCode: 'C1201',
        description: 'Hiện tượng xuất hiện sau khi đi qua đoạn đường ngập nước sâu khoảng 30cm.',
        carIndex: 10 // Mazda3 2023
      },
      {
        title: 'Tiếng kêu lạch cạch khi qua gờ giảm tốc',
        symptoms: 'Có tiếng kêu lạch cạch ở phía trước xe mỗi khi qua gờ giảm tốc hoặc đường xóc. Âm thanh nghe như kim loại va chạm vào nhau.',
        errorCode: '',
        description: 'Tiếng kêu xuất hiện sau 20,000km. Không biết có phải liên quan đến giảm xóc hay cần kiểm tra gì.',
        carIndex: 5 // Honda City 2023
      },
      {
        title: 'Đèn check engine sáng - lỗi cảm biến oxy',
        symptoms: 'Đèn check engine sáng vàng liên tục. Xe vẫn chạy bình thường, không có biểu hiện gì bất thường về động cơ hay khả năng vận hành.',
        errorCode: 'P0420',
        description: 'Đã quét mã lỗi thì báo lỗi P0420 - hiệu suất bộ xúc tác dưới ngưỡng. Xe đã đi 60,000km.',
        carIndex: 2 // Toyota Corolla Cross 2023
      },
      {
        title: 'Rung giật khi chạy tốc độ 100-110 km/h',
        symptoms: 'Xe bị rung giật nhẹ ở vô lăng và thân xe khi chạy trong khoảng 100-110km/h. Ngoài tốc độ này thì xe chạy êm.',
        errorCode: '',
        description: 'Đã cân chỉnh lại bánh xe và kiểm tra lốp nhưng vẫn không khắc phục được.',
        carIndex: 8 // Honda CR-V 2023
      },
      {
        title: 'Tiêu hao nhiên liệu cao bất thường',
        symptoms: 'Mức tiêu hao nhiên liệu tăng đột ngột từ 7L/100km lên 11L/100km trong thành phố. Cách lái xe không thay đổi.',
        errorCode: 'P0171',
        description: 'Xe đã thay lọc gió và bugi mới nhưng vẫn không cải thiện. Quét mã lỗi báo P0171 - hỗn hợp quá nghèo.',
        carIndex: 14 // Hyundai Accent 2023
      },
      {
        title: 'Khó khởi động vào buổi sáng',
        symptoms: 'Xe khó khởi động vào buổi sáng, phải nhấn mồi 2-3 lần mới nổ máy. Sau khi xe đã chạy thì khởi động lại rất dễ dàng.',
        errorCode: '',
        description: 'Đã thay bình ắc quy mới nhưng vẫn gặp tình trạng này. Nhiệt độ ban đêm khoảng 20-25 độ C.',
        carIndex: 21 // Mitsubishi Xpander 2023
      },
      {
        title: 'Hệ thống cảnh báo điểm mù không hoạt động',
        symptoms: 'Đèn cảnh báo điểm mù trên gương không sáng khi có xe ở làn bên cạnh. Hệ thống hoàn toàn không phản ứng.',
        errorCode: '',
        description: 'Kiểm tra thì cảm biến vẫn còn nguyên, không bị va chạm hay hư hỏng. Không biết có phải do lỗi phần mềm.',
        carIndex: 12 // Mazda CX-5 2023
      }
    ]

    let createdErrorsCount = 0
    for (const errorData of errorPostsData) {
      const car = createdCars[errorData.carIndex]
      if (!car) continue

      const baseSlug = generateSlug(errorData.title)
      let slug = baseSlug
      let counter = 1
      while (await ErrorPost.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      const existingError = await ErrorPost.findOne({
        title: errorData.title,
        car: car._id
      })

      if (!existingError) {
        await ErrorPost.create({
          title: errorData.title,
          slug,
          symptoms: errorData.symptoms,
          description: errorData.description,
          errorCode: errorData.errorCode || undefined,
          car: car._id,
          author: adminUser._id,
          images: [],
          videos: [],
          views: Math.floor(Math.random() * 500) + 100, // Random views between 100-600
          popularity: Math.floor(Math.random() * 50), // Random popularity
          status: 'open',
          solutions: []
        })
        createdErrorsCount++
      }
    }
    console.log(`✅ Error posts created (${createdErrorsCount} new posts)`)

    console.log('🎉 Database seeding completed successfully!')
    
    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        adminUser: adminUser.username,
        carModels: createdCars.length,
        errorPosts: createdErrorsCount
      }
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error seeding database',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
