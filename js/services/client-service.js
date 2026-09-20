LawOfficeApp.Services.ClientService = {
    async createClient(clientData) {
        const validation = LawOfficeApp.Core.Validators.validateClient(clientData);
        if (!validation.valid) {
            throw new Error(validation.message);
        }
        return LawOfficeApp.DB.Repositories.ClientRepository.add(clientData);
    },

    async getClientsList() {
        return LawOfficeApp.DB.Repositories.ClientRepository.getAll(false);
    }
};
