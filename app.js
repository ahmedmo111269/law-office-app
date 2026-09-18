const DB_NAME = "LawOfficeDB";
const DB_VERSION = 4;
const CLIENTS_STORE = "clients";
const CASES_STORE = "cases";

let db;


/* =========================================
   تشغيل البرنامج
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    openDatabase();

    setupNavigation();

    setupClientEvents();

    setupCaseEvents();

});


/* =========================================
   قاعدة البيانات
========================================= */

function openDatabase() {

    const request = indexedDB.open(
        DB_NAME,
        DB_VERSION
    );


    request.onupgradeneeded = (event) => {

        const database = event.target.result;


        /* =========================================
           إنشاء مخزن العملاء
        ========================================= */

        if (!database.objectStoreNames.contains(CLIENTS_STORE)) {

            const store =
                database.createObjectStore(
                    CLIENTS_STORE,
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );


            store.createIndex(
                "fullName",
                "fullName",
                {
                    unique: false
                }
            );


            store.createIndex(
                "nationalId",
                "nationalId",
                {
                    unique: false
                }
            );


            store.createIndex(
                "phone1",
                "phone1",
                {
                    unique: false
                }
            );


            store.createIndex(
                "archived",
                "archived",
                {
                    unique: false
                }
            );

        }


        /* =========================================
           إنشاء مخزن القضايا
        ========================================= */

        if (!database.objectStoreNames.contains(CASES_STORE)) {

            database.createObjectStore(
                CASES_STORE,
                {
                    keyPath: "id",
                    autoIncrement: true
                }
            );

        }

    };


    request.onsuccess = (event) => {

        db = event.target.result;

        loadClients();

        loadCases();

    };


    request.onerror = () => {

        alert(
            "حدث خطأ أثناء فتح قاعدة البيانات."
        );

    };

}

/* =========================================
   التنقل بين الصفحات
========================================= */

function setupNavigation() {

    const modules =
        document.querySelectorAll(".module");


    modules.forEach(module => {

        module.addEventListener(
            "click",
            () => {

                const name =
                    module.dataset.module;


                if (name === "clients") {

                    showClientsSection();

                }


                else if (name === "cases") {

                    showCasesSection();

                }


                else {

                    alert(
                        "هذه الوحدة سيتم بناؤها في المرحلة القادمة."
                    );

                }

            }
        );

    });


    document
        .getElementById("backToDashboard")
        .addEventListener(
            "click",
            showDashboard
        );


    document
        .getElementById("backToClients")
        .addEventListener(
            "click",
            showClientsSection
        );


    document
        .getElementById("backFromCases")
        .addEventListener(
            "click",
            showDashboard
        );

}


function hideAllSections() {

    const sections = [
        "dashboard",
        "clientsSection",
        "clientDetailsSection",
        "casesSection"
    ];


    sections.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.classList.add("hidden");

        }

    });

}


function showDashboard() {

    hideAllSections();


    document
        .getElementById("dashboard")
        .classList
        .remove("hidden");

}


function showClientsSection() {

    hideAllSections();


    document
        .getElementById("clientsSection")
        .classList
        .remove("hidden");


    loadClients();

}


function showCasesSection() {

    hideAllSections();


    document
        .getElementById("casesSection")
        .classList
        .remove("hidden");


    loadCases();

}


/* =========================================
   أحداث وحدة العملاء
========================================= */

function setupClientEvents() {


    document
        .getElementById("addClientButton")
        .addEventListener(
            "click",
            () => {

                openClientModal();

            }
        );


    document
        .getElementById("closeClientModal")
        .addEventListener(
            "click",
            closeClientModal
        );


    document
        .getElementById("cancelClientButton")
        .addEventListener(
            "click",
            closeClientModal
        );


    document
        .getElementById("clientForm")
        .addEventListener(
            "submit",
            saveClient
        );


    document
        .getElementById("clientSearch")
        .addEventListener(
            "input",
            (event) => {

                loadClients(
                    event.target.value
                );

            }
        );


    document
        .getElementById("clientsList")
        .addEventListener(
            "click",
            handleClientAction
        );

}


/* =========================================
   أحداث وحدة القضايا
========================================= */

function setupCaseEvents() {

    const addCaseButton =
        document.getElementById(
            "addCaseButton"
        );


    const caseModal =
        document.getElementById(
            "caseModal"
        );


    const closeCaseModal =
        document.getElementById(
            "closeCaseModal"
        );


    const cancelCaseButton =
        document.getElementById(
            "cancelCaseButton"
        );


    /* =========================================
       فتح نافذة إضافة قضية
    ========================================= */

    if (addCaseButton) {

        addCaseButton.addEventListener(
            "click",
            () => {

                caseModal.classList.remove(
                    "hidden"
                );

            }
        );

    }


    /* =========================================
       إغلاق النافذة
    ========================================= */

    if (closeCaseModal) {

        closeCaseModal.addEventListener(
            "click",
            () => {

                caseModal.classList.add(
                    "hidden"
                );

            }
        );

    }


    if (cancelCaseButton) {

        cancelCaseButton.addEventListener(
            "click",
            () => {

                caseModal.classList.add(
                    "hidden"
                );

            }
        );

    }


    /* =========================================
       البحث في القضايا
    ========================================= */

    const caseSearch =
        document.getElementById(
            "caseSearch"
        );


    if (caseSearch) {

        caseSearch.addEventListener(
            "input",
            (event) => {

                loadCases(
                    event.target.value
                );

            }
        );

    }
    /* =========================================
       حفظ القضية
    ========================================= */

    const caseForm =
        document.getElementById(
            "caseForm"
        );


    if (caseForm) {

        caseForm.addEventListener(
    "submit",
    (event) => {

        alert("وصل زر حفظ القضية إلى JavaScript");

        event.preventDefault();


                const caseData = {

                    caseNumber:
                        document
                            .getElementById("caseNumber")
                            .value
                            .trim(),

                    caseYear:
                        document
                            .getElementById("caseYear")
                            .value,

                    caseType:
                        document
                            .getElementById("caseType")
                            .value
                            .trim(),

                    caseLevel:
                        document
                            .getElementById("caseLevel")
                            .value
                            .trim(),

                    caseCourt:
                        document
                            .getElementById("caseCourt")
                            .value
                            .trim(),

                    caseCircuit:
                        document
                            .getElementById("caseCircuit")
                            .value
                            .trim(),

                    caseSubject:
                        document
                            .getElementById("caseSubject")
                            .value
                            .trim(),

                    caseRole:
                        document
                            .getElementById("caseRole")
                            .value
                            .trim(),

                    caseStatus:
                        document
                            .getElementById("caseStatus")
                            .value
                            .trim(),

                    caseFilingDate:
                        document
                            .getElementById("caseFilingDate")
                            .value,

                    caseNotes:
                        document
                            .getElementById("caseNotes")
                            .value
                            .trim(),

                    createdAt:
                        new Date().toISOString(),

                    updatedAt:
                        new Date().toISOString()

                };


                const transaction =
                    db.transaction(
                        [CASES_STORE],
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        CASES_STORE
                    );


                store.add(caseData);


                transaction.oncomplete = () => {

                    alert(
                        "تم حفظ القضية بنجاح."
                    );


                    caseForm.reset();


                    caseModal.classList.add(
                        "hidden"
                    );


                    loadCases();

                };


                transaction.onerror = () => {

                    alert(
                        "حدث خطأ أثناء حفظ القضية."
                    );

                };

            }
        );

    }
}


/* =========================================
   تحميل القضايا
========================================= */

function loadCases(searchText = "") {

    const container =
        document.getElementById(
            "casesList"
        );


    const countElement =
        document.getElementById(
            "casesCount"
        );


    if (!container) {
        return;
    }


    const search =
        searchText
            .trim()
            .toLowerCase();


    const transaction =
        db.transaction(
            [CASES_STORE],
            "readonly"
        );


    const store =
        transaction.objectStore(
            CASES_STORE
        );


    const request =
        store.getAll();


    request.onsuccess = () => {

        let cases =
            request.result;


        /* =========================================
           البحث
        ========================================= */

        if (search) {

            cases =
                cases.filter(
                    (item) => {

                        return (

                            String(
                                item.caseNumber || ""
                            )
                            .toLowerCase()
                            .includes(search)

                            ||

                            String(
                                item.caseYear || ""
                            )
                            .toLowerCase()
                            .includes(search)

                            ||

                            String(
                                item.caseCourt || ""
                            )
                            .toLowerCase()
                            .includes(search)

                            ||

                            String(
                                item.caseSubject || ""
                            )
                            .toLowerCase()
                            .includes(search)

                        );

                    }
                );

        }


        /* =========================================
           العدد
        ========================================= */

        if (countElement) {

            countElement.textContent =
                cases.length;

        }


        /* =========================================
           لا توجد نتائج
        ========================================= */

        if (cases.length === 0) {

            container.innerHTML = `

                <div class="empty">

                    ${
                        search
                            ? "لا توجد قضايا تطابق البحث."
                            : "لا توجد قضايا مسجلة حتى الآن."
                    }

                </div>

            `;

            return;

        }


        /* =========================================
           عرض القضايا
        ========================================= */

        container.innerHTML =
            cases
                .map(
                    (item) => {

                        return `

                            <div class="client-card">

                                <div>

                                    <h3>

                                        قضية رقم
                                        ${item.caseNumber}
                                        لسنة
                                        ${item.caseYear}

                                    </h3>


                                    <p>

                                        ${
                                            item.caseType
                                                || "نوع القضية غير محدد"
                                        }

                                    </p>


                                    <p>

                                        ${
                                            item.caseCourt
                                                || "المحكمة غير محددة"
                                        }

                                    </p>

                                </div>


                                <div>

                                    ${
                                        item.caseStatus
                                            || "الحالة غير محددة"
                                    }

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");

    };


    request.onerror = () => {

        container.innerHTML = `

            <div class="empty">

                حدث خطأ أثناء تحميل القضايا.

            </div>

        `;

    };

}


/* =========================================
   نافذة العميل
========================================= */

function openClientModal(client = null) {

    const modal =
        document.getElementById(
            "clientModal"
        );


    document
        .getElementById("clientForm")
        .reset();


    document
        .getElementById("clientId")
        .value = "";


    if (client) {

        document
            .getElementById("clientModalTitle")
            .textContent =
            "تعديل بيانات العميل";


        document
            .getElementById("clientId")
            .value =
            client.id;


        document
            .getElementById("fullName")
            .value =
            client.fullName || "";


        document
            .getElementById("nationalId")
            .value =
            client.nationalId || "";


        document
            .getElementById("phone1")
            .value =
            client.phone1 || "";


        document
            .getElementById("phone2")
            .value =
            client.phone2 || "";


        document
            .getElementById("whatsapp")
            .value =
            client.whatsapp || "";


        document
            .getElementById("address")
            .value =
            client.address || "";


        document
            .getElementById("profession")
            .value =
            client.profession || "";


        document
            .getElementById("email")
            .value =
            client.email || "";


        document
            .getElementById("notes")
            .value =
            client.notes || "";

    } else {

        document
            .getElementById("clientModalTitle")
            .textContent =
            "إضافة عميل";

    }


    modal
        .classList
        .remove("hidden");


    document
        .getElementById("fullName")
        .focus();

}


/* =========================================
   إغلاق نافذة العميل
========================================= */

function closeClientModal() {

    document
        .getElementById("clientModal")
        .classList
        .add("hidden");

}


/* =========================================
   حفظ العميل
========================================= */

function saveClient(event) {

    event.preventDefault();


    if (!db) {

        alert(
            "قاعدة البيانات لم تجهز بعد."
        );

        return;

    }


    const idValue =
        document
            .getElementById("clientId")
            .value;


    const client = {

        fullName:
            document
                .getElementById("fullName")
                .value
                .trim(),


        nationalId:
            document
                .getElementById("nationalId")
                .value
                .trim(),


        phone1:
            document
                .getElementById("phone1")
                .value
                .trim(),


        phone2:
            document
                .getElementById("phone2")
                .value
                .trim(),


        whatsapp:
            document
                .getElementById("whatsapp")
                .value
                .trim(),


        address:
            document
                .getElementById("address")
                .value
                .trim(),


        profession:
            document
                .getElementById("profession")
                .value
                .trim(),


        email:
            document
                .getElementById("email")
                .value
                .trim(),


        notes:
            document
                .getElementById("notes")
                .value
                .trim(),


        archived: false,


        updatedAt:
            new Date().toISOString()

    };


    if (!client.fullName) {

        alert(
            "من فضلك اكتب اسم العميل."
        );

        return;

    }


    const transaction =
        db.transaction(
            CLIENTS_STORE,
            "readwrite"
        );


    const store =
        transaction.objectStore(
            CLIENTS_STORE
        );


    if (idValue) {

        client.id =
            Number(idValue);


        const request =
            store.put(client);


        request.onsuccess = () => {

            closeClientModal();

            loadClients();

        };


        request.onerror = () => {

            alert(
                "حدث خطأ أثناء تعديل العميل."
            );

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


        request.onerror = () => {

            alert(
                "حدث خطأ أثناء إضافة العميل."
            );

        };

    }

}


/* =========================================
   تحميل العملاء
========================================= */

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
        transaction.objectStore(
            CLIENTS_STORE
        );


    const request =
        store.getAll();


    request.onsuccess = () => {


        let clients =
            request.result.filter(
                client =>
                    !client.archived
            );


        const search =
            searchText
                .trim()
                .toLowerCase();


        if (search) {

            clients =
                clients.filter(
                    client => {

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

                    }
                );

        }


        renderClients(clients);

    };

}


/* =========================================
   عرض العملاء
========================================= */

function renderClients(clients) {

    const container =
        document.getElementById(
            "clientsList"
        );


    const countElement =
        document.getElementById(
            "clientsCount"
        );


    if (countElement) {

        countElement.textContent =
            clients.length;

    }


    if (clients.length === 0) {

        container.innerHTML = `

            <div class="empty">

                لا توجد بيانات عملاء.

            </div>

        `;

        return;

    }


    container.innerHTML =
        clients
            .map(client => {

                return `

                    <div
                        class="client-card"
                    >

                        <h3>

                            ${escapeHtml(
                                client.fullName
                            )}

                        </h3>


                        <div
                            class="client-info"
                        >

                            ${
                                client.nationalId
                                ?
                                `🪪 الرقم القومي:
                                ${escapeHtml(
                                    client.nationalId
                                )}<br>`
                                :
                                ""
                            }


                            ${
                                client.phone1
                                ?
                                `📱 الهاتف:
                                ${escapeHtml(
                                    client.phone1
                                )}<br>`
                                :
                                ""
                            }


                            ${
                                client.address
                                ?
                                `📍 العنوان:
                                ${escapeHtml(
                                    client.address
                                )}`
                                :
                                ""
                            }

                        </div>


                        <div
                            class="client-actions"
                        >

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


                            <button
                                class="edit-button"
                                data-action="open"
                                data-id="${client.id}"
                            >

                                فتح السجل

                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================
   التعامل مع أزرار العميل
========================================= */

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


    if (action === "open") {

        openClientDetails(id);

    }

}


/* =========================================
   الحصول على عميل
========================================= */

function getClient(id) {

    const transaction =
        db.transaction(
            CLIENTS_STORE,
            "readonly"
        );


    const store =
        transaction.objectStore(
            CLIENTS_STORE
        );


    const request =
        store.get(id);


    request.onsuccess = () => {

        if (request.result) {

            openClientModal(
                request.result
            );

        }

    };

}


/* =========================================
   فتح سجل العميل
========================================= */

function openClientDetails(id) {

    const transaction =
        db.transaction(
            CLIENTS_STORE,
            "readonly"
        );


    const store =
        transaction.objectStore(
            CLIENTS_STORE
        );


    const request =
        store.get(id);


    request.onsuccess = () => {

        const client =
            request.result;


        if (!client) {

            alert(
                "لم يتم العثور على العميل."
            );

            return;

        }


        renderClientDetails(client);


        hideAllSections();


        document
            .getElementById("clientDetailsSection")
            .classList
            .remove("hidden");

    };

}


/* =========================================
   عرض سجل العميل
========================================= */

function renderClientDetails(client) {

    const container =
        document.getElementById(
            "clientDetails"
        );


    const createdDate =
        formatDate(client.createdAt);


    const updatedDate =
        formatDate(client.updatedAt);


    container.innerHTML = `

        <div class="client-profile">

            <div class="profile-header">

                <div>

                    <h2>

                        ${escapeHtml(
                            client.fullName
                        )}

                    </h2>

                    <p>
                        كود العميل:
                        <strong>
                            ${client.id}
                        </strong>
                    </p>

                </div>


                <button
                    class="primary-button"
                    id="detailsEditButton"
                >

                    تعديل البيانات

                </button>

            </div>


            <div class="profile-grid">


                <div class="profile-item">

                    <span>
                        الرقم القومي
                    </span>

                    <strong>
                        ${
                            escapeHtml(
                                client.nationalId ||
                                "غير مسجل"
                            )
                        }
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        الهاتف
                    </span>

                    <strong>
                        ${
                            escapeHtml(
                                client.phone1 ||
                                "غير مسجل"
                            )
                        }
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        هاتف آخر
                    </span>

                    <strong>
                        ${
                            escapeHtml(
                                client.phone2 ||
                                "غير مسجل"
                            )
                        }
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        واتساب
                    </span>

                    <strong>
                        ${
                            escapeHtml(
                                client.whatsapp ||
                                "غير مسجل"
                            )
                        }
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        المهنة
                    </span>

                    <strong>
                        ${
                            escapeHtml(
                                client.profession ||
                                "غير مسجل"
                            )
                        }
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        البريد الإلكتروني
                    </span>

                    <strong>
                        ${
                            escapeHtml(
                                client.email ||
                                "غير مسجل"
                            )
                        }
                    </strong>

                </div>


                <div class="profile-item full">

                    <span>
                        العنوان
                    </span>

                    <strong>
                        ${
                            escapeHtml(
                                client.address ||
                                "غير مسجل"
                            )
                        }
                    </strong>

                </div>


                <div class="profile-item full">

                    <span>
                        ملاحظات
                    </span>

                    <strong>
                        ${
                            escapeHtml(
                                client.notes ||
                                "لا توجد ملاحظات"
                            )
                        }
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        تاريخ الإضافة
                    </span>

                    <strong>
                        ${createdDate}
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        آخر تعديل
                    </span>

                    <strong>
                        ${updatedDate}
                    </strong>

                </div>


            </div>

        </div>

    `;


    document
        .getElementById("detailsEditButton")
        .addEventListener(
            "click",
            () => {

                openClientModal(client);

            }
        );

}


/* =========================================
   أرشفة العميل
========================================= */

function archiveClient(id) {

    if (
        !confirm(
            "هل تريد أرشفة هذا العميل؟"
        )
    ) {

        return;

    }


    const transaction =
        db.transaction(
            CLIENTS_STORE,
            "readwrite"
        );


    const store =
        transaction.objectStore(
            CLIENTS_STORE
        );


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


/* =========================================
   تنسيق التاريخ
========================================= */

function formatDate(value) {

    if (!value) {

        return "غير مسجل";

    }


    const date =
        new Date(value);


    if (isNaN(date.getTime())) {

        return "غير مسجل";

    }


    return date.toLocaleDateString(
        "ar-EG",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    );

}


/* =========================================
   حماية عرض النصوص
========================================= */

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}
