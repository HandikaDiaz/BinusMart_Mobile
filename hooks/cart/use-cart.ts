import api from "@/api/api";
import type { Cart } from "@/constants/type";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from "@tanstack/react-query";

export default function useCarts() {
    async function getMyCart() {
        const token = await AsyncStorage.getItem('token');
        const res = await api.get('/cart/get-my-cart', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data.data;
    };

    const { data, isLoading, refetch, isRefetching } = useQuery<Cart[]>({
        queryKey: ['carts'],
        queryFn: getMyCart
    });

    return {
        data,
        isLoading,
        refetch,
        isRefetching
    };
};