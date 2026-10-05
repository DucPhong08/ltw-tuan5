# Kế hoạch Triển khai: Tối ưu hóa hiệu năng ReactJS (10.000 sản phẩm)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng ứng dụng quản lý 10.000 sản phẩm với chế độ Chưa tối ưu và Đã tối ưu, đo đạc bằng Lighthouse và xuất báo cáo so sánh chỉ số chi tiết.

**Architecture:** Sử dụng Vite + React 18 (JavaScript thuần). Chế độ chưa tối ưu render thẳng 10.000 DOM node và re-render lặp lại. Chế độ đã tối ưu tích hợp 3 kỹ thuật: Virtualization (Ảo hóa danh sách), Memoization (`React.memo`, `useMemo`, `useCallback`), và Code Splitting (`React.lazy` + `Suspense`). Hỗ trợ URL query param `?mode=...` để đo bằng Lighthouse CLI tự động.

**Tech Stack:** React 18, Vite, Vanilla CSS, Lighthouse CLI (`npx lighthouse`).

**Spec:** `docs/superpowers/specs/2026-10-05-react-performance-optimization-design.md`

## Global Constraints
- Nền tảng: React 18, Vite, JavaScript thuần (không dùng TypeScript phức tạp).
- Không cài thư viện cồng kềnh ngoài React và Vite.
- Git: Sử dụng `rtk git <command>` cho mọi thao tác git.
- Tự động đo Lighthouse qua script Node.js headless Chrome và xuất file HTML/JSON kết quả.
- Viết báo cáo so sánh hoàn chỉnh `BAO_CAO_TOI_UU_REACT.md`.

---

### Task 1: Khởi tạo Project Vite + React & Cấu hình cơ bản

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`

- [x] **Step 1: Viết file package.json và cài đặt dependencies**
- [x] **Step 2: Viết vite.config.js, index.html và src/main.jsx**
- [x] **Step 3: Chạy `npm install` và kiểm tra lệnh `npm run build`**
- [x] **Step 4: Commit thay đổi:** `rtk git add . && rtk git commit -m "feat: scaffold Vite React project"`

---

### Task 2: Sinh dữ liệu 10.000 sản phẩm & Thiết kế giao diện (CSS)

**Files:**
- Create: `src/data/generateProducts.js`
- Create: `src/index.css`

- [x] **Step 1: Viết module sinh dữ liệu ngẫu nhiên 10.000 sản phẩm (`src/data/generateProducts.js`)**
- [x] **Step 2: Xây dựng hệ thống giao diện CSS (`src/index.css`)**
- [x] **Step 3: Kiểm tra build:** `npm run build`
- [x] **Step 4: Commit thay đổi:** `rtk git add src/data src/index.css && rtk git commit -m "feat: add mock data generator and modern styles"`

---

### Task 3: Xây dựng Component danh sách Chưa tối ưu (UnoptimizedList)

**Files:**
- Create: `src/components/ProductItem.jsx`
- Create: `src/components/UnoptimizedList.jsx`

- [x] **Step 1: Viết `ProductItem.jsx` (component con thông thường, không dùng memo)**
- [x] **Step 2: Viết `UnoptimizedList.jsx` (render 10.000 DOM rows, lọc dữ liệu trực tiếp mỗi lần render)**
- [x] **Step 3: Kiểm tra build:** `npm run build`
- [x] **Step 4: Commit:** `rtk git add src/components && rtk git commit -m "feat: implement unoptimized product list"`

---

### Task 4: Xây dựng Component Đã tối ưu (OptimizedList) với 3 Kỹ thuật

**Files:**
- Create: `src/components/MemoizedProductItem.jsx`
- Create: `src/components/OptimizedList.jsx`
- Create: `src/components/AnalyticsModal.jsx`

- [x] **Step 1: Viết `AnalyticsModal.jsx` (thống kê tổng kho hàng, doanh thu dự tính, phân loại)**
- [x] **Step 2: Viết `MemoizedProductItem.jsx` bọc bởi `React.memo`**
- [x] **Step 3: Viết `OptimizedList.jsx` cài đặt Virtualization bằng cửa sổ cuộn và `useMemo`/`useCallback`**
- [x] **Step 4: Kiểm tra build:** `npm run build`
- [x] **Step 5: Commit:** `rtk git add src/components && rtk git commit -m "feat: implement optimized list with virtualization and memoization"`

---

### Task 5: Hoàn thiện `App.jsx`, Tích hợp Switcher & Đồng bộ URL

**Files:**
- Modify: `src/App.jsx`
- Create: `src/components/MetricDashboard.jsx`

- [x] **Step 1: Xây dựng component `MetricDashboard.jsx` hiển thị so sánh trực quan**
- [x] **Step 2: Viết `App.jsx` tích hợp:**
- [x] **Step 3: Chạy thử dev server và kiểm tra giao diện cả 2 chế độ**
- [x] **Step 4: Kiểm tra production build:** `npm run build`
- [x] **Step 5: Commit:** `rtk git add src/App.jsx src/components/MetricDashboard.jsx && rtk git commit -m "feat: integrate dual-mode switcher and URL synchronization"`

---

### Task 6: Đo hiệu năng tự động bằng Google Lighthouse CLI & Thu thập số liệu

**Files:**
- Create: `scripts/run-lighthouse.mjs`
- Create: `reports/unoptimized.json`
- Create: `reports/optimized.json`
- Create: `reports/unoptimized.html`
- Create: `reports/optimized.html`

- [x] **Step 1: Viết script `scripts/run-lighthouse.mjs` chạy preview server và gọi Lighthouse CLI**
- [x] **Step 2: Chạy kiểm thử Lighthouse trên phiên bản Chưa tối ưu (`?mode=unoptimized`)**
- [x] **Step 3: Chạy kiểm thử Lighthouse trên phiên bản Đã tối ưu (`?mode=optimized`)**
- [x] **Step 4: Trích xuất các chỉ số Performance Score, FCP, LCP, TBT, CLS cho cả 2 lượt chạy**
- [x] **Step 5: Commit các file báo cáo:** `rtk git add scripts reports && rtk git commit -m "test: run lighthouse audits and capture benchmark reports"`

---

### Task 7: Viết Báo cáo Tổng kết Hoàn chỉnh (`BAO_CAO_TOI_UU_REACT.md`)

**Files:**
- Create: `BAO_CAO_TOI_UU_REACT.md`

- [x] **Step 1: Soạn thảo báo cáo chuẩn phong cách bài tập sinh viên đại học:**
- [x] **Step 2: Commit báo cáo:** `rtk git add BAO_CAO_TOI_UU_REACT.md && rtk git commit -m "docs: add comprehensive React optimization report"`
