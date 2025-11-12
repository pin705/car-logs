# Cấu hình Cloudinary (Cloudinary Configuration)

## Giới thiệu (Introduction)

CarLogs sử dụng Cloudinary để quản lý và tối ưu hóa việc upload hình ảnh và video. Cloudinary cung cấp:
- Lưu trữ đám mây an toàn
- Tối ưu hóa hình ảnh tự động
- CDN toàn cầu để tải nhanh
- Chuyển đổi định dạng tự động (WebP, AVIF)

CarLogs uses Cloudinary for managing and optimizing image and video uploads. Cloudinary provides:
- Secure cloud storage
- Automatic image optimization
- Global CDN for fast loading
- Automatic format conversion (WebP, AVIF)

## Cách thiết lập (Setup Instructions)

### 1. Tạo tài khoản Cloudinary miễn phí (Create Free Cloudinary Account)

1. Truy cập [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Đăng ký tài khoản miễn phí
3. Xác nhận email của bạn

### 2. Lấy thông tin xác thực (Get Your Credentials)

Sau khi đăng nhập, bạn sẽ thấy **Dashboard** với thông tin:
- **Cloud Name**: Tên định danh duy nhất của bạn
- **API Key**: Khóa API công khai
- **API Secret**: Khóa API bí mật (giữ bảo mật)

After logging in, you'll see the **Dashboard** with:
- **Cloud Name**: Your unique identifier
- **API Key**: Public API key
- **API Secret**: Secret API key (keep this secure)

### 3. Cấu hình biến môi trường (Configure Environment Variables)

Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Cập nhật các giá trị Cloudinary trong `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Thay thế `your_cloud_name`, `your_api_key`, và `your_api_secret` bằng thông tin từ Cloudinary Dashboard của bạn.

Replace `your_cloud_name`, `your_api_key`, and `your_api_secret` with your actual credentials from Cloudinary Dashboard.

### 4. Tạo thư mục upload (Create Upload Folder)

Trong Cloudinary Dashboard:
1. Vào **Media Library**
2. Tạo thư mục mới tên `car-logs`
3. Đây là nơi tất cả hình ảnh/video sẽ được lưu

In Cloudinary Dashboard:
1. Go to **Media Library**
2. Create a new folder named `car-logs`
3. This is where all images/videos will be stored

## Giới hạn miễn phí (Free Tier Limits)

Gói miễn phí của Cloudinary bao gồm:
- 25 GB lưu trữ
- 25 GB băng thông/tháng
- 25,000 transformations/tháng

Cloudinary free tier includes:
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

Điều này đủ cho hầu hết các ứng dụng nhỏ đến trung bình.

This is sufficient for most small to medium applications.

## Tính năng được sử dụng (Features Used)

### Tối ưu hóa tự động (Auto Optimization)
- Chất lượng tự động (`quality: auto`)
- Định dạng tự động (`fetch_format: auto`)
- Tự động chọn WebP hoặc AVIF nếu trình duyệt hỗ trợ

### Thư mục tổ chức (Organized Folders)
- Tất cả uploads được lưu trong folder `car-logs/`
- Dễ dàng quản lý và sao lưu

### Hỗ trợ nhiều loại file (Multiple File Types)
- Hình ảnh: JPEG, PNG, GIF, WebP
- Video: MP4, WebM
- Giới hạn kích thước: 10MB/file

## Khắc phục sự cố (Troubleshooting)

### Lỗi: "Invalid credentials"
- Kiểm tra lại Cloud Name, API Key, và API Secret
- Đảm bảo không có khoảng trắng thừa
- Xác nhận file `.env` được load đúng

### Lỗi: "Upload failed"
- Kiểm tra kích thước file (<10MB)
- Xác nhận định dạng file được hỗ trợ
- Kiểm tra kết nối internet

### Lỗi: "Quota exceeded"
- Bạn đã vượt giới hạn miễn phí
- Xem xét nâng cấp hoặc tối ưu hóa uploads

## Bảo mật (Security)

⚠️ **QUAN TRỌNG (IMPORTANT):**
- KHÔNG commit file `.env` vào Git
- KHÔNG chia sẻ API Secret công khai
- Sử dụng biến môi trường cho production

## Tài liệu bổ sung (Additional Resources)

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK Guide](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

## Hỗ trợ (Support)

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Cloudinary Community](https://community.cloudinary.com/)
2. Xem [Status Page](https://status.cloudinary.com/)
3. Liên hệ [Cloudinary Support](https://support.cloudinary.com/)

If you encounter issues:
1. Check [Cloudinary Community](https://community.cloudinary.com/)
2. See [Status Page](https://status.cloudinary.com/)
3. Contact [Cloudinary Support](https://support.cloudinary.com/)
