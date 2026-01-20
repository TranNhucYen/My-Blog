const esbuild = require('esbuild');
const path = require('path');

const libraries = [
    {
        name: 'Grid.js',
        entryPoints: [path.join(__dirname, 'frontend', 'grid-vendor.js')],
        outfile: path.join(__dirname, 'src', 'public', 'vendor', 'gridjs.bundle.js'),
        globalName: 'gridjs',
    },
    {
        name: 'Chart.js',
        entryPoints: [path.join(__dirname, 'frontend', 'chart-vendor.js')],
        outfile: path.join(__dirname, 'src', 'public', 'vendor', 'chartjs.bundle.js'),
        globalName: 'ChartBundle',
    }
];

async function buildAll() {
    console.log("\n--- BUILDING ---\n");
    const startTime = Date.now();

    // Tạo danh sách các Promise
    const tasks = libraries.map(lib => {
        return esbuild.build({
            entryPoints: lib.entryPoints,
            outfile: lib.outfile,
            globalName: lib.globalName,
            bundle: true,
            minify: true,
            treeShaking: true,
            sourcemap: false,
            format: 'iife',
            legalComments: 'none',
            target: ['es2015'],
        })
            .then(() => ({ name: lib.name, status: 'fulfilled' }))
            .catch(err => ({ name: lib.name, status: 'rejected', reason: err.message }));
    });

    // Đợi tất cả hoàn thành (bất kể thành công hay thất bại)
    const results = await Promise.allSettled(tasks);

    // Phân tích kết quả
    console.log("\n--- RESULT ---\n");
    results.forEach((result) => {
        // result.value chứa object {name, status, reason} từ bước .then/.catch ở trên
        const info = result.value;
        if (info.status === 'fulfilled') {
            console.log(`${info.name.padEnd(10)} : Success`);
        } else {
            console.error(`${info.name.padEnd(10)} : Failed! (Error: ${info.reason})`);
        }
    });

    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`\nTotal time: ${totalTime}s`);
}

buildAll();