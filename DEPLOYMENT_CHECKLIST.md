# ✅ Deployment Checklist - Dragon Note

## 📋 Pre-Deployment

### 1. Code Preparation
- [x] ✅ Code đã cleanup (15 files removed)
- [x] ✅ Unused imports đã fix
- [x] ✅ No TypeScript errors
- [x] ✅ No ESLint warnings
- [ ] Test local: `npm run dev`
- [ ] Build test: `npm run build`

### 2. Database Setup
- [x] ✅ FreeSQLDatabase đã setup
- [x] ✅ Database credentials:
  - Host: `sql12.freesqldatabase.com`
  - Database: `sql12803231`
  - User: `sql12803231`
  - Password: `yBQrsNT5dU`
  - Port: `3306`
- [x] ✅ Tables đã tạo (users, short_links, notes, qr_codes)
- [x] ✅ Admin user đã tạo

### 3. Environment Variables
- [ ] Generate JWT secret: `node scripts/generate-jwt-secret.js`
- [ ] Copy JWT secret để dùng cho Vercel
- [ ] Chuẩn bị các env variables:
  ```
  DB_HOST=sql12.freesqldatabase.com
  DB_USER=sql12803231
  DB_PASSWORD=yBQrsNT5dU
  DB_NAME=sql12803231
  DB_PORT=3306
  JWT_SECRET=<generated-secret>
  ```

### 4. Files Check
- [x] ✅ `vercel.json` đã tạo
- [x] ✅ `.gitignore` đã có
- [x] ✅ `package.json` scripts OK
- [ ] `.env.local` KHÔNG commit (đã trong .gitignore)

## 🐙 GitHub Setup

### 1. Initialize Git
```bash
# Nếu chưa có git
git init

# Check status
git status
```

### 2. Create Repository
- [ ] Vào https://github.com/new
- [ ] Repository name: `dragon-note` (hoặc tên khác)
- [ ] Visibility: Public hoặc Private
- [ ] KHÔNG chọn "Initialize with README"
- [ ] Click "Create repository"

### 3. Push Code
```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Dragon Note App"

# Add remote (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/dragon-note.git

# Push
git branch -M main
git push -u origin main
```

### 4. Verify
- [ ] Code đã lên GitHub
- [ ] `.env.local` KHÔNG có trên GitHub
- [ ] All files visible

## 🌐 Vercel Deployment

### 1. Create Vercel Account
- [ ] Vào https://vercel.com/signup
- [ ] Click "Continue with GitHub"
- [ ] Authorize Vercel

### 2. Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Select repository `dragon-note`
- [ ] Click "Import"

### 3. Configure Build Settings
- [ ] Framework Preset: **Next.js** (auto-detected)
- [ ] Root Directory: `./`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

### 4. Add Environment Variables
Click "Environment Variables" và thêm từng cái:

```
Name: DB_HOST
Value: sql12.freesqldatabase.com
Environment: Production, Preview, Development
```

```
Name: DB_USER
Value: sql12803231
Environment: Production, Preview, Development
```

```
Name: DB_PASSWORD
Value: yBQrsNT5dU
Environment: Production, Preview, Development
```

```
Name: DB_NAME
Value: sql12803231
Environment: Production, Preview, Development
```

```
Name: DB_PORT
Value: 3306
Environment: Production, Preview, Development
```

```
Name: JWT_SECRET
Value: <paste-generated-secret>
Environment: Production, Preview, Development
```

### 5. Deploy
- [ ] Click "Deploy"
- [ ] Đợi build (2-5 phút)
- [ ] Check build logs nếu có lỗi

## 🧪 Post-Deployment Testing

### 1. Basic Tests
- [ ] Website loads: `https://your-app.vercel.app`
- [ ] Homepage hiển thị đúng
- [ ] Logo "Dragon" hiển thị
- [ ] Sidebar menu hoạt động

### 2. Authentication Tests
- [ ] Trang đăng ký: `/register`
- [ ] Đăng ký user mới
- [ ] Trang đăng nhập: `/login`
- [ ] Đăng nhập với user vừa tạo
- [ ] Đăng nhập với admin (admin/Admin@123)

### 3. Features Tests
- [ ] **Tạo ghi chú** (`/notes`)
  - Nhập tiêu đề, nội dung
  - Click "Lưu"
  - Check toast notification
  
- [ ] **Xem ghi chú** (`/my-notes`)
  - Danh sách ghi chú hiển thị
  - Click xem chi tiết
  - Copy note key
  - Xóa ghi chú

- [ ] **Rút gọn link** (`/short-link`)
  - Nhập URL
  - Tạo short code
  - Copy link
  - Test link hoạt động

- [ ] **Tạo QR code** (`/qr-code`)
  - Nhập text
  - QR code hiển thị
  - Download QR

- [ ] **Quản lý** (`/manage`)
  - 4 boxes hiển thị
  - Click vào từng box
  - Profile page hoạt động

- [ ] **Admin** (`/admin`)
  - Đăng nhập với admin
  - Dashboard hiển thị stats
  - User management hoạt động
  - Toggle user status
  - Delete user

### 4. API Tests
- [ ] `/api/auth/login` - Login API
- [ ] `/api/auth/register` - Register API
- [ ] `/api/notes` - Notes CRUD
- [ ] `/api/admin/stats` - Admin stats
- [ ] `/api/admin/users` - User management

### 5. Database Tests
- [ ] Data được lưu vào database
- [ ] Queries hoạt động
- [ ] Foreign keys OK
- [ ] No connection errors

## 🔧 Troubleshooting

### Build Failed
```bash
# Test local build
npm run build

# Check errors
# Fix và push lại
git add .
git commit -m "Fix build errors"
git push
```

### Database Connection Error
- [ ] Check environment variables trong Vercel
- [ ] Verify database credentials
- [ ] Test connection: `npm run db:test`
- [ ] Check Vercel Function Logs

### API Routes 404
- [ ] Check file structure: `src/app/api/*/route.ts`
- [ ] Check Vercel deployment logs
- [ ] Redeploy nếu cần

### JWT Errors
- [ ] Verify JWT_SECRET trong Vercel
- [ ] Regenerate secret nếu cần
- [ ] Redeploy

## 📊 Monitoring

### 1. Vercel Dashboard
- [ ] Check deployment status
- [ ] View function logs
- [ ] Monitor analytics
- [ ] Check speed insights

### 2. Database Monitoring
- [ ] Login to FreeSQLDatabase
- [ ] Check database size (5MB limit)
- [ ] Monitor queries
- [ ] Backup data nếu cần

## 🚀 Custom Domain (Optional)

### 1. Add Domain to Vercel
- [ ] Project Settings → Domains
- [ ] Add domain: `yourdomain.com`
- [ ] Copy DNS records

### 2. Configure DNS
Nếu dùng `host88.vpshosting.vn`:
- [ ] Login to hosting control panel
- [ ] DNS Management
- [ ] Add A record hoặc CNAME
- [ ] Point to Vercel

### 3. Wait for DNS
- [ ] DNS propagation (5-30 phút)
- [ ] SSL certificate auto-generated
- [ ] Test domain

## 🎯 Performance Optimization

### 1. Enable Caching
- [ ] Add cache headers to API routes
- [ ] Use Next.js Image component
- [ ] Optimize static assets

### 2. Database Optimization
- [ ] Add indexes to frequently queried columns
- [ ] Limit query results
- [ ] Use pagination

### 3. Code Optimization
- [ ] Remove console.logs
- [ ] Minify code (auto by Next.js)
- [ ] Lazy load components

## 🔒 Security Checklist

- [x] ✅ `.env.local` not in Git
- [ ] JWT_SECRET is strong (64+ characters)
- [x] ✅ SQL injection prevention (prepared statements)
- [x] ✅ Password hashing (bcryptjs)
- [x] ✅ JWT authentication
- [ ] Rate limiting (consider adding)
- [ ] CORS configured
- [ ] Input validation

## 📝 Final Steps

### 1. Documentation
- [ ] Update README.md với production URL
- [ ] Document API endpoints
- [ ] Add screenshots

### 2. Backup
- [ ] Backup database
- [ ] Export code to zip
- [ ] Save environment variables

### 3. Share
- [ ] Share URL với team/users
- [ ] Create demo account
- [ ] Write deployment notes

## 🎉 Success Criteria

- [ ] ✅ Website accessible at Vercel URL
- [ ] ✅ All features working
- [ ] ✅ Database connected
- [ ] ✅ Authentication working
- [ ] ✅ No console errors
- [ ] ✅ Mobile responsive
- [ ] ✅ Fast loading (<3s)
- [ ] ✅ SSL enabled (https)

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **FreeSQLDatabase**: https://www.freesqldatabase.com
- **GitHub Issues**: Create issue in your repo

---

## 🚀 Quick Deploy Commands

```bash
# 1. Generate JWT Secret
node scripts/generate-jwt-secret.js

# 2. Test build
npm run build

# 3. Initialize Git (if needed)
git init
git add .
git commit -m "Initial commit - Dragon Note"

# 4. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/dragon-note.git
git branch -M main
git push -u origin main

# 5. Go to Vercel
# - Import project
# - Add environment variables
# - Deploy!
```

---

**Good luck with your deployment!** 🎊

Nếu gặp vấn đề, check lại từng bước trong checklist này! ✅

