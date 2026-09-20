LawOfficeApp.DB.Repositories.ClientRepository = {
    async add(clientData) {
        const now = new Date().toISOString();
        const payload = {
            ...clientData,
            archived: false,
            createdAt: now,
            updatedAt: now
        };

        return LawOfficeApp.DB.Database.executeTransaction(
            [LawOfficeApp.Constants.STORES.CLIENTS],
            "readwrite",
            (stores) => stores[LawOfficeApp.Constants.STORES.CLIENTS].add(payload)
        );
    },

    async getAll(includeArchived = false) {
        const db = await LawOfficeApp.DB.Database.connect();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(LawOfficeApp.Constants.STORES.CLIENTS, "readonly");
            const store = tx.objectStore(LawOfficeApp.Constants.STORES.CLIENTS);
            const req = store.getAll();

            req.onsuccess = () => {
                let results = req.result || [];
                if (!includeArchived) {
                    results = results.filter(c => !c.archived);
                }
                resolve(results);
            };
            req.onerror = () => reject(req.error);
        });
    },

    async countActive() {
        const clients = await this.getAll(false);
        return clients.length;
    }
};