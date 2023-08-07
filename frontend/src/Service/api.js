import axios from "axios";

export const SERVER_URL = "http://localhost:3001";

const login = (data) => axios.post(`${SERVER_URL}/auth/login`, data);
const register = (data) => axios.post(`${SERVER_URL}/auth/register`, data);

const getMaingroups = () => axios.get(`${SERVER_URL}/maingroup/getMaingroups`);
const getSubgroups = () => axios.get(`${SERVER_URL}/subgroup/getSubgroups`);
const getProducts = (search, main, sub) => axios.get(`${SERVER_URL}/products/getList?search=${search}&main=${main}&sub=${sub}`);

export const ApiService = {
    login,
    register,
    getMaingroups,
    getSubgroups,
    getProducts
}