const API_URL = "http://127.0.0.1:5000/api";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Login failed with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server. Please ensure the backend is running on port 5000.");
        }
        throw error;
    }
};

export const registerUser = async (name, email, password, role) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Registration failed with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server. Please ensure the backend is running on port 5000.");
        }
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
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server. Please ensure the backend is running on port 5000.");
        }
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
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server.");
        }
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
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server.");
        }
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
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server.");
        }
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
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server.");
        }
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
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server.");
        }
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
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server.");
        }
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
