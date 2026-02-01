import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star } from 'lucide-react-native';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    const product = {
        id: id as string,
        name: 'Laptop Gaming ASUS ROG Strix',
        price: 25000000,
        description: 'Laptop gaming dengan processor Intel Core i9, RTX 4080, 32GB RAM, 1TB SSD. Performa maksimal untuk gaming dan content creation.',
        images: [
            'https://via.placeholder.com/400x300',
            'https://via.placeholder.com/400x300/ccc',
            'https://via.placeholder.com/400x300/999',
        ],
        rating: 4.7,
        reviews: 128,
        stock: 10,
        specifications: {
            processor: 'Intel Core i9-13900H',
            graphics: 'NVIDIA RTX 4080',
            ram: '32GB DDR5',
            storage: '1TB NVMe SSD',
            display: '16" QHD+ 240Hz',
        },
    };

    const addToCart = () => {
        // Implement add to cart logic
        console.log(`Added ${quantity} of product ${id} to cart`);
        router.push('/cart/index');
    };

    const buyNow = () => {
        // Implement buy now logic
        console.log(`Buying ${quantity} of product ${id}`);
        router.push('/cart');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Detail</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.iconButton}>
                        <Heart size={24} color={isFavorite ? '#ef4444' : '#9ca3af'} fill={isFavorite ? '#ef4444' : 'none'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Share2 size={24} color="#9ca3af" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Product Images */}
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.imageSlider}
            >
                {product.images.map((image, index) => (
                    <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                ))}
            </ScrollView>

            {/* Product Info */}
            <View style={styles.content}>
                <Text style={styles.productName}>{product.name}</Text>

                <View style={styles.ratingContainer}>
                    <View style={styles.ratingStars}>
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={20}
                                color="#FFD700"
                                fill={i < Math.floor(product.rating) ? '#FFD700' : 'none'}
                            />
                        ))}
                    </View>
                    <Text style={styles.ratingText}>{product.rating} ({product.reviews} reviews)</Text>
                </View>

                <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>

                <Text style={styles.stock}>Stock: {product.stock} items</Text>

                {/* Quantity Selector */}
                <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            style={styles.quantityButton}
                            disabled={quantity <= 1}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityValue}>{quantity}</Text>
                        <TouchableOpacity
                            onPress={() => setQuantity(quantity + 1)}
                            style={styles.quantityButton}
                            disabled={quantity >= product.stock}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>

                {/* Specifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Specifications</Text>
                    {Object.entries(product.specifications).map(([key, value]) => (
                        <View key={key} style={styles.specRow}>
                            <Text style={styles.specLabel}>{key}:</Text>
                            <Text style={styles.specValue}>{value}</Text>
                        </View>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.button, styles.addToCartButton]}
                        onPress={addToCart}
                    >
                        <ShoppingCart size={20} color="#3b82f6" />
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buyNowButton]}
                        onPress={buyNow}
                    >
                        <Text style={styles.buyNowText}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 4,
    },
    imageSlider: {
        height: 300,
    },
    productImage: {
        width: width,
        height: 300,
    },
    content: {
        padding: 16,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingStars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#6b7280',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 8,
    },
    stock: {
        fontSize: 16,
        color: '#059669',
        marginBottom: 20,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f3f4f6',
    },
    quantityLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    quantityValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        minWidth: 40,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4b5563',
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    specLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    specValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },
    addToCartButton: {
        backgroundColor: '#eff6ff',
        borderWidth: 2,
        borderColor: '#3b82f6',
    },
    addToCartText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#3b82f6',
    },
    buyNowButton: {
        backgroundColor: '#3b82f6',
    },
    buyNowText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});