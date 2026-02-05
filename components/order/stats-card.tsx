import { OrderStatusT, type Cart } from '@/constants/type';
import { formatCurrency } from '@/utils/index';
import { CheckCircle, Clock, CreditCard, Package } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface StatsCardsProps {
    orders: Cart[] | undefined;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ orders }) => {
    const stats = {
        total: orders?.length || 0,
        delivered: orders?.filter(o => o.status === OrderStatusT.DELIVERED).length || 0,
        pending: orders?.filter(o => o.status === OrderStatusT.PENDING).length || 0,
        totalSpent: orders?.reduce((sum, order) => sum + order.variant.price * order.quantity, 0) || 0,
    };

    const successRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0;
    const pendingRate = stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;
    const averageOrder = stats.total > 0 ? stats.totalSpent / stats.total : 0;

    const cards = [
        {
            title: 'Total Orders',
            value: stats.total.toString(),
            subtitle: 'All time orders',
            icon: Package,
            color: '#3b82f6',
            bgColor: '#dbeafe',
        },
        {
            title: 'Delivered',
            value: stats.delivered.toString(),
            subtitle: `${successRate}% success rate`,
            icon: CheckCircle,
            color: '#059669',
            bgColor: '#d1fae5',
        },
        {
            title: 'Pending',
            value: stats.pending.toString(),
            subtitle: `${pendingRate}% of orders`,
            icon: Clock,
            color: '#d97706',
            bgColor: '#fef3c7',
        },
        {
            title: 'Total Spent',
            value: formatCurrency(stats.totalSpent),
            subtitle: `Avg: ${formatCurrency(averageOrder)} per order`,
            icon: CreditCard,
            color: '#8b5cf6',
            bgColor: '#f3e8ff',
        },
    ];

    return (
        <View style={styles.container}>
            {cards.map((card, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{card.title}</Text>
                            <Text style={styles.value}>{card.value}</Text>
                            <Text style={styles.subtitle}>{card.subtitle}</Text>
                        </View>
                        <View style={[styles.iconContainer, { backgroundColor: card.bgColor }]}>
                            <card.icon size={20} color={card.color} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        flex: 1,
        minWidth: '45%',
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
    cardContent: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
        marginBottom: 4,
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 11,
        color: '#9ca3af',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});