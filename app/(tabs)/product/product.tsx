import ProductCard from '@/components/product-card';
import CreateProductModal from '@/components/product/add-product';
import { useGetAllProductUser } from '@/hooks/product/use-products';
import { Package } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProductsView() {
    const { data, isLoading, refetch, isRefetching } = useGetAllProductUser();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    const hasProducts = data && data.length > 0;

    const numColumns = width > 768 ? 4 : width > 480 ? 3 : 2;

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isRefetching}
                        onRefresh={onRefresh}
                        colors={['#3b82f6']}
                        tintColor="#3b82f6"
                    />
                }
            >
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>My Products</Text>
                        <Text style={styles.subtitle}>Manage your products</Text>
                    </View>

                    {hasProducts && (
                        <View style={styles.actionButtons}>
                            <CreateProductModal onProductCreated={refetch} />
                        </View>
                    )}
                </View>

                {hasProducts ? (
                    <>
                        <View style={styles.listHeader}>
                            <Text style={styles.productCount}>
                                {data.length} product{data.length !== 1 ? 's' : ''} found
                            </Text>
                        </View>

                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={numColumns}
                            renderItem={({ item }) => (
                                <View style={styles.productCardContainer}>
                                    <ProductCard
                                        product={item}
                                    />
                                </View>
                            )}
                            columnWrapperStyle={styles.columnWrapper}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Package size={48} color="#9ca3af" />
                        </View>
                        <Text style={styles.emptyTitle}>No products yet</Text>
                        <Text style={styles.emptyDescription}>
                            You haven't created any products yet. Start by adding your first product to showcase in your store.
                        </Text>
                        <CreateProductModal onProductCreated={refetch} />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerContent: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    productCount: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    productCardContainer: {
        flex: 1,
        maxWidth: '48%',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#d1d5db',
        borderRadius: 12,
        backgroundColor: '#f9fafb',
        marginTop: 40,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
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
});