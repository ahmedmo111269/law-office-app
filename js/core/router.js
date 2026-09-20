// Ensure namespace exists
window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.Core = window.LawOfficeApp.Core || {};

window.LawOfficeApp.Core.Router = {
    routes: {},

    register(route, handler) {
        this.routes[route] = handler;
    },

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    handleRoute() {
        const hash = window.location.hash || '#/dashboard';
        const handler = this.routes[hash] || this.routes['#/dashboard'];
        const viewContainer = document.getElementById('router-view') || document.getElementById('view-container');

        if (handler && viewContainer) {
            handler(viewContainer);
            this.updateActiveNavLink(hash);
        } else if (!handler) {
            console.error('الموديول غير موجود أو غير مسجل للرابط:', hash);
        }
    },

    updateActiveNavLink(hash) {
        const links = document.querySelectorAll('.sidebar-nav a, .sidebar-nav .nav-item');
        links.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};
