document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. Initialize IndexedDB Connection
        await LawOfficeApp.DB.Database.connect();
        console.log("IndexedDB LawOfficeDB Ready.");

        // 2. Setup Mobile Sidebar Navigation Toggle
        const toggleBtn = document.getElementById("btn-toggle-sidebar");
        const sidebar = document.getElementById("app-sidebar");
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener("click", () => {
                sidebar.classList.toggle("open");
            });
        }

        // 3. Register SPA Routes
        const Router = LawOfficeApp.Core.Router;
        Router.register("#/dashboard", (c) => LawOfficeApp.Modules.Dashboard.render(c));
        Router.register("#/clients", (c) => {
            c.innerHTML = "<h2>👥 إدارة العملاء</h2><p>قائمة العملاء والسجلات...</p>";
        });
        Router.register("#/cases", (c) => {
            c.innerHTML = "<h2>⚖️ إدارة القضايا</h2><p>سجلات القضايا والدوائر...</p>";
        });

        // 4. Start Router Navigation
        Router.init();

    } catch (err) {
        console.error("Initialization Failed:", err);
    }
});