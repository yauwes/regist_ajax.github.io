function showSpinner() {
    document.getElementById("spinner").classList.remove("hidden");
}
function hideSpinner() {
    document.getElementById("spinner").classList.add("hidden");
}

// VALIDASI NIM REAL-TIME
document.getElementById("studentNIM").addEventListener("input", async function () {
    const nim = this.value;
    const errorLabel = document.getElementById("nimError");

    if (nim.length !== 10) {
        errorLabel.textContent = "NIM harus 10 digit";
        return;
    }

    showSpinner();
    try {
        const res = await fetch("registered_nim.json");
        const registered = await res.json();
        if (registered.includes(nim)) {
            errorLabel.textContent = "NIM sudah terdaftar";
        } else {
            errorLabel.textContent = "";
        }
    } catch (err) {
        errorLabel.textContent = "Gagal memvalidasi NIM";
    } finally {
        hideSpinner();
    }
});

// AUTOCOMPLETE NAMA MAHASISWA
async function autocomplete(inputId, endpoint) {
    const input = document.getElementById(inputId);
    const list = document.getElementById("nameAutocompleteList");

    input.addEventListener("input", async function () {
        const val = this.value.trim();
        if (!val) return list.classList.add("hidden");

        showSpinner();
        try {
            const res = await fetch(endpoint);
            const names = await res.json();
            const filtered = names.filter(name => name.toLowerCase().includes(val.toLowerCase()));

            list.innerHTML = "";
            if (filtered.length === 0) {
                list.classList.add("hidden");
                return;
            }

            list.classList.remove("hidden");
            filtered.forEach(name => {
                const div = document.createElement("div");
                div.textContent = name;
                div.classList.add("cursor-pointer", "px-3", "py-2", "hover:bg-blue-100");
                div.addEventListener("click", () => {
                    input.value = name;
                    list.classList.add("hidden");
                });
                list.appendChild(div);
            });
        } catch (e) {
            console.error("Autocomplete error", e);
        } finally {
            hideSpinner();
        }
    });

    // Close dropdown jika klik luar
    document.addEventListener("click", function (e) {
        if (e.target !== input && !list.contains(e.target)) {
            list.classList.add("hidden");
        }
    });
}

autocomplete("studentName", "students.json");

// FORM SUBMISSION (SIMULASI AJAX)
document.getElementById("registrationForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const nimError = document.getElementById("nimError").textContent;
    if (nimError) {
        alert("Periksa kembali NIM Anda.");
        return;
    }

    showSpinner();

    const formData = {
        name: document.getElementById("studentName").value,
        nim: document.getElementById("studentNIM").value,
        course: document.getElementById("course").value,
        lecturer: document.getElementById("lecturer").value
    };

    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // delay simulasi
        alert(`✅ Registrasi berhasil!\nNama: ${formData.name}`);
        this.reset();
    } catch (e) {
        alert("❌ Gagal mengirim data.");
    } finally {
        hideSpinner();
    }
});
