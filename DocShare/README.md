# DocShare - Frontend

## Giới thiệu

DocShare là một ứng dụng web hiện đại cho phép người dùng chia sẻ và quản lý tài liệu. Dự án này chỉ bao gồm phần frontend, được xây dựng với các công nghệ tiên tiến như Next.js 15.2.4, React 19 và TypeScript.

## Công nghệ sử dụng

- **Next.js 15.2.4** với App Router
- **React 19** và **TypeScript**
- **Tailwind CSS** cho styling
- **shadcn/ui** (dựa trên Radix UI) cho các component UI
- **Framer Motion** cho hiệu ứng chuyển động

## Tính năng

- Giao diện người dùng hiện đại và thân thiện
- Các trang: Trang chủ, Kho tài liệu, Tài liệu đã lưu, Dashboard
- Các thành phần UI: Hero, HowItWorks, Features, Stats, Testimonials, CTA
- Hỗ trợ xem và tải xuống tài liệu
- Tìm kiếm tài liệu
- Đánh dấu tài liệu yêu thích

## Cài đặt và chạy

1. Clone dự án:
   ```bash
   git clone <repository-url>
   cd DocShare
   ```

2. Cài đặt các dependencies:
   ```bash
   npm install
   # hoặc
   yarn install
   # hoặc
   pnpm install
   ```

3. Chạy ứng dụng ở môi trường development:
   ```bash
   npm run dev
   # hoặc
   yarn dev
   # hoặc
   pnpm dev
   ```

4. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt để xem kết quả.

## Lưu ý

- Dự án này chỉ bao gồm phần frontend và sử dụng dữ liệu mẫu để hiển thị giao diện.
- Các chức năng liên quan đến backend (xác thực, lưu trữ dữ liệu) đã được thay thế bằng các hàm giả lập.
- Để có ứng dụng hoàn chỉnh, bạn cần phát triển một backend riêng và kết nối với frontend này.

## Cấu trúc dự án

- `/src/app`: Chứa các trang (sử dụng App Router của Next.js)
- `/src/components`: Chứa các component UI được tái sử dụng
- `/src/lib`: Chứa các hàm tiện ích và dữ liệu mẫu
- `/src/hooks`: Chứa các custom hooks
- `/src/providers`: Chứa các context providers
- `/src/types`: Chứa các định nghĩa TypeScript