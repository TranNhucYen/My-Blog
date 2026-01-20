// build.js
const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
    entryPoints: [path.join(__dirname, 'frontend', 'fontawesome-vendor.js')],
    bundle: true,
    outfile: path.join(__dirname, 'src', 'public', 'vendor', 'fontawesome', 'font.bundle.js'),

    // Import CSS vào JS, output thành file CSS riêng
    loader: {
        '.css': 'css',
        '.woff': 'file',
        '.woff2': 'file',
        '.ttf': 'file',
        '.eot': 'file',
    },

    minify: true,
    sourcemap: true,
}).catch(() => process.exit(1));
console.log("Font bundle built successfully");