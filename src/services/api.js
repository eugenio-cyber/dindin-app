import axios from 'axios';

export default axios.create({
  baseURL: 'https://desafio-backend-03-dindin.herokuapp.com',
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' },
});
