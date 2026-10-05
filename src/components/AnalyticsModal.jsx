import React from 'react';

// KỸ THUẬT 2: CODE-SPLITTING & LAZY LOADING
// Component này có kích thước lớn và chứa các tính toán thống kê kho hàng.
// Được tải động bằng React.lazy() và Suspense, giúp giảm dung lượng bundle ban đầu
// và cải thiện đáng kể chỉ số FCP (First Contentful Paint) cũng như LCP.
export default function AnalyticsModal({ products, onClose }) {
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Tính toán số liệu thống kê kho hàng
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const categoryStats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Báo Cáo Phân Tích Kho Hàng (Code-split Chunk)</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div style={{ marginBottom: '16px', fontSize: '0.92rem', color: '#64748b' }}>
          * Component này được tách riêng thành một chunk độc lập bằng <code>React.lazy()</code>. Trình duyệt chỉ tải mã nguồn của modal này khi người dùng nhấn nút mở.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Tổng số mã SKU</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#2563eb' }}>{totalProducts.toLocaleString('vi-VN')}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Tổng số lượng tồn kho</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#16a34a' }}>{totalStock.toLocaleString('vi-VN')} chiếc</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Tổng giá trị kho hàng</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#d97706' }}>{formatCurrency(totalValue)}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Sản phẩm hết hàng</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#dc2626' }}>{outOfStockCount} sản phẩm</div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.98rem', marginBottom: '10px' }}>Phân bố theo danh mục:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(categoryStats).map(([cat, count]) => {
              const percent = ((count / totalProducts) * 100).toFixed(1);
              return (
                <div key={cat} style={{ fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>{cat}</span>
                    <span style={{ fontWeight: 600 }}>{count} ({percent}%)</span>
                  </div>
                  <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: '#2563eb' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
