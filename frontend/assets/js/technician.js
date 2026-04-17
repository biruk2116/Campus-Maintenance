// 🔐 PROTECT PAGE
checkSession("technician");


// ========================
// LOAD ASSIGNED REQUESTS
// ========================
async function loadTasks() {

    const res = await apiRequest("getAssignedRequests");

    if (!res.success) {
        document.getElementById("tasks").innerText = res.message;
        return;
    }

    let html = "";

    res.data.forEach(task => {

        html += `
        <div style="border:1px solid black; margin:10px; padding:10px;">
            <b>${task.title}</b><br>
            Student: ${task.student_name}<br>
            Status: ${task.status}<br><br>

            <input type="number" id="progress_${task.id}" placeholder="Progress %" min="0" max="100"><br><br>
            <textarea id="message_${task.id}" placeholder="Update message"></textarea><br><br>

            <button onclick="update(${task.id})">Update Progress</button>
        </div>
        `;
    });

    document.getElementById("tasks").innerHTML = html;
}


// ========================
// UPDATE PROGRESS
// ========================
async function update(request_id) {

    const progress = document.getElementById(`progress_${request_id}`).value;
    const message = document.getElementById(`message_${request_id}`).value;

    if (progress === "" || message === "") {
        alert("Fill all fields");
        return;
    }

    const res = await apiRequest("updateProgress", "POST", {
        request_id,
        progress_percentage: progress,
        message
    });

    alert(res.message);
    loadTasks();
}


// ========================
// LOGOUT
// ========================
async function logout() {
    await apiRequest("logout");
    window.location.href = "login.html";
}


// INITIAL LOAD
loadTasks();