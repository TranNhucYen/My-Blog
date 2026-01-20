const Toast = {
    init() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        // Ensure container has correct positioning
        container.className = 'fixed top-5 right-5 z-50 flex flex-col gap-2';
    },

    show(message, type = 'info') {
        this.init();
        const container = document.getElementById('toast-container');

        const toast = document.createElement('div');

        // Colors for the icon background
        const typeColors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        // FontAwesome icons (user requested specific classes earlier)
        const icon = {
            success: '<i class="fa-solid fa-check"></i>',
            error: '<i class="fa-solid fa-circle-exclamation"></i>',
            warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
            info: '<i class="fa-solid fa-circle-info"></i>'
        };

        // Main toast container: White background, text dark, fixed width
        toast.className = `bg-white w-80 shadow-lg rounded flex overflow-hidden transform transition-all duration-500 -translate-y-full opacity-0 relative`;

        // Inner HTML: Icon container (colored) + Message container (white)
        const colorClass = typeColors[type] || 'bg-gray-500';

        toast.innerHTML = `
            <div class="${colorClass} w-16 flex items-center justify-center text-white text-2xl">
                ${icon[type] || ''}
            </div>
            <div class="p-2 flex-1 flex items-center">
                <span class="text-gray-800 font-medium">${message}</span>
            </div>
        `;

        container.appendChild(toast);

        // Animation in
        requestAnimationFrame(() => {
            toast.classList.remove('-translate-y-full', 'opacity-0');
        });

        // Auto remove after 2 seconds (2000ms)
        setTimeout(() => {
            toast.classList.add('opacity-0', '-translate-y-full'); // Slide back up
            setTimeout(() => {
                toast.remove();
            }, 500); // Wait for transition out
        }, 2000);
    },

    success(message) {
        this.show(message, 'success');
    },

    error(message) {
        this.show(message, 'error');
    },

    warning(message) {
        this.show(message, 'warning');
    },

    info(message) {
        this.show(message, 'info');
    },

    loading(message) {
        this.init();
        const container = document.getElementById('toast-container');

        const toast = document.createElement('div');
        toast.className = `bg-white w-80 shadow-lg rounded flex overflow-hidden transform transition-all duration-500 -translate-y-full opacity-0 relative`;
        toast.setAttribute('data-loading', 'true');

        toast.innerHTML = `
            <div class="bg-blue-500 w-16 flex items-center justify-center text-white text-2xl">
                <i class="fa-solid fa-spinner fa-spin"></i>
            </div>
            <div class="p-4 flex-1 flex items-center">
                <span class="text-gray-800 font-medium">${message}</span>
            </div>
        `;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('-translate-y-full', 'opacity-0');
        });

        return toast;
    },

    dismiss(toast) {
        if (!toast) return;
        toast.classList.add('opacity-0', '-translate-y-full');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }
};

window.Toast = Toast;
