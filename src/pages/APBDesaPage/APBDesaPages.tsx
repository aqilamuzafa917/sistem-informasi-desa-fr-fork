import { API_CONFIG } from "../../config/api";

const response = await axios.get(`${API_CONFIG.baseURL}/api/apbdesa`, {
  headers: {
    ...API_CONFIG.headers,
    Authorization: `Bearer ${token}`,
  },
});

const response = await axios.post(
  `${API_CONFIG.baseURL}/api/apbdesa`,
  formData,
  {
    headers: {
      ...API_CONFIG.headers,
      Authorization: `Bearer ${token}`,
    },
  },
);
