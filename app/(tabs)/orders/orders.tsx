import { useRouter } from 'expo-router';
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ordersData = [
    {
        id: 'ORD-001',
        date: '2024-01-15',
        status: 'completed',
        items: 3,
        total: 24200000,
        itemsList: [
            { name: 'Laptop Gaming', quantity: 1 },
            { name: 'Mouse', quantity: 2 },
        ],
    },
    {
        id: 'ORD-002',
        date: '2024-01-14',
        status: 'processing',
        items: 2,
        total: 18000000,
        itemsList: [
            { name: 'Smartphone', quantity: 1 },
            { name: 'Charger', quantity: 1 },
        ],
    },
    {
        id: 'ORD-003',
        date: '2024-01-12',
        status: 'shipped',
        items: 1,
        total: 1200000,
        itemsList: [
            { name: 'Headphone', quantity: 1 },
        ],
    },
    {
        id: 'ORD-004',
        date: '2024-01-10',
        status: 'cancelled',
        items: 1,
        total: 8000000,
        itemsList: [
            { name: 'Tablet', quantity: 1 },
        ],
    },
];

const statusConfig = {
    completed: { icon: CheckCircle, color: '#059669', bgColor: '#d1fae5', text: 'Completed' },
    processing: { icon: Clock, color: '#d97706', bgColor: '#fef3c7', text: 'Processing' },
    shipped: { icon: Truck, color: '#2563eb', bgColor: '#dbeafe', text: 'Shipped' },
    cancelled: { icon: XCircle, color: '#dc2626', bgColor: '#fee2e2', text: 'Cancelled' },
};

export default function OrdersScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState('all');

    const filteredOrders = filter === 'all'
        ? ordersData
        : ordersData.filter(order => order.status === filter);

    const getStatusConfig = (status: string) => {
        return statusConfig[status as keyof typeof statusConfig] || statusConfig.processing;
    };

    const renderOrderItem = ({ item }: { item: any }) => {
        const StatusIcon = getStatusConfig(item.status).icon;
        const statusColor = getStatusConfig(item.status).color;
        const statusBgColor = getStatusConfig(item.status).bgColor;
        const statusText = getStatusConfig(item.status).text;

        return (
            <TouchableOpacity
                style={styles.orderCard}
                onPress={() => router.push(`/orders/${item.id}`)}
            >
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={styles.orderId}>{item.id}</Text>
                        <Text style={styles.orderDate}>{item.date}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
                        <StatusIcon size={16} color={statusColor} />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {statusText}
                        </Text>
                    </View>
                </View>

                <View style={styles.orderDetails}>
                    <Text style={styles.itemsText}>{item.items} items</Text>
                    <Text style={styles.totalText}>
                        Rp {item.total.toLocaleString('id-ID')}
                    </Text>
                </View>

                <View style={styles.itemsList}>
                    {item.itemsList.map((product: any, index: number) => (
                        <Text key={index} style={styles.productText}>
                            {product.name} × {product.quantity}
                        </Text>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => router.push(`/orders/${item.id}`)}
                >
                    <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Filter Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
            >
                {['all', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
                    <TouchableOpacity
                        key={status}
                        style={[
                            styles.filterTab,
                            filter === status && styles.filterTabActive,
                        ]}
                        onPress={() => setFilter(status)}
                    >
                        <Text style={[
                            styles.filterText,
                            filter === status && styles.filterTextActive,
                        ]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Package size={64} color="#9ca3af" />
                    <Text style={styles.emptyText}>No orders found</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => router.push('/product')}
                    >
                        <Text style={styles.shopButtonText}>Browse Products</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredOrders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.ordersList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    filterContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
    },
    filterTabActive: {
        backgroundColor: '#3b82f6',
    },
    filterText: {
        fontSize: 14,
        color: '#6b7280',
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#6b7280',
        marginVertical: 16,
    },
    shopButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    ordersList: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    orderDate: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemsText: {
        fontSize: 14,
        color: '#6b7280',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e40af',
    },
    itemsList: {
        marginBottom: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 12,
    },
    productText: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 4,
    },
    detailsButton: {
        backgroundColor: '#f3f4f6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    detailsButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
    },
});