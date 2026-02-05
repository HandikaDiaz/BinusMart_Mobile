import type { Cart } from '@/constants/type';
import { CartItemDTO, usePayment } from '@/hooks/cart/use-payment';
import { Lock, RefreshCw, Truck } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';

interface CartSummaryProps {
    cart: Cart[]
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    selectedCount: number;
    selectedItems: string[];
    isCheckingOut: boolean;
    onCheckout?: () => void;
}

export default function CartSummary({
    cart,
    total,
    subtotal,
    shipping,
    tax,
    selectedCount,
    selectedItems,
    isCheckingOut
}: CartSummaryProps) {
    const { handlePay } = usePayment();

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleCheckout = async () => {
        if (selectedCount === 0) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please select at least one item to checkout',
            });
            return;
        }

        const selectedCartItems = cart.filter(item =>
            selectedItems.includes(item.id)
        );

        const cartForPayment = selectedCartItems.map(item => ({
            id: item.id,
            name: item.variant.variantName,
            price: item.variant.price,
            quantity: item.quantity,
        }));

        const calculatedTotal = cartForPayment.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        ) + tax + shipping;

        if (Math.abs(total - calculatedTotal) > 100) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Payment validation error. Please refresh and try again.',
            });
            console.error('Total mismatch:', { total, calculatedTotal });
            return;
        }

        try {
            const paymentData: CartItemDTO = {
                totalAmount: total,
                cart: cartForPayment
            };

            await handlePay(paymentData);
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Order Summary</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.summaryList}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal ({selectedCount} items)</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(shipping)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tax (PPN 11%)</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                    </View>
                </View>

                <View style={styles.deliveryInfo}>
                    <View style={styles.deliveryHeader}>
                        <Truck size={16} color="#3b82f6" />
                        <Text style={styles.deliveryTitle}>Estimated Delivery</Text>
                    </View>
                    <Text style={styles.deliveryText}>
                        2-4 business days • Free shipping
                    </Text>
                </View>

                <View style={styles.paymentMethods}>
                    <Text style={styles.paymentTitle}>Payment Methods</Text>
                    <View style={styles.paymentIcons}>
                        {['💳', '🏦', '📱', '💵'].map((icon, index) => (
                            <View key={index} style={styles.paymentIcon}>
                                <Text style={styles.paymentIconText}>{icon}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.checkoutButton,
                        (selectedCount === 0 || isCheckingOut) && styles.checkoutButtonDisabled
                    ]}
                    onPress={handleCheckout}
                    disabled={selectedCount === 0 || isCheckingOut}
                >
                    {isCheckingOut ? (
                        <>
                            <RefreshCw size={20} color="white" />
                            <Text style={styles.checkoutButtonText}>Processing...</Text>
                        </>
                    ) : (
                        <>
                            <Lock size={20} color="white" />
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.termsText}>
                    By completing your purchase, you agree to our Terms of Service
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    content: {
        padding: 20,
    },
    summaryList: {
        gap: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 8,
    },
    totalRow: {
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    deliveryInfo: {
        backgroundColor: '#dbeafe',
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
    },
    deliveryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    deliveryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e40af',
    },
    deliveryText: {
        fontSize: 14,
        color: '#374151',
    },
    paymentMethods: {
        marginTop: 16,
    },
    paymentTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 8,
    },
    paymentIcons: {
        flexDirection: 'row',
        gap: 8,
    },
    paymentIcon: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    paymentIconText: {
        fontSize: 16,
    },
    footer: {
        padding: 20,
        paddingTop: 0,
        gap: 12,
    },
    checkoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 8,
    },
    checkoutButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    checkoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    termsText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 16,
    },
});