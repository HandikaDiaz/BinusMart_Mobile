import type { Products } from '@/constants/type';
import { useRouter } from 'expo-router';
import { ShoppingCart, Star } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
    product: Products;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();

    const primaryVariant = product.variants?.find((v: any) => v.isPrimary) || product.variants?.[0];
    const price = primaryVariant?.price || 0;

    const rating = product.reviews?.length
        ? product.reviews.reduce((acc: number, review: any) => acc + (review.rating || 0), 0) / product.reviews.length
        : 0;

    const handleProductPress = () => {
        router.push(`/product/${product.id}`);
    };

    const handleAddToCart = (e: any) => {
        e.stopPropagation();
        console.log('Added to cart:', product.id);
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handleProductPress}
        >
            <Image
                source={{ uri: product.image?.[0].url || 'https://via.placeholder.com/150' }}
                style={styles.image}
                resizeMode="cover"
            />

            {product.isFeatured && (
                <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>Featured</Text>
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={2}>
                    {product.productName}
                </Text>

                <View style={styles.ratingContainer}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                    <Text style={styles.reviewCount}>({product.reviews?.length || 0})</Text>
                </View>

                <Text style={styles.price}>Rp {price.toLocaleString('id-ID')}</Text>

                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                >
                    <ShoppingCart size={16} color="#fff" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#f3f4f6',
    },
    featuredBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#3b82f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    featuredText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500',
    },
    content: {
        padding: 12,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
        height: 40,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 12,
        color: '#111827',
        marginLeft: 4,
        fontWeight: '500',
    },
    reviewCount: {
        fontSize: 12,
        color: '#6b7280',
        marginLeft: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 12,
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#3b82f6',
        paddingVertical: 8,
        borderRadius: 8,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
});