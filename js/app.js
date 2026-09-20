document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. تهيئة قاعدة البيانات IndexedDB
        if (window.LawOfficeApp && window.LawOfficeApp.DB && window.LawOfficeApp.DB.Database) {
            await window.LawOfficeApp.DB.Database.init();
            console.log("IndexedDB LawOfficeDB Ready.");
        }

        // 2. تفعيل القائمة الجانبية (Sidebar Toggle)
        const toggleBtn = document.getElementById('btn-toggle-sidebar') || document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('app-sidebar') || document.querySelector('.sidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // 3. تشغيل الموجه (Router)
        if (window.LawOfficeApp && window.LawOfficeApp.Core && window.LawOfficeApp.Core.Router) {
            window.LawOfficeApp.Core.Router.init();
        }

    } catch (err) {
        console.error("Initialization Failed:", err);
    }
});
