import { OrderStatus, type Cart } from '@/constants/type';
import { useRouter } from 'expo-router';
import { Package } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import OrderCard from './order-card';

interface OrdersListProps {
    filteredOrders: Cart[];
    searchQuery: string;
    statusFilter: OrderStatus | 'ALL';
    setSearchQuery: (value: string) => void;
    setStatusFilter: (value: OrderStatus | 'ALL') => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
    filteredOrders,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
}) => {
    const router = useRouter();

    if (filteredOrders.length === 0) {
        return (
            <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                    <Package size={48} color="#9ca3af" />
                </View>
                <Text style={styles.emptyTitle}>No orders found</Text>
                <Text style={styles.emptyDescription}>
                    {searchQuery || statusFilter !== 'ALL'
                        ? 'Try adjusting your search or filter'
                        : "You haven't placed any orders yet"}
                </Text>
                <View style={styles.emptyActions}>
                    {(searchQuery || statusFilter !== 'ALL') && (
                        <TouchableOpacity
                            style={[styles.button, styles.clearButton]}
                            onPress={() => {
                                setSearchQuery('');
                                setStatusFilter('ALL');
                            }}
                        >
                            <Text style={styles.clearButtonText}>Clear Filters</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.button, styles.shopButton]}
                        onPress={() => router.push('/')}
                    >
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.list}>
            {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 32,
        alignItems: 'center',
    },
    emptyIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyDescription: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    emptyActions: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    clearButton: {
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    clearButtonText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '500',
    },
    shopButton: {
        backgroundColor: '#3b82f6',
    },
    shopButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    list: {
        gap: 16,
    },
});