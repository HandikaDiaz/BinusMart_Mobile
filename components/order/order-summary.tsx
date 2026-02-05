import { type Cart } from '@/constants/type';
import { formatCurrency } from '@/utils/index';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface OrderSummaryProps {
    filteredOrders: Cart[];
}

export default function OrderSummary({
    filteredOrders
}: OrderSummaryProps) {
    const totalOrders = filteredOrders.length;
    const totalItems = filteredOrders.reduce((sum) => sum + filteredOrders.length, 0);
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.variant.price * order.quantity, 0);
    const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Order Summary</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Orders</Text>
                        <View style={styles.statValueContainer}>
                            <Text style={styles.statValue}>{totalOrders}</Text>
                            <View style={styles.statBadge}>
                                <Text style={styles.statBadgeText}>{filteredOrders.length}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Items</Text>
                        <Text style={styles.statValue}>{totalItems}</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Amount</Text>
                        <Text style={styles.statValue}>{formatCurrency(totalAmount)}</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Average Order</Text>
                        <Text style={styles.statValue}>{formatCurrency(averageOrderValue)}</Text>
                    </View>
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
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    header: {
        padding: 20,
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    statItem: {
        flex: 1,
        minWidth: '45%',
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
        marginBottom: 8,
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    statBadge: {
        height: 20,
        paddingHorizontal: 6,
        borderRadius: 10,
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#d1d5db',
        justifyContent: 'center',
    },
    statBadgeText: {
        fontSize: 12,
        color: '#374151',
    },
});