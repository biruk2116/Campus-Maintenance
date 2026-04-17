const BASE_URL = "http://localhost/campus_maintenance/backend/index.php";

async function apiRequest(action, method = "POST", data = null) {
    let url = `${BASE_URL}?action=${encodeURIComponent(action)}`;
    const options = {
        method,
        credentials: "include"
    };

    if (method === "GET" && data) {
        url += `&${new URLSearchParams(data).toString()}`;
    }

    if (method === "POST") {
        options.headers = {
            "Content-Type": "application/json"
        };

        if (data) {
            options.body = JSON.stringify(data);
        }
    }

    const res = await fetch(url, options);
    return await res.json();
}