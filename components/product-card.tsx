/* eslint-disable react-hooks/rules-of-hooks */
import type { Products } from '@/constants/type';
import { useRouter } from 'expo-router';
import { Edit2, ShoppingCart, Star, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import DeleteProductModal from './product/delete-product';
import EditProductModal from './product/edit-product';

interface ProductCardProps {
    product: Products;
    isProductsPage?: boolean;
    onProductUpdated?: () => void;
    onProductDeleted?: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    ELECTRONICS: { bg: '#dbeafe', text: '#1e40af' },
    FASHION: { bg: '#fce7f3', text: '#be185d' },
    HOME: { bg: '#dcfce7', text: '#15803d' },
    BOOKS: { bg: '#f3e8ff', text: '#7c3aed' },
    SPORTS: { bg: '#ffedd5', text: '#ea580c' },
    OTHER: { bg: '#f3f4f6', text: '#4b5563' },
} as const;

const ProductCard = React.memo(({
    product,
    isProductsPage = true,
    onProductUpdated,
    onProductDeleted,
}: ProductCardProps) => {
    if (!product) return null;

    const router = useRouter();
    const categoryColor = CATEGORY_COLORS[product.category] || CATEGORY_COLORS.OTHER;
    const isOutOfStock = product.variants?.[0]?.stock === 0;
    const price = product.variants?.[0]?.price?.toLocaleString('id-ID') || '0';
    const sellerInitial = product.seller?.name?.charAt(0) || 'S';
    const rating = 3.7;
    const reviewCount = product.reviews?.length || 0;
    const mainImage = product.image?.[0]?.url || 'https://via.placeholder.com/300x300.png?text=No+Image';
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleProductPress = () => {
        router.push(`/product/${product.id}`);
    };

    const handleEditPress = () => {
        setShowEditModal(true);
    };

    const handleDeletePress = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteSuccess = () => {
        setShowDeleteModal(false);
        onProductDeleted?.();
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        onProductUpdated?.();
    };

    return (
        <>
            <TouchableOpacity
                style={styles.card}
                onPress={handleProductPress}
                activeOpacity={0.9}
                disabled={isProductsPage}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: mainImage }}
                        style={styles.image}
                        resizeMode="cover"
                    />

                    <View style={[styles.categoryBadge, { backgroundColor: categoryColor.bg }]}>
                        <Text style={[styles.categoryText, { color: categoryColor.text }]}>
                            {product.category}
                        </Text>
                    </View>

                    {isOutOfStock && (
                        <View style={styles.outOfStockOverlay}>
                            <View style={styles.outOfStockBadge}>
                                <Text style={styles.outOfStockText}>Out of Stock</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <Text style={styles.productName} numberOfLines={1}>
                        {product.productName}
                    </Text>

                    <Text style={styles.description} numberOfLines={2}>
                        {product.shortDescription || 'No description available'}
                    </Text>

                    <View style={styles.priceRatingRow}>
                        <Text style={styles.price}>Rp {price}</Text>

                        <View style={styles.ratingContainer}>
                            <Star size={14} color="#f59e0b" fill="#f59e0b" />
                            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
                            <Text style={styles.reviewCount}>({reviewCount})</Text>
                        </View>
                    </View>

                    <View style={styles.sellerContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{sellerInitial}</Text>
                        </View>
                        <Text style={styles.sellerName} numberOfLines={1}>
                            {product.seller?.name || 'Unknown Seller'}
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    {isProductsPage ? (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={handleEditPress}
                            >
                                <Edit2 size={16} color="#10b981" />
                                <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={handleDeletePress}
                            >
                                <Trash2 size={16} color="#ef4444" />
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.viewButton}
                            onPress={handleProductPress}
                        >
                            <ShoppingCart size={18} color="#3b82f6" />
                            <Text style={styles.viewButtonText}>View Details</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>

            <DeleteProductModal
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                productId={product.id}
                productName={product.productName}
                onSuccess={handleDeleteSuccess}
            />

            {/* Edit Modal */}
            <EditProductModal
                visible={showEditModal}
                onClose={() => setShowEditModal(false)}
                productId={product.id}
                onSuccess={handleEditSuccess}
            />
        </>
    );
});

ProductCard.displayName = 'ProductCard';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 16,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        height: 150,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    categoryBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    outOfStockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outOfStockBadge: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    outOfStockText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        padding: 12,
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 12,
        lineHeight: 16,
    },
    priceRatingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    reviewCount: {
        fontSize: 12,
        color: '#6b7280',
    },
    sellerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 'auto',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    sellerName: {
        fontSize: 12,
        color: '#4b5563',
        flex: 1,
    },
    footer: {
        padding: 12,
        paddingTop: 0,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#eff6ff',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    viewButtonText: {
        color: '#3b82f6',
        fontSize: 14,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        borderRadius: 8,
    },
    editButton: {
        backgroundColor: '#f0fdf4',
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    editButtonText: {
        color: '#10b981',
        fontSize: 12,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    deleteButtonText: {
        color: '#ef4444',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default ProductCard;