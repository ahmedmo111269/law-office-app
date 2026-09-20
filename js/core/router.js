window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.Core = window.LawOfficeApp.Core || {};

window.LawOfficeApp.Core.Router = {
    routes: {
        '#/dashboard': LawOfficeApp.Modules?.Dashboard,
        '#/clients': LawOfficeApp.Modules?.Clients,
        '#/cases': LawOfficeApp.Modules?.Cases,
        '#/hearings': LawOfficeApp.Modules?.Hearings
    },

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute(); // تشغيل عند التحميل
    },

    async handleRoute() {
        const hash = window.location.hash || '#/dashboard';
        
        // تحديث الرابط النشط في القائمة الجانبية
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            if (item.getAttribute('href') === hash) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // جلب الموديول المناسب للمسار
        const module = this.routes[hash];

        if (module && typeof module.init === 'function') {
            await module.init();
        } else {
            // مسار افتراضي في حال عدم وجود الموديول
            if (LawOfficeApp.Modules?.Dashboard?.init) {
                await LawOfficeApp.Modules.Dashboard.init();
            }
        }
    }
};
