LawOfficeApp.DB.Schema = {
    initSchema(db) {
        const STORES = LawOfficeApp.Constants.STORES;

        // 1. Clients
        if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
            const store = db.createObjectStore(STORES.CLIENTS, { keyPath: "id", autoIncrement: true });
            store.createIndex("fullName", "fullName", { unique: false });
            store.createIndex("nationalId", "nationalId", { unique: false });
            store.createIndex("phone1", "phone1", { unique: false });
            store.createIndex("archived", "archived", { unique: false });
        }

        // 2. Cases
        if (!db.objectStoreNames.contains(STORES.CASES)) {
            const store = db.createObjectStore(STORES.CASES, { keyPath: "id", autoIncrement: true });
            store.createIndex("caseNumber", "caseNumber", { unique: false });
            store.createIndex("caseYear", "caseYear", { unique: false });
            store.createIndex("court", "court", { unique: false });
            store.createIndex("archived", "archived", { unique: false });
        }

        // 3. CaseClients (M:N)
        if (!db.objectStoreNames.contains(STORES.CASE_CLIENTS)) {
            const store = db.createObjectStore(STORES.CASE_CLIENTS, { keyPath: "id", autoIncrement: true });
            store.createIndex("caseId", "caseId", { unique: false });
            store.createIndex("clientId", "clientId", { unique: false });
            store.createIndex("caseId_clientId", ["caseId", "clientId"], { unique: true });
        }

        // 4. Opponents
        if (!db.objectStoreNames.contains(STORES.OPPONENTS)) {
            const store = db.createObjectStore(STORES.OPPONENTS, { keyPath: "id", autoIncrement: true });
            store.createIndex("fullName", "fullName", { unique: false });
        }

        // 5. CaseOpponents (M:N)
        if (!db.objectStoreNames.contains(STORES.CASE_OPPONENTS)) {
            const store = db.createObjectStore(STORES.CASE_OPPONENTS, { keyPath: "id", autoIncrement: true });
            store.createIndex("caseId", "caseId", { unique: false });
            store.createIndex("opponentId", "opponentId", { unique: false });
        }

        // 6. Hearings
        if (!db.objectStoreNames.contains(STORES.HEARINGS)) {
            const store = db.createObjectStore(STORES.HEARINGS, { keyPath: "id", autoIncrement: true });
            store.createIndex("caseId", "caseId", { unique: false });
            store.createIndex("date", "date", { unique: false });
        }

        // 7. Procedures
        if (!db.objectStoreNames.contains(STORES.PROCEDURES)) {
            const store = db.createObjectStore(STORES.PROCEDURES, { keyPath: "id", autoIncrement: true });
            store.createIndex("caseId", "caseId", { unique: false });
            store.createIndex("deadline", "deadline", { unique: false });
        }

        // 8. Judgments
        if (!db.objectStoreNames.contains(STORES.JUDGMENTS)) {
            const store = db.createObjectStore(STORES.JUDGMENTS, { keyPath: "id", autoIncrement: true });
            store.createIndex("caseId", "caseId", { unique: false });
        }

        // 9. CaseEvents
        if (!db.objectStoreNames.contains(STORES.CASE_EVENTS)) {
            const store = db.createObjectStore(STORES.CASE_EVENTS, { keyPath: "id", autoIncrement: true });
            store.createIndex("caseId", "caseId", { unique: false });
        }

        // 10. Lookups
        if (!db.objectStoreNames.contains(STORES.LOOKUPS)) {
            const store = db.createObjectStore(STORES.LOOKUPS, { keyPath: "id", autoIncrement: true });
            store.createIndex("category", "category", { unique: false });
        }

        // 11. Settings
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
            db.createObjectStore(STORES.SETTINGS, { keyPath: "key" });
        }

        // 12. BackupHistory
        if (!db.objectStoreNames.contains(STORES.BACKUP_HISTORY)) {
            db.createObjectStore(STORES.BACKUP_HISTORY, { keyPath: "id", autoIncrement: true });
        }
    }
};