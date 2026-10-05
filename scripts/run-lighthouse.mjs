import { spawn } from 'child_process';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const REPORTS_DIR = path.join(ROOT_DIR, 'reports');

if (!existsSync(REPORTS_DIR)) {
  mkdirSync(REPORTS_DIR, { recursive: true });
}

// Hàm khởi động vite preview server
function startPreviewServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Đang khởi động Vite Preview Server trên cổng 4173...');
    const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
      cwd: ROOT_DIR,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false,
    });

    let started = false;
    server.stdout.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('4173') || msg.includes('Local:')) {
        if (!started) {
          started = true;
          console.log('✅ Preview Server đã sẵn sàng!');
          resolve(server);
        }
      }
    });

    server.stderr.on('data', (data) => {
      console.error('[Server Stderr]:', data.toString());
    });

    server.on('error', (err) => {
      reject(err);
    });

    // Timeout 15s phòng trường hợp không nhận diện stdout
    setTimeout(() => {
      if (!started) {
        started = true;
        resolve(server);
      }
    }, 15000);
  });
}

// Chạy Lighthouse CLI cho một URL
function runLighthouse(url, reportPrefix) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔍 Đang chạy kiểm thử Lighthouse cho: ${url}`);
    const htmlReport = path.join(REPORTS_DIR, `${reportPrefix}.html`);
    const jsonReport = path.join(REPORTS_DIR, `${reportPrefix}.json`);

    const args = [
      'lighthouse',
      url,
      '--output=json,html',
      `--output-path=${path.join(REPORTS_DIR, reportPrefix)}`,
      '--only-categories=performance',
      '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu',
      '--preset=desktop', // Đo theo desktop để sát thực tế máy tính sinh viên/giảng viên
      '--no-enable-error-reporting',
      '--quiet',
    ];

    const child = spawn('npx', args, {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Hoàn thành đo Lighthouse cho ${reportPrefix}!`);
        resolve({ htmlReport, jsonReport });
      } else {
        console.error(`❌ Lighthouse kết thúc với mã lỗi ${code}`);
        reject(new Error(`Lighthouse failed with code ${code}`));
      }
    });
  });
}

// Trích xuất các chỉ số quan trọng từ file JSON
function extractMetrics(jsonFilePath) {
  const content = JSON.parse(readFileSync(jsonFilePath, 'utf-8'));
  const audits = content.audits;
  const categories = content.categories;

  return {
    score: Math.round((categories.performance?.score || 0) * 100),
    fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
    fcpNumeric: audits['first-contentful-paint']?.numericValue || 0,
    lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
    lcpNumeric: audits['largest-contentful-paint']?.numericValue || 0,
    tbt: audits['total-blocking-time']?.displayValue || 'N/A',
    tbtNumeric: audits['total-blocking-time']?.numericValue || 0,
    cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
    clsNumeric: audits['cumulative-layout-shift']?.numericValue || 0,
    speedIndex: audits['speed-index']?.displayValue || 'N/A',
  };
}

async function main() {
  const server = await startPreviewServer();

  try {
    // 1. Đo bản Chưa tối ưu (10.000 phần tử DOM cùng lúc)
    await runLighthouse('http://localhost:4173/?mode=unoptimized', 'unoptimized');

    // 2. Đo bản Đã tối ưu (Virtual List + Memoization + Lazy Loading)
    await runLighthouse('http://localhost:4173/?mode=optimized', 'optimized');

    // 3. Trích xuất chỉ số
    const unoptMetrics = extractMetrics(path.join(REPORTS_DIR, 'unoptimized.report.json'));
    const optMetrics = extractMetrics(path.join(REPORTS_DIR, 'optimized.report.json'));

    const summary = {
      unoptimized: unoptMetrics,
      optimized: optMetrics,
      improvements: {
        scoreDiff: `+${optMetrics.score - unoptMetrics.score} điểm`,
        tbtDiff: `${Math.round(unoptMetrics.tbtNumeric - optMetrics.tbtNumeric)} ms giảm`,
        lcpDiff: `${((unoptMetrics.lcpNumeric - optMetrics.lcpNumeric) / 1000).toFixed(2)} s nhanh hơn`,
      }
    };

    writeFileSync(path.join(REPORTS_DIR, 'summary.json'), JSON.stringify(summary, null, 2));

    console.log('\n================ BẢNG SO SÁNH KẾT QUẢ LIGHTHOUSE ================');
    console.table({
      'Chỉ số': ['Performance Score', 'First Contentful Paint (FCP)', 'Largest Contentful Paint (LCP)', 'Total Blocking Time (TBT)', 'Cumulative Layout Shift (CLS)'],
      'Trước tối ưu (Unoptimized)': [
        `${unoptMetrics.score}/100`,
        unoptMetrics.fcp,
        unoptMetrics.lcp,
        unoptMetrics.tbt,
        unoptMetrics.cls
      ],
      'Sau tối ưu (Optimized)': [
        `${optMetrics.score}/100`,
        optMetrics.fcp,
        optMetrics.lcp,
        optMetrics.tbt,
        optMetrics.cls
      ],
    });
    console.log('=================================================================\n');

  } catch (err) {
    console.error('Lỗi trong quá trình chạy kiểm thử:', err);
  } finally {
    console.log('🛑 Đang tắt Preview Server...');
    server.kill();
    process.exit(0);
  }
}

main();
