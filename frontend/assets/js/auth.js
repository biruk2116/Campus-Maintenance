const loginForm = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const user_code = formData.get("user_code").trim();
    const password = formData.get("password").trim();

    const res = await apiRequest("login", "POST", {
        user_code,
        password
    });

    if (!res.success) {
        if (messageEl) {
            messageEl.innerText = res.message;
        } else {
            alert(res.message);
        }
        return;
    }

    if (res.data?.action === "change_password") {
        window.location.href = "change-password.html";
        return;
    }

    if (res.data?.role === "admin") {
        window.location.href = "admin-dashboard.html";
        return;
    }

    if (res.data?.role === "student") {
        window.location.href = "student-dashboard.html";
        return;
    }

    if (res.data?.role === "technician") {
        window.location.href = "technician-dashboard.html";
        return;
    }

    if (messageEl) {
        messageEl.innerText = "Login successful";
    }
});