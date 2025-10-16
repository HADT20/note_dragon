# 📝 Tính năng Ghi Chú - VOZ.EE

## ✨ Tổng quan

Tính năng ghi chú cho phép người dùng tạo, lưu trữ và quản lý các ghi chú cá nhân trên database MySQL.

## 🎯 Tính năng đã hoàn thành

### 1. **Tạo ghi chú mới** (`/notes`)
- ✅ Nhập tiêu đề, người nhận, nội dung
- ✅ Tạo mã khóa tự động hoặc tùy chỉnh
- ✅ Rich text editor với toolbar
- ✅ Undo/Redo
- ✅ Lưu vào database MySQL
- ✅ Thông báo toast khi lưu thành công

### 2. **Xem danh sách ghi chú** (`/my-notes`)
- ✅ Hiển thị tất cả ghi chú của user
- ✅ Grid layout responsive
- ✅ Xem chi tiết ghi chú (modal)
- ✅ Copy mã khóa
- ✅ Xóa ghi chú
- ✅ Hiển thị ngày tạo

### 3. **API Backend**
- ✅ `POST /api/notes` - Tạo ghi chú mới
- ✅ `GET /api/notes` - Lấy danh sách ghi chú
- ✅ `GET /api/notes/[id]` - Lấy chi tiết ghi chú
- ✅ `PUT /api/notes/[id]` - Cập nhật ghi chú
- ✅ `DELETE /api/notes/[id]` - Xóa ghi chú

### 4. **Bảo mật**
- ✅ Yêu cầu đăng nhập
- ✅ JWT authentication
- ✅ Chỉ xem/sửa/xóa ghi chú của mình

## 📊 Database Schema

```sql
CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  recipient VARCHAR(100),
  content TEXT,
  note_key VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_note_key (note_key),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🚀 Cách sử dụng

### 1. Tạo ghi chú mới

1. Đăng nhập vào hệ thống
2. Vào menu **"Tạo Ghi Chú"** hoặc truy cập `/notes`
3. Nhập thông tin:
   - **Tiêu đề** (tùy chọn)
   - **Người nhận** (tùy chọn)
   - **Nội dung** (bắt buộc)
4. Click **"Tạo khóa"** để tạo mã khóa ngẫu nhiên (hoặc để trống)
5. Click **"Lưu"**
6. Ghi chú sẽ được lưu vào database

### 2. Xem ghi chú đã lưu

1. Click vào tên user ở góc phải trên
2. Chọn **"Ghi chú của tôi"** hoặc truy cập `/my-notes`
3. Xem danh sách tất cả ghi chú

### 3. Xem chi tiết ghi chú

1. Trong trang "Ghi chú của tôi"
2. Click icon **mắt** (👁️) trên ghi chú
3. Modal hiển thị đầy đủ thông tin

### 4. Copy mã khóa

1. Click icon **copy** (📋) bên cạnh mã khóa
2. Mã khóa được copy vào clipboard

### 5. Xóa ghi chú

1. Click icon **thùng rác** (🗑️) trên ghi chú
2. Xác nhận xóa
3. Ghi chú sẽ bị xóa khỏi database

## 🔧 API Documentation

### POST /api/notes
Tạo ghi chú mới

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Tiêu đề ghi chú",
  "recipient": "Người nhận",
  "content": "Nội dung ghi chú",
  "note_key": "ABC123XYZ" // Tùy chọn
}
```

**Response:**
```json
{
  "message": "Ghi chú đã được lưu thành công!",
  "note": {
    "id": 1,
    "title": "Tiêu đề ghi chú",
    "recipient": "Người nhận",
    "content": "Nội dung ghi chú",
    "note_key": "ABC123XYZ",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/notes
Lấy danh sách ghi chú của user

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "notes": [
    {
      "id": 1,
      "title": "Tiêu đề",
      "recipient": "Người nhận",
      "content": "Nội dung",
      "note_key": "ABC123",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": null
    }
  ]
}
```

### GET /api/notes/[id]
Lấy chi tiết ghi chú

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "note": {
    "id": 1,
    "title": "Tiêu đề",
    "recipient": "Người nhận",
    "content": "Nội dung",
    "note_key": "ABC123",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": null
  }
}
```

### PUT /api/notes/[id]
Cập nhật ghi chú

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Tiêu đề mới",
  "recipient": "Người nhận mới",
  "content": "Nội dung mới"
}
```

### DELETE /api/notes/[id]
Xóa ghi chú

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Ghi chú đã được xóa!"
}
```

## 🎨 UI Components

### 1. Notes Page (`/notes`)
- Form tạo ghi chú
- Rich text editor
- Toolbar với các tính năng format
- Nút Lưu, Thử lại, Tạo khóa

### 2. My Notes Page (`/my-notes`)
- Grid layout hiển thị ghi chú
- Card component cho mỗi ghi chú
- Modal xem chi tiết
- Actions: Xem, Copy, Xóa

### 3. Toast Notification
- Thông báo thành công/lỗi
- Auto dismiss sau 3 giây
- Animation slide-in

## 🔐 Bảo mật

1. **Authentication**: Yêu cầu JWT token
2. **Authorization**: Chỉ xem/sửa/xóa ghi chú của mình
3. **Validation**: Kiểm tra input trước khi lưu
4. **SQL Injection**: Sử dụng prepared statements

## 📝 Lưu ý

1. **Mã khóa duy nhất**: Mỗi ghi chú có mã khóa riêng
2. **Tự động tạo**: Nếu không nhập mã khóa, hệ thống tự tạo
3. **Không thể trùng**: Mã khóa không được trùng lặp
4. **Xóa cascade**: Khi xóa user, tất cả ghi chú cũng bị xóa

## 🚀 Các bước tiếp theo (Tùy chọn)

- [ ] Tìm kiếm ghi chú
- [ ] Filter theo ngày tạo
- [ ] Chia sẻ ghi chú với người khác
- [ ] Export ghi chú (PDF, TXT)
- [ ] Rich text preview
- [ ] Markdown support
- [ ] Tags/Categories
- [ ] Pin ghi chú quan trọng

---

**Hoàn thành!** 🎉

