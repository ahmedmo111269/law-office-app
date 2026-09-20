window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.Modules = window.LawOfficeApp.Modules || {};

window.LawOfficeApp.Modules.Clients = {
    async init() {
        const container = document.getElementById('router-view') || document.getElementById('main-content');
        if (!container) return;

        this.render(container);
        await this.loadClients();
        this.bindEvents();
    },

    render(container) {
        container.innerHTML = `
            <div class="module-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>👥 إدارة العملاء</h2>
                <button id="btn-add-client" class="btn btn-primary" style="padding: 10px 15px; cursor: pointer; background-color: #2563eb; color: #fff; border: none; border-radius: 6px;">+ إضافة عميل جديد</button>
            </div>
            <div id="clients-list-container">
                <div class="card" style="padding: 20px; background: #fff; border-radius: 8px;">
                    <p style="color: #666;">جاري تحميل البيانات...</p>
                </div>
            </div>
        `;
    },

    bindEvents() {
        const addBtn = document.getElementById('btn-add-client');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showClientModal());
        }
    },

    async loadClients() {
        const listContainer = document.getElementById('clients-list-container');
        if (!listContainer) return;

        try {
            const clientRepo = LawOfficeApp.DB.Repositories.ClientRepository || 
                               LawOfficeApp.DB.ClientRepository || 
                               LawOfficeApp.Repositories.Client;

            if (!clientRepo || typeof clientRepo.getAll !== 'function') {
                this.renderEmptyList(listContainer);
                return;
            }

            const clients = await clientRepo.getAll();
            if (!clients || clients.length === 0) {
                this.renderEmptyList(listContainer);
                return;
            }

            let html = `
                <div class="card" style="padding: 20px; background: #fff; border-radius: 8px; border-right: 4px solid #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="margin-top:0; margin-bottom:15px;">قائمة العملاء المسجلين:</h3>
                    <table style="width: 100%; border-collapse: collapse; text-align: right;">
                        <thead>
                            <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                                <th style="padding: 10px;">اسم العميل</th>
                                <th style="padding: 10px;">رقم الهاتف</th>
                                <th style="padding: 10px;">الرقم القومي</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            clients.forEach(c => {
                const name = c.fullName || c.name || '-';
                const phone = c.phone1 || c.phone || '-';
                const nationalId = c.nationalId || '-';
                html += `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold;">${name}</td>
                        <td style="padding: 10px;">${phone}</td>
                        <td style="padding: 10px;">${nationalId}</td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            listContainer.innerHTML = html;
        } catch (err) {
            console.error('خطأ أثناء قراءة العملاء:', err);
            this.renderEmptyList(listContainer);
        }
    },

    renderEmptyList(container) {
        container.innerHTML = `
            <div class="card" style="padding: 20px; background: #fff; border-radius: 8px; border-right: 4px solid #2563eb;">
                <p style="font-weight:bold; margin-bottom: 5px;">قائمة العملاء المسجلين في النظام:</p>
                <p style="color: #666; margin: 0;">لا يوجد عملاء مسجلون حالياً.</p>
            </div>`;
    },

    showClientModal() {
        const wrapperNode = document.createElement('div');
        wrapperNode.className = 'modal-form-wrapper';
        
        const form = document.createElement('form');
        form.id = 'client-form';
        form.style.cssText = 'display: flex; flex-direction: column; gap: 12px; text-align: right; padding: 10px 0;';
        form.innerHTML = `
            <div>
                <label style="display:block; margin-bottom:5px; font-weight:bold;">اسم العميل *</label>
                <input type="text" id="client-name" required style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
                <label style="display:block; margin-bottom:5px; font-weight:bold;">رقم الهاتف</label>
                <input type="tel" id="client-phone" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
                <label style="display:block; margin-bottom:5px; font-weight:bold;">الرقم القومي</label>
                <input type="text" id="client-national-id" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
            </div>
        `;

        wrapperNode.appendChild(form);

        const actions = [
            {
                label: 'إلغاء',
                class: 'btn-secondary',
                onClick: () => {
                    if (LawOfficeApp.UI && LawOfficeApp.UI.Modal) {
                        LawOfficeApp.UI.Modal.hide();
                    }
                }
            },
            {
                label: 'حفظ العميل',
                class: 'btn-primary',
                onClick: async () => {
                    const nameInput = document.getElementById('client-name');
                    if (!nameInput || !nameInput.value.trim()) {
                        alert('يرجى كتابة اسم العميل أولاً');
                        return;
                    }

                    const clientData = {
                        fullName: nameInput.value.trim(),
                        phone1: document.getElementById('client-phone')?.value || '',
                        nationalId: document.getElementById('client-national-id')?.value || '',
                        archived: false,
                        createdAt: new Date().toISOString()
                    };

                    const clientRepo = LawOfficeApp.DB.Repositories.ClientRepository || 
                                       LawOfficeApp.DB.ClientRepository || 
                                       LawOfficeApp.Repositories.Client;

                    if (clientRepo && typeof clientRepo.add === 'function') {
                        await clientRepo.add(clientData);
                    }

                    if (LawOfficeApp.UI && LawOfficeApp.UI.Modal) {
                        LawOfficeApp.UI.Modal.hide();
                    }
                    await this.loadClients();
                }
            }
        ];

        if (LawOfficeApp.UI && LawOfficeApp.UI.Modal) {
            LawOfficeApp.UI.Modal.show('إضافة عميل جديد', wrapperNode, actions);
        }
    }
};
