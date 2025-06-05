import { API_CONFIG } from "../../config/api";

const response = await axios.get(`${API_CONFIG.baseURL}/api/artikel/${id}`, {
  headers: {
    ...API_CONFIG.headers,
    Authorization: `Bearer ${token}`,
  },
});

const response = await axios.put(
  `${API_CONFIG.baseURL}/api/artikel/${id}`,
  formData,
  {
    headers: {
      ...API_CONFIG.headers,
      Authorization: `Bearer ${token}`,
    },
  },
);
