import AllProduct from '@/components/home/all-product';
import CategoryFilter from '@/components/home/category-filter';
import OpeningCard from '@/components/home/opening-card';
import PromotionCard from '@/components/home/promotion-card';
import { Categories } from '@/constants/type';
import { useDebounce } from '@/hooks/home/use-search';
import useGetAllProduct from '@/hooks/product/use-products';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function HomeView() {
    const { data: productsData, isLoading, refetch } = useGetAllProduct();
    const [refreshing, setRefreshing] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const categories = [
        { value: 'ALL', label: 'All Categories' },
        { value: Categories.ELECTRONICS, label: 'Electronics' },
        { value: Categories.FASHION, label: 'Fashion' },
        { value: Categories.HOME, label: 'Home & Garden' },
        { value: Categories.BOOKS, label: 'Books' },
        { value: Categories.SPORTS, label: 'Sports' },
        { value: Categories.OTHER, label: 'Other' },
    ];

    const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'newest', label: 'Newest' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Top Rated' },
    ];

    const handleSearch = useCallback(() => {
        console.log('Performing search for:', searchQuery);
    }, [searchQuery]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const filteredProducts = useMemo(() => {
        if (!productsData) return [];

        return productsData
            .filter(product => {
                const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
                if (!matchesCategory) return false;

                if (debouncedSearchQuery.trim() === '') return true;

                const query = debouncedSearchQuery.toLowerCase().trim();

                if (product.productName?.toLowerCase().includes(query)) return true;
                if (product.shortDescription?.toLowerCase().includes(query)) return true;
                if (product.fullDescription?.toLowerCase().includes(query)) return true;
                if (product.tag?.some((tag: string) => tag.toLowerCase().includes(query))) return true;
                if (product.variants?.some((variant: any) =>
                    variant.color?.toLowerCase().includes(query) ||
                    variant.size?.toLowerCase().includes(query) ||
                    variant.SKU?.toLowerCase().includes(query) ||
                    variant.variantName?.toLowerCase().includes(query)
                )) return true;

                return false;
            })
            .sort((a, b) => {
                const getProductPrice = (product: any) => {
                    const primaryVariant = product.variants?.find((v: any) => v.isPrimary) || product.variants?.[0];
                    return primaryVariant?.price || 0;
                };

                const getProductRating = (product: any) => {
                    if (!product.reviews?.length) return 0;
                    const total = product.reviews.reduce((acc: number, review: any) => acc + (review.rating || 0), 0);
                    return total / product.reviews.length;
                };

                switch (sortBy) {
                    case 'newest':
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    case 'price_low':
                        return getProductPrice(a) - getProductPrice(b);
                    case 'price_high':
                        return getProductPrice(b) - getProductPrice(a);
                    case 'rating':
                        return getProductRating(b) - getProductRating(a);
                    case 'featured':
                    default:
                        if (a.isFeatured && !b.isFeatured) return -1;
                        if (!a.isFeatured && b.isFeatured) return 1;
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
            });
    }, [productsData, selectedCategory, debouncedSearchQuery, sortBy]);

    useEffect(() => {
        console.log('Search results:', filteredProducts.length);
    }, [filteredProducts]);

    const handleClearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory('ALL');
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <OpeningCard
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
            />

            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <>
                    <AllProduct
                        filteredProducts={filteredProducts}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        setSearchQuery={setSearchQuery}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOptions={sortOptions}
                        categories={categories}
                        searchQuery={searchQuery}
                    />

                    {filteredProducts.length === 0 && searchQuery && (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsTitle}>No products found</Text>
                            <Text style={styles.noResultsText}>
                                Try adjusting your search or filter to find what you're looking for.
                            </Text>
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={handleClearAllFilters}
                            >
                                <Text style={styles.clearButtonText}>Clear Search</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}

            <PromotionCard />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultsContainer: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    noResultsTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    noResultsText: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    clearButton: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
});