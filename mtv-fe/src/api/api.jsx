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
// tạo nghiên cứu khoa học 
export const createScientificResearch = async (data) => {
  const response = await api.post('/scientific_research/', data);
  return response.data;
};

// API: Lấy chi tiết nghiên cứu khoa học
export const fetchScientificResearchDetails = async (id) => {
  const response = await api.get(`/scientific_research/${id}`);
  return response.data;
};

// API: Cập nhật trạng thái nghiên cứu khoa học
export const updateScientificResearchStatus = async (id, payload) => {
  const response = await api.put(`/scientific_research/${id}`, payload);
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

// API: thông tin người dùng
export const fetchMe = async () => {
  const response = await api.get('/user/read_me/');
  return response.data;
};

// API: Lấy danh sách người dùng
export const fetchUsers = async () => {
  const response = await api.get('/user/'); 
  return response.data;
};

export const fetchUserDetails = async (id) => {
  const res = await api.get(`/user/${id}`);
  return res.data;
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
export const updateSponsorshipProposalStatus = async (id, updatedProposal) => {
  try {
    const response = await api.put(`/sponsorship_proposal/${id}`, updatedProposal); // Gửi toàn bộ payload
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật tài trợ:', error.response || error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// API: Gửi dữ liệu hoạt động nghiên cứu khoa học
export const submitScientificActivities = async (activity) => {
  try {
    const response = await api.post('/scientific_research_activities/', activity);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gửi dữ liệu hoạt động nghiên cứu:', error.response || error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// API: lấy danh sách hoạt động nghiên cứu khoa học
export const getListScientificActivities = async (activity) => {
  try {
    const response = await api.get('/scientific_research_activities/', activity);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gửi dữ liệu hoạt động nghiên cứu:', error.response || error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// tìm người dùng 
export const searchUsers = async (query) => {
  const response = await api.get(`/user/search/?q=${query}`);
  return response.data;
};

export const fetchUserScientificResearch = async (userId) => {
  const res = await api.get(`/user-scientific-research/user_sr?search=${userId}`);
  return res.data; 
}

export const uploadDocuments = async (id, file) => {
  const token = localStorage.getItem('access');
  const formData = new FormData();
  formData.append('file_zip', file);

  return api.put(
    `/scientific_research/${id}/update_data`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
};

export const uploadBanner = async (id, file) => {
  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  formData.append('file_banner', file);
  return axios.put(
    `/scientific_research/${id}/update_banner`,
    formData,
    {
      baseURL: 'http://localhost:8000',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
export const sendScientificProcessingRequest = async (id, data) => {
  const payload = {
    name: data.name,
    number_member: data.number_member,
    description: data.description,
    status: 'PROCESS', 
    quantity: data.quantity,
    time_volume: data.time_volume,
    documents: data.documents,
    data: data.data,
    sr_activities: data.sr_activities?.id || data.sr_activities,
  };
  console.log('Payload:', payload); 
  const response = await api.put(`/scientific_research/${id}`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
export default api;