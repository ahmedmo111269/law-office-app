LawOfficeApp.DB.Database = {
    dbInstance: null,

    async connect() {
        if (this.dbInstance) return this.dbInstance;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(
                LawOfficeApp.Constants.DB_NAME,
                LawOfficeApp.Constants.DB_VERSION
            );

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                LawOfficeApp.DB.Schema.initSchema(db);
            };

            request.onsuccess = (e) => {
                this.dbInstance = e.target.result;
                resolve(this.dbInstance);
            };

            request.onerror = (e) => {
                const errorMsg = request.error ? request.error.message : "تعذر فتح قاعدة البيانات";
                LawOfficeApp.Core.ErrorHandler.handle("فشل الاتصال بقاعدة البيانات: " + errorMsg, request.error);
                reject(request.error);
            };
        });
    },

    async executeTransaction(storeNames, mode, callback) {
        const db = await this.connect();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeNames, mode);
            const stores = {};
            storeNames.forEach(name => { stores[name] = tx.objectStore(name); });

            let result;
            tx.oncomplete = () => resolve(result);
            tx.onerror = (e) => reject(tx.error || e);
            tx.onabort = (e) => reject(new Error("Transaction aborted"));

            try {
                result = callback(stores, tx);
            } catch (err) {
                tx.abort();
                reject(err);
            }
        });
    }
};
