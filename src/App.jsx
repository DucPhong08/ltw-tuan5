import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { generateProducts } from './data/generateProducts.js';
import UnoptimizedList from './components/UnoptimizedList.jsx';
import OptimizedList from './components/OptimizedList.jsx';
import MetricDashboard from './components/MetricDashboard.jsx';

// Tải lười (Code-splitting) modal thống kê
const AnalyticsModal = lazy(() => import('./components/AnalyticsModal.jsx'));

export default function App() {
  // Đồng bộ chế độ với URL param (?mode=unoptimized hoặc ?mode=optimized)
  const [isOptimized, setIsOptimized] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'optimized';
  });

  const [products, setProducts] = useState(() => generateProducts(10000));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cập nhật URL khi chuyển đổi chế độ
  const handleToggleMode = (mode) => {
    setIsOptimized(mode);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('mode', mode ? 'optimized' : 'unoptimized');
    window.history.replaceState({}, '', newUrl.toString());
  };

  // Kỹ thuật useCallback cho các event handler
  const handleDeleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleViewDetail = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  return (
    <div className="app-container">
      {/* Header & Bộ chuyển đổi chế độ */}
      <header className="app-header">
        <div className="header-top">
          <div className="header-title">
            <h1>
              Quản Lý Kho 10.000 Sản Phẩm
              <span className="badge-student">LTWNC - Tuần 5</span>
            </h1>
            <p className="header-subtitle">
              Ứng dụng kiểm thử và so sánh hiệu năng React trước & sau khi tối ưu hóa
            </p>
          </div>

          {/* Switcher chuyển đổi trực quan */}
          <div className="mode-toggle-card">
            <span>Chế độ:</span>
            <button
              type="button"
              className={`switch-btn unoptimized ${!isOptimized ? 'active' : ''}`}
              onClick={() => handleToggleMode(false)}
            >
              Chưa tối ưu
            </button>
            <button
              type="button"
              className={`switch-btn optimized ${isOptimized ? 'active' : ''}`}
              onClick={() => handleToggleMode(true)}
            >
              Đã tối ưu (Virtual + Memo)
            </button>
          </div>
        </div>

        {/* Thông báo trạng thái cơ chế đang chạy */}
        {!isOptimized ? (
          <div className="status-banner unoptimized">
            <div>
              <strong>Cảnh báo:</strong> Đang chạy ở chế độ <strong>CHƯA TỐI ƯU</strong>. Toàn bộ 10.000 thẻ DOM được kết xuất cùng lúc. Không dùng Memoization & Code-splitting.
            </div>
            <span className="perf-badge slow">Chậm / Lag Main Thread</span>
          </div>
        ) : (
          <div className="status-banner optimized">
            <div>
              <strong>Hoàn hảo:</strong> Đang chạy ở chế độ <strong>ĐÃ TỐI ƯU</strong>. Áp dụng đồng thời <strong>Virtualization</strong> (~20 DOM node), <strong>React.memo</strong>, <strong>useMemo</strong>, <strong>useCallback</strong> và <strong>Lazy loading</strong>.
            </div>
            <span className="perf-badge fast">Mượt mà (60 FPS)</span>
          </div>
        )}
      </header>

      {/* Bảng so sánh chỉ số tổng quan */}
      <MetricDashboard isOptimized={isOptimized} totalProducts={products.length} />

      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm sản phẩm theo tên hoặc mã SKU (Hãy thử gõ nhanh để cảm nhận độ mượt)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="ALL">Tất cả danh mục</option>
          <option value="Điện tử">Điện tử</option>
          <option value="Phụ kiện">Phụ kiện</option>
          <option value="Gia dụng">Gia dụng</option>
          <option value="Thời trang">Thời trang</option>
          <option value="Sách & Văn phòng phẩm">Sách & Văn phòng phẩm</option>
        </select>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAnalytics(true)}
        >
          Xem thống kê kho (Lazy Load)
        </button>
      </div>

      {/* Hiển thị danh sách theo chế độ */}
      <main>
        {!isOptimized ? (
          <UnoptimizedList
            products={products}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onDelete={handleDeleteProduct}
            onViewDetail={handleViewDetail}
          />
        ) : (
          <OptimizedList
            products={products}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onDelete={handleDeleteProduct}
            onViewDetail={handleViewDetail}
          />
        )}
      </main>

      {/* Modal chi tiết sản phẩm đơn giản */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết sản phẩm #{selectedProduct.id}</h3>
              <button className="modal-close" onClick={() => setSelectedProduct(null)}>&times;</button>
            </div>
            <div style={{ lineHeight: 1.8 }}>
              <p><strong>Tên:</strong> {selectedProduct.name}</p>
              <p><strong>Mã SKU:</strong> {selectedProduct.code}</p>
              <p><strong>Danh mục:</strong> {selectedProduct.category}</p>
              <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.price)}</p>
              <p><strong>Tồn kho:</strong> {selectedProduct.stock} cái ({selectedProduct.status})</p>
              <p><strong>Đánh giá:</strong> {selectedProduct.rating} / 5.0</p>
              <p><strong>Mô tả:</strong> {selectedProduct.description}</p>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thống kê phân tích được tải lười bằng React.lazy & Suspense */}
      {showAnalytics && (
        <Suspense fallback={
          <div className="modal-overlay">
            <div className="modal-content loading-box">
              Đang tải mã nguồn Analytics chunk (Code-splitting)...
            </div>
          </div>
        }>
          <AnalyticsModal
            products={products}
            onClose={() => setShowAnalytics(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
