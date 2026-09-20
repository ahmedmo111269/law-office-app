window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.Modules = window.LawOfficeApp.Modules || {};

window.LawOfficeApp.Modules.Cases = {
    async init() {
        const container = document.getElementById('router-view') || document.getElementById('main-content');
        if (!container) return;

        this.render(container);
        await this.loadCases();
        this.bindEvents();
    },

    render(container) {
        container.innerHTML = `
            <div class="module-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>⚖️ إدارة القضايا</h2>
                <button id="btn-add-case" class="btn btn-primary" style="padding: 10px 15px; cursor: pointer; background-color: #2563eb; color: #fff; border: none; border-radius: 6px;">+ إضافة قضية جديدة</button>
            </div>
            <div id="cases-list-container">
                <div class="card" style="padding: 20px; background: #fff; border-radius: 8px;">
                    <p style="color: #666;">جاري تحميل القضايا...</p>
                </div>
            </div>
        `;
    },

    bindEvents() {
        const addBtn = document.getElementById('btn-add-case');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showCaseModal());
        }
    },

    async loadCases() {
        const listContainer = document.getElementById('cases-list-container');
        if (!listContainer) return;

        try {
            const caseRepo = LawOfficeApp.DB.Repositories.CaseRepository || LawOfficeApp.DB.CaseRepository;
            if (!caseRepo || typeof caseRepo.getAll !== 'function') {
                this.renderEmptyList(listContainer);
                return;
            }

            const cases = await caseRepo.getAll();
            if (!cases || cases.length === 0) {
                this.renderEmptyList(listContainer);
                return;
            }

            let html = `
                <div class="card" style="padding: 20px; background: #fff; border-radius: 8px; border-right: 4px solid #1e293b; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="margin-top:0; margin-bottom:15px;">جدول القضايا المتداولة:</h3>
                    <table style="width: 100%; border-collapse: collapse; text-align: right;">
                        <thead>
                            <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                                <th style="padding: 10px;">رقم القضية / السنة</th>
                                <th style="padding: 10px;">المحكمة / الدائرة</th>
                                <th style="padding: 10px;">موضوع الدعوى</th>
                                <th style="padding: 10px;">الصفة</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            cases.forEach(c => {
                const caseNum = `${c.caseNumber || '-'} لسنة ${c.caseYear || '-'}`;
                const court = `${c.court || '-'} ${c.circuit ? ' - ' + c.circuit : ''}`;
                const subject = c.subject || '-';
                const capacity = c.clientCapacity || 'مدعي';

                html += `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold; color: #2563eb;">${caseNum}</td>
                        <td style="padding: 10px;">${court}</td>
                        <td style="padding: 10px;">${subject}</td>
                        <td style="padding: 10px;">${capacity}</td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            listContainer.innerHTML = html;
        } catch (err) {
            console.error('خطأ أثناء تحميل القضايا:', err);
            this.renderEmptyList(listContainer);
        }
    },

    renderEmptyList(container) {
        container.innerHTML = `
            <div class="card" style="padding: 20px; background: #fff; border-radius: 8px; border-right: 4px solid #1e293b;">
                <p style="font-weight:bold; margin-bottom: 5px;">سجل القضايا والدوائر:</p>
                <p style="color: #666; margin: 0;">لا توجد قضايا مسجلة حالياً.</p>
            </div>`;
    },

    async showCaseModal() {
        // جلب قائمة العملاء لربط القضية بعميل
        let clientsOptions = '<option value="">-- اختر العميل --</option>';
        try {
            const clientRepo = LawOfficeApp.DB.Repositories.ClientRepository;
            const clients = await clientRepo.getAll();
            clients.forEach(c => {
                clientsOptions += `<option value="${c.id}">${c.fullName || c.name}</option>`;
            });
        } catch (e) {
            console.warn("لم يتم جلب العملاء للنموذج:", e);
        }

        const wrapperNode = document.createElement('div');
        wrapperNode.className = 'modal-form-wrapper';
        
        const form = document.createElement('form');
        form.id = 'case-form';
        form.style.cssText = 'display: flex; flex-direction: column; gap: 12px; text-align: right; padding: 10px 0;';
        form.innerHTML = `
            <div style="display: flex; gap: 10px;">
                <div style="flex: 1;">
                    <label style="display:block; margin-bottom:5px; font-weight:bold;">رقم القضية *</label>
                    <input type="text" id="case-number" required style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div style="flex: 1;">
                    <label style="display:block; margin-bottom:5px; font-weight:bold;">السنة *</label>
                    <input type="text" id="case-year" value="${new Date().getFullYear()}" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <div style="flex: 1;">
                    <label style="display:block; margin-bottom:5px; font-weight:bold;">المحكمة *</label>
                    <input type="text" id="case-court" placeholder="مثال: محكمة طوخ الجزئية" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div style="flex: 1;">
                    <label style="display:block; margin-bottom:5px; font-weight:bold;">الدائرة</label>
                    <input type="text" id="case-circuit" placeholder="مثال: مدني/مدني مدني" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>
            </div>

            <div>
                <label style="display:block; margin-bottom:5px; font-weight:bold;">العميل المرتبط</label>
                <select id="case-client-id" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                    ${clientsOptions}
                </select>
            </div>

            <div>
                <label style="display:block; margin-bottom:5px; font-weight:bold;">موضوع الدعوى</label>
                <input type="text" id="case-subject" placeholder="مثال: صحة توقيع / إثبات حالة / صحة ونفاذ" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
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
                label: 'حفظ القضية',
                class: 'btn-primary',
                onClick: async () => {
                    const numInput = document.getElementById('case-number');
                    if (!numInput || !numInput.value.trim()) {
                        alert('يرجى إدخال رقم القضية');
                        return;
                    }

                    const caseData = {
                        caseNumber: numInput.value.trim(),
                        caseYear: document.getElementById('case-year')?.value?.trim() || '',
                        court: document.getElementById('case-court')?.value?.trim() || '',
                        circuit: document.getElementById('case-circuit')?.value?.trim() || '',
                        clientId: document.getElementById('case-client-id')?.value || null,
                        subject: document.getElementById('case-subject')?.value?.trim() || '',
                        archived: false,
                        createdAt: new Date().toISOString()
                    };

                    const caseRepo = LawOfficeApp.DB.Repositories.CaseRepository || LawOfficeApp.DB.CaseRepository;

                    if (caseRepo && typeof caseRepo.add === 'function') {
                        const newCaseId = await caseRepo.add(caseData);
                        
                        // ربط العميل بالقضية في جدول M:N إذا تم اختياره
                        if (caseData.clientId && LawOfficeApp.DB.Repositories.CaseClientRepository) {
                            await LawOfficeApp.DB.Repositories.CaseClientRepository.linkClientToCase(newCaseId, parseInt(caseData.clientId));
                        }
                    }

                    if (LawOfficeApp.UI && LawOfficeApp.UI.Modal) {
                        LawOfficeApp.UI.Modal.hide();
                    }
                    if (LawOfficeApp.UI && LawOfficeApp.UI.Toast) {
                        LawOfficeApp.UI.Toast.show("تم تسجيل القضية بنجاح!", "success");
                    }
                    await this.loadCases();
                }
            }
        ];

        if (LawOfficeApp.UI && LawOfficeApp.UI.Modal) {
            LawOfficeApp.UI.Modal.show('إضافة قضية جديدة', wrapperNode, actions);
        }
    }
};
