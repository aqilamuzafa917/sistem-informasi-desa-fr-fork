import { API_CONFIG } from "../../config/api";

const response = await axios.get(`${API_CONFIG.baseURL}/api/pengaduan`, {
  headers: {
    ...API_CONFIG.headers,
    Authorization: `Bearer ${token}`,
  },
});

const response = await axios.get(`${API_CONFIG.baseURL}/api/pengaduan/stats`, {
  headers: {
    ...API_CONFIG.headers,
    Authorization: `Bearer ${token}`,
  },
});
