import api from "@/api/api";
import type { Products } from "@/constants/type";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllProduct() {
    async function getProducts() {
        const res = await api.get("/product/all");
        return res.data.data;
    };

    const { data, isLoading, refetch, isRefetching } = useQuery<Products[], null, Products[]>({
        queryKey: ['products'],
        queryFn: getProducts,
        staleTime: 0,
    });

    return {
        data,
        isLoading,
        refetch,
        isRefetching
    };
};

export function useGetAllProductUser() {
    async function getProducts() {
        const res = await api.get("/product/my-product");
        return res.data.data;
    };

    const { data, isLoading, refetch, isRefetching } = useQuery<Products[], null, Products[]>({
        queryKey: ['myProduct'],
        queryFn: getProducts,
        staleTime: 0,
    });

    return {
        data,
        isLoading,
        refetch,
        isRefetching
    };
};