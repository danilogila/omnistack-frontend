import axios from 'axios';

const api = axios.create({
  baseURL: 'https://omnistack-backend-danilo.herokuapp.com',
});

export default api;
