import api from "@/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

export interface CartDto {
    quantity: number;
    productId: string;
    variantId: string;
};

export default function useCreateCart() {
    const queryClient = useQueryClient();

    const createCart = async (cartData: CartDto) => {
        const token = await SecureStore.getItemAsync('token');
        const res = await api.post('/cart/create', cartData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data.data;
    };

    const { mutateAsync: createCartMutation, isPending, isSuccess, error } = useMutation({
        mutationFn: createCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['carts'] });
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Item added to cart',
            });
        },
        onError: (error: Error) => {
            const errorMessage = error.message || "Failed to add item to cart";
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });
        }
    });

    return {
        createCartAsync: createCartMutation,
        isCreating: isPending,
        isSuccess: isSuccess,
        error: error
    };
};