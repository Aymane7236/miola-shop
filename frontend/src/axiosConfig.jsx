import axios from 'axios';

// En mode Docker : les chemins relatifs passent par le proxy nginx → backend
// En developpement local : definir VITE_API_URL=http://localhost:8080 dans .env
const baseURL = import.meta.env.VITE_API_URL || '';

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Authorization'] = 'Basic ' + btoa('admin:admin123');

export default axios;
