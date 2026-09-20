LawOfficeApp.DB.Repositories.CaseClientRepository = {
    async linkClientToCase(caseId, clientId, role = "مدعي") {
        const now = new Date().toISOString();
        const payload = { caseId, clientId, role, createdAt: now, updatedAt: now };

        return LawOfficeApp.DB.Database.executeTransaction(
            [LawOfficeApp.Constants.STORES.CASE_CLIENTS],
            "readwrite",
            (stores) => stores[LawOfficeApp.Constants.STORES.CASE_CLIENTS].add(payload)
        );
    }
};
