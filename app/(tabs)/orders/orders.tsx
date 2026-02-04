import useCarts from '@/modules/cart/hooks/useCarts';
import React, { useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import FiltersBar from '../components/filter-bar';
import HelpSection from '../components/help-section';
import OrdersHeader from '../components/order-header';
import { OrdersList } from '../components/order-list';
import OrderSummary from '../components/order-summary';
import { StatsCards } from '../components/stats-card';
import useOrders from '../hooks/useOrder';

export default function OrdersView() {
    const { data: orders, refetch, isRefetching } = useCarts();
    const [refreshing, setRefreshing] = useState(false);

    const {
        searchQuery,
        statusFilter,
        sortBy,
        filteredOrders,
        setSearchQuery,
        setStatusFilter,
        setSortBy,
    } = useOrders({ orders });

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing || isRefetching}
                    onRefresh={onRefresh}
                    colors={['#3b82f6']}
                    tintColor="#3b82f6"
                />
            }
        >
            <View style={styles.content}>
                <OrdersHeader />

                <StatsCards orders={orders} />

                <FiltersBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                <OrdersList
                    filteredOrders={filteredOrders}
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    setSearchQuery={setSearchQuery}
                    setStatusFilter={setStatusFilter}
                />

                {filteredOrders.length > 0 && (
                    <OrderSummary filteredOrders={filteredOrders} />
                )}

                <HelpSection />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        padding: 16,
        gap: 24,
    },
});