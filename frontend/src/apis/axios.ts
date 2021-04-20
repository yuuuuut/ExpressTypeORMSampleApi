import axios from 'axios'

const baseURL = 'http://localhost:4000/api'

export const Axios = axios.create({
  baseURL: baseURL,
})
