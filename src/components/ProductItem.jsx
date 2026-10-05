import React from 'react';

// Component đại diện cho 1 dòng sản phẩm (CHƯA dùng React.memo)
// Khi component cha re-render (ví dụ: gõ tìm kiếm), toàn bộ 10.000 ProductItem này đều bị re-render lại!
export default function ProductItem({ product, onDelete, onViewDetail }) {
  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <div className="product-row">
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
}
