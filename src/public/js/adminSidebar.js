(function () { //IIFE
    const $ = document.querySelector.bind(document);

    const adminSidebar = {
        init() {
            this.bindEvents();
            this.openSidebar(); // Initialize: sidebar open by default
        },

        state: {
            isSidebarOpen: false
        },

        elements: {
            sidebar: $('#sidebar'),
            sidebarToggle: $('#sidebar-toggle'),
            sidebarOverlay: $('#sidebar-overlay'),
            mainContent: $('#main-content'),
            contentArea: $('#content-area'),
            btnLogout: $('#btn-logout')
        },

        bindEvents() {
            this.elements.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
            this.elements.sidebarOverlay.addEventListener('click', () => this.closeSidebar());
            window.addEventListener('resize', () => this.handleResize());
        },

        openSidebar() {
            this.elements.sidebar.classList.remove('-translate-x-full');
            this.elements.sidebar.classList.add('translate-x-0');
            this.elements.sidebarOverlay.classList.remove('hidden');
            this.state.isSidebarOpen = true;

            // On desktop, push content
            if (window.innerWidth >= 768) {
                this.elements.mainContent.style.marginLeft = '256px';
            }
        },

        closeSidebar() {
            this.elements.sidebar.classList.add('-translate-x-full');
            this.elements.sidebar.classList.remove('translate-x-0');
            this.elements.sidebarOverlay.classList.add('hidden');
            this.state.isSidebarOpen = false;

            // On desktop, reset content
            if (window.innerWidth >= 768) {
                this.elements.mainContent.style.marginLeft = '0';
            }
        },

        toggleSidebar() {
            if (this.state.isSidebarOpen) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        },

        toggleSubmenu(menuId) {
            const menu = $(`#${menuId}`);
            const icon = $(`#${menuId}-icon`);

            menu.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        },

        handleResize() {
            if (window.innerWidth >= 768 && !this.state.isSidebarOpen) {
                // Reset on desktop when not manually opened
                this.elements.mainContent.style.marginLeft = '0';
            }
        }
    };

    adminSidebar.init();

    // Expose toggleSubmenu globally if needed by HTML onclick handlers
    window.toggleSubmenu = (menuId) => adminSidebar.toggleSubmenu(menuId);
})();
