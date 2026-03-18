const normalizeBaseUrl = (value) => (value ? String(value).replace(/\/+$/, "") : "");

// Prefer CRA dev proxy (package.json "proxy") by default by using a relative URL.
// For deployments where the API is hosted elsewhere, set `REACT_APP_API_URL`.
const resolveApiBase = () => {
    const base = normalizeBaseUrl(process.env.REACT_APP_API_URL);
    // Allow `REACT_APP_API_URL` to be set to either `https://host` or `https://host/api`.
    if (base) return base.replace(/\/api$/i, "");

    // In development, default to the local backend port directly. This avoids relying on the CRA proxy
    // (which requires restarting `npm start` after config changes) and makes the target explicit.
    if (process.env.NODE_ENV === "development") {
        if (typeof window !== "undefined" && window.location?.hostname) {
            return `http://${window.location.hostname}:5000`;
        }
        return "http://localhost:5000";
    }

    // In production, prefer same-origin `/api` (or set `REACT_APP_API_URL`).
    return "";
};

const API_URL = `${resolveApiBase()}/api`;

const isFetchNetworkError = (error) => {
    const message = String(error?.message || "");
    return error?.name === "TypeError" && /Failed to fetch|NetworkError|Load failed/i.test(message);
};

const apiUrlForError = () => {
    try {
        if (typeof window !== "undefined" && window.location?.origin) {
            return new URL(API_URL, window.location.origin).toString();
        }
    } catch { }
    return API_URL;
};

const requestUrlForError = (url) => {
    try {
        if (typeof window !== "undefined" && window.location?.origin) {
            return new URL(url, window.location.origin).toString();
        }
    } catch { }
    return url;
};

const buildConnectionError = () =>
    new Error(
        `Cannot connect to server at ${apiUrlForError()}. If you're running locally, start the backend with \`npm run backend\` (port 5000).`
    );

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const loginUser = async (email, password) => {
    const endpoint = `${API_URL}/auth/login`;
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const url = requestUrlForError(endpoint);
            const details =
                response.status === 404
                    ? " (check backend route `/api/auth/login` and ensure `REACT_APP_API_URL` is not set to include `/api`)"
                    : "";
            throw new Error(errorData.error || `Login failed with status: ${response.status} at ${url}${details}`);
        }

        return await response.json();
    } catch (error) {
        if (isFetchNetworkError(error)) throw buildConnectionError();
        throw error;
    }
};

export const registerUser = async (name, email, password, role) => {
    const endpoint = `${API_URL}/auth/register`;
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const url = requestUrlForError(endpoint);
            const details =
                response.status === 404
                    ? " (check backend route `/api/auth/register` and ensure `REACT_APP_API_URL` is not set to include `/api`)"
                    : "";
            throw new Error(errorData.error || `Registration failed with status: ${response.status} at ${url}${details}`);
        }

        return await response.json();
    } catch (error) {
        if (isFetchNetworkError(error)) throw buildConnectionError();
        throw error;
    }
};

export const markAttendance = async (studentId, status) => {
    try {
        const response = await fetch(`${API_URL}/attendance/mark`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ studentId, status }),
        });
        if (!response.ok) throw new Error(`Failed to mark attendance: ${response.status}`);
        return response.json();
    } catch (error) {
        if (isFetchNetworkError(error)) throw buildConnectionError();
        throw error;
    }
};

export const getAttendance = async (studentId) => {
    try {
        const response = await fetch(`${API_URL}/attendance/${studentId}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error(`Failed to fetch attendance: ${response.status}`);
        return response.json();
    } catch (error) {
        if (isFetchNetworkError(error)) throw buildConnectionError();
        throw error;
    }
};

export const getAllAttendance = async () => {
    try {
        const response = await fetch(`${API_URL}/attendance`, {
            headers: getHeaders(),
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/"; // Redirect to login
            throw new Error("Session expired. Please log in again.");
        }

        if (!response.ok) throw new Error(`Failed to fetch all attendance: ${response.status}`);
        return response.json();
    } catch (error) {
        if (isFetchNetworkError(error)) throw buildConnectionError();
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
        return response.json();
    } catch (error) {
        if (isFetchNetworkError(error)) throw buildConnectionError();
        throw error;
    }
};

export const updateLocation = async (lat, lng) => {
    try {
        const response = await fetch(`${API_URL}/driver/location`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ lat, lng }),
        });
        if (!response.ok) throw new Error(`Failed to update location: ${response.status}`);
        return response.json();
    } catch (error) {
        if (isFetchNetworkError(error)) throw buildConnectionError();
        throw error;
    }
};

export const getDriverLocation = async (driverId) => {
    try {
        const response = await fetch(`${API_URL}/driver/location/${driverId}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error(`Failed to fetch driver location: ${response.status}`);
        return response.json();
    } catch (error) {
        if (isFetchNetworkError(error)) throw buildConnectionError();
        throw error;
    }
};


export const getUserProfile = async () => {
    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        return response.json();
    } catch (error) {
        console.error("Get Profile Error:", error);
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            method: "PUT",
            headers: {
                ...getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Profile update failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (isFetchNetworkError(error)) throw buildConnectionError();
        throw error;
    }
};

export const getBuses = async () => {
    try {
        const response = await fetch(`${API_URL}/buses`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Failed to fetch buses");
        return response.json();
    } catch (error) { throw error; }
};

export const addBus = async (busData) => {
    try {
        const response = await fetch(`${API_URL}/buses`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(busData)
        });
        if (!response.ok) throw new Error("Failed to add bus");
        return response.json();
    } catch (error) { throw error; }
};

export const deleteBus = async (id) => {
    try {
        const response = await fetch(`${API_URL}/buses/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Failed to delete bus");
        return response.json();
    } catch (error) { throw error; }
};
export const getStudents = async () => {
    try {
        const response = await fetch(`${API_URL}/students`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        return Array.isArray(data)
            ? data.map((s) => ({ ...s, id: s.id || s._id }))
            : data;
    } catch (error) { throw error; }
};

export const getTeachers = async () => {
    try {
        const response = await fetch(`${API_URL}/teachers`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Failed to fetch teachers");
        return response.json();
    } catch (error) { throw error; }
};

export const getDrivers = async () => {
    try {
        const response = await fetch(`${API_URL}/drivers`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Failed to fetch drivers");
        return response.json();
    } catch (error) { throw error; }
};

export const getFinanceSummary = async () => {
    try {
        const response = await fetch(`${API_URL}/finance/summary`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Failed to fetch finance summary");
        return response.json();
    } catch (error) { throw error; }
};

export const generateAttendanceOtp = async () => {
    try {
        const response = await fetch(`${API_URL}/attendance/otp/generate`, {
            method: "POST",
            headers: getHeaders()
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Failed to generate OTP");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const verifyAttendanceOtp = async (code) => {
    try {
        const response = await fetch(`${API_URL}/attendance/otp/verify`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ code })
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "OTP verification failed");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const getAnalytics = async () => {
    try {
        const response = await fetch(`${API_URL}/analytics`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Failed to fetch analytics");
        return response.json();
    } catch (error) { throw error; }
};

export const createFeedback = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/feedback`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Failed to submit feedback");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const getMyFeedback = async () => {
    try {
        const response = await fetch(`${API_URL}/feedback/my`, {
            headers: getHeaders()
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Failed to fetch your feedback");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const getAllFeedback = async () => {
    try {
        const response = await fetch(`${API_URL}/feedback`, {
            headers: getHeaders()
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Failed to fetch feedback");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const replyFeedback = async (feedbackId, payload) => {
    try {
        const response = await fetch(`${API_URL}/feedback/${feedbackId}/reply`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Failed to reply feedback");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const updateMonthlyStats = async (monthKeyOrPayload, present, absent) => {
    try {
        const payload = typeof monthKeyOrPayload === "object"
            ? monthKeyOrPayload
            : { monthKey: monthKeyOrPayload, present, absent };
        const response = await fetch(`${API_URL}/analytics/monthly`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to update monthly stats");
        return response.json();
    } catch (error) { throw error; }
};

export const getAnnouncements = async () => {
    try {
        const response = await fetch(`${API_URL}/announcements`, { headers: getHeaders() });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || err.message || "Failed to fetch announcements");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const createAnnouncement = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/announcements`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || err.message || "Failed to create announcement");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const deleteAnnouncement = async (id) => {
    try {
        const response = await fetch(`${API_URL}/announcements/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || err.message || "Failed to delete announcement");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const getWeatherUpdate = async () => {
    try {
        const response = await fetch(`${API_URL}/weather`, { headers: getHeaders() });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || err.message || "Failed to fetch weather update");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const updateWeather = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/weather`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || err.message || "Failed to update weather");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const updateStudentFees = async (studentId, feeData) => {
    try {
        const response = await fetch(`${API_URL}/students/${studentId}/fees`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(feeData)
        });
        if (!response.ok) throw new Error("Failed to update student fees");
        return response.json();
    } catch (error) { throw error; }
};

export const updateBus = async (busId, busData) => {
    try {
        const response = await fetch(`${API_URL}/buses/${busId}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(busData)
        });
        if (!response.ok) throw new Error("Failed to update bus");
        return response.json();
    } catch (error) { throw error; }
};

export const setRouteFees = async (busId, feeAmount) => {
    try {
        const response = await fetch(`${API_URL}/buses/${busId}/route-fees`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ feeAmount })
        });
        if (!response.ok) throw new Error("Failed to set route fees");
        return response.json();
    } catch (error) { throw error; }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error("Failed to update user");
        return response.json();
    } catch (error) { throw error; }
};

export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Failed to delete user");
        return response.json();
    } catch (error) { throw error; }
};

export const createDamageReport = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/damages`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errJson = await response.json().catch(() => null);
            const errText = errJson ? "" : await response.text().catch(() => "");
            const message =
                errJson?.error ||
                (errText ? errText.slice(0, 180) : "") ||
                `Failed to submit damage report (status ${response.status})`;
            throw new Error(message);
        }
        return response.json();
    } catch (error) { throw error; }
};

export const getDamageReports = async () => {
    try {
        const response = await fetch(`${API_URL}/damages`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Failed to fetch damage reports");
        return response.json();
    } catch (error) { throw error; }
};

export const getDamageReport = async (id) => {
    try {
        const response = await fetch(`${API_URL}/damages/${encodeURIComponent(id)}`, { headers: getHeaders() });
        if (!response.ok) {
            const errJson = await response.json().catch(() => null);
            throw new Error(errJson?.error || `Failed to fetch damage report (status ${response.status})`);
        }
        return response.json();
    } catch (error) { throw error; }
};

export const createLeaveRequest = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/leaves`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Failed to submit leave");
        }
        return response.json();
    } catch (error) { throw error; }
};

export const getLeaveRequests = async (role) => {
    try {
        const url = role ? `${API_URL}/leaves?role=${encodeURIComponent(role)}` : `${API_URL}/leaves`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error("Failed to fetch leaves");
        return response.json();
    } catch (error) { throw error; }
};

export const updateLeaveStatus = async (id, status) => {
    try {
        const response = await fetch(`${API_URL}/leaves/${id}/status`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error("Failed to update leave status");
        return response.json();
    } catch (error) { throw error; }
};

export const updateDamageStatus = async (id, payload) => {
    try {
        const response = await fetch(`${API_URL}/damages/${id}/status`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to update damage status");
        return response.json();
    } catch (error) { throw error; }
};

export const updateDamagePayment = async (id, payload) => {
    try {
        const response = await fetch(`${API_URL}/damages/${id}/payment`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to update payment");
        return response.json();
    } catch (error) { throw error; }
};
