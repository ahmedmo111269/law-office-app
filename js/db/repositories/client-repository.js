window.LawOfficeApp = window.LawOfficeApp || {};
window.LawOfficeApp.DB = window.LawOfficeApp.DB || {};
window.LawOfficeApp.Repositories = window.LawOfficeApp.Repositories || {};

const ClientRepository = {
    async getAll() {
        if (!LawOfficeApp.DB.db) return [];
        return await LawOfficeApp.DB.db.getAll('clients');
    },

    async add(clientData) {
        if (!LawOfficeApp.DB.db) return null;
        return await LawOfficeApp.DB.db.add('clients', clientData);
    },

    async getById(id) {
        if (!LawOfficeApp.DB.db) return null;
        return await LawOfficeApp.DB.db.get('clients', id);
    }
};

// تسجيل المستودع في المسارات الممكنة لضمان استدعائه بدون أخطاء
window.LawOfficeApp.DB.ClientRepository = ClientRepository;
window.LawOfficeApp.Repositories.Client = ClientRepository;
