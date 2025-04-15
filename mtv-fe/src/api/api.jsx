import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000, 
});

// Interceptor để thêm access token vào header
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý khi access token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        const response = await axios.post('http://localhost:8000/auth/refresh', {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        localStorage.setItem('access', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

// API: Lấy danh sách nghiên cứu khoa học
export const fetchScientificResearch = async () => {
  const response = await api.get('/scientific_research/');
  return response;
};

// API: Lấy chi tiết nghiên cứu khoa học
export const fetchScientificResearchDetails = async (id) => {
  const response = await api.get(`/scientific_research/${id}`);
  return response.data;
};

// API: Cập nhật trạng thái nghiên cứu khoa học
export const updateScientificResearchStatus = async (id, payload) => {
  const response = await api.put(`/scientific_research/${id}/`, payload);
  return response.data;
};

// API: Lấy danh sách nghiên cứu theo trạng thái
export const fetchScientificResearchByStatus = async (status) => {
  const response = await api.get(`/scientific_research/?status=${status}`);
  return response.data;
};

// API: Đăng nhập
export const login = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);
  return response.data;
};

// API: Làm mới token
export const refreshToken = async (refreshToken) => {
  const response = await api.post('/auth/refresh', { refresh: refreshToken });
  return response.data;
};

// API: Xác minh token
export const verifyToken = async (token) => {
  const response = await api.post('/auth/verify', { token });
  return response.data;
};

// API: Tạo tài khoản người dùng
export const createUser = async (userData) => {
  const response = await api.post('/user/', userData); 
  return response.data;
};

// API: Lấy danh sách người dùng
export const fetchUsers = async () => {
  const response = await api.get('/user/'); 
  return response.data;
};


// API: Import danh sách người dùng từ CSV
export const importUsersFromCSV = async (formData) => {
  const response = await api.post('/user/admin/import-users/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchSponsorshipProposals = async () => {
  const response = await api.get('/sponsorship_proposal/');
  return response.data;
};

// API: Tạo mới đề xuất tài trợ
export const createSponsorshipProposal = async (proposalData) => {
  const response = await api.post('/sponsorship_proposal/', proposalData);
  return response.data;
};

// API: Lấy chi tiết đề xuất tài trợ
export const fetchSponsorshipProposalDetails = async (id) => {
  const response = await api.get(`/sponsorship_proposal/${id}`);
  return response.data;
};

// API: Cập nhật trạng thái đề xuất tài trợ
export const updateSponsorshipProposalStatus = async (id, status) => {
  const response = await api.put(`/sponsorship_proposal/${id}/`, { status });
  return response.data;
};
export default api;