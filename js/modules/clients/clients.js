window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.Modules = window.LawOfficeApp.Modules || {};

window.LawOfficeApp.Modules.Clients = {
    async init() {
        const container = document.getElementById('router-view') || document.getElementById('view-container');
        if (!container) return;

        // 1. رسم واجهة العملاء
        this.render(container);

        // 2. تحميل البيانات
        await this.loadClients();

        // 3. ربط الأحداث
        this.bindEvents();
    },

    render(container) {
        container.innerHTML = `
            <div class="module-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>👥 إدارة العملاء</h2>
                <button id="btn-add-client" class="btn btn-primary" style="padding: 10px 15px; cursor: pointer;">+ إضافة عميل جديد</button>
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
            const clients = await LawOfficeApp.DB.ClientRepository.getAll();
            if (!clients || clients.length === 0) {
                listContainer.innerHTML = `
                    <div class="card" style="padding: 20px; background: #fff; border-radius: 8px;">
                        <p>قائمة العملاء المسجلين في النظام:</p>
                        <p style="color: #666;">لا يوجد عملاء مسجلون حالياً.</p>
                    </div>`;
                return;
            }

            let html = '<ul style="list-style: none; padding: 0;">';
            clients.forEach(c => {
                html += `<li style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${c.name}</strong> - ${c.phone || 'بدون رقم'}</li>`;
            });
            html += '</ul>';
            listContainer.innerHTML = html;
        } catch (err) {
            console.error('خطأ في تحميل العملاء:', err);
            listContainer.innerHTML = '<p style="color:red;">حدث خطأ أثناء تحميل العملاء.</p>';
        }
    },

    showClientModal() {
        // إنشاء عنصر النموذج كـ DOM Node بدلاً من نص HTML
        const form = document.createElement('form');
        form.id = 'client-form';
        form.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        form.innerHTML = `
            <label>اسم العميل *</label>
            <input type="text" id="client-name" required style="padding: 8px; width: 100%;">
            
            <label>رقم الهاتف</label>
            <input type="tel" id="client-phone" style="padding: 8px; width: 100%;">
            
            <label>الرقم القومي</label>
            <input type="text" id="client-national-id" style="padding: 8px; width: 100%;">
        `;

        // إعداد مصفوفة الأزرار (actions) المطلوبة
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
                    await LawOfficeApp.DB.ClientRepository.add(clientData);
                    await this.loadClients();
                }
            }
        ];

        // استدعاء المودال بالتوقيع المطابق لكودك: show(title, contentNode, actions)
        LawOfficeApp.UI.Modal.show('إضافة عميل جديد', form, actions);
    }
};
