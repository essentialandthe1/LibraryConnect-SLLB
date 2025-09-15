import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });

export const getFolders = () => API.get('/folders/');
export const createFolder = (data) => API.post('/folders/create/', data);
