# VOZ.EE Clone - Trang web đa tiện ích

Một bản sao của trang web voz.ee được xây dựng bằng Next.js, cung cấp các tiện ích hữu ích như ghi chú, tạo mã QR và rút gọn link.

## ✨ Tính năng

### 📝 Ghi chú
- Tạo và lưu trữ ghi chú cá nhân
- Lưu trữ local trong trình duyệt
- Sao chép và tải xuống ghi chú
- Quản lý danh sách ghi chú đã lưu

### 📱 Tạo mã QR
- Tạo mã QR từ văn bản hoặc URL
- Tùy chỉnh kích thước và màu sắc
- Tải xuống mã QR dưới dạng PNG
- Sao chép mã QR vào clipboard

### 🔗 Rút gọn link
- Tạo link rút gọn từ URL dài
- Tùy chỉnh mã rút gọn
- Theo dõi số lượt click
- Quản lý danh sách link đã tạo

### 🌙 Dark/Light Mode
- Chuyển đổi giữa chế độ sáng và tối
- Lưu trữ preference trong localStorage
- Responsive design cho mobile

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd vozee-clone

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem trang web.

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 15 với App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **QR Code**: react-qr-code
- **Language**: TypeScript
- **Font**: Inter

## 📁 Cấu trúc dự án

```
vozee-clone/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Trang chủ
│   │   ├── notes/
│   │   │   └── page.tsx        # Trang ghi chú
│   │   ├── qr-code/
│   │   │   └── page.tsx        # Trang tạo QR
│   │   └── short-link/
│   │       └── page.tsx        # Trang rút gọn link
│   └── components/
│       ├── header.tsx          # Header component
│       ├── feature-card.tsx    # Feature card component
│       └── theme-provider.tsx  # Theme provider
├── public/                     # Static assets
└── tailwind.config.ts         # Tailwind configuration
```

## 🎨 Tính năng nổi bật

- **Responsive Design**: Tương thích với mọi kích thước màn hình
- **Dark Mode**: Hỗ trợ chế độ tối với animation mượt mà
- **Local Storage**: Lưu trữ dữ liệu local, không cần server
- **Modern UI**: Thiết kế hiện đại với Tailwind CSS
- **TypeScript**: Type safety cho code chất lượng cao

## 📱 Screenshots

### Trang chủ
- Hiển thị 3 tính năng chính với card design đẹp mắt
- Header với navigation và toggle dark mode

### Trang ghi chú
- Editor đơn giản với title và content
- Danh sách ghi chú đã lưu với các action buttons

### Trang QR Code
- Form input với preview real-time
- Tùy chỉnh màu sắc và kích thước
- Download và copy functionality

### Trang rút gọn link
- Input URL với custom code option
- Danh sách link đã tạo với click tracking
- Copy và open link functionality

## 🔧 Development

```bash
# Chạy development server
npm run dev

# Build production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
