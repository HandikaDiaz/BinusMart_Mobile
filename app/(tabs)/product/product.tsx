import { useRouter } from 'expo-router';
import { Filter, Search, ShoppingCart, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Mock data
const products = [
    { id: '1', name: 'Laptop Gaming ASUS ROG', price: 15000000, image: 'https://via.placeholder.com/150', rating: 4.5, stock: 10 },
    { id: '2', name: 'iPhone 15 Pro Max', price: 25000000, image: 'https://via.placeholder.com/150', rating: 4.8, stock: 5 },
    { id: '3', name: 'Samsung Galaxy S24', price: 18000000, image: 'https://via.placeholder.com/150', rating: 4.6, stock: 8 },
    { id: '4', name: 'MacBook Pro M3', price: 35000000, image: 'https://via.placeholder.com/150', rating: 4.9, stock: 3 },
    { id: '5', name: 'PlayStation 5', price: 9000000, image: 'https://via.placeholder.com/150', rating: 4.7, stock: 12 },
    { id: '6', name: 'Nintendo Switch OLED', price: 6000000, image: 'https://via.placeholder.com/150', rating: 4.4, stock: 7 },
];

export default function ProductsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchQuery) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery]);

    const navigateToProduct = (id: any) => {
        router.push(`/product/${id}`);
    };

    const addToCart = (productId: string) => {
        // Implement add to cart logic
        console.log('Added to cart:', productId);
    };

    const renderProductItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigateToProduct(item.id)}
        >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>

                <View style={styles.ratingContainer}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>

                <Text style={styles.stockText}>Stock: {item.stock}</Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>
                        Rp {item.price.toLocaleString('id-ID')}
                    </Text>
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            addToCart(item.id);
                        }}
                    >
                        <ShoppingCart size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Search size={20} color="#9ca3af" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton}>
                    <Filter size={20} color="#6b7280" />
                </TouchableOpacity>
            </View>

            {/* Products List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.productsList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No products found</Text>
                        </View>
                    }
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
    searchContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        gap: 12,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productsList: {
        padding: 8,
    },
    productCard: {
        flex: 1,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 8,
        height: 40,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#6b7280',
    },
    stockText: {
        fontSize: 12,
        color: '#059669',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    addToCartButton: {
        backgroundColor: '#3b82f6',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
    },
});