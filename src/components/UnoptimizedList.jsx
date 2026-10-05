import React from 'react';
import ProductItem from './ProductItem.jsx';

// Component Danh sách CHƯA TỐI ƯU
// Vấn đề:
// 1. Render thẳng 10.000 phần tử DOM cùng lúc -> nghẽn Main Thread, TBT và LCP tăng cao.
// 2. Không dùng useMemo: mỗi lần cha re-render, thuật toán filter 10.000 phần tử chạy lại từ đầu.
// 3. Không dùng React.memo cho ProductItem: toàn bộ 10.000 dòng đều render lại mỗi khi gõ phím.
export default function UnoptimizedList({ products, searchQuery, selectedCategory, onDelete, onViewDetail }) {
  // Lọc trực tiếp KHÔNG DÙNG useMemo
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div style={{ marginBottom: '10px', fontSize: '0.92rem', color: '#dc2626', fontWeight: 600 }}>
        Cảnh báo: Đang render thực tế {filteredProducts.length.toLocaleString('vi-VN')} thẻ DOM cùng lúc (Gây lag và đơ giao diện)
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

        {/* Khung cuộn chứa toàn bộ 10.000 thẻ DOM */}
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onDelete={onDelete}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
