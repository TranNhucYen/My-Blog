# BlogMVC - Hệ thống Quản lý Blog Node.js

Hệ thống quản lý Blog được xây dựng trên nền tảng **Node.js**, **Express**, và **MySQL**, tuân thủ kiến trúc **Model-View-Controller (MVC)**.

---

## Các Tính năng Chính

- **Xác thực Người dùng**: Hệ thống đăng nhập sử dụng `bcrypt` để mã hóa mật khẩu và `express-session` để quản lý phiên làm việc.
- **Quản lý Blog**: Các thao tác CRUD (Thêm, Đọc, Sửa, Xóa) cho bài viết, tích hợp tải lên hình ảnh qua **Supabase Storage**.
- **Bảng điều khiển (Dashboard)**: Hiển thị số liệu thống kê bằng **Chart.js** và quản lý dữ liệu với **Grid.js**.
- **Giao diện Phản hồi (Responsive)**: Giao diện người dùng được xây dựng với **EJS Templating** và **Tailwind CSS**.
- **Tính năng Bảo mật**:
    - **Rate Limiting**: Hạn chế số lượng yêu cầu để ngăn chặn brute-force.
    - **Input Validation**: Kiểm soát dữ liệu đầu vào với `express-validator`.
- **Quản lý Session**: Sử dụng **Redis** để lưu trữ session.
- **Giao tiếp Email**: Tích hợp **Resend API** cho biểu mẫu liên hệ và thông báo.
- **Đóng gói Tài nguyên**: Sử dụng **esbuild** để biên dịch Javascript và FontAwesome.

---

## Công nghệ Sử dụng

| Tầng (Layer) | Công nghệ |
| :--- | :--- |
| **Backend** | Node.js (Express.js) |
| **Database** | MySQL (Sequelize ORM) |
| **Caching** | Redis |
| **Frontend** | EJS, Tailwind CSS, Grid.js, Chart.js |
| **Storage** | Supabase Storage |
| **Email** | Resend API |
| **Bundler** | esbuild |

---

## Hướng dẫn Khởi chạy

### Yêu cầu Hệ thống

Đảm bảo bạn đã cài đặt:
- **Node.js** (v18.x trở lên)
- **MySQL** (v8.0+)
- **Redis** (Tùy chọn, để quản lý session tối ưu)
- **Docker Desktop** (Tùy chọn, để thiết lập môi trường nhanh chóng)

### 1. Cài đặt

```bash
git clone https://github.com/TranNhucYen/My-Blog.git
npm install
```

### 2. Cấu hình Môi trường

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

Cập nhật các thông số trong `.env` như: Database, Redis, Supabase keys, và Resend API keys để phù hợp với môi trường của bạn.

### 3. Thiết lập Môi trường Phát triển

**Lựa chọn A: Sử dụng Docker (Nhanh nhất)**
```bash
docker-compose -f db/docker-compose.yml up -d
```

**Lựa chọn B: Thiết lập Thủ công**
- Tạo một MySQL database với tên `myblog`.
- Khởi chạy Redis server cục bộ.

### 4. Khởi tạo Cơ sở dữ liệu

Đồng bộ schema và tạo dữ liệu mẫu:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 5. Biên dịch Tài nguyên (Build Assets)

Dự án cần biên dịch Tailwind CSS và đóng gói các thư viện JS/Fonts:

```bash
# Build JS & Font bundles
node esbuild.js
node esbuild-font.js

# Build Tailwind CSS
npm run build:tailwind
```

---

## Chạy Ứng dụng

### Chế độ Phát triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ hoạt động tại địa chỉ `http://localhost:3000`.

### Chế độ Production
```bash
npm start
```

---

## Cấu trúc Thư mục

```text
BlogMVC/
├── db/              # Cấu hình Database & Docker Compose
├── frontend/        # Tài nguyên nguồn (CSS/JS vendors)
├── src/
│   ├── config/      # Cấu hình ứng dụng
│   ├── controllers/ # Xử lý logic nghiệp vụ
│   ├── middleware/  # Các phần mềm trung gian tùy chỉnh
│   ├── models/      # Sequelize database models
│   ├── routes/      # Định nghĩa các tuyến đường (routes)
│   ├── services/    # Giao tiếp với cơ sở dữ liệu và dịch vụ bên ngoài (Supabase, Resend)
│   ├── views/       # Giao diện EJS templates
│   └── public/      # Tài nguyên đã biên dịch
```

---

## Các Scripts có sẵn

- `npm run dev`: Chạy server phát triển với Nodemon.
- `npm start`: Chạy server production.
- `npm run build:tailwind`: Biên dịch Tailwind CSS.
- `node esbuild.js`: Đóng gói các thư viện vendor.
- `node esbuild-font.js`: Đóng gói icon FontAwesome.

---

## Giấy phép

Dự án này được cấp phép theo **ISC License**.

---
