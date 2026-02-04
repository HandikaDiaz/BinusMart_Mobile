import type { Products } from '@/constants/type';
import { Filter, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductCard from '../product-card';

interface AllProductProps {
    filteredProducts: Products[];
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    setSearchQuery: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    sortOptions: { value: string; label: string }[];
    categories: { label: string; value: string }[];
    searchQuery: string;
}

export default function AllProduct({
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOptions,
    categories,
    searchQuery,
}: AllProductProps) {
    const [sortModalVisible, setSortModalVisible] = useState(false);

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleClearAllFilters = () => {
        setSelectedCategory('ALL');
        setSearchQuery('');
        setSortBy('featured');
    };

    const hasActiveFilters = selectedCategory !== 'ALL' || searchQuery.trim() !== '' || sortBy !== 'featured';

    const categoryLabel = categories.find(c => c.value === selectedCategory)?.label || 'All Products';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>
                        {selectedCategory === 'ALL' ? 'All Products' : categoryLabel}
                    </Text>
                    <Text style={styles.count}>
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    </Text>
                </View>

                <View style={styles.actions}>
                    {hasActiveFilters && (
                        <TouchableOpacity
                            style={styles.clearAllButton}
                            onPress={handleClearAllFilters}
                        >
                            <X size={16} color="#374151" />
                            <Text style={styles.clearAllText}>Clear All</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.sortButton}
                        onPress={() => setSortModalVisible(true)}
                    >
                        <Filter size={16} color="#374151" />
                        <Text style={styles.sortButtonText}>
                            {sortOptions.find(s => s.value === sortBy)?.label || 'Sort by'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {hasActiveFilters && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersScroll}
                    contentContainerStyle={styles.filtersContainer}
                >
                    {searchQuery && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>Search: {searchQuery}</Text>
                            <TouchableOpacity onPress={handleClearSearch}>
                                <X size={14} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {selectedCategory !== 'ALL' && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>
                                Category: {categoryLabel}
                            </Text>
                            <TouchableOpacity onPress={() => setSelectedCategory('ALL')}>
                                <X size={14} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {sortBy !== 'featured' && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>
                                Sort: {sortOptions.find(s => s.value === sortBy)?.label}
                            </Text>
                            <TouchableOpacity onPress={() => setSortBy('featured')}>
                                <X size={14} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            )}

            {filteredProducts.length > 0 ? (
                <FlatList
                    data={filteredProducts}
                    renderItem={({ item }) => <ProductCard isProductsPage={false} product={item} />}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                    contentContainerStyle={styles.productsGrid}
                    columnWrapperStyle={styles.columnWrapper}
                />
            ) : (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                        <Search size={48} color="#9ca3af" />
                    </View>
                    <Text style={styles.emptyTitle}>No products found</Text>
                    <Text style={styles.emptyText}>
                        {searchQuery
                            ? `No products match your search for "${searchQuery}". Try a different search term.`
                            : `No products found in ${selectedCategory === 'ALL' ? 'all categories' : categoryLabel}.`
                        }
                    </Text>

                    <View style={styles.emptyActions}>
                        {searchQuery && (
                            <TouchableOpacity
                                style={styles.emptyActionButton}
                                onPress={handleClearSearch}
                            >
                                <X size={16} color="#374151" />
                                <Text style={styles.emptyActionText}>Clear Search</Text>
                            </TouchableOpacity>
                        )}

                        {selectedCategory !== 'ALL' && (
                            <TouchableOpacity
                                style={styles.emptyActionButton}
                                onPress={() => setSelectedCategory('ALL')}
                            >
                                <X size={16} color="#374151" />
                                <Text style={styles.emptyActionText}>Clear Category</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.emptyActionButton, styles.primaryAction]}
                            onPress={handleClearAllFilters}
                        >
                            <Text style={styles.primaryActionText}>View All Products</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {sortModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.sortModal}>
                        <View style={styles.sortModalHeader}>
                            <Text style={styles.sortModalTitle}>Sort Options</Text>
                            <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                                <X size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.sortOption,
                                    sortBy === option.value && styles.sortOptionActive
                                ]}
                                onPress={() => {
                                    setSortBy(option.value);
                                    setSortModalVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.sortOptionText,
                                    sortBy === option.value && styles.sortOptionTextActive
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    count: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    clearAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: '#f3f4f6',
        borderRadius: 6,
    },
    clearAllText: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '500',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
    },
    sortButtonText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    filtersScroll: {
        marginBottom: 16,
    },
    filtersContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    filterBadgeText: {
        fontSize: 12,
        color: '#374151',
    },
    productsGrid: {
        paddingBottom: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
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
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
        maxWidth: 300,
    },
    emptyActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    emptyActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    emptyActionText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    primaryAction: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    primaryActionText: {
        color: '#fff',
        fontWeight: '500',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    sortModal: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '80%',
        maxWidth: 300,
        padding: 20,
    },
    sortModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sortModalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    sortOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    sortOptionActive: {
        backgroundColor: '#eff6ff',
    },
    sortOptionText: {
        fontSize: 16,
        color: '#374151',
    },
    sortOptionTextActive: {
        color: '#3b82f6',
        fontWeight: '500',
    },
});