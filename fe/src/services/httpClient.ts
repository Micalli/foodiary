import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from '../config/localStorageKeys';

export const httpClient = axios.create({
  baseURL: "https://zt0fae3h95.execute-api.us-east-1.amazonaws.com",
});

