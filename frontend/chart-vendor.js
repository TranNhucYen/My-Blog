import {
    Chart,
    BarController,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Chỉ register những component cần thiết
Chart.register(
    BarController,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Xuất Chart để dùng ở nơi khác
export { Chart };
