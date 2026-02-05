import type { Cart, OrderStatus } from "@/constants/type";
import { useCallback, useMemo, useState } from "react";

interface UseOrdersProps {
    orders: Cart[] | undefined;
}

export default function useOrders({ orders }: UseOrdersProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'total_high' | 'total_low'>('newest');

    const filteredOrders = useMemo(() => {
        if (!orders || orders.length === 0) return [];

        return orders
            .filter((order) => {
                const statusMatch = statusFilter === 'ALL' || order.status === statusFilter;
                const searchMatch =
                    searchQuery === '' ||
                    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.variant.variantName.toLowerCase().includes(searchQuery.toLowerCase());

                return statusMatch && searchMatch;
            })
            .sort((a, b) => {
                const totalPriceA = a.variant.price * a.quantity;
                const totalPriceB = b.variant.price * b.quantity;

                switch (sortBy) {
                    case 'oldest':
                        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    case 'total_high':
                        return totalPriceB - totalPriceA;
                    case 'total_low':
                        return totalPriceA - totalPriceB;
                    case 'newest':
                    default:
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
            });
    }, [orders, searchQuery, statusFilter, sortBy]);

    const stats = useMemo(() => {
        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum, order) =>
            sum + (order.variant.price * order.quantity), 0
        ) || 0;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
            totalOrders,
            totalRevenue,
            averageOrderValue,
            filteredCount: filteredOrders.length,
        };
    }, [orders, filteredOrders]);

    const resetFilters = useCallback(() => {
        setSearchQuery('');
        setStatusFilter('ALL');
        setSortBy('newest');
    }, []);

    return {
        searchQuery,
        statusFilter,
        sortBy,
        filteredOrders,

        setSearchQuery,
        setStatusFilter,
        setSortBy,

        stats,

        resetFilters,
    };
}