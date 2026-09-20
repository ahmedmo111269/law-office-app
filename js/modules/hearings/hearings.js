window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.Modules = window.LawOfficeApp.Modules || {};

window.LawOfficeApp.Modules.Hearings = {
    async init() {
        const container = document.getElementById('router-view') || document.getElementById('main-content');
        if (!container) return;

        this.render(container);
        await this.loadHearings();
        this.bindEvents();
    },

    render(container) {
        container.innerHTML = `
            <div class="module-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>📅 أجندة الجلسات</h2>
                <button id="btn-add-hearing" class="btn btn-primary" style="padding: 10px 15px; cursor: pointer; background-color: #2563eb; color: #fff; border: none; border-radius: 6px;">+ إضافة جلسة جديدة</button>
            </div>
            <div id="hearings-list-container">
                <div class="card" style="padding: 20px; background: #fff; border-radius: 8px;">
                    <p style="color: #666;">جاري تحميل جدول الجلسات...</p>
                </div>
            </div>
        `;
    },

    bindEvents() {
        const addBtn = document.getElementById('btn-add-hearing');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showHearingModal());
        }
    },

    async loadHearings() {
        const listContainer = document.getElementById('hearings-list-container');
        if (!listContainer) return;

        try {
            const hearingRepo = LawOfficeApp.DB?.Repositories?.HearingRepository || LawOfficeApp.DB?.HearingRepository;
            if (!hearingRepo || typeof hearingRepo.getAll !== 'function') {
                this.renderEmptyList(listContainer);
                return;
            }

            const hearings = await hearingRepo.getAll();
            if (!hearings || hearings.length === 0) {
                this.renderEmptyList(listContainer);
                return;
            }

            let html = `
                <div class="card" style="padding: 20px; background: #fff; border-radius: 8px; border-right: 4px solid #059669;">
                    <h3 style="margin-top:0; margin-bottom:15px;">جدول الجلسات المسجلة:</h3>
                    <table style="width: 100%; border-collapse: collapse; text-align: right;">
                        <thead>
                            <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                                <th style="padding: 10px;">تاريخ الجلسة</th>
                                <th style="padding: 10px;">القرار / المطلوب</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            hearings.forEach(h => {
                html += `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold; color: #059669;">${h.hearingDate || h.date || '-'}</td>
                        <td style="padding: 10px;">${h.decision || h.requirements || 'متابعة الجلسة'}</td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            listContainer.innerHTML = html;
        } catch (err) {
            console.error('خطأ أثناء تحميل الجلسات:', err);
            this.renderEmptyList(listContainer);
        }
    },

    renderEmptyList(container) {
        container.innerHTML = `
            <div class="card" style="padding: 20px; background: #fff; border-radius: 8px; border-right: 4px solid #059669;">
                <p style="font-weight:bold; margin-bottom: 5px;">أجندة الجلسات:</p>
                <p style="color: #666; margin: 0;">لا توجد جلسات مسجلة حالياً.</p>
            </div>`;
    },

    showHearingModal() {
        const form = document.createElement('form');
        form.id = 'hearing-form';
        form.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        form.innerHTML = `
            <label>تاريخ الجلسة *</label>
            <input type="date" id="hearing-date" value="${new Date().toISOString().split('T')[0]}" required style="padding: 8px;">
            <label>القرار / القرار المطلوب</label>
            <textarea id="hearing-decision" rows="3" style="padding: 8px;"></textarea>
        `;

        const actions = [
            { label: 'إلغاء', class: 'btn-secondary', onClick: () => {} },
            {
                label: 'حفظ الجلسة',
                class: 'btn-primary',
                onClick: async () => {
                    const dateInput = document.getElementById('hearing-date');
                    if (!dateInput || !dateInput.value) return;
                    
                    const hearingData = {
                        hearingDate: dateInput.value,
                        decision: document.getElementById('hearing-decision')?.value || '',
                        createdAt: new Date().toISOString()
                    };

                    const hearingRepo = LawOfficeApp.DB?.Repositories?.HearingRepository || LawOfficeApp.DB?.HearingRepository;
                    if (hearingRepo && typeof hearingRepo.add === 'function') {
                        await hearingRepo.add(hearingData);
                    }
                    await this.loadHearings();
                }
            }
        ];

        if (LawOfficeApp.UI && LawOfficeApp.UI.Modal) {
            LawOfficeApp.UI.Modal.show('إضافة جلسة جديدة', form, actions);
        }
    }
};
