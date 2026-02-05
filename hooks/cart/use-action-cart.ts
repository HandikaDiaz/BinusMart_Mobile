import api from "@/api/api";
import type { Cart } from "@/constants/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import { useCallback, useMemo, useState } from "react";
import Toast from 'react-native-toast-message';

interface UpdateQuantityData {
    cartId: string;
    quantity: number;
};

interface UseCartActionsProps {
    cart: Cart[];
};

export default function useCartActions({ cart }: UseCartActionsProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const pendingCartItems = useMemo(() => {
        return cart.filter(item => item.status === 'PENDING');
    }, [cart]);

    const { subtotal, tax, total, shipping, selectedCount } = useMemo(() => {
        if (!pendingCartItems || pendingCartItems.length === 0 || selectedItems.length === 0) {
            return {
                subtotal: 0,
                tax: 0,
                total: 0,
                shipping: 0,
                selectedCount: 0
            };
        }

        const selectedPendingItems = pendingCartItems.filter(item =>
            selectedItems.includes(item.id)
        );

        const subtotal = selectedPendingItems.reduce(
            (sum, item) => sum + (item.variant.price * item.quantity),
            0
        );

        const tax = subtotal * 0.11;
        const shipping = selectedPendingItems.length > 0 ? 20000 : 0;
        const total = subtotal + tax + shipping;

        return {
            subtotal,
            tax,
            total,
            shipping,
            selectedCount: selectedPendingItems.length
        };
    }, [pendingCartItems, selectedItems]);

    const allSelected = useMemo(() => {
        if (!pendingCartItems || pendingCartItems.length === 0) return false;
        return pendingCartItems.length > 0 &&
            selectedItems.length === pendingCartItems.length &&
            pendingCartItems.every(item => selectedItems.includes(item.id));
    }, [pendingCartItems, selectedItems]);

    const handleSelectAll = useCallback((checked: boolean) => {
        if (!pendingCartItems || pendingCartItems.length === 0) return;

        if (checked) {
            const pendingItemIds = pendingCartItems.map(item => item.id);
            setSelectedItems(pendingItemIds);
        } else {
            setSelectedItems([]);
        }
    }, [pendingCartItems]);

    const handleSelectItem = useCallback((itemId: string, checked: boolean) => {
        const isPendingItem = pendingCartItems.some(item => item.id === itemId);

        if (!isPendingItem) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Cannot select non-pending items',
            });
            return;
        }

        if (checked) {
            setSelectedItems(prev => [...prev, itemId]);
        } else {
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        }
    }, [pendingCartItems]);

    const handleCheckout = useCallback(() => {
        if (selectedItems.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please select at least one item to checkout',
            });
            return;
        }

        setIsCheckingOut(true);
        Toast.show({
            type: 'success',
            text1: 'Processing',
            text2: 'Processing checkout...',
        });

        setTimeout(() => {
            setIsCheckingOut(false);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Checkout completed successfully!',
            });
        }, 2000);
    }, [selectedItems]);

    return {
        selectedItems,
        isCheckingOut,
        subtotal,
        tax,
        total,
        shipping,
        selectedCount,
        allSelected,
        handleSelectAll,
        handleSelectItem,
        handleCheckout,
        pendingCartItems
    };
};

export function useUpdateCart() {
    const queryClient = useQueryClient();

    const updateQuantityCart = async ({ cartId, quantity }: UpdateQuantityData) => {
        const token = await SecureStore.getItemAsync('token');
        const res = await api.put(`/cart/update-quantity/${cartId}`, { quantity }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.data;
    };

    const { mutateAsync: updateQuantityCartMutation } = useMutation({
        mutationFn: updateQuantityCart,
        onMutate: async (newData: UpdateQuantityData) => {
            await queryClient.cancelQueries({ queryKey: ['carts'] });

            const previousCarts = queryClient.getQueryData<Cart[]>(['carts']);

            queryClient.setQueryData(['carts'], (old: Cart[] | undefined) =>
                old?.map(item => item.id === newData.cartId
                    ? { ...item, quantity: newData.quantity }
                    : item
                )
            );

            return { previousCarts };
        },
        onError: (error: Error, _, context) => {
            const errorMessage = error.message || "Failed to update quantity";
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });

            if (context?.previousCarts) {
                queryClient.setQueryData(['carts'], context.previousCarts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['carts'] });
        }
    });

    return {
        updateQuantityCartMutation,
    };
};

export function useDeleteCart() {
    const queryClient = useQueryClient();

    const deleteCart = async (cartId: string) => {
        const token = await SecureStore.getItemAsync('token');
        const res = await api.delete(`/cart/remove/${cartId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.data;
    }

    return useMutation({
        mutationFn: deleteCart,
        onMutate: async (cartId: string) => {
            await queryClient.cancelQueries({ queryKey: ['carts'] });

            const previousCarts = queryClient.getQueryData<Cart[]>(['carts']);

            queryClient.setQueryData(['carts'], (old: Cart[] | undefined) =>
                old?.filter(item => item.id !== cartId)
            );

            return { previousCarts, deletedCartId: cartId };
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Item removed from cart',
            });
        },
        onError: (error: Error, _, context) => {
            const errorMessage = error.message || "Failed to remove item";
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });

            if (context?.previousCarts) {
                queryClient.setQueryData(['carts'], context.previousCarts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['carts'] });
        }
    });
}

export function useCreateCart() {
    const queryClient = useQueryClient();

    const createCart = async (cartData: { quantity: number; productId: string; variantId: string }) => {
        const token = await SecureStore.getItemAsync('token');
        const res = await api.post('/cart/create', cartData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.data;
    };

    return useMutation({
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
}