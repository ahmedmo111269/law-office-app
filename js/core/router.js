LawOfficeApp.Router = {
    routes: {
        '#/dashboard': LawOfficeApp.Modules.Dashboard,
        '#/clients': LawOfficeApp.Modules.Clients,
        '#/cases': LawOfficeApp.Modules.Cases
    },

    init() {
        // الاستماع للتغيرات في الـ URL
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // تشغيل الراوتر عند تحميل الصفحة أول مرة
        window.addEventListener('DOMContentLoaded', () => this.handleRoute());

        // تشغيل مباشر في حال كان المستند محمل بالفعل
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.handleRoute();
        }
    },

    async handleRoute() {
        const hash = window.location.hash || '#/dashboard';
        const module = this.routes[hash] || this.routes['#/dashboard'];

        if (module && typeof module.init === 'function') {
            await module.init();
            this.updateActiveNavLink(hash);
        } else {
            console.error('الموديول غير موجود أو دالة init غير معرفة للرابط:', hash);
        }
    },

    updateActiveNavLink(hash) {
        const links = document.querySelectorAll('.sidebar-nav .nav-item');
        links.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};

// تهيئة الراوتر تلقائياً
LawOfficeApp.Router.init();
