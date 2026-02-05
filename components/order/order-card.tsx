import {
    OrderStatus,
    orderStatusConfig,
    OrderStatusT,
    paymentMethodConfig,
    type Cart,
} from '@/constants/type';
import {
    formatCurrency,
    formatDate,
    generateRandomDeliveryDate,
    generateRandomIsPaid,
    generateRandomPaidDate,
    generateRandomPaymentMethod,
    generateRandomShippingInfo,
} from '@/utils/index';
import { useRouter } from 'expo-router';
import {
    Calendar,
    CreditCard,
    Eye,
    MapPin,
    RefreshCw,
    Star,
    Truck,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import OrderTimeline from './order-timeline';

interface OrderCardProps {
    order: Cart;
}

export default function OrderCard({ order }: OrderCardProps) {
    const router = useRouter();

    const enhancedOrder = useMemo(() => {
        const paymentMethod = generateRandomPaymentMethod();
        const isPaid = generateRandomIsPaid();
        const paidAt = generateRandomPaidDate(order.createdAt);
        const deliveredAt = generateRandomDeliveryDate(order.createdAt);
        const shippingInfo = generateRandomShippingInfo();

        return {
            ...order,
            paymentMethod,
            isPaid: paidAt,
            paidAt: isPaid,
            deliveredAt: deliveredAt || undefined,
            shippingAddress: shippingInfo,
            shippingPrice: shippingInfo.shippingPrice,
        };
    }, [order]);

    const statusConfig = orderStatusConfig[enhancedOrder.status as OrderStatus];
    const paymentConfig = paymentMethodConfig[enhancedOrder.paymentMethod!];
    const statusColor = orderStatusConfig[enhancedOrder.status as OrderStatus];

    const handleViewDetails = () => {
        router.push(`/product/${enhancedOrder.product.id}`);
    };

    const handleTrackOrder = () => {
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Order tracked successfully!',
        })
    };

    const handleRateProduct = () => {
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Product rated successfully!',
        })
    };

    const handleBuyAgain = () => {
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Product bought again successfully!',
        })
    };

    const handleCancelOrder = () => {
        console.log('Cancel order:', enhancedOrder.id);
        Toast.show({
            type: 'success',
            text1: 'Order Cancelled',
            text2: 'Your order has been cancelled successfully.',
        })
    };

    return (
        <View style={styles.card}>
            <View style={[styles.header, { backgroundColor: `${statusColor.bgColor}20` }]}>
                <View style={styles.headerLeft}>
                    <View style={styles.headerRow}>
                        <Text style={styles.orderId}>Order #{enhancedOrder.id.slice(-6)}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor.bgColor }]}>
                            <Text style={[styles.statusText, { color: statusColor.color }]}>
                                {statusConfig.icon} {statusConfig.label}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.dateRow}>
                        <Calendar size={12} color="#6b7280" />
                        <Text style={styles.dateText}>
                            Placed on {formatDate(new Date(enhancedOrder.createdAt))}
                        </Text>
                        {enhancedOrder.deliveredAt && (
                            <>
                                <Truck size={12} color="#6b7280" />
                                <Text style={styles.dateText}>
                                    Delivered on {formatDate(new Date(enhancedOrder.deliveredAt))}
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                <View style={styles.headerRight}>
                    <Text style={styles.totalAmount}>
                        {formatCurrency(enhancedOrder.variant.price * enhancedOrder.quantity)}
                    </Text>
                    <Text style={styles.itemCount}>1 item</Text>
                </View>
            </View>

            <View style={styles.productSection}>
                <Image
                    source={{ uri: enhancedOrder.product.image[0]?.url }}
                    style={styles.productImage}
                    resizeMode="cover"
                />
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {enhancedOrder.product.productName}
                    </Text>
                    <Text style={styles.productDetails}>
                        Quantity: {enhancedOrder.quantity} × {formatCurrency(enhancedOrder.variant.price)}
                    </Text>
                </View>
                <View style={styles.productPrice}>
                    <Text style={styles.productTotal}>
                        {formatCurrency(enhancedOrder.variant.price * enhancedOrder.quantity)}
                    </Text>
                    <TouchableOpacity onPress={handleViewDetails}>
                        <Text style={styles.viewProductLink}>View Product</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
                <View style={styles.infoContainer}>
                    <View style={styles.infoSection}>
                        <View style={styles.sectionHeader}>
                            <CreditCard size={16} color="#4b5563" />
                            <Text style={styles.sectionTitle}>Payment Information</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Method:</Text>
                            <Text style={styles.infoValue}>
                                {paymentConfig?.icon} {paymentConfig?.label}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Status:</Text>
                            <Text style={[
                                styles.infoValue,
                                enhancedOrder.isPaid ? styles.paidStatus : styles.pendingStatus
                            ]}>
                                {enhancedOrder.isPaid ? 'Paid' : 'Pending Payment'}
                            </Text>
                        </View>
                        {enhancedOrder.paidAt && typeof enhancedOrder.paidAt === 'string' && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Paid on:</Text>
                                <Text style={styles.infoValue}>
                                    {formatDate(new Date(enhancedOrder.paidAt))}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.verticalDivider} />

                    <View style={styles.infoSection}>
                        <View style={styles.sectionHeader}>
                            <Truck size={16} color="#4b5563" />
                            <Text style={styles.sectionTitle}>Shipping Information</Text>
                        </View>
                        {enhancedOrder.shippingAddress ? (
                            <>
                                <View style={styles.addressRow}>
                                    <MapPin size={16} color="#6b7280" />
                                    <View style={styles.addressText}>
                                        <Text style={styles.addressStreet}>
                                            {enhancedOrder.shippingAddress.street}
                                        </Text>
                                        <Text style={styles.addressDetails}>
                                            {enhancedOrder.shippingAddress.city}, {enhancedOrder.shippingAddress.state} {enhancedOrder.shippingAddress.zipCode}
                                        </Text>
                                        <Text style={styles.addressDetails}>
                                            {enhancedOrder.shippingAddress.country}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Shipping Cost:</Text>
                                    <Text style={styles.infoValue}>
                                        {formatCurrency(enhancedOrder.shippingPrice || 0)}
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <Text style={styles.noAddress}>No shipping address provided</Text>
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.timelineSection}>
                <OrderTimeline order={enhancedOrder} />
            </View>

            <View style={[styles.footer, { backgroundColor: `${statusColor.bgColor}20` }]}>
                <Text style={styles.helpText}>
                    Need help? <Text style={styles.helpLink}>Contact Support</Text>
                </Text>

                <View style={styles.actionButtons}>
                    {enhancedOrder.status === OrderStatusT.DELIVERED && (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.rateButton]}
                                onPress={handleRateProduct}
                            >
                                <Star size={16} color="#10b981" />
                                <Text style={styles.rateButtonText}>Rate & Review</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.buyAgainButton]}
                                onPress={handleBuyAgain}
                            >
                                <RefreshCw size={16} color="#3b82f6" />
                                <Text style={styles.buyAgainButtonText}>Buy Again</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {enhancedOrder.status === OrderStatusT.PENDING && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={handleCancelOrder}
                        >
                            <Text style={styles.cancelButtonText}>Cancel Order</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.actionButton, styles.viewButton]}
                        onPress={handleViewDetails}
                    >
                        <Eye size={16} color="#3b82f6" />
                        <Text style={styles.viewButtonText}>View Details</Text>
                    </TouchableOpacity>

                    {enhancedOrder.status === OrderStatusT.SHIPPED && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.trackButton]}
                            onPress={handleTrackOrder}
                        >
                            <Truck size={16} color="white" />
                            <Text style={styles.trackButtonText}>Track Order</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden',
    },
    header: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    orderId: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateText: {
        fontSize: 12,
        color: '#6b7280',
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    itemCount: {
        fontSize: 12,
        color: '#6b7280',
    },
    productSection: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        gap: 12,
    },
    productImage: {
        width: 64,
        height: 64,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    productDetails: {
        fontSize: 12,
        color: '#6b7280',
    },
    productPrice: {
        alignItems: 'flex-end',
    },
    productTotal: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    viewProductLink: {
        fontSize: 12,
        color: '#3b82f6',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    infoContainer: {
        flexDirection: 'row',
    },
    infoSection: {
        flex: 1,
        minWidth: '50%',
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    infoValue: {
        fontSize: 12,
        fontWeight: '500',
        color: '#111827',
    },
    paidStatus: {
        color: '#059669',
    },
    pendingStatus: {
        color: '#d97706',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#e5e7eb',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 12,
    },
    addressText: {
        flex: 1,
    },
    addressStreet: {
        fontSize: 12,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 2,
    },
    addressDetails: {
        fontSize: 11,
        color: '#6b7280',
    },
    noAddress: {
        fontSize: 12,
        color: '#6b7280',
        fontStyle: 'italic',
    },
    // New style for timeline section
    timelineSection: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    footer: {
        padding: 16,
    },
    helpText: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 12,
    },
    helpLink: {
        color: '#3b82f6',
    },
    actionButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        gap: 6,
    },
    rateButton: {
        backgroundColor: '#f0fdf4',
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    rateButtonText: {
        fontSize: 12,
        color: '#10b981',
        fontWeight: '500',
    },
    buyAgainButton: {
        backgroundColor: '#eff6ff',
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    buyAgainButtonText: {
        fontSize: 12,
        color: '#3b82f6',
        fontWeight: '500',
    },
    cancelButton: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    cancelButtonText: {
        fontSize: 12,
        color: '#dc2626',
        fontWeight: '500',
    },
    viewButton: {
        backgroundColor: '#eff6ff',
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    viewButtonText: {
        fontSize: 12,
        color: '#3b82f6',
        fontWeight: '500',
    },
    trackButton: {
        backgroundColor: '#3b82f6',
    },
    trackButtonText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '500',
    },
});