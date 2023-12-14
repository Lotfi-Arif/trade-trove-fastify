import aspida from '@aspida/axios';
import axios from 'axios';
import api from '../../../server/api/$api';

export const apiClient = api(aspida(axios.create({ withCredentials: true })));
