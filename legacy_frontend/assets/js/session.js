async function checkSession(requiredRole = null) {
    const res = await apiRequest("checkSession", "GET");

    if (!res.success) {
        window.location.href = "login.html";
        return null;
    }

    if (requiredRole && res.data.role !== requiredRole) {
        alert("Access denied");
        window.location.href = "login.html";
        return null;
    }

    return res.data;
}