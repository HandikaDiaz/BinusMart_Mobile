import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Heart,
    MessageSquare,
    Minus,
    Package,
    Plus,
    RefreshCw,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Store,
    Truck
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ProgressBar } from 'react-native-paper';

import { useAuth } from '@/hooks/auth/use-auth';
import useCreateCart from '@/hooks/cart/use-create-cart';
import useGetProductDetails from '@/hooks/product/use-product';
import { formatCurrency } from '@/utils/index';
import Toast from 'react-native-toast-message';


const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    ELECTRONICS: { bg: '#dbeafe', text: '#1e40af' },
    FASHION: { bg: '#fce7f3', text: '#be185d' },
    HOME: { bg: '#dcfce7', text: '#166534' },
    BOOKS: { bg: '#f3e8ff', text: '#7c3aed' },
    SPORTS: { bg: '#ffedd5', text: '#c2410c' },
    OTHER: { bg: '#f3f4f6', text: '#374151' },
};

export default function ProductDetailView() {
    const { user } = useAuth();
    const { id } = useLocalSearchParams();
    const { createCartAsync } = useCreateCart();
    const { data: productData, isLoading } = useGetProductDetails(id as string);
    const router = useRouter();

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariantName, setSelectedVariantName] = useState('');
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ProgressBar indeterminate color="#3b82f6" style={styles.progressBar} />
            </View>
        );
    }

    const primaryVariant = productData?.variants.find(v => v.isPrimary) || productData?.variants[0];

    const getSelectedVariant = () => {
        if (selectedVariantName && productData) {
            return productData.variants.find(v => v.variantName === selectedVariantName);
        }
        return primaryVariant;
    };

    const getSelectedVariantId = () => {
        const variant = getSelectedVariant();
        return variant?.id || '';
    };

    const currentStock = getSelectedVariant()?.stock || primaryVariant?.stock || 0;
    const currentPrice = getSelectedVariant()?.price || primaryVariant?.price || 0;
    const categoryColor = productData?.category
        ? CATEGORY_COLORS[productData.category] || CATEGORY_COLORS.OTHER
        : CATEGORY_COLORS.OTHER;

    if (!productData) {
        return (
            <SafeAreaView style={styles.notFoundContainer}>
                <View style={styles.notFoundIcon}>
                    <Package size={48} color="#9ca3af" />
                </View>
                <Text style={styles.notFoundTitle}>Product Not Found</Text>
                <Text style={styles.notFoundText}>
                    The product you're looking for doesn't exist.
                </Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={20} color="white" />
                    <Text style={styles.backButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleAddToCart = () => {
        if (!user) {
            return;
        }

        const variantId = getSelectedVariantId();
        createCartAsync({
            quantity: quantity,
            productId: productData.id,
            variantId: variantId,
        });

        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Item added to cart',
        })
    };

    const handleToggleWishlist = () => {
        setIsInWishlist(!isInWishlist);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this product: ${productData.variants[0].variantName} - ${productData.shortDescription}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const incrementQuantity = () => {
        if (quantity < currentStock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const primaryImage = productData.image.find(img => img.isPrimary) || productData.image[0];
    const images = productData.image || [];

    const renderImageItem = ({ item, index }: { item: any; index: number }) => (
        <TouchableOpacity
            onPress={() => setSelectedImage(index)}
            style={[
                styles.thumbnailContainer,
                selectedImage === index && styles.selectedThumbnail
            ]}
        >
            <Image
                source={{ uri: item.url }}
                style={styles.thumbnailImage}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    const renderStars = () => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                color={i < 4 ? '#fbbf24' : '#d1d5db'}
                fill={i < 4 ? '#fbbf24' : 'transparent'}
                style={styles.starIcon}
            />
        ));
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'description':
                return (
                    <View style={styles.tabContent}>
                        <Text style={styles.tabTitle}>Product Details</Text>
                        <Text style={styles.descriptionText}>{productData.fullDescription}</Text>

                        {productData.tag && productData.tag.length > 0 && (
                            <View>
                                <Text style={styles.tagTitle}>Tags:</Text>
                                <View style={styles.tagContainer}>
                                    {productData.tag.map((tag, index) => (
                                        <View key={index} style={styles.tagBadge}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                );

            case 'specifications':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.specSection}>
                            <Text style={styles.specTitle}>Product Specifications</Text>
                            <View style={styles.specList}>
                                <View style={styles.specRow}>
                                    <Text style={styles.specLabel}>Dimensions</Text>
                                    <Text style={styles.specValue}>
                                        {productData.length} × {productData.width} × {productData.height} {productData.dimensionUnit}
                                    </Text>
                                </View>
                                <View style={styles.specRow}>
                                    <Text style={styles.specLabel}>Weight</Text>
                                    <Text style={styles.specValue}>
                                        {productData.weight} {productData.weightUnit}
                                    </Text>
                                </View>
                                <View style={styles.specRow}>
                                    <Text style={styles.specLabel}>Material</Text>
                                    <Text style={styles.specValue}>{productData.material}</Text>
                                </View>
                                <View style={styles.specRow}>
                                    <Text style={styles.specLabel}>Warranty</Text>
                                    <Text style={styles.specValue}>
                                        {productData.warrantyPeriod} months ({productData.warrantyType})
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {productData.variants.length > 0 && (
                            <View style={styles.variantSection}>
                                <Text style={styles.variantTitle}>Available Variants</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {productData.variants.map((variant, index) => (
                                        <View key={index} style={styles.variantCard}>
                                            <View style={styles.variantHeader}>
                                                <Text style={styles.variantName}>{variant.variantName}</Text>
                                                {variant.isPrimary && (
                                                    <View style={styles.primaryBadge}>
                                                        <Text style={styles.primaryBadgeText}>Primary</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={styles.variantDetails}>
                                                <Text>Color: {variant.color}</Text>
                                                <Text>Size: {variant.size}</Text>
                                            </View>
                                            <View style={styles.variantFooter}>
                                                <Text style={styles.variantPrice}>{formatCurrency(variant.price)}</Text>
                                                <Text style={[
                                                    styles.variantStock,
                                                    variant.stock === 0 && styles.outOfStockText
                                                ]}>
                                                    Stock: {variant.stock}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                );

            case 'reviews':
                return (
                    <View style={styles.tabContent}>
                        {productData.reviews.length === 0 ? (
                            <View style={styles.emptyReviews}>
                                <MessageSquare size={48} color="#9ca3af" />
                                <Text style={styles.emptyReviewsTitle}>No Reviews Yet</Text>
                                <Text style={styles.emptyReviewsText}>Be the first to review this product!</Text>
                                <TouchableOpacity style={styles.writeReviewButton}>
                                    <Text style={styles.writeReviewButtonText}>Write a Review</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text>Reviews will be displayed here</Text>
                        )}
                    </View>
                );

            case 'shipping':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.shippingSection}>
                            <Text style={styles.shippingTitle}>Shipping Information</Text>
                            <View style={styles.shippingItem}>
                                <Truck size={20} color="#3b82f6" />
                                <View style={styles.shippingContent}>
                                    <Text style={styles.shippingItemTitle}>Standard Shipping</Text>
                                    <Text style={styles.shippingItemText}>
                                        3-5 business days • Free on orders over Rp 50.000
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.shippingItem}>
                                <Package size={20} color="#3b82f6" />
                                <View style={styles.shippingContent}>
                                    <Text style={styles.shippingItemTitle}>Express Shipping</Text>
                                    <Text style={styles.shippingItemText}>
                                        1-2 business days • Rp 25.000 flat rate
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.shippingSection}>
                            <Text style={styles.shippingTitle}>Return & Warranty</Text>
                            <View style={styles.shippingItem}>
                                <RefreshCw size={20} color="#3b82f6" />
                                <View style={styles.shippingContent}>
                                    <Text style={styles.shippingItemTitle}>30-Day Returns</Text>
                                    <Text style={styles.shippingItemText}>
                                        Full refund within 30 days of purchase
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.shippingItem}>
                                <Shield size={20} color="#3b82f6" />
                                <View style={styles.shippingContent}>
                                    <Text style={styles.shippingItemTitle}>Warranty Details</Text>
                                    <Text style={styles.shippingItemText}>
                                        {productData.warrantyDetail}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButtonIcon}>
                        <ArrowLeft size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: images[selectedImage]?.url || primaryImage?.url }}
                        style={styles.mainImage}
                        resizeMode="contain"
                    />

                    <View style={styles.categoryBadge}>
                        <View style={[styles.badge, { backgroundColor: categoryColor.bg }]}>
                            <Text style={[styles.badgeText, { color: categoryColor.text }]}>
                                {productData.category}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.imageActions}>
                        <TouchableOpacity
                            onPress={handleToggleWishlist}
                            style={styles.actionButton}
                        >
                            <Heart
                                size={20}
                                color={isInWishlist ? '#ef4444' : '#374151'}
                                fill={isInWishlist ? '#ef4444' : 'transparent'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleShare}
                            style={styles.actionButton}
                        >
                            <Share2 size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>
                </View>

                {images.length > 1 && (
                    <View style={styles.thumbnailsContainer}>
                        <FlatList
                            horizontal
                            data={images}
                            renderItem={renderImageItem}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.thumbnailsList}
                        />
                    </View>
                )}

                <View style={styles.contentContainer}>
                    <Text style={styles.productName}>{productData.productName}</Text>

                    <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                            {renderStars()}
                            <Text style={styles.ratingText}>4.0</Text>
                            <Text style={styles.reviewCount}>
                                ({productData.reviews.length} reviews)
                            </Text>
                        </View>
                        {currentStock > 0 ? (
                            <View style={styles.inStockBadge}>
                                <Text style={styles.inStockText}>In Stock: {currentStock}</Text>
                            </View>
                        ) : (
                            <View style={styles.outOfStockBadge}>
                                <Text style={styles.outOfStockText}>Out of Stock</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.shortDescription}>{productData.shortDescription}</Text>

                    <View style={styles.priceCard}>
                        <Text style={styles.priceText}>{formatCurrency(currentPrice)}</Text>

                        <View style={styles.priceInfo}>
                            <View style={styles.infoRow}>
                                <Truck size={16} color="#6b7280" />
                                <Text style={styles.infoText}>Free shipping on orders over Rp 50.000</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Package size={16} color="#6b7280" />
                                <Text style={styles.infoText}>Estimated delivery: 2-4 business days</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Shield size={16} color="#6b7280" />
                                <Text style={styles.infoText}>{productData.warrantyPeriod}-month warranty</Text>
                            </View>
                        </View>
                    </View>

                    {productData.variants.length > 1 && (
                        <View style={styles.variantSelector}>
                            <Text style={styles.sectionTitle}>Select Variant:</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedVariantName}
                                    onValueChange={(itemValue) => setSelectedVariantName(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select a variant" value="" />
                                    {productData.variants.map((variant, index) => (
                                        <Picker.Item
                                            key={`${variant.variantName}-${index}`}
                                            label={`${variant.variantName} - ${formatCurrency(variant.price)}${variant.stock === 0 ? ' (Out of Stock)' : ''}`}
                                            value={variant.variantName}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}

                    <View style={styles.quantitySection}>
                        <Text style={styles.sectionTitle}>Quantity:</Text>
                        <View style={styles.quantityContainer}>
                            <View style={styles.quantityControl}>
                                <TouchableOpacity
                                    onPress={decrementQuantity}
                                    disabled={quantity <= 1 || currentStock === 0}
                                    style={[
                                        styles.quantityButton,
                                        (quantity <= 1 || currentStock === 0) && styles.quantityButtonDisabled
                                    ]}
                                >
                                    <Minus size={20} color={quantity <= 1 || currentStock === 0 ? '#9ca3af' : '#374151'} />
                                </TouchableOpacity>
                                <Text style={styles.quantityValue}>{quantity}</Text>
                                <TouchableOpacity
                                    onPress={incrementQuantity}
                                    disabled={quantity >= currentStock || currentStock === 0}
                                    style={[
                                        styles.quantityButton,
                                        (quantity >= currentStock || currentStock === 0) && styles.quantityButtonDisabled
                                    ]}
                                >
                                    <Plus size={20} color={quantity >= currentStock || currentStock === 0 ? '#9ca3af' : '#374151'} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.stockInfo}>
                                {currentStock > 0 ? (
                                    <>
                                        <Text style={styles.stockText}>Only {currentStock} items left</Text>
                                        <ProgressBar
                                            progress={(currentStock - quantity) / currentStock}
                                            color="#3b82f6"
                                            style={styles.progressBar}
                                        />
                                    </>
                                ) : (
                                    <Text style={styles.outOfStockText}>Out of stock</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.addToCartButton,
                            currentStock === 0 && styles.addToCartButtonDisabled
                        ]}
                        onPress={handleAddToCart}
                        disabled={currentStock === 0}
                    >
                        <ShoppingCart size={20} color="white" />
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>

                    <View style={styles.sellerCard}>
                        <View style={styles.sellerInfo}>
                            <View style={styles.sellerAvatar}>
                                <Text style={styles.sellerAvatarText}>
                                    {productData.seller.name.charAt(0)}
                                </Text>
                            </View>
                            <View style={styles.sellerDetails}>
                                <View style={styles.sellerNameRow}>
                                    <Text style={styles.sellerName}>{productData.seller.name}</Text>
                                    <View style={styles.verifiedBadge}>
                                        <Text style={styles.verifiedBadgeText}>Verified Seller</Text>
                                    </View>
                                </View>
                                <Text style={styles.sellerEmail}>{productData.seller.email}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.visitStoreButton}>
                            <Store size={16} color="#3b82f6" />
                            <Text style={styles.visitStoreText}>Visit Store</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.tabsContainer}>
                    <View style={styles.tabsHeader}>
                        {['description', 'specifications', 'reviews', 'shipping'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                style={[
                                    styles.tabButton,
                                    activeTab === tab && styles.activeTabButton
                                ]}
                            >
                                <Text style={[
                                    styles.tabButtonText,
                                    activeTab === tab && styles.activeTabButtonText
                                ]}>
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    {tab === 'reviews' && ` (${productData.reviews.length})`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.tabContentContainer}>
                        {renderTabContent()}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    backButtonIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        height: 320,
        backgroundColor: '#f9fafb',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    categoryBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#dbeafe',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    imageActions: {
        position: 'absolute',
        top: 16,
        right: 16,
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    thumbnailsContainer: {
        paddingVertical: 8,
        backgroundColor: '#ffffff',
    },
    thumbnailsList: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    thumbnailContainer: {
        marginRight: 8,
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 8,
        overflow: 'hidden',
    },
    selectedThumbnail: {
        borderColor: '#3b82f6',
    },
    thumbnailImage: {
        width: 80,
        height: 80,
    },
    contentContainer: {
        padding: 16,
    },
    productName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    starIcon: {
        marginRight: 2,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginLeft: 4,
    },
    reviewCount: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 4,
    },
    inStockBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#86efac',
    },
    inStockText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#166534',
    },
    outOfStockBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    outOfStockText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#dc2626',
    },
    shortDescription: {
        fontSize: 16,
        color: '#6b7280',
        lineHeight: 24,
        marginBottom: 24,
    },
    priceCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
    },
    priceText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    priceInfo: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#6b7280',
        flex: 1,
    },
    variantSelector: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    quantitySection: {
        marginBottom: 24,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        overflow: 'hidden',
    },
    quantityButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    quantityButtonDisabled: {
        backgroundColor: '#f3f4f6',
    },
    quantityValue: {
        width: 64,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    stockInfo: {
        alignItems: 'flex-end',
    },
    stockText: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    progressBar: {
        width: 100,
        height: 4,
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 8,
        marginBottom: 24,
    },
    addToCartButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    sellerCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    sellerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    sellerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sellerAvatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#374151',
    },
    sellerDetails: {
        flex: 1,
    },
    sellerNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    verifiedBadge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    verifiedBadgeText: {
        fontSize: 12,
        color: '#6b7280',
    },
    sellerEmail: {
        fontSize: 14,
        color: '#6b7280',
    },
    visitStoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#3b82f6',
        borderRadius: 6,
    },
    visitStoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3b82f6',
    },
    tabsContainer: {
        marginTop: 8,
    },
    tabsHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: '#3b82f6',
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
    },
    activeTabButtonText: {
        color: '#3b82f6',
        fontWeight: '600',
    },
    tabContentContainer: {
        padding: 16,
    },
    tabContent: {
        padding: 0,
    },
    tabTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    descriptionText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 24,
    },
    tagTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagBadge: {
        backgroundColor: '#e5e7eb',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 14,
        color: '#374151',
    },
    specSection: {
        marginBottom: 24,
    },
    specTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    specList: {
        gap: 12,
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
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
    variantSection: {
        marginTop: 16,
    },
    variantTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    variantCard: {
        width: 200,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    variantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    variantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
    },
    primaryBadge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    primaryBadgeText: {
        fontSize: 12,
        color: '#6b7280',
    },
    variantDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    variantFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    variantPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    variantStock: {
        fontSize: 14,
        color: '#374151',
    },
    emptyReviews: {
        paddingVertical: 48,
        alignItems: 'center',
    },
    emptyReviewsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyReviewsText: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 24,
    },
    writeReviewButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    writeReviewButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    shippingSection: {
        marginBottom: 24,
    },
    shippingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    shippingItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    shippingContent: {
        flex: 1,
    },
    shippingItemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    shippingItemText: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    notFoundIcon: {
        width: 96,
        height: 96,
        backgroundColor: '#f3f4f6',
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    notFoundTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    notFoundText: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#3b82f6',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});