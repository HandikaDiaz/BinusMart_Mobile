import api from "@/api/api";
import { Products } from "@/constants/type";
import { useQuery } from "@tanstack/react-query";

export default function useGetProductDetails(id: string) {
    async function getProductDetails() {
        const res = await api.get(`/product/${id}`);
        return res.data.data;
    };

    const { data, isLoading } = useQuery<Products, null, Products>({
        queryKey: ['product', id],
        queryFn: getProductDetails,
        enabled: !!id,
        staleTime: 0,
    });

    return {
        data,
        isLoading
    };
};