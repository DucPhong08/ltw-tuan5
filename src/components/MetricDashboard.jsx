import React from 'react';

export default function MetricDashboard({ isOptimized, totalProducts }) {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-title">Tổng dữ liệu sản phẩm</div>
        <div className="metric-val">{totalProducts.toLocaleString('vi-VN')}</div>
        <div className="metric-desc" style={{ color: '#64748b' }}>Bản ghi trong bộ nhớ</div>
      </div>

      <div className="metric-card">
        <div className="metric-title">Số thẻ DOM thực tế</div>
        <div className="metric-val" style={{ color: isOptimized ? '#16a34a' : '#dc2626' }}>
          {isOptimized ? '~20 thẻ' : '10.000 thẻ'}
        </div>
        <div className={`metric-desc ${isOptimized ? 'good' : 'bad'}`}>
          {isOptimized ? 'Virtualized (Cực nhẹ)' : 'Đầy DOM (>40k node)'}
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-title">Cơ chế Memoization</div>
        <div className="metric-val" style={{ color: isOptimized ? '#16a34a' : '#dc2626', fontSize: '1.25rem' }}>
          {isOptimized ? 'Bật (React.memo)' : 'Tắt'}
        </div>
        <div className={`metric-desc ${isOptimized ? 'good' : 'bad'}`}>
          {isOptimized ? 'Tránh re-render thừa' : 'Re-render toàn bộ khi gõ'}
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-title">Code-splitting (Lazy)</div>
        <div className="metric-val" style={{ color: isOptimized ? '#16a34a' : '#dc2626', fontSize: '1.25rem' }}>
          {isOptimized ? 'React.lazy + Suspense' : 'Import tĩnh'}
        </div>
        <div className={`metric-desc ${isOptimized ? 'good' : 'bad'}`}>
          {isOptimized ? 'Tách chunk, nhẹ bundle' : 'Bundle gộp chung'}
        </div>
      </div>
    </div>
  );
}
