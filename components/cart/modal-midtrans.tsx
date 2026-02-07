import { AlertCircle, CheckCircle, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

interface MidtransModalProps {
    visible: boolean;
    paymentUrl: string;
    snapToken: string;
    cartItems: { id: string; variant: { id: string }; quantity: number }[];
    onClose: () => void;
    onPaymentSuccess?: () => void;
    onPaymentFailed?: (error: string) => void;
}

export default function MidtransModal({
    visible,
    paymentUrl,
    snapToken,
    cartItems,
    onClose,
    onPaymentSuccess,
    onPaymentFailed,
}: MidtransModalProps) {
    const webViewRef = useRef<WebView>(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed' | 'pending'>('idle');
    const [hasProcessed, setHasProcessed] = useState(false);

    useEffect(() => {
        if (visible) {
            setLoading(true);
            setPaymentStatus('idle');
            setHasProcessed(false);
        }
    }, [visible, snapToken]);

    const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
        const { url, loading } = navState;
        setLoading(loading);
        if (url.includes('status_code=200') ||
            url.includes('transaction_status=settlement') ||
            url.includes('transaction_status=capture')) {

            if (!hasProcessed) {
                setPaymentStatus('success');
                setHasProcessed(true);
                setTimeout(() => {
                    if (onPaymentSuccess) {
                        onPaymentSuccess();
                    }
                    onClose();
                }, 2000);
            }

            return;

        } else if (url.includes('transaction_status=pending')) {
            if (!hasProcessed) {
                setPaymentStatus('pending');
                setHasProcessed(true);

                setTimeout(() => {
                    onClose();
                }, 2000);
            }

        } else if (url.includes('transaction_status=deny') ||
            url.includes('transaction_status=expire') ||
            url.includes('transaction_status=cancel') ||
            url.includes('status_code=201')) {

            if (!hasProcessed) {
                setPaymentStatus('failed');
                setHasProcessed(true);

                setTimeout(() => {
                    if (onPaymentFailed) {
                        onPaymentFailed('Payment failed or was cancelled');
                    }
                    onClose();
                }, 2000);
            }
        }
    }, [hasProcessed, onPaymentSuccess, onPaymentFailed, onClose]);

    const handleClose = useCallback(() => {
        if (paymentStatus === 'idle' && !hasProcessed) {
            if (onPaymentFailed) {
                onPaymentFailed('Payment was cancelled');
            }
        }

        onClose();
    }, [paymentStatus, hasProcessed, onPaymentFailed, onClose]);

    const renderStatusView = () => {
        switch (paymentStatus) {
            case 'success':
                return (
                    <View style={styles.statusContainer}>
                        <CheckCircle size={64} color="#10b981" />
                        <Text style={[styles.statusText, styles.successText]}>
                            Payment Successful!
                        </Text>
                        <Text style={styles.statusSubText}>
                            Updating your order...
                        </Text>
                        <ActivityIndicator size="small" color="#10b981" style={{ marginTop: 16 }} />
                        <Text style={styles.autoCloseText}>Closing automatically...</Text>
                    </View>
                );

            case 'failed':
                return (
                    <View style={styles.statusContainer}>
                        <AlertCircle size={64} color="#ef4444" />
                        <Text style={[styles.statusText, styles.errorText]}>
                            Payment Failed
                        </Text>
                        <Text style={styles.statusSubText}>
                            Please try again
                        </Text>
                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'pending':
                return (
                    <View style={styles.statusContainer}>
                        <AlertCircle size={64} color="#f59e0b" />
                        <Text style={[styles.statusText, styles.pendingText]}>
                            Payment Pending
                        </Text>
                        <Text style={styles.statusSubText}>
                            Waiting for confirmation
                        </Text>
                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Complete Payment</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <X size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contentContainer}>
                        {paymentStatus !== 'idle' ? (
                            renderStatusView()
                        ) : (
                            <>
                                <WebView
                                    ref={webViewRef}
                                    source={{ uri: paymentUrl }}
                                    style={styles.webview}
                                    onLoadStart={() => setLoading(true)}
                                    onLoadEnd={() => setLoading(false)}
                                    onNavigationStateChange={handleNavigationStateChange}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    startInLoadingState={true}
                                    scalesPageToFit={true}
                                    mixedContentMode="always"
                                    thirdPartyCookiesEnabled={true}
                                    sharedCookiesEnabled={true}
                                    cacheEnabled={false}
                                    onError={(error) => {
                                        console.error('WebView error:', error.nativeEvent);
                                        setLoading(false);
                                    }}
                                />
                                {loading && (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="large" color="#3b82f6" />
                                        <Text style={styles.loadingText}>
                                            Loading payment gateway...
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        width: '90%',
        maxWidth: 500,
        height: '80%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        color: '#6b7280',
        fontSize: 16,
    },
    contentContainer: {
        flex: 1,
        position: 'relative',
    },
    webview: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    statusContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#ffffff',
    },
    statusText: {
        fontSize: 24,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    successText: {
        color: '#10b981',
    },
    errorText: {
        color: '#ef4444',
    },
    pendingText: {
        color: '#f59e0b',
    },
    statusSubText: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    autoCloseText: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 8,
    },
});