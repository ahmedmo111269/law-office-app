window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.DB = window.LawOfficeApp.DB || {};
window.LawOfficeApp.DB.Repositories = window.LawOfficeApp.DB.Repositories || {};

const HearingRepository = {
    async getAll() {
        const STORES = LawOfficeApp.Constants.STORES;
        return LawOfficeApp.DB.Database.executeTransaction(
            [STORES.HEARINGS],
            "readonly",
            (stores) => {
                return new Promise((resolve, reject) => {
                    const req = stores[STORES.HEARINGS].getAll();
                    req.onsuccess = () => resolve(req.result || []);
                    req.onerror = () => reject(req.error);
                });
            }
        );
    },

    async add(hearingData) {
        const STORES = LawOfficeApp.Constants.STORES;
        return LawOfficeApp.DB.Database.executeTransaction(
            [STORES.HEARINGS],
            "readwrite",
            (stores) => {
                return new Promise((resolve, reject) => {
                    const req = stores[STORES.HEARINGS].add(hearingData);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });
            }
        );
    },

    async countToday() {
        try {
            const allHearings = await this.getAll();
            const todayStr = new Date().toISOString().split('T')[0];
            const todayHearings = allHearings.filter(h => h.date === todayStr);
            return todayHearings.length;
        } catch (err) {
            console.error("خطأ في حساب جلسات اليوم:", err);
            return 0;
        }
    }
};

window.LawOfficeApp.DB.Repositories.HearingRepository = HearingRepository;
window.LawOfficeApp.DB.HearingRepository = HearingRepository;
