document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. فتح وتحديث قاعدة البيانات IndexedDB
        if (LawOfficeApp.DB && LawOfficeApp.DB.Database) {
            await LawOfficeApp.DB.Database.init();
            console.log("✅ تم الاتصال بقاعدة البيانات بنجاح.");
        }

        // 2. تفعيل القائمة الجانبية (Sidebar Toggle)
        const toggleBtn = document.getElementById('btn-toggle-sidebar');
        const sidebar = document.getElementById('app-sidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // 3. تشغيل الموجه (Router)
        if (LawOfficeApp.Core && LawOfficeApp.Core.Router) {
            LawOfficeApp.Core.Router.init();
        }

    } catch (err) {
        console.error("❌ خطأ أثناء تشغيل التطبيق:", err);
    }
});
