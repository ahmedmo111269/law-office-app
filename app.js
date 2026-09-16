document.addEventListener("DOMContentLoaded", () => {

    const search = document.getElementById("globalSearch");

    search.addEventListener("input", () => {

        const value = search.value.trim();

        if (value.length > 0) {
            console.log("البحث عن:", value);
        }

    });


    const modules = document.querySelectorAll(".module");

    modules.forEach(module => {

        module.addEventListener("click", () => {

            const name =
                module.querySelector("strong").textContent;

            alert(
                "وحدة " + name +
                " سيتم بناؤها في المرحلة التالية."
            );

        });

    });

});
