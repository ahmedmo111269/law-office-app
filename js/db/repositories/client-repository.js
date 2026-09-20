window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.DB = window.LawOfficeApp.DB || {};
window.LawOfficeApp.DB.Repositories = window.LawOfficeApp.DB.Repositories || {};

const ClientRepository = {
    async getAll() {
        const STORES = LawOfficeApp.Constants.STORES;
        return LawOfficeApp.DB.Database.executeTransaction(
            [STORES.CLIENTS],
            "readonly",
            (stores) => {
                return new Promise((resolve, reject) => {
                    const req = stores[STORES.CLIENTS].getAll();
                    req.onsuccess = () => resolve(req.result || []);
                    req.onerror = () => reject(req.error);
                });
            }
        );
    },

    async add(clientData) {
        const STORES = LawOfficeApp.Constants.STORES;
        return LawOfficeApp.DB.Database.executeTransaction(
            [STORES.CLIENTS],
            "readwrite",
            (stores) => {
                return new Promise((resolve, reject) => {
                    const req = stores[STORES.CLIENTS].add(clientData);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });
            }
        );
    },

    async getById(id) {
        const STORES = LawOfficeApp.Constants.STORES;
        return LawOfficeApp.DB.Database.executeTransaction(
            [STORES.CLIENTS],
            "readonly",
            (stores) => {
                return new Promise((resolve, reject) => {
                    const req = stores[STORES.CLIENTS].get(id);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });
            }
        );
    },

    async countActive() {
        try {
            const allClients = await this.getAll();
            const activeClients = allClients.filter(c => !c.archived);
            return activeClients.length;
        } catch (err) {
            console.error("خطأ في حساب عدد العملاء:", err);
            return 0;
        }
    }
};

// تسجيل المستودع في المسارات لضمان التوافقية
window.LawOfficeApp.DB.Repositories.ClientRepository = ClientRepository;
window.LawOfficeApp.DB.ClientRepository = ClientRepository;
window.LawOfficeApp.Repositories = window.LawOfficeApp.Repositories || {};
window.LawOfficeApp.Repositories.Client = ClientRepository;
