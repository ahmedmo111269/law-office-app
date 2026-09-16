const DB_NAME = "LawOfficeDB";
const DB_VERSION = 1;
const CLIENTS_STORE = "clients";

let db;

document.addEventListener("DOMContentLoaded", () => {

    openDatabase();

    setupNavigation();
    setupClientEvents();

});


function openDatabase() {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {

        const database = event.target.result;

        if (!database.objectStoreNames.contains(CLIENTS_STORE)) {

            const store = database.createObjectStore(
                CLIENTS_STORE,
                {
                    keyPath: "id",
                    autoIncrement: true
                }
            );

            store.createIndex("fullName", "fullName", {
                unique: false
            });

            store.createIndex("nationalId", "nationalId", {
                unique: false
            });

            store.createIndex("phone1", "phone1", {
                unique: false
            });

            store.createIndex("archived", "archived", {
                unique: false
            });
        }
    };

    request.onsuccess = (event) => {

        db = event.target.result;

        loadClients();

    };

    request.onerror = () => {

        alert("حدث خطأ أثناء فتح قاعدة البيانات.");

    };

}


function setupNavigation() {

    const modules = document.querySelectorAll(".module");

    modules.forEach(module => {

        module.addEventListener("click", () => {

            const name = module.dataset.module;

            if (name === "clients") {

                showClientsSection();

            } else {

                alert("هذه الوحدة سيتم بناؤها في المرحلة القادمة.");

            }

        });

    });

    document
        .getElementById("backToDashboard")
        .addEventListener("click", () => {

            document
                .getElementById("clientsSection")
                .classList.add("hidden");

            document
                .getElementById("dashboard")
                .classList.remove("hidden");

        });

}


function showClientsSection() {

    document
        .getElementById("dashboard")
        .classList.add("hidden");

    document
        .getElementById("clientsSection")
        .classList.remove("hidden");

    loadClients();

}


function setupClientEvents() {

    document
        .getElementById("addClientButton")
        .addEventListener("click", () => {

            openClientModal();

        });


    document
        .getElementById("closeClientModal")
        .addEventListener("click", closeClientModal);


    document
        .getElementById("cancelClientButton")
        .addEventListener("click", closeClientModal);


    document
        .getElementById("clientForm")
        .addEventListener("submit", saveClient);


    document
        .getElementById("clientSearch")
        .addEventListener("input", (event) => {

            loadClients(event.target.value);

        });


    document
        .getElementById("clientsList")
        .addEventListener("click", handleClientAction);

}


function openClientModal(client = null) {

    const modal = document.getElementById("clientModal");

    document.getElementById("clientForm").reset();

    document.getElementById("clientId").value = "";

    if (client) {

        document.getElementById("clientModalTitle").textContent =
            "تعديل بيانات العميل";

        document.getElementById("clientId").value =
            client.id;

        document.getElementById("fullName").value =
            client.fullName || "";

        document.getElementById("nationalId").value =
            client.nationalId || "";

        document.getElementById("phone1").value =
            client.phone1 || "";

        document.getElementById("phone2").value =
            client.phone2 || "";

        document.getElementById("whatsapp").value =
            client.whatsapp || "";

        document.getElementById("address").value =
            client.address || "";

        document.getElementById("profession").value =
            client.profession || "";

        document.getElementById("email").value =
            client.email || "";

        document.getElementById("notes").value =
            client.notes || "";

    } else {

        document.getElementById("clientModalTitle").textContent =
            "إضافة عميل";

    }

    modal.classList.remove("hidden");

    document.getElementById("fullName").focus();

}


function closeClientModal() {

    document
        .getElementById("clientModal")
        .classList.add("hidden");

}


function saveClient(event) {

    event.preventDefault();

    if (!db) {

        alert("قاعدة البيانات لم تجهز بعد. حاول مرة أخرى.");

        return;

    }

    const idValue =
        document.getElementById("clientId").value;

    const client = {

        fullName:
            document.getElementById("fullName").value.trim(),

        nationalId:
            document.getElementById("nationalId").value.trim(),

        phone1:
            document.getElementById("phone1").value.trim(),

        phone2:
            document.getElementById("phone2").value.trim(),

        whatsapp:
            document.getElementById("whatsapp").value.trim(),

        address:
            document.getElementById("address").value.trim(),

        profession:
            document.getElementById("profession").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        notes:
            document.getElementById("notes").value.trim(),

        archived: false,

        updatedAt: new Date().toISOString()

    };


    if (!client.fullName) {

        alert("من فضلك اكتب اسم العميل.");

        return;

    }


    const transaction =
        db.transaction(
            CLIENTS_STORE,
            "readwrite"
        );

    const store =
        transaction.objectStore(CLIENTS_STORE);


    if (idValue) {

        client.id = Number(idValue);

        const request =
            store.put(client);

        request.onsuccess = () => {

            closeClientModal();

            loadClients();

        };

    } else {

        client.createdAt =
            new Date().toISOString();

        const request =
            store.add(client);

        request.onsuccess = () => {

            closeClientModal();

            loadClients();

        };

    }


    request.onerror = () => {

        alert("حدث خطأ أثناء حفظ العميل.");

    };

}


function loadClients(searchText = "") {

    if (!db) {
        return;
    }

    const transaction =
        db.transaction(
            CLIENTS_STORE,
            "readonly"
        );

    const store =
        transaction.objectStore(CLIENTS_STORE);

    const request =
        store.getAll();

    request.onsuccess = () => {

        let clients = request.result
            .filter(client => !client.archived);


        const search =
            searchText.trim().toLowerCase();


        if (search) {

            clients = clients.filter(client => {

                return (

                    (client.fullName || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (client.nationalId || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (client.phone1 || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (client.phone2 || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (client.whatsapp || "")
                        .toLowerCase()
                        .includes(search)

                );

            });

        }


        renderClients(clients);

    };

}


function renderClients(clients) {

    const container =
        document.getElementById("clientsList");


    if (clients.length === 0) {

        container.innerHTML = `
            <div class="empty">
                لا توجد بيانات عملاء.
            </div>
        `;

        return;

    }


    container.innerHTML = clients.map(client => {

        return `

            <div class="client-card">

                <h3>
                    ${escapeHtml(client.fullName)}
                </h3>

                <div class="client-info">

                    ${client.nationalId
                        ? `🪪 الرقم القومي: ${escapeHtml(client.nationalId)}<br>`
                        : ""}

                    ${client.phone1
                        ? `📱 الهاتف: ${escapeHtml(client.phone1)}<br>`
                        : ""}

                    ${client.address
                        ? `📍 العنوان: ${escapeHtml(client.address)}`
                        : ""}

                </div>

                <div class="client-actions">

                    <button
                        class="edit-button"
                        data-action="edit"
                        data-id="${client.id}"
                    >
                        تعديل
                    </button>

                    <button
                        class="archive-button"
                        data-action="archive"
                        data-id="${client.id}"
                    >
                        أرشفة
                    </button>

                </div>

            </div>

        `;

    }).join("");

}


function handleClientAction(event) {

    const button =
        event.target.closest("button");

    if (!button) {
        return;
    }

    const id =
        Number(button.dataset.id);

    const action =
        button.dataset.action;


    if (action === "edit") {

        getClient(id);

    }


    if (action === "archive") {

        archiveClient(id);

    }

}


function getClient(id) {

    const transaction =
        db.transaction(
            CLIENTS_STORE,
            "readonly"
        );

    const store =
        transaction.objectStore(CLIENTS_STORE);

    const request =
        store.get(id);


    request.onsuccess = () => {

        if (request.result) {

            openClientModal(request.result);

        }

    };

}


function archiveClient(id) {

    if (!confirm("هل تريد أرشفة هذا العميل؟")) {
        return;
    }


    const transaction =
        db.transaction(
            CLIENTS_STORE,
            "readwrite"
        );

    const store =
        transaction.objectStore(CLIENTS_STORE);

    const request =
        store.get(id);


    request.onsuccess = () => {

        const client =
            request.result;

        if (!client) {
            return;
        }

        client.archived = true;

        client.updatedAt =
            new Date().toISOString();

        store.put(client);

    };


    transaction.oncomplete = () => {

        loadClients();

    };

}


function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}
