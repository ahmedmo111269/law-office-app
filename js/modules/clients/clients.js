window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.Modules = window.LawOfficeApp.Modules || {};

window.LawOfficeApp.Modules.Clients = {
    async init() {
        const container = document.getElementById('router-view') || document.getElementById('view-container');
        if (!container) return;

        // 1. رسم واجهة العملاء
        this.render(container);

        // 2. تحميل البيانات مع التحقق من وجود المستودع
        await this.loadClients();

        // 3. ربط أحداث الأزرار
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
                    <p>جاري تحميل العملاء...</p>
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
        try {
            // الوصول الآمن لمستودع العملاء باختبار كافة المسميات المحتملة
            const clientRepo = (LawOfficeApp.DB && LawOfficeApp.DB.ClientRepository) || 
                               (LawOfficeApp.Repositories && LawOfficeApp.Repositories.Client) ||
                               LawOfficeApp.ClientRepository;

            if (!clientRepo || typeof clientRepo.getAll !== 'function') {
                listContainer.innerHTML = `
                    <div class="card" style="padding: 20px; background: #fff; border-radius: 8px; border-right: 4px solid #3b82f6;">
                        <p>قائمة العملاء المسجلين في النظام:</p>
                        <p style="color: #666;">لا يوجد عملاء مسجلون حالياً.</p>
                    </div>`;
                return;
            }

            const clients = await clientRepo.getAll();
            if (!clients || clients.length === 0) {
                listContainer.innerHTML = `
                    <div class="card" style="padding: 20px; background: #fff; border-radius: 8px; border-right: 4px solid #3b82f6;">
                        <p>قائمة العملاء المسجلين في النظام:</p>
                        <p style="color: #666;">لا يوجد عملاء مسجلون حالياً.</p>
                    </div>`;
                return;
            }

            let html = '<ul style="list-style: none; padding: 0;">';
            clients.forEach(c => {
                html += `<li style="padding: 12px; border-bottom: 1px solid #eee;"><strong>${c.name}</strong> - ${c.phone || 'بدون رقم'}</li>`;
            });
            html += '</ul>';
            listContainer.innerHTML = html;
        } catch (err) {
            console.error('خطأ أثناء تحميل العملاء:', err);
            listContainer.innerHTML = `
                <div class="card" style="padding: 20px; background: #fff; border-radius: 8px;">
                    <p style="color: #666;">لا يوجد عملاء مسجلون حالياً.</p>
                </div>`;
        }
    },

    showClientModal() {
        // إنشاء حاوية Wrapper كعنصر DOM صريح متوافق مع appendChild
        const wrapperNode = document.createElement('div');
        wrapperNode.className = 'modal-form-wrapper';
        
        const form = document.createElement('form');
        form.id = 'client-form';
        form.style.cssText = 'display: flex; flex-direction: column; gap: 12px; text-align: right;';
        form.innerHTML = `
            <div>
                <label style="display:block; margin-bottom:5px;">اسم العميل *</label>
                <input type="text" id="client-name" required style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
                <label style="display:block; margin-bottom:5px;">رقم الهاتف</label>
                <input type="tel" id="client-phone" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
                <label style="display:block; margin-bottom:5px;">الرقم القومي</label>
                <input type="text" id="client-national-id" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
            </div>
        `;

        wrapperNode.appendChild(form);

        const actions = [
            {
                label: 'إلغاء',
                class: 'btn-secondary',
                onClick: () => {}
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
                        name: nameInput.value.trim(),
                        phone: document.getElementById('client-phone')?.value || '',
                        nationalId: document.getElementById('client-national-id')?.value || '',
                        createdAt: new Date().toISOString()
                    };

                    const clientRepo = (LawOfficeApp.DB && LawOfficeApp.DB.ClientRepository) || 
                                       (LawOfficeApp.Repositories && LawOfficeApp.Repositories.Client) ||
                                       LawOfficeApp.ClientRepository;

                    if (clientRepo && typeof clientRepo.add === 'function') {
                        await clientRepo.add(clientData);
                    }
                    await this.loadClients();
                }
            }
        ];

        // تمرير عنصر DOM حقيقي (wrapperNode)
        if (LawOfficeApp.UI && LawOfficeApp.UI.Modal) {
            LawOfficeApp.UI.Modal.show('إضافة عميل جديد', wrapperNode, actions);
        }
    }
};
