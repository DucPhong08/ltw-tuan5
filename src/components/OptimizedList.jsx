import React, { useState, useRef, useMemo, useCallback } from 'react';
import MemoizedProductItem from './MemoizedProductItem.jsx';

// KỸ THUẬT 3: VIRTUALIZATION (Ảo hóa danh sách - Windowing)
// Nguyên lý: Dù danh sách có 10.000 sản phẩm, người dùng trên màn hình chỉ thấy được khoảng 10-12 dòng.
// Thay vì render toàn bộ 10.000 thẻ DOM, Virtualization chỉ render các dòng nằm trong khung nhìn (viewport)
// cộng thêm một vài dòng đệm (overscan).
// -> DOM giảm từ 10.000 thẻ xuống còn ~18-20 thẻ! Giảm triệt để TBT, LCP và giải phóng bộ nhớ.

const ITEM_HEIGHT = 60;       // Chiều cao cố định mỗi dòng (60px)
const CONTAINER_HEIGHT = 600;  // Chiều cao khung nhìn (600px)
const OVERSCAN = 4;           // Số dòng đệm trước và sau để cuộn mượt

export default function OptimizedList({ products, searchQuery, selectedCategory, onDelete, onViewDetail }) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  // KỸ THUẬT MEMOIZATION: useMemo cho tác vụ lọc 10.000 phần tử
  // Chỉ tính toán lại khi products, searchQuery hoặc selectedCategory thực sự thay đổi!
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch = query === '' ||
                          p.name.toLowerCase().includes(query) ||
                          p.code.toLowerCase().includes(query);
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Xử lý sự kiện scroll với độ trễ tối thiểu
  const handleScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Tính toán chỉ số dòng bắt đầu và kết thúc nằm trong Viewport
  const totalCount = filteredProducts.length;
  const totalHeight = totalCount * ITEM_HEIGHT;

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(totalCount, Math.ceil((scrollTop + CONTAINER_HEIGHT) / ITEM_HEIGHT) + OVERSCAN);

  // Lát cắt các sản phẩm thực tế cần đưa vào DOM
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex]);

  const offsetY = startIndex * ITEM_HEIGHT;

  return (
    <div>
      <div style={{ marginBottom: '10px', fontSize: '0.92rem', color: '#16a34a', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
        <span>Đang ảo hóa: Chỉ render <strong>{visibleProducts.length} thẻ DOM</strong> trên tổng số <strong>{totalCount.toLocaleString('vi-VN')}</strong> sản phẩm</span>
        <span>Tiết kiệm: {Math.round((1 - (visibleProducts.length / (totalCount || 1))) * 100)}% dung lượng DOM</span>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div>ID</div>
          <div>Sản phẩm</div>
          <div>Danh mục</div>
          <div>Giá bán</div>
          <div>Kho hàng</div>
          <div>Thao tác</div>
        </div>

        {/* Khung cuộn ảo hóa (Virtual Scroll Container) */}
        <div
          ref={containerRef}
          className="virtual-scroll-container"
          onScroll={handleScroll}
        >
          {/* Thanh cuộn có chiều cao ảo bằng toàn bộ 10.000 dòng */}
          <div style={{ height: `${totalHeight}px`, width: '100%', position: 'relative' }}>
            {/* Vùng chứa các thẻ DOM thực tế, dịch chuyển theo vị trí cuộn */}
            <div style={{ transform: `translateY(${offsetY}px)`, willChange: 'transform' }}>
              {visibleProducts.map((product) => (
                <MemoizedProductItem
                  key={product.id}
                  product={product}
                  onDelete={onDelete}
                  onViewDetail={onViewDetail}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
