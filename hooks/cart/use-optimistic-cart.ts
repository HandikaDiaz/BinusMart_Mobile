import { Cart } from '@/constants/type';
import { useCallback, useState } from 'react';

interface OptimisticCartState {
    quantities: Record<string, number>;
    removedItems: string[];
}

export default function useOptimisticCartManager() {
    const [optimisticState, setOptimisticState] = useState<OptimisticCartState>({
        quantities: {},
        removedItems: []
    });

    const updateQuantity = useCallback((cartId: string, quantity: number) => {
        setOptimisticState(prev => ({
            ...prev,
            quantities: { ...prev.quantities, [cartId]: quantity }
        }));
    }, []);

    const removeItem = useCallback((cartId: string) => {
        setOptimisticState(prev => {
            const newQuantities = { ...prev.quantities };
            delete newQuantities[cartId];

            return {
                quantities: newQuantities,
                removedItems: [...prev.removedItems, cartId]
            };
        });
    }, []);

    const rollbackRemove = useCallback((cartId: string) => {
        setOptimisticState(prev => ({
            ...prev,
            removedItems: prev.removedItems.filter(id => id !== cartId)
        }));
    }, []);

    const clearQuantity = useCallback((cartId: string) => {
        setOptimisticState(prev => {
            const newQuantities = { ...prev.quantities };
            delete newQuantities[cartId];
            return { ...prev, quantities: newQuantities };
        });
    }, []);

    const clearAll = useCallback(() => {
        setOptimisticState({ quantities: {}, removedItems: [] });
    }, []);

    const applyOptimisticUpdates = useCallback((cartItems: Cart[]): Cart[] => {
        if (!cartItems) return [];

        return cartItems
            .filter(item => !optimisticState.removedItems.includes(item.id))
            .map(item => ({
                ...item,
                quantity: optimisticState.quantities[item.id] ?? item.quantity
            }));
    }, [optimisticState.quantities, optimisticState.removedItems]);

    return {
        optimisticQuantities: optimisticState.quantities,
        removedItems: optimisticState.removedItems,
        updateQuantity,
        removeItem,
        rollbackRemove,
        clearQuantity,
        clearAll,
        applyOptimisticUpdates
    };
}