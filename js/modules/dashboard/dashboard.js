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

        await this.refreshStats();

        const quickBtn = document.getElementById("btn-quick-add-client");
        if (quickBtn) {
            quickBtn.addEventListener("click", () => {
                this.showAddClientModal();
            });
        }
    },

    async refreshStats() {
        try {
            const clientRepo = LawOfficeApp.DB.Repositories.ClientRepository;
            const caseRepo = LawOfficeApp.DB.Repositories.CaseRepository;

            const clientsCount = clientRepo && typeof clientRepo.countActive === 'function' ? await clientRepo.countActive() : 0;
            const casesCount = caseRepo && typeof caseRepo.countActive === 'function' ? await caseRepo.countActive() : 0;

            const clientElem = document.getElementById("stat-active-clients");
            const caseElem = document.getElementById("stat-active-cases");

            if (clientElem) clientElem.textContent = clientsCount;
            if (caseElem) caseElem.textContent = casesCount;
        } catch (err) {
            console.error("خطأ أثناء تحديث الإحصائيات:", err);
        }
    },

    showAddClientModal() {
        const form = document.createElement("form");
        form.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:0.75rem;text-align:right;">
                <label>اسم العميل *
                    <input type="text" id="m-client-name" style="width:100%;padding:0.5rem;margin-top:0.25rem;box-sizing:border-box;" required>
                </label>
                <label>رقم الهاتف
                    <input type="text" id="m-client-phone" style="width:100%;padding:0.5rem;margin-top:0.25rem;box-sizing:border-box;">
                </label>
                <label>الرقم القومي
                    <input type="text" id="m-client-nid" style="width:100%;padding:0.5rem;margin-top:0.25rem;box-sizing:border-box;">
                </label>
            </div>
        `;

        LawOfficeApp.UI.Modal.show("حفظ بيانات عميل جديد", form, [
            { 
                label: "إلغاء", 
                class: "btn-secondary",
                onClick: () => {
                    LawOfficeApp.UI.Modal.hide();
                }
            },
            {
                label: "حفظ العميل",
                class: "btn-primary",
                onClick: async () => {
                    const name = document.getElementById("m-client-name")?.value?.trim();
                    const phone = document.getElementById("m-client-phone")?.value || "";
                    const nid = document.getElementById("m-client-nid")?.value || "";

                    if (!name) {
                        alert("يرجى كتابة اسم العميل أولاً");
                        return;
                    }

                    try {
                        await LawOfficeApp.Services.ClientService.createClient({
                            fullName: name,
                            phone1: phone,
                            nationalId: nid,
                            archived: false,
                            createdAt: new Date().toISOString()
                        });

                        LawOfficeApp.UI.Toast.show("تم إضافة العميل بنجاح!", "success");
                        LawOfficeApp.UI.Modal.hide();
                        await this.refreshStats();
                    } catch (err) {
                        LawOfficeApp.Core.ErrorHandler.handle(err.message, err);
                    }
                }
            }
        ]);
    }
};
