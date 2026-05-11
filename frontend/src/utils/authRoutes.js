export const ROLE_DASHBOARD_PATHS = {
    admin: '/admin',
    student: '/student',
    technician: '/technician'
};

export const normalizeRole = (role) => String(role || '').trim().toLowerCase();

export const getDashboardPathForRole = (role) => ROLE_DASHBOARD_PATHS[normalizeRole(role)] || null;

export const normalizeAuthUser = (user) => {
    if (!user) return null;

    return {
        ...user,
        role: normalizeRole(user.role)
    };
};
