# 🚀 Deploy Dragon Note lên Vercel

## 📋 Tổng quan

Vercel là nền tảng tốt nhất để deploy Next.js (miễn phí):
- ✅ Tự động build và deploy
- ✅ SSL certificate miễn phí
- ✅ CDN toàn cầu
- ✅ Serverless functions cho API routes
- ✅ Custom domain miễn phí
- ✅ Tự động deploy khi push code

## 🎯 Yêu cầu

- ✅ Tài khoản GitHub (để lưu code)
- ✅ Tài khoản Vercel (đăng ký miễn phí)
- ✅ Database FreeSQLDatabase đã setup

## 📝 Bước 1: Chuẩn bị code

### 1.1. Tạo file `.gitignore` (nếu chưa có)

Đảm bảo file `.gitignore` có nội dung:
```
# dependencies
/node_modules
/.pnp
.pnp.*

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### 1.2. Tạo file `vercel.json` (optional)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"]
}
```

### 1.3. Kiểm tra `package.json`

Đảm bảo có scripts:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

## 🐙 Bước 2: Push code lên GitHub

### 2.1. Khởi tạo Git (nếu chưa có)

```bash
git init
git add .
git commit -m "Initial commit - Dragon Note"
```

### 2.2. Tạo repository trên GitHub

1. Vào https://github.com/new
2. Tạo repository mới (ví dụ: `dragon-note`)
3. **KHÔNG** chọn "Initialize with README"
4. Click "Create repository"

### 2.3. Push code lên GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/dragon-note.git
git branch -M main
git push -u origin main
```

## 🌐 Bước 3: Deploy lên Vercel

### 3.1. Đăng ký Vercel

1. Vào https://vercel.com/signup
2. Chọn "Continue with GitHub"
3. Authorize Vercel

### 3.2. Import Project

1. Click "Add New..." → "Project"
2. Chọn repository `dragon-note`
3. Click "Import"

### 3.3. Cấu hình Project

**Framework Preset**: Next.js (tự động detect)

**Root Directory**: `./` (mặc định)

**Build Command**: `npm run build` (mặc định)

**Output Directory**: `.next` (mặc định)

**Install Command**: `npm install` (mặc định)

### 3.4. Thêm Environment Variables

Click "Environment Variables" và thêm:

```
DB_HOST=sql12.freesqldatabase.com
DB_USER=sql12803231
DB_PASSWORD=yBQrsNT5dU
DB_NAME=sql12803231
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

⚠️ **Quan trọng**: 
- Thay `JWT_SECRET` bằng chuỗi ngẫu nhiên mạnh
- Có thể generate tại: https://randomkeygen.com/

### 3.5. Deploy

1. Click "Deploy"
2. Đợi 2-3 phút để build
3. ✅ Xong!

## 🎉 Bước 4: Truy cập ứng dụng

Sau khi deploy thành công:

- **URL**: `https://dragon-note.vercel.app` (hoặc tên bạn đặt)
- **Dashboard**: https://vercel.com/dashboard

## 🔧 Bước 5: Cấu hình Custom Domain (Optional)

### 5.1. Thêm Domain

1. Vào Project Settings → Domains
2. Nhập domain của bạn (ví dụ: `dragonnote.com`)
3. Click "Add"

### 5.2. Cấu hình DNS

Vercel sẽ hướng dẫn thêm DNS records:

**Nếu dùng root domain** (`dragonnote.com`):
```
Type: A
Name: @
Value: 76.76.21.21
```

**Nếu dùng subdomain** (`www.dragonnote.com`):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3. Đợi DNS propagate (5-30 phút)

## 🔄 Bước 6: Auto Deploy

Mỗi khi bạn push code mới lên GitHub:

```bash
git add .
git commit -m "Update features"
git push
```

Vercel sẽ **tự động build và deploy** trong vài phút!

## 📊 Monitoring & Logs

### Xem Logs
1. Vào Vercel Dashboard
2. Click vào Project
3. Tab "Deployments" → Click deployment → "View Function Logs"

### Analytics
1. Tab "Analytics" để xem traffic
2. Tab "Speed Insights" để xem performance

## ⚙️ Environment Variables Management

### Thêm/Sửa Environment Variables

1. Project Settings → Environment Variables
2. Thêm/Sửa/Xóa variables
3. Click "Save"
4. **Redeploy** để áp dụng thay đổi

### Environments

Vercel có 3 environments:
- **Production**: Branch `main`
- **Preview**: Pull requests
- **Development**: Local development

## 🐛 Troubleshooting

### Build Failed

**Lỗi**: `Module not found`
```bash
# Kiểm tra dependencies
npm install
npm run build
```

**Lỗi**: `Environment variable not found`
- Kiểm tra lại Environment Variables trong Vercel
- Redeploy sau khi thêm

### Database Connection Failed

**Lỗi**: `ECONNREFUSED` hoặc `Access denied`
- Kiểm tra DB credentials trong Environment Variables
- Test connection local trước:
```bash
npm run db:test
```

### API Routes 404

**Lỗi**: API routes không hoạt động
- Đảm bảo files trong `src/app/api/` có `route.ts`
- Check Vercel Function Logs

### Slow Performance

- Enable Edge Runtime cho API routes:
```typescript
export const runtime = 'edge';
```

- Optimize images với Next.js Image component
- Enable caching headers

## 📈 Optimization Tips

### 1. Enable Edge Runtime

Trong API routes:
```typescript
// src/app/api/notes/route.ts
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
```

### 2. Add Caching Headers

```typescript
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
    }
  });
}
```

### 3. Optimize Images

```tsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  width={200} 
  height={100} 
  alt="Dragon"
/>
```

## 🔒 Security Best Practices

### 1. Environment Variables
- ❌ KHÔNG commit `.env.local` vào Git
- ✅ Dùng Vercel Environment Variables
- ✅ Rotate JWT_SECRET định kỳ

### 2. API Security
- ✅ Validate JWT tokens
- ✅ Rate limiting
- ✅ CORS configuration

### 3. Database Security
- ✅ Dùng prepared statements (đã có)
- ✅ Validate user input
- ✅ Limit query results

## 💰 Pricing

### Free Plan (Hobby)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless Functions: 100GB-Hrs
- ✅ 1000 Edge Middleware invocations
- ✅ Custom domains
- ✅ SSL certificates

### Nếu vượt giới hạn
- Upgrade lên Pro ($20/month)
- Hoặc optimize để giảm usage

## 📞 Support

- **Documentation**: https://vercel.com/docs
- **Community**: https://github.com/vercel/next.js/discussions
- **Status**: https://vercel-status.com

## ✅ Checklist

Trước khi deploy:
- [ ] Code đã test local
- [ ] Database đã setup
- [ ] `.gitignore` đã cấu hình
- [ ] Environment variables đã chuẩn bị
- [ ] GitHub repository đã tạo

Sau khi deploy:
- [ ] Test tất cả tính năng
- [ ] Kiểm tra API routes
- [ ] Test đăng nhập/đăng ký
- [ ] Kiểm tra database connection
- [ ] Setup custom domain (nếu có)

## 🎯 Next Steps

1. ✅ Deploy lên Vercel
2. ✅ Test ứng dụng
3. ✅ Setup custom domain
4. ✅ Enable analytics
5. ✅ Monitor performance
6. ✅ Setup error tracking (Sentry)

---

**Chúc bạn deploy thành công!** 🚀

Nếu gặp vấn đề, hãy check Vercel logs hoặc hỏi tôi! 😊

