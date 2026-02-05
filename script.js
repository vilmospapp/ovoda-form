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
    /* ----------------------------
       1. VALIDATION
    ----------------------------- */
    const missing = [];
    const requiredInputs = container.querySelectorAll("[data-required]");

    requiredInputs.forEach(input => {
        if (!input.value || !input.value.trim()) {
            missing.push(input.dataset.label || "Ismeretlen mező");
        }
    });

    if (missing.length > 0) {
        alert(
            "A nyomtatás nem lehetséges.\n\nHiányzó adatok:\n" +
            missing.map(m => "– " + m).join("\n")
        );
        return; // 🚫 STOP export
    }

    /* ----------------------------
       2. PREPARE FILENAME (DATE)
    ----------------------------- */
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const fileName = `szuloi_igazolas_${yyyy}-${mm}-${dd}.png`;

    /* ----------------------------
       3. INPUT → SPAN REPLACEMENT
    ----------------------------- */
    const inputs = container.querySelectorAll("input:not(#alairas)");
    const replacements = [];

    // Replace inputs with divs
    inputs.forEach(input => {
        const span = document.createElement("span");
        span.className = "print-text";
        span.textContent = input.value || " ";

        // Copy size & alignment
        const style = getComputedStyle(input);
        span.style.display = style.display === "block" ? "block" : "inline-block";
        span.style.width = style.width;
        span.style.height = style.height;
        span.style.textAlign = style.textAlign;
        span.style.borderBottom = style.borderBottom;
        span.style.padding = style.padding;
        span.style.margin = style.margin;

        input.style.display = "none";
        input.parentNode.insertBefore(span, input);
        replacements.push({ input, span });
    });

    container.classList.add("hide-buttons");

    /* ----------------------------
       4. CANVAS EXPORT
    ----------------------------- */
    html2canvas(container).then(canvas => {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = canvas.toDataURL("image/png");
        link.click();
        //container.classList.remove("hide-buttons");
    }).finally(() => {
        console.log("Finally....");
        // 🔁 ALWAYS restore original inputs
        replacements.forEach(({ input, span }) => {
            span.remove();
            input.style.display = "";
        });

        container.classList.remove("hide-buttons");
    });
}

loadStoredData();
