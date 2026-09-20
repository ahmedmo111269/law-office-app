document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. تهيئة قاعدة البيانات بالشكل الصحيح والآمن
        const db = window.LawOfficeApp?.DB;
        if (db) {
            if (typeof db.Database?.init === 'function') {
                await db.Database.init();
            } else if (typeof db.init === 'function') {
                await db.init();
            } else if (typeof db.open === 'function') {
                await db.open();
            }
            console.log("✅ IndexedDB LawOfficeDB Ready.");
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
        if (window.LawOfficeApp?.Core?.Router?.init) {
            window.LawOfficeApp.Core.Router.init();
        }

    } catch (err) {
        console.error(" Initialization Failed:", err);
    }
});
