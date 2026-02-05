import api from "@/api/api";
import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

export interface CartItemDTO {
    totalAmount: number;
    cart: {
        id: string;
        name: string;
        price: number;
        quantity: number;
    }[];
};

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
                console.log('Snap.js loaded successfully');
                resolve();
            };

            script.onerror = (error) => {
                console.error('Failed to load Snap.js:', error);
                reject(new Error('Failed to load payment gateway'));
            };

            document.head.appendChild(script);
        });
    };

    const updateCartStatus = async (cartItems: { id: string }[], token: string) => {
        try {
            const updatePromises = cartItems.map(item =>
                api.put(`/cart/update-status/${item.id}`, {
                    status: 'PROCESSING'
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            );

            await Promise.all(updatePromises);
            queryClient.invalidateQueries({ queryKey: ['carts'] });
        } catch (error) {
            console.error('Error updating cart status:', error);
            throw error;
        }
    };

    const handlePay = async (data: CartItemDTO) => {
        try {
            const token = await getToken();
            if (!token) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Authentication required',
                });
                return;
            }

            const resPayment = await api.post(`/payment/transaction`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!resPayment.data.data?.token) {
                throw new Error('No payment token received');
            }

            const snapToken = resPayment.data.data.token;

            if (Platform.OS === 'web') {
                await loadSnapScript();

                window.snap?.pay(snapToken, {
                    onSuccess: async (result: any) => {
                        try {
                            await updateCartStatus(data.cart, token);

                            Toast.show({
                                type: 'success',
                                text1: 'Payment Successful',
                                text2: 'Your order is being processed!',
                            });
                        } catch (error) {
                            console.error('Failed to update cart status:', error);
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Payment successful but failed to update order. Please contact support.',
                            });
                        }
                    },

                    onPending: (result: any) => {
                        console.log('Payment pending:', result);
                        Toast.show({
                            type: 'info',
                            text1: 'Payment Pending',
                            text2: 'Waiting for payment confirmation',
                        });
                    },

                    onError: (result: any) => {
                        console.error('Payment error:', result);
                        Toast.show({
                            type: 'error',
                            text1: 'Payment Failed',
                            text2: 'Please try again or contact support',
                        });
                    },

                    onClose: () => {
                        console.log('Payment popup closed');
                        Toast.show({
                            type: 'info',
                            text1: 'Payment Cancelled',
                            text2: 'You closed the payment window',
                        });
                    }
                });
            }
            else {
                const paymentUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;
                const result = await WebBrowser.openBrowserAsync(paymentUrl);

                if (result.type === 'dismiss') {
                    await checkPaymentStatusAndUpdate(snapToken, data.cart, token);
                }
            }

        } catch (error: any) {
            console.error('Payment error:', error);

            let errorMessage = 'Payment failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });
        }
    };

    const checkPaymentStatusAndUpdate = async (
        snapToken: string,
        cartItems: { id: string }[],
        userToken: string
    ) => {
        try {
            const statusRes = await api.get(`/payment/check-status/${snapToken}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            const status = statusRes.data.data.status;

            if (status === 'success' || status === 'settlement' || status === 'capture') {
                await updateCartStatus(cartItems, userToken);

                Toast.show({
                    type: 'success',
                    text1: 'Payment Successful',
                    text2: 'Your order is being processed!',
                });
            } else if (status === 'pending') {
                Toast.show({
                    type: 'info',
                    text1: 'Payment Pending',
                    text2: 'Waiting for payment confirmation',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Payment Failed',
                    text2: 'Please try again or contact support',
                });
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Unable to verify payment status',
            });
        }
    };

    return {
        handlePay
    };
}