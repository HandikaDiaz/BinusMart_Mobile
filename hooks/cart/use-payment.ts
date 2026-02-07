import api from "@/api/api";
import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

export interface CartItemDTO {
    totalAmount: number;
    cart: {
        id: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    platform: 'mobile';
};

interface StockReductionItem {
    variantId?: string;
    quantity: number;
}

declare global {
    interface Window {
        snap?: {
            pay: (
                token: string,
                options: {
                    onSuccess?: (result: any) => void;
                    onPending?: (result: any) => void;
                    onError?: (result: any) => void;
                    onClose?: () => void;
                }
            ) => void;
        };
    }
}

interface PaymentResult {
    success: boolean;
    message?: string;
    token?: string;
    paymentUrl?: string;
}

interface PaymentVerificationResult {
    success: boolean;
    status?: string;
    message?: string;
    transactionId?: string;
    orderId?: string;
}

export function usePayment() {
    const queryClient = useQueryClient();

    const getToken = async () => {
        return await SecureStore.getItemAsync('token');
    };

    const loadSnapScript = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined') {
                resolve();
                return;
            }

            if (window.snap) {
                resolve();
                return;
            }

            const existingScript = document.querySelector('script[src*="midtrans"]');
            if (existingScript) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', 'SB-Mid-client-xxxxxxxxxxxx');
            script.async = true;

            script.onload = () => {
                resolve();
            };

            script.onerror = (error) => {
                reject(new Error('Failed to load payment gateway'));
            };

            document.head.appendChild(script);
        });
    };

    const updateCartStatus = async (cartItems: { id: string }[], token: string) => {
        try {
            const updatePromises = cartItems.map(item =>
                api.put(`/cart/update-status/${item.id}`, {
                    status: 'PROCESSING',
                    updatedAt: new Date().toISOString()
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).catch(error => {
                    console.error(`Failed to update item ${item.id}:`, error);
                    throw error;
                })
            );

            const results = await Promise.allSettled(updatePromises);
            const failedUpdates = results.filter(result =>
                result.status === 'rejected'
            );

            if (failedUpdates.length > 0) {
                console.error(`Failed to update ${failedUpdates.length} items`);
                throw new Error(`Failed to update ${failedUpdates.length} cart items`);
            }

            queryClient.invalidateQueries({ queryKey: ['carts'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        } catch (error: any) {
            console.error('Error updating cart status:', error);
            throw new Error(`Cart update failed: ${error.message}`);
        }
    };

    const reduceQuantity = async (stockItems: StockReductionItem[], token: string) => {
        try {
            const reducePromises = stockItems.map(item =>
                api.put(`/payment/reduce-stock`, {
                    variantId: item.variantId,
                    quantity: item.quantity
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).catch(error => {
                    console.error(`Failed to reduce quantity for variant ${item.variantId}:`, error);
                    throw error;
                })
            );

            const results = await Promise.allSettled(reducePromises);
            const failedUpdates = results.filter(result =>
                result.status === 'rejected'
            );

            if (failedUpdates.length > 0) {
                console.error(`Failed to reduce quantity for ${failedUpdates.length} variants`);
                throw new Error(`Failed to reduce quantity for ${failedUpdates.length} variants`);
            }

            queryClient.invalidateQueries({ queryKey: ['variants'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['carts'] });

            return { success: true, message: 'Stock reduced successfully' };
        } catch (error: any) {
            console.error('Error reducing stock:', error);
            throw new Error(`Stock reduction failed: ${error.message}`);
        }
    };

    const verifyPaymentStatus = async (snapToken: string): Promise<PaymentVerificationResult> => {
        try {
            const token = await getToken();
            if (!token) {
                return {
                    success: false,
                    message: 'Authentication required'
                };
            }

            const response = await api.get(`/payment/verify/${snapToken}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                },
                timeout: 10000
            });

            if (response.data.success) {
                return {
                    success: true,
                    status: response.data.data.status,
                    transactionId: response.data.data.transaction_id,
                    orderId: response.data.data.order_id,
                    message: response.data.message
                };
            } else {
                return {
                    success: false,
                    status: response.data.data?.status,
                    message: response.data.message || 'Verification failed'
                };
            }
        } catch (error: any) {
            console.error('Error verifying payment status:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Verification error'
            };
        }
    };

    const generatePayment = async (data: CartItemDTO): Promise<PaymentResult> => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const resPayment = await api.post(`/payment/transaction`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            });

            if (!resPayment.data.data?.token) {
                throw new Error('No payment token received from server');
            }

            const snapToken = resPayment.data.data.token;
            const paymentUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;

            return {
                success: true,
                token: snapToken,
                paymentUrl,
                message: 'Payment generated successfully'
            };

        } catch (error: any) {
            console.error('Payment generation error:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Payment generation failed'
            };
        }
    };

    const handleWebPayment = async (
        snapToken: string,
        cartItems: { id: string }[],
        stockItems: StockReductionItem[]
    ) => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            await loadSnapScript();

            return new Promise<void>((resolve) => {
                window.snap?.pay(snapToken, {
                    onSuccess: async (result: any) => {
                        try {
                            const verification = await verifyPaymentStatus(snapToken);

                            if (verification.success &&
                                (verification.status === 'settlement' ||
                                    verification.status === 'capture')) {

                                Toast.show({
                                    type: 'success',
                                    text1: 'Payment Successful',
                                    text2: 'Your order is being processed!',
                                });
                            } else {
                                Toast.show({
                                    type: 'warning',
                                    text1: 'Payment Pending Verification',
                                    text2: 'Your payment is being verified. Please check your orders.',
                                });
                            }
                        } catch (error: any) {
                            console.error('Failed to process payment success:', error);
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Payment successful but failed to update order. Please contact support.',
                            });
                        } finally {
                            resolve();
                        }
                    },

                    onPending: async (result: any) => {
                        const verification = await verifyPaymentStatus(snapToken);
                        if (verification.success && verification.status === 'pending') {
                            Toast.show({
                                type: 'info',
                                text1: 'Payment Pending',
                                text2: 'Waiting for payment confirmation',
                            });
                        } else {
                            Toast.show({
                                type: 'warning',
                                text1: 'Payment Processing',
                                text2: 'Your payment is being processed',
                            });
                        }
                        resolve();
                    },

                    onError: (result: any) => {
                        console.error('Web payment error:', result);
                        Toast.show({
                            type: 'error',
                            text1: 'Payment Failed',
                            text2: 'Please try again or contact support',
                        });
                        resolve();
                    },

                    onClose: () => {
                        verifyPaymentStatus(snapToken).then(verification => {
                            if (verification.success &&
                                (verification.status === 'settlement' ||
                                    verification.status === 'capture')) {

                                updateCartStatus(cartItems, token)
                                    .then(() => {
                                        Toast.show({
                                            type: 'success',
                                            text1: 'Payment Verified',
                                            text2: 'Your order is now being processed!',
                                        });
                                    })
                                    .catch(() => {
                                        Toast.show({
                                            type: 'info',
                                            text1: 'Payment Successful',
                                            text2: 'Please check your orders for status',
                                        });
                                    });
                            }
                        });

                        resolve();
                    }
                });
            });

        } catch (error) {
            console.error('Web payment error:', error);
            throw error;
        }
    };

    const checkPaymentStatus = async (snapToken: string): Promise<string> => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const statusRes = await api.get(`/payment/check-status/${snapToken}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
            });

            return statusRes.data.data.status || 'unknown';
        } catch (error) {
            console.error('Error checking payment status:', error);
            return 'error';
        }
    };

    return {
        generatePayment,
        handleWebPayment,
        checkPaymentStatus,
        updateCartStatus,
        verifyPaymentStatus,
        reduceQuantity
    };
}