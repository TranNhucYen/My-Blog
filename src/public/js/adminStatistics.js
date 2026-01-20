document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await fetchAPI.get('/admin/api/post-statistics');
        renderCharts(data);
    } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
        if (typeof Toast !== 'undefined') {
            Toast.error('Không thể tải thống kê: ' + error.message);
        }
    }
});

function renderCharts(data) {
    const { postsPerAdmin, postsPerDay } = data;

    // 1. Chart: Bài viết theo Admin
    renderPostsPerAdminChart(postsPerAdmin);

    // 2. Chart: Bài viết theo Ngày
    renderPostsPerDayChart(postsPerDay);
}

function renderPostsPerAdminChart(data) {
    const ctx = document.getElementById('postsPerAdminChart');
    if (!ctx) return;

    const labels = data.map(item => item.username);
    const values = data.map(item => item.postCount);

    new ChartBundle.Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Số lượng bài viết',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 4,
                maxBarThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function renderPostsPerDayChart(data) {
    const ctx = document.getElementById('postsPerDayChart');
    if (!ctx) return;

    // data.postsPerDay is ordered by day DESC (from backend query)
    // For chart, we might want ascending order (oldest to newest)
    const sortedData = [...data].reverse();

    const labels = sortedData.map(item => {
        const date = new Date(item.day);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    });
    const values = sortedData.map(item => item.postCount);

    new ChartBundle.Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bài viết trong ngày',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.3, // smooth curve
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}
