import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for HttpOnly cookies
});

// Request interceptor to add Access Token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); // Or from state. Storing in LS for simplicity of restoration for now, usually memory is safer but complexity increases.
        // Wait, requirement: "passed via headers". 
        // Ideally memory, but for reload persistence we need refresh flow on boot.
        // I will use memory in Context, but here I need a way to get it.
        // I'll attach it in the Context/Component interaction or use a variable exported from a store.
        // For now, let's assume the AuthContext will set the default header on axios instance when it changes.
        return config;
    },
    (error) => Promise.reject(error)
);

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post('/auth/refresh');
                const newAccessToken = data.accessToken;

                setAuthToken(newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                window.dispatchEvent(new CustomEvent('accessTokenRefreshed', { detail: newAccessToken }));

                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed (token expired/invalid)
                window.dispatchEvent(new Event('authLogout'));
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Add method calls to the default export object
const apiService = {
    ...api,
    // Auth
    login: (credentials: any) => api.post('/auth/login', credentials),
    register: (data: any) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    refreshToken: () => api.post('/auth/refresh'),

    // Users (Admin)
    getUsers: () => api.get('/users'),
    updateUserRole: (id: string, role: string) => api.put(`/users/${id}/role`, { role }),

    // Posts
    getPosts: () => api.get('/posts'),
    getPostBySlug: (slug: string) => api.get(`/posts/slug/${slug}`),
    createPost: (data: any) => api.post('/posts', data),
    updatePost: (id: string, data: any) => api.put(`/posts/${id}`, data),
    deletePost: (id: string) => api.delete(`/posts/${id}`),

    // Comments
    getComments: (postId: string) => api.get(`/posts/${postId}/comments`),
    createComment: (postId: string, content: string) => api.post(`/posts/${postId}/comments`, { content }),

    // Helper to expose axios instance methods if needed directly, though above covers use cases
    get: api.get,
    post: api.post,
    put: api.put,
    delete: api.delete,
};

export default apiService;
