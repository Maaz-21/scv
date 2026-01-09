const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Helper to get the token from localStorage
 */
const getAuthHeader = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
    }
    return {};
};

/**
 * Helper to handle response and throw errors for non-200 responses
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        // Try to parse error message from JSON, fallback to status text
        let errorMessage = response.statusText;
        try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
                errorMessage = errorData.error;
            } else if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (e) {
            // Ignore JSON parse error and use statusText
        }
        throw new Error(errorMessage);
    }
    // Return empty object for 204 No Content, else parsed JSON
    if (response.status === 204) return {};
    return response.json();
};

export const apiGet = async (url) => {
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });
    return handleResponse(res);
};

export const apiPost = async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const apiPostForm = async (url, formData) => {
    // Note: Do NOT set Content-Type header when sending FormData,
    // the browser setting it automatically with the correct boundary.
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            ...getAuthHeader(),
        },
        body: formData,
    });
    return handleResponse(res);
};

export const apiPatch = async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const apiPut = async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const apiDelete = async (url) => {
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });
    return handleResponse(res);
};
