# 🚀 Quick Deploy Guide - Dragon Note

## ⚡ 5 Bước Deploy Nhanh

### Bước 1: Generate JWT Secret ✅
```bash
npm run generate:jwt
```
**→ Copy JWT secret để dùng ở bước 4**

---

### Bước 2: Push lên GitHub 🐙

#### 2.1. Tạo repository trên GitHub
1. Vào: https://github.com/new
2. Repository name: `dragon-note`
3. Click "Create repository"

#### 2.2. Push code
```bash
git init
git add .
git commit -m "Initial commit - Dragon Note"
git remote add origin https://github.com/YOUR_USERNAME/dragon-note.git
git branch -M main
git push -u origin main
```

**Thay `YOUR_USERNAME` bằng username GitHub của bạn!**

---

### Bước 3: Deploy lên Vercel 🌐

#### 3.1. Đăng ký Vercel
1. Vào: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel

#### 3.2. Import Project
1. Click "Add New..." → "Project"
2. Chọn repository `dragon-note`
3. Click "Import"

---

### Bước 4: Thêm Environment Variables 🔐

Click "Environment Variables" và thêm **6 biến** sau:

#### Variable 1:
```
Name: DB_HOST
Value: sql12.freesqldatabase.com
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 2:
```
Name: DB_USER
Value: sql12803231
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 3:
```
Name: DB_PASSWORD
Value: yBQrsNT5dU
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 4:
```
Name: DB_NAME
Value: sql12803231
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 5:
```
Name: DB_PORT
Value: 3306
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 6 (QUAN TRỌNG):
```
Name: JWT_SECRET
Value: <paste JWT secret từ bước 1>
Environment: ✅ Production ✅ Preview ✅ Development
```

---

### Bước 5: Deploy! 🎉

1. Click "Deploy"
2. Đợi 2-5 phút
3. ✅ Xong!

**URL của bạn**: `https://dragon-note-xxx.vercel.app`

---

## 🧪 Test Sau Khi Deploy

### 1. Truy cập website
```
https://your-app.vercel.app
```

### 2. Test đăng nhập Admin
```
URL: /login
Username: admin
Password: Admin@123
```

### 3. Test các tính năng
- ✅ Tạo ghi chú (`/notes`)
- ✅ Xem ghi chú (`/my-notes`)
- ✅ Rút gọn link (`/short-link`)
- ✅ Tạo QR code (`/qr-code`)
- ✅ Quản lý (`/manage`)
- ✅ Admin dashboard (`/admin`)

---

## 🔄 Update Code Sau Này

Mỗi khi sửa code:

```bash
git add .
git commit -m "Update features"
git push
```

**Vercel sẽ tự động deploy!** ⚡

---

## 🐛 Nếu Có Lỗi

### Build Failed
```bash
# Test local
npm run build

# Fix lỗi rồi push lại
git add .
git commit -m "Fix build"
git push
```

### Database Error
1. Check Environment Variables trong Vercel
2. Verify database credentials
3. Redeploy

### API 404
1. Check Vercel Function Logs
2. Verify API routes exist
3. Redeploy

---

## 📞 Cần Giúp?

- **Vercel Docs**: https://vercel.com/docs
- **Check Logs**: Vercel Dashboard → Deployments → View Function Logs
- **Redeploy**: Deployments → ... → Redeploy

---

## ✅ Checklist

- [ ] JWT Secret generated
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] 6 Environment Variables added
- [ ] Deployed successfully
- [ ] Website accessible
- [ ] Login works
- [ ] Features tested

---

**Chúc mừng! Bạn đã deploy thành công!** 🎊

