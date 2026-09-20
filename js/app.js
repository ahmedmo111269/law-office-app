document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. الاتصال بقاعدة البيانات IndexedDB
        await LawOfficeApp.DB.Database.connect();
        console.log("IndexedDB LawOfficeDB Ready.");

        // 2. إعداد زر القائمة الجانبية للشاشات الصغيرة
        const toggleBtn = document.getElementById("btn-toggle-sidebar");
        const sidebar = document.getElementById("app-sidebar");
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener("click", () => {
                sidebar.classList.toggle("open");
            });
        }

        // 3. تسجيل شاشات التطبيق (Routes) وربطها بالموديولات
        const Router = LawOfficeApp.Core.Router;

        // شاشة لوحة التحكم
        Router.register("#/dashboard", (c) => LawOfficeApp.Modules.Dashboard.render(c));

        // شاشة العملاء (استدعاء الموديول الجديد)
        Router.register("#/clients", () => {
            if (LawOfficeApp.Modules.Clients && typeof LawOfficeApp.Modules.Clients.init === "function") {
                LawOfficeApp.Modules.Clients.init();
            }
        });

        // شاشة القضايا (استدعاء الموديول الجديد)
        Router.register("#/cases", () => {
            if (LawOfficeApp.Modules.Cases && typeof LawOfficeApp.Modules.Cases.init === "function") {
                LawOfficeApp.Modules.Cases.init();
            }
        });

        // 4. تشغيل نظام التنقل
        Router.init();

    } catch (err) {
        console.error("Initialization Failed:", err);
    }
});
