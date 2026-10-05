import React from 'react';

// KỸ THUẬT 1: MEMOIZATION (React.memo)
// Bọc component bằng React.memo giúp React bỏ qua việc re-render component này
// nếu props (product, onDelete, onViewDetail) không thay đổi giữa các lần render của cha.
const MemoizedProductItem = React.memo(function ProductItem({ product, onDelete, onViewDetail, style }) {
  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <div className="product-row" style={style}>
      <div style={{ fontWeight: 600, color: '#64748b' }}>#{product.id}</div>
      <div>
        <div className="product-name">{product.name}</div>
        <div className="product-sku">{product.code}</div>
      </div>
      <div>
        <span className="badge badge-cat">{product.category}</span>
      </div>
      <div style={{ fontWeight: 600, color: '#0f172a' }}>
        {formatPrice(product.price)}
      </div>
      <div>
        <span className={`badge ${
          product.stock === 0 ? 'badge-out-of-stock' : product.stock < 15 ? 'badge-low-stock' : 'badge-in-stock'
        }`}>
          {product.status} ({product.stock})
        </span>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={() => onViewDetail(product)}
          style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}
        >
          Xem
        </button>
        <button
          onClick={() => onDelete(product.id)}
          style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}
        >
          Xóa
        </button>
      </div>
    </div>
  );
});

export default MemoizedProductItem;
