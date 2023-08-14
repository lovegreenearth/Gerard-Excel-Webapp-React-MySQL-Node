import axios from "axios";

export const SERVER_URL = "http://localhost:3001";

const login = (data) => axios.post(`${SERVER_URL}/auth/login`, data);
const register = (data) => axios.post(`${SERVER_URL}/auth/register`, data);

const getMaingroups = () => axios.get(`${SERVER_URL}/maingroup/getMaingroups`);
const getSubgroups = () => axios.get(`${SERVER_URL}/subgroup/getSubgroups`);
const getProducts = (search, main, sub) => axios.get(`${SERVER_URL}/products/getList?search=${search}&main=${main}&sub=${sub}`);
const addProduct = (data) => axios.post(`${SERVER_URL}/products/add`, data);
const editProduct = (id, data) => axios.put(`${SERVER_URL}/products/edit/${id}`, data);
const deleteProduct = (id) => axios.delete(`${SERVER_URL}/products/delete/${id}`);
const getProductById = (id) => axios.get(`${SERVER_URL}/products/${id}`);

export const ApiService = {
    login,
    register,
    getMaingroups,
    getSubgroups,
    getProducts,
    addProduct,
    deleteProduct,
    getProductById,
    editProduct
}