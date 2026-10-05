# LTWNC Tuần 5 - Tối Ưu Hóa Hiệu Năng ReactJS (10.000 Sản Phẩm)

Dự án thực hành môn Lập trình Web Nâng cao (LTWNC) - Bài tập tuần 5 về tối ưu hóa hiệu năng ReactJS.

## 📌 Báo cáo chi tiết Before & After
Xem toàn bộ báo cáo phân tích, hình ảnh và số liệu đo lường Lighthouse tại:
👉 **[BAO_CAO_TOI_UU_REACT.md](./BAO_CAO_TOI_UU_REACT.md)**

## 🚀 Các kỹ thuật tối ưu hóa áp dụng
1. **Virtualization (Ảo hóa danh sách):** Chỉ render ~15-20 thẻ DOM trong viewport thay vì 10.000 thẻ, giảm Total Blocking Time (TBT) từ **710ms về 0ms**.
2. **Memoization (`React.memo` + `useMemo` + `useCallback`):** Ngăn re-render thừa và cache kết quả lọc 10.000 bản ghi, phản hồi mượt mà 60 FPS khi gõ tìm kiếm.
3. **Code-Splitting & Lazy Loading (`React.lazy` + `Suspense`):** Tách `AnalyticsModal` thành chunk riêng (~3.15 kB), tải động khi người dùng cần.

## 📊 Kết quả đo lường Google Lighthouse
| Chỉ số | Trước tối ưu (Before) | Sau tối ưu (After) | Cải thiện |
| :--- | :---: | :---: | :---: |
| **Performance Score** | **74 / 100** | **100 / 100** | **+26 điểm (Tuyệt đối)** |
| **Total Blocking Time (TBT)** | **710 ms** | **0 ms** | **Giảm 100% đơ giật** |
| **Largest Contentful Paint (LCP)** | **0.5 s** | **0.3 s** | **Nhanh hơn 40%** |
| **Số DOM node** | **> 40.000** | **~80** | **Giảm 99.8% DOM** |

## 🛠️ Hướng dẫn cài đặt & chạy thử
```bash
# 1. Cài đặt thư viện
npm install

# 2. Chạy môi trường phát triển (có nút gạt chuyển đổi chế độ trực tiếp)
npm run dev

# 3. Build và chạy tự động bài đo Lighthouse CLI
npm run build
npm run lighthouse
```
