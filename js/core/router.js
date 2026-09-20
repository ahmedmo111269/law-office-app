LawOfficeApp.Core.Router = {
    routes: {},

    register(path, handler) {
        this.routes[path] = handler;
    },

    init() {
        window.addEventListener("hashchange", () => this.handleRoute());
        this.handleRoute();
    },

    handleRoute() {
        const hash = window.location.hash || "#/dashboard";
        const viewContainer = document.getElementById("router-view");
        
        // Highlight menu
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.toggle("active", item.getAttribute("href") === hash);
        });

        const handler = this.routes[hash] || this.routes["#/dashboard"];
        if (handler) {
            viewContainer.innerHTML = "";
            handler(viewContainer);
        } else {
            viewContainer.innerHTML = "<h2>404 - الشاشة غير موجودة</h2>";
        }
    }
};
