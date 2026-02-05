import CartHeader from '@/components/cart/cart-header';
import CartItemList from '@/components/cart/cart-item-list';
import CartSummary from '@/components/cart/cart-summary';
import CartEmptyState from '@/components/cart/empty-state';
import useCartActions, { useDeleteCart, useUpdateCart } from '@/hooks/cart/use-action-cart';
import useCarts from '@/hooks/cart/use-cart';
import useDebouncedCart from '@/hooks/cart/use-debounce-cart';
import useOptimisticCartManager from '@/hooks/cart/use-optimistic-cart';
import React, { useCallback, useEffect } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';

export default function CartView() {
    const { data: cart, isLoading } = useCarts();
    const optimisticManager = useOptimisticCartManager();
    const debouncedCart = useDebouncedCart();
    const optimisticCart = optimisticManager.applyOptimisticUpdates(cart || []);

    const {
        selectedItems,
        isCheckingOut,
        selectedCount,
        tax,
        subtotal,
        shipping,
        total,
        allSelected,
        handleSelectAll,
        handleSelectItem,
        handleCheckout,
    } = useCartActions({ cart: optimisticCart });

    const { updateQuantityCartMutation } = useUpdateCart();
    const { mutateAsync: deleteCart } = useDeleteCart();

    const handleQuantityChange = useCallback(async (cartId: string, newQuantity: number) => {
        optimisticManager.updateQuantity(cartId, newQuantity);

        try {
            await updateQuantityCartMutation({ cartId, quantity: newQuantity });
        } catch (error: any) {
            console.log(error);
            optimisticManager.clearQuantity(cartId);
        }
    }, [optimisticManager, updateQuantityCartMutation]);

    const handleRemoveItem = useCallback(async (cartId: string) => {
        debouncedCart.cancel(cartId);
        optimisticManager.removeItem(cartId);

        try {
            await deleteCart(cartId);
        } catch (error) {
            optimisticManager.rollbackRemove(cartId);
            throw error;
        }
    }, [optimisticManager, debouncedCart, deleteCart]);

    useEffect(() => {
        return () => debouncedCart.cancelAll();
    }, [debouncedCart]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (!optimisticCart || optimisticCart.length === 0) {
        return <CartEmptyState />;
    }

    const onlyPendingCart = optimisticCart.filter(item => item.status === 'PENDING');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <CartHeader
                    cart={onlyPendingCart}
                    selectedCount={selectedCount}
                    onCheckout={handleCheckout}
                    isCheckingOut={isCheckingOut}
                />

                <View style={styles.contentContainer}>
                    <View style={styles.itemsContainer}>
                        <CartItemList
                            cart={onlyPendingCart}
                            selectedItems={selectedItems}
                            allSelected={allSelected}
                            onSelectAll={handleSelectAll}
                            onSelectItem={handleSelectItem}
                            onQuantityChange={handleQuantityChange}
                            onRemoveItem={handleRemoveItem}
                            subtotal={subtotal}
                        />
                    </View>

                    <View style={styles.summaryContainer}>
                        <CartSummary
                            cart={optimisticCart}
                            subtotal={subtotal}
                            tax={tax}
                            shipping={shipping}
                            total={total}
                            selectedCount={selectedCount}
                            selectedItems={selectedItems}
                            isCheckingOut={isCheckingOut}
                            onCheckout={handleCheckout}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    contentContainer: {
        padding: 16,
    },
    itemsContainer: {
        marginBottom: 16,
    },
    summaryContainer: {
        marginBottom: 16,
    },
});