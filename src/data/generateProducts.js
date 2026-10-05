// Module sinh dữ liệu 10.000 sản phẩm mẫu (deterministic để đo lường nhất quán)

const CATEGORIES = ['Điện tử', 'Phụ kiện', 'Gia dụng', 'Thời trang', 'Sách & Văn phòng phẩm'];

const PRODUCT_PREFIXES = [
  'Laptop', 'Điện thoại', 'Bàn phím cơ', 'Chuột không dây', 'Màn hình 4K',
  'Tai nghe Bluetooth', 'Ổ cứng SSD', 'Loa thông minh', 'Cáp sạc nhanh', 'Đồng hồ thông minh',
  'Máy hút bụi', 'Nồi chiên không dầu', 'Bình giữ nhiệt', 'Áo thun thể thao', 'Balo chống nước'
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'Logitech', 'Xiaomi', 'Asus', 'Anker', 'LG', 'Lenovo'];

// Bộ sinh số ngẫu nhiên có kiểm soát (Pseudo Random)
function pseudoRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateProducts(count = 10000) {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const brand = BRANDS[i % BRANDS.length];
    const prefix = PRODUCT_PREFIXES[i % PRODUCT_PREFIXES.length];
    const category = CATEGORIES[i % CATEGORIES.length];
    const price = Math.floor(pseudoRandom(i) * 35000000) + 50000; // 50k - 35tr
    const stock = Math.floor(pseudoRandom(i + 1) * 300);
    const rating = (3.5 + pseudoRandom(i + 2) * 1.5).toFixed(1);
    
    let status = 'Còn hàng';
    if (stock === 0) status = 'Hết hàng';
    else if (stock < 15) status = 'Sắp hết';

    products.push({
      id: i,
      name: `${prefix} ${brand} Pro Gen ${i}`,
      category,
      price,
      stock,
      rating: parseFloat(rating),
      status,
      code: `SKU-${10000 + i}`,
      description: `Sản phẩm ${prefix} chất lượng cao từ hãng ${brand}. Phù hợp nhu cầu học tập, làm việc và giải trí.`
    });
  }
  return products;
}
