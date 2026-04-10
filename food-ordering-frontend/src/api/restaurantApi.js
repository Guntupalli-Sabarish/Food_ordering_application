import axiosInstance from './axiosInstance';

export const getAllRestaurants = () => axiosInstance.get('/restaurants');
export const getRestaurantById = (id) => axiosInstance.get(`/restaurants/${id}`);
export const getMenuByRestaurant = (id) => axiosInstance.get(`/restaurants/${id}/menu`);
