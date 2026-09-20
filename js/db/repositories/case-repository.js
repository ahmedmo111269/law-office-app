window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.DB = window.LawOfficeApp.DB || {};
window.LawOfficeApp.DB.Repositories = window.LawOfficeApp.DB.Repositories || {};

const CaseRepository = {
    async getAll() {
        const STORES = LawOfficeApp.Constants.STORES;
        return LawOfficeApp.DB.Database.executeTransaction(
            [STORES.CASES],
            "readonly",
            (stores) => {
                return new Promise((resolve, reject) => {
                    const req = stores[STORES.CASES].getAll();
                    req.onsuccess = () => resolve(req.result || []);
                    req.onerror = () => reject(req.error);
                });
            }
        );
    },

    async add(caseData) {
        const STORES = LawOfficeApp.Constants.STORES;
        return LawOfficeApp.DB.Database.executeTransaction(
            [STORES.CASES],
            "readwrite",
            (stores) => {
                return new Promise((resolve, reject) => {
                    const req = stores[STORES.CASES].add(caseData);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });
            }
        );
    },

    async getById(id) {
        const STORES = LawOfficeApp.Constants.STORES;
        return LawOfficeApp.DB.Database.executeTransaction(
            [STORES.CASES],
            "readonly",
            (stores) => {
                return new Promise((resolve, reject) => {
                    const req = stores[STORES.CASES].get(id);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });
            }
        );
    },

    async countActive() {
        try {
            const allCases = await this.getAll();
            const activeCases = allCases.filter(c => !c.archived);
            return activeCases.length;
        } catch (err) {
            console.error("خطأ في حساب عدد القضايا النشطة:", err);
            return 0;
        }
    }
};

window.LawOfficeApp.DB.Repositories.CaseRepository = CaseRepository;
window.LawOfficeApp.DB.CaseRepository = CaseRepository;
