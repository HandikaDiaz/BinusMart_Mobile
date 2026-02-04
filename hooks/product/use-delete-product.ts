import api from "@/api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseDeleteProductProps {
    productId: string;
}

export default function useDeleteProduct({ productId }: UseDeleteProductProps) {
    const queryClient = useQueryClient();

    async function deleteProduct() {
        const token = await AsyncStorage.getItem('token');
        const res = await api.delete(`/product/delete/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    }

    const { mutateAsync: deleteProductAsync, isPending: isDeleting } = useMutation({
        mutationKey: ['deleteProduct', productId],
        mutationFn: deleteProduct,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["products"] });
            await queryClient.invalidateQueries({ queryKey: ["product"] });
            await queryClient.invalidateQueries({ queryKey: ["myProduct"] });
        },
        onError: (error: any) => {
            console.error('Error deleting product:', error);
            throw error;
        }
    });

    return {
        isDeleting,
        deleteProductAsync,
    };
}