import Axios from 'axios'
import { backendUrl } from '@config';

const axios = Axios.create({
    baseURL: backendUrl,
    headers: {
        'Accept': "application/json",
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true,
})

export default axios
