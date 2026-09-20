LawOfficeApp.DB.Repositories.CaseRepository = {
    async countActive() {
        const db = await LawOfficeApp.DB.Database.connect();
        return new Promise((resolve) => {
            const tx = db.transaction(LawOfficeApp.Constants.STORES.CASES, "readonly");
            const store = tx.objectStore(LawOfficeApp.Constants.STORES.CASES);
            const req = store.getAll();
            req.onsuccess = () => {
                const activeCases = (req.result || []).filter(c => !c.archived);
                resolve(activeCases.length);
            };
            req.onerror = () => resolve(0);
        });
    }
};