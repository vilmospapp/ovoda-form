const ovoda = document.getElementById("ovoda");
const gyermek = document.getElementById("gyermek");
const alairas = document.getElementById("alairas");
const saveBtn = document.getElementById("saveBtn");
const container = document.getElementById("form-container");

function loadStoredData() {
    ovoda.value = localStorage.getItem("ovoda") || "";
    gyermek.value = localStorage.getItem("gyermek") || "";
    alairas.value = localStorage.getItem("alairas") || "";

    if (ovoda.value || gyermek.value || alairas.value) {
        saveBtn.textContent = "Tárolt adatok törlése";
    }
}

saveBtn.addEventListener("click", () => {
    if (saveBtn.textContent.includes("Mentés")) {
        localStorage.setItem("ovoda", ovoda.value);
        localStorage.setItem("gyermek", gyermek.value);
        localStorage.setItem("alairas", alairas.value);
        saveBtn.textContent = "Tárolt adatok törlése";
        alert("Adatok elmentve a böngészőben.");
    } else {
        localStorage.clear();
        ovoda.value = "";
        gyermek.value = "";
        alairas.value = "";
        saveBtn.textContent = "Mentés";
    }
});

function clearForm() {
    document.querySelectorAll("input").forEach(input => {
        if (!["ovoda", "gyermek", "alairas"].includes(input.id)) {
            input.value = "";
        }
    });
}

function exportPNG() {
    container.classList.add("hide-buttons");

    html2canvas(container).then(canvas => {
        const link = document.createElement("a");
        link.download = "ovodai_igazolas.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        container.classList.remove("hide-buttons");
    });
}

loadStoredData();
