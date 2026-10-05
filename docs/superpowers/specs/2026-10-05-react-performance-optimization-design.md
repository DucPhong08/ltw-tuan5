# Tài liệu Thiết kế: Tối ưu hóa hiệu năng ReactJS (Quản lý 10.000 sản phẩm)

## 1. Mục tiêu và Bối cảnh
- **Môn học**: Lập trình Web Nâng cao (LTWNC) - Bài tập tuần 5.
- **Yêu cầu**:
  1. Xây dựng trang ReactJS quản lý 10.000 sản phẩm (chưa tối ưu).
  2. Đo hiệu năng bằng Google Lighthouse (chụp lại FCP, LCP, TBT, CLS).
  3. Áp dụng ít nhất 2 kỹ thuật tối ưu (Virtualization, Memoization, Code-splitting).
  4. Đo lại bằng Lighthouse sau khi tối ưu và viết báo cáo so sánh.
- **Tiêu chí**: Đơn giản, rõ ràng, code sạch, phù hợp sinh viên giải thích khi vấn đáp.

## 2. Kiến trúc & Công nghệ
- **Nền tảng**: React 18 + Vite (JavaScript).
- **Styling**: Vanilla CSS hiện đại, trực quan, hỗ trợ responsive.
- **Công cụ đo đạc**: Google Lighthouse CLI (`npx lighthouse`) tự động xuất báo cáo HTML và JSON.

## 3. Cấu trúc thư mục
```
ltw-tuan5/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   └── generateProducts.js      # Tạo 10.000 sản phẩm mẫu ngẫu nhiên
│   ├── components/
│   │   ├── Header.jsx               # Header kèm nút gạt chuyển chế độ
│   │   ├── MetricDashboard.jsx      # Bảng tóm tắt chỉ số Lighthouse
│   │   ├── UnoptimizedList.jsx      # Danh sách render 10.000 phần tử DOM cùng lúc
│   │   ├── OptimizedList.jsx        # Danh sách ảo hóa (Virtual List)
│   │   ├── ProductItem.jsx          # Dòng sản phẩm (chưa memo)
│   │   ├── MemoizedProductItem.jsx  # Dòng sản phẩm bọc React.memo
│   │   └── AnalyticsModal.jsx       # Modal thống kê nặng (dùng React.lazy)
├── scripts/
│   └── run-lighthouse.js            # Script đo tự động bằng Lighthouse CLI
└── BAO_CAO_TOI_UU_REACT.md          # Báo cáo so sánh chi tiết kèm biểu bảng
```

## 4. Các kỹ thuật tối ưu áp dụng
1. **Virtualization (Ảo hóa danh sách)**:
   - Thay vì đưa 10.000 thẻ DOM vào trang cùng lúc, chỉ render số phần tử vừa vặn khung hình (khoảng 15-20 phần tử) dựa trên vị trí cuộn `scrollTop`.
   - Giảm DOM node từ >40.000 node xuống <100 node.
2. **Memoization (`React.memo`, `useMemo`, `useCallback`)**:
   - `React.memo` ngăn chặn re-render các dòng sản phẩm không bị ảnh hưởng khi gõ tìm kiếm.
   - `useMemo` tránh lặp qua 10.000 sản phẩm khi các giá trị phụ thuộc không đổi.
   - `useCallback` tránh tạo mới hàm xử lý sự kiện trong mỗi lần component cha render.
3. **Code-splitting (`React.lazy` + `Suspense`)**:
   - Tách riêng `AnalyticsModal` thành chunk riêng biệt, chỉ tải khi người dùng nhấn nút "Xem thống kê".

## 5. Quy trình kiểm thử & xác minh
1. Khởi động ứng dụng bằng `npm run build` và `npm run preview`.
2. Chạy Lighthouse đo URL `http://localhost:4173/?mode=unoptimized` -> lưu file kết quả.
3. Chạy Lighthouse đo URL `http://localhost:4173/?mode=optimized` -> lưu file kết quả.
4. Trích xuất các chỉ số: Performance Score, FCP (First Contentful Paint), LCP (Largest Contentful Paint), TBT (Total Blocking Time), CLS (Cumulative Layout Shift).
5. Tổng hợp vào file `BAO_CAO_TOI_UU_REACT.md`.
