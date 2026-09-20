LawOfficeApp.Modules.Dashboard = {
    async render(container) {
        container.innerHTML = `
            <h2>📊 لوحة التحكم والإحصائيات</h2>
            <div class="stats-grid" style="margin-top:1rem;">
                <div class="stat-card">
                    <div>👥 العملاء النشطون</div>
                    <div class="val" id="stat-active-clients">...</div>
                </div>
                <div class="stat-card">
                    <div>⚖️ القضايا المتداولة</div>
                    <div class="val" id="stat-active-cases">...</div>
                </div>
                <div class="stat-card">
                    <div>📅 جلسات اليوم</div>
                    <div class="val" id="stat-today-hearings">0</div>
                </div>
                <div class="stat-card">
                    <div>📋 إجراءات متأخرة</div>
                    <div class="val" style="color:var(--danger)">0</div>
                </div>
            </div>
            
            <div style="margin-top:2rem;">
                <button id="btn-quick-add-client" class="btn btn-primary">+ إضافة عميل جديد</button>
            </div>
        `;

        // Calculate actual stats from IndexedDB
        const clientsCount = await LawOfficeApp.DB.Repositories.ClientRepository.countActive();
        const casesCount = await LawOfficeApp.DB.Repositories.CaseRepository.countActive();

        document.getElementById("stat-active-clients").textContent = clientsCount;
        document.getElementById("stat-active-cases").textContent = casesCount;

        // Event listener for quick action
        document.getElementById("btn-quick-add-client").addEventListener("click", () => {
            this.showAddClientModal();
        });
    },

    showAddClientModal() {
        const form = document.createElement("form");
        form.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
                <label>اسم العميل *
                    <input type="text" id="m-client-name" style="width:100%;padding:0.5rem;margin-top:0.25rem;" required>
                </label>
                <label>رقم الهاتف
                    <input type="text" id="m-client-phone" style="width:100%;padding:0.5rem;margin-top:0.25rem;">
                </label>
                <label>الرقم القومي
                    <input type="text" id="m-client-nid" style="width:100%;padding:0.5rem;margin-top:0.25rem;">
                </label>
            </div>
        `;

        LawOfficeApp.UI.Modal.show("حفظ بيانات عميل جديد", form, [
            { label: "إلغاء", class: "btn-secondary" },
            {
                label: "حفظ العميل",
                class: "btn-primary",
                onClick: async () => {
                    const name = document.getElementById("m-client-name").value;
                    const phone = document.getElementById("m-client-phone").value;
                    const nid = document.getElementById("m-client-nid").value;

                    try {
                        await LawOfficeApp.Services.ClientService.createClient({
                            fullName: name,
                            phone1: phone,
                            nationalId: nid
                        });
                        LawOfficeApp.UI.Toast.show("تم إضافة العميل بنجاح!", "success");
                        // Refresh route view
                        LawOfficeApp.Core.Router.handleRoute();
                    } catch (err) {
                        LawOfficeApp.Core.ErrorHandler.handle(err.message, err);
                    }
                }
            }
        ]);
    }
};