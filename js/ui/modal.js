LawOfficeApp.UI.Modal = {
    show(title, contentNode, actions = []) {
        const container = document.getElementById("modal-container");
        container.innerHTML = `
            <div class="modal-backdrop" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9000;">
                <div class="modal-card" style="background:white;padding:1.5rem;border-radius:8px;min-width:320px;max-width:500px;width:90%;">
                    <h3>${title}</h3>
                    <div class="modal-body" style="margin:1rem 0;"></div>
                    <div class="modal-actions" style="display:flex;gap:0.5rem;justify-content:flex-end;"></div>
                </div>
            </div>
        `;

        const body = container.querySelector(".modal-body");
        body.appendChild(contentNode);

        const actionsContainer = container.querySelector(".modal-actions");
        actions.forEach(act => {
            const btn = document.createElement("button");
            btn.className = `btn ${act.class || "btn-secondary"}`;
            btn.textContent = act.label;
            btn.onclick = () => {
                if (act.onClick) act.onClick();
                this.hide();
            };
            actionsContainer.appendChild(btn);
        });

        container.classList.remove("hidden");
    },

    hide() {
        const container = document.getElementById("modal-container");
        container.classList.add("hidden");
        container.innerHTML = "";
    }
};
