
// 🔐 PROTECT PAGE
checkSession("admin");

// ========================
// CREATE USER
// ========================
document.getElementById("createUserForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    const res = await apiRequest("createUser", "POST", {
        name: formData.get("name"),
        email: formData.get("email"),
        user_code: formData.get("user_code"),
        role: formData.get("role")
    });

    const msg = document.getElementById("userMsg");

    if (res.success) {
        msg.innerText = `User created. Temp Password: ${res.data.temporary_password}`;
    } else {
        msg.innerText = res.message;
    }
});


// ========================
// LOAD REQUESTS
// ========================
async function loadRequests() {
    const res = await apiRequest("getAllRequests", "POST");

    if (!res.success) {
        document.getElementById("requests").innerText = res.message;
        return;
    }

    let html = "";

    for (let r of res.data) {
        html += `
            <div style="border:1px solid black; margin:10px; padding:10px;">
                <b>${r.title}</b><br>
                Student: ${r.student_name}<br>
                Status: ${r.status}<br>

                ${r.technician_id ? "Assigned" : `
                    <select id="tech_${r.id}">
                        <option value="">Select Technician</option>
                    </select>
                    <button onclick="assign(${r.id})">Assign</button>
                `}
            </div>
        `;
    }

    document.getElementById("requests").innerHTML = html;

    loadTechnicians();
}


// ========================
// LOAD TECHNICIANS INTO SELECT
// ========================
async function loadTechnicians() {

    const res = await apiRequest("getTechnicians");

    if (!res.success) return;

    const selects = document.querySelectorAll("select[id^='tech_']");

    selects.forEach(select => {
        res.data.forEach(t => {
            let option = document.createElement("option");
            option.value = t.id;
            option.text = t.name;
            select.appendChild(option);
        });
    });
}


// ========================
// ASSIGN TECHNICIAN
// ========================
async function assign(request_id) {

    const select = document.getElementById(`tech_${request_id}`);
    const technician_id = select.value;

    if (!technician_id) {
        alert("Select technician first");
        return;
    }

    const res = await apiRequest("assignTechnician", "POST", {
        request_id,
        technician_id
    });

    alert(res.message);
    loadRequests();
}


// ========================
// LOGOUT
// ========================
async function logout() {
    await apiRequest("logout");
    window.location.href = "login.html";
}


// INITIAL LOAD
loadRequests();