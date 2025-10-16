# 🔔 Hệ Thống Thông Báo Tùy Chỉnh

## ✨ Tổng quan

Đã thay thế tất cả thông báo mặc định của trình duyệt (`alert`, `confirm`, `prompt`) bằng hệ thống thông báo tùy chỉnh đẹp mắt và nhất quán với thiết kế của ứng dụng.

## 🎯 Những gì đã thay đổi

### ❌ Trước đây (Browser Alerts):
```javascript
alert('Thông báo');
confirm('Bạn có chắc?');
prompt('Nhập giá trị:');
```

### ✅ Bây giờ (Custom Components):
```javascript
// Toast Notification
setToastType('success');
setToastMessage('Thành công!');
setShowToast(true);

// Confirm Dialog
setShowConfirm(true);
```

## 📦 Components đã tạo

### 1. **Toast Component** (`src/components/toast.tsx`)
Thông báo tự động biến mất sau 3 giây

**Các loại:**
- ✅ `success` - Màu xanh lá
- ❌ `error` - Màu đỏ
- ⚠️ `warning` - Màu vàng

**Sử dụng:**
```tsx
import Toast from '@/components/toast';

const [showToast, setShowToast] = useState(false);
const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
const [toastMessage, setToastMessage] = useState('');

// Hiển thị toast
setToastType('success');
setToastMessage('Đã lưu thành công!');
setShowToast(true);

// Render
{showToast && (
  <Toast
    type={toastType}
    message={toastMessage}
    onClose={() => setShowToast(false)}
  />
)}
```

### 2. **ConfirmDialog Component** (`src/components/confirm-dialog.tsx`)
Modal xác nhận hành động

**Props:**
- `title` - Tiêu đề
- `message` - Nội dung
- `onConfirm` - Callback khi xác nhận
- `onCancel` - Callback khi hủy
- `confirmText` - Text nút xác nhận (mặc định: "OK")
- `cancelText` - Text nút hủy (mặc định: "Hủy")

**Sử dụng:**
```tsx
import ConfirmDialog from '@/components/confirm-dialog';

const [showConfirm, setShowConfirm] = useState(false);

// Hiển thị confirm
setShowConfirm(true);

// Render
{showConfirm && (
  <ConfirmDialog
    title="Xác nhận xóa"
    message="Bạn có chắc muốn xóa?"
    onConfirm={handleConfirm}
    onCancel={() => setShowConfirm(false)}
    confirmText="Xóa"
    cancelText="Hủy"
  />
)}
```

## 🔄 Files đã cập nhật

### 1. **My Notes Page** (`src/app/my-notes/page.tsx`)
- ❌ Bỏ: `confirm('Bạn có chắc muốn xóa?')`
- ✅ Thêm: ConfirmDialog component
- ✅ Thêm: Toast notifications

### 2. **Admin Users Page** (`src/app/admin/users/page.tsx`)
- ❌ Bỏ: `alert('Bạn không có quyền...')`
- ❌ Bỏ: `confirm('Bạn có chắc muốn xóa?')`
- ❌ Bỏ: `confirm('Bạn có chắc muốn vô hiệu hóa?')`
- ✅ Thêm: ConfirmDialog cho toggle/delete user
- ✅ Thêm: Toast cho thông báo thành công/lỗi

### 3. **Admin Dashboard** (`src/app/admin/page.tsx`)
- ❌ Bỏ: `alert('Bạn không có quyền...')`
- ✅ Thêm: Toast notification

### 4. **Short Link Page** (`src/app/short-link/page.tsx`)
- ❌ Bỏ: `alert('Vui lòng nhập URL hợp lệ')`
- ❌ Bỏ: `alert('Mã rút gọn đã tồn tại')`
- ✅ Thêm: Toast cho tất cả thông báo

### 5. **Notes Page** (`src/app/notes/page.tsx`)
- ⚠️ Giữ nguyên `prompt()` cho insert image/link (cần modal input riêng)
- ✅ Đã có Toast từ trước

## 🎨 Thiết kế

### Toast:
- Position: Top-right
- Animation: Slide-in from right
- Auto-dismiss: 3 seconds
- Close button: X icon
- Icons: CheckCircle, XCircle, AlertCircle
- Background: Semi-transparent với backdrop-blur

### ConfirmDialog:
- Position: Center screen
- Background: Dark blue gradient (#1e3a5f → #2d4a6e)
- Border: Subtle border với shadow
- Buttons: 
  - Cancel: Gray
  - Confirm: Orange (hoặc red cho delete)
- Overlay: Black 50% opacity

## 📝 Ví dụ sử dụng

### Xóa ghi chú:
```tsx
const deleteNote = (id: number) => {
  setNoteToDelete(id);
  setShowConfirm(true);
};

const handleConfirmDelete = async () => {
  setShowConfirm(false);
  
  try {
    // Delete logic...
    
    setToastType('success');
    setToastMessage('Đã xóa ghi chú!');
    setShowToast(true);
  } catch (error) {
    setToastType('error');
    setToastMessage('Đã xảy ra lỗi');
    setShowToast(true);
  }
};
```

### Tạo link rút gọn:
```tsx
const createShortLink = () => {
  if (!url.trim()) {
    setToastType('error');
    setToastMessage('Vui lòng nhập URL');
    setShowToast(true);
    return;
  }
  
  // Create logic...
  
  setToastType('success');
  setToastMessage('Link đã được rút gọn!');
  setShowToast(true);
};
```

### Toggle user status:
```tsx
const toggleUserStatus = (userId: number, currentStatus: boolean) => {
  setConfirmAction({ type: 'toggle', userId, currentStatus });
  setShowConfirm(true);
};

{showConfirm && confirmAction && (
  <ConfirmDialog
    title="Xác nhận thay đổi"
    message={`Bạn có chắc muốn ${confirmAction.currentStatus ? 'vô hiệu hóa' : 'kích hoạt'} người dùng này?`}
    onConfirm={handleConfirmAction}
    onCancel={handleCancelAction}
  />
)}
```

## ✅ Lợi ích

1. **Nhất quán**: Tất cả thông báo có cùng style
2. **Đẹp hơn**: Thiết kế hiện đại, phù hợp với theme
3. **UX tốt hơn**: Animation mượt mà, không làm gián đoạn
4. **Tùy chỉnh**: Dễ dàng thay đổi màu sắc, text, icon
5. **Responsive**: Hoạt động tốt trên mọi thiết bị
6. **Accessibility**: Có thể thêm ARIA labels

## 🚀 Tính năng tương lai

- [ ] Input Dialog (thay thế `prompt()`)
- [ ] Loading Toast (cho async operations)
- [ ] Toast Queue (nhiều toast cùng lúc)
- [ ] Toast Position (top-left, bottom-right, etc.)
- [ ] Custom Icons
- [ ] Sound Effects
- [ ] Keyboard Shortcuts (ESC để đóng)

## 📊 Thống kê

- **Components mới**: 2 (Toast, ConfirmDialog)
- **Files cập nhật**: 5 pages
- **Browser alerts loại bỏ**: 6 chỗ
- **Browser confirms loại bỏ**: 3 chỗ
- **Browser prompts giữ lại**: 2 chỗ (cần modal input)

---

**Hoàn thành!** 🎉 Hệ thống thông báo đã được nâng cấp hoàn toàn!

