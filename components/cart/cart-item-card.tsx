import type { Cart } from '@/constants/type';
import { Link } from 'expo-router';
import { Heart, Minus, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CartItemCardProps {
    item: Cart;
    isSelected: boolean;
    stock: number;
    onSelect: (itemId: string, checked: boolean) => void;
    onQuantityChange: (itemId: string, quantity: number) => Promise<void>;
    onRemove: (itemId: string) => void;
}

export default function CartItemCard({
    item,
    isSelected,
    stock,
    onSelect,
    onQuantityChange,
    onRemove,
}: CartItemCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > stock || isUpdating) return;

        setIsUpdating(true);
        try {
            await onQuantityChange(item.id, newQuantity);
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSelect = () => {
        onSelect(item.id, !isSelected);
    };

    const handleRemove = () => {
        onRemove(item.id);
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.mainContent}>
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={handleSelect}
                    >
                        <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                            {isSelected && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                    </TouchableOpacity>

                    <Link href={`/product/${item.product.id}`} asChild>
                        <TouchableOpacity style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.product.image[0]?.url }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </Link>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailsHeader}>
                            <View style={styles.productInfo}>
                                <Link href={`/product/${item.product.id}`} asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.productName} numberOfLines={1}>
                                            {item.variant.variantName}
                                        </Text>
                                    </TouchableOpacity>
                                </Link>

                                <View style={styles.badgesContainer}>
                                    <View style={styles.categoryBadge}>
                                        <Text style={styles.categoryText}>{item.product.category}</Text>
                                    </View>
                                    {item.variant.stock < 15 && (
                                        <View style={styles.stockBadge}>
                                            <Text style={styles.stockText}>
                                                Only {item.variant.stock} left
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {item.product.shortDescription && (
                                    <Text style={styles.description} numberOfLines={2}>
                                        {item.product.shortDescription}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.priceContainer}>
                                <Text style={styles.totalPrice}>
                                    {formatCurrency(item.variant.price * item.quantity)}
                                </Text>
                                <Text style={styles.unitPrice}>
                                    {formatCurrency(item.variant.price)} each
                                </Text>
                            </View>
                        </View>

                        <View style={styles.actionsContainer}>
                            <View style={styles.quantityContainer}>
                                <View style={styles.quantityControls}>
                                    <TouchableOpacity
                                        style={[
                                            styles.quantityButton,
                                            item.quantity <= 1 && styles.quantityButtonDisabled
                                        ]}
                                        onPress={() => handleQuantityChange(item.quantity - 1)}
                                        disabled={item.quantity <= 1 || isUpdating}
                                    >
                                        <Minus size={14} color={item.quantity <= 1 ? '#9ca3af' : '#374151'} />
                                    </TouchableOpacity>

                                    <Text style={styles.quantityText}>{item.quantity}</Text>

                                    <TouchableOpacity
                                        style={[
                                            styles.quantityButton,
                                            item.quantity >= item.variant.stock && styles.quantityButtonDisabled
                                        ]}
                                        onPress={() => handleQuantityChange(item.quantity + 1)}
                                        disabled={item.quantity >= item.variant.stock || isUpdating}
                                    >
                                        <Plus size={14} color={item.quantity >= item.variant.stock ? '#9ca3af' : '#374151'} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.stockStatus}>
                                    {item.variant.stock > 0 ? (
                                        <Text style={styles.inStockText}>In Stock</Text>
                                    ) : (
                                        <Text style={styles.outOfStockText}>Out of Stock</Text>
                                    )}
                                </Text>
                            </View>

                            <View style={styles.itemActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Heart size={16} color="#6b7280" />
                                    <Text style={styles.actionText}>Save</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton]}
                                    onPress={handleRemove}
                                >
                                    <Trash2 size={16} color="#dc2626" />
                                    <Text style={[styles.actionText, styles.removeText]}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardContent: {
        padding: 16,
    },
    mainContent: {
        flexDirection: 'row',
        gap: 12,
    },
    checkboxContainer: {
        paddingTop: 4,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    checkmark: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    imageContainer: {
        width: 96,
        height: 96,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    detailsContainer: {
        flex: 1,
        minWidth: 0,
    },
    detailsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    productInfo: {
        flex: 1,
        marginRight: 12,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    badgesContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    categoryBadge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    categoryText: {
        fontSize: 12,
        color: '#374151',
    },
    stockBadge: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    stockText: {
        fontSize: 12,
        color: '#ffffff',
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    unitPrice: {
        fontSize: 14,
        color: '#6b7280',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityContainer: {
        alignItems: 'flex-start',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        overflow: 'hidden',
    },
    quantityButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    quantityButtonDisabled: {
        backgroundColor: '#f3f4f6',
    },
    quantityText: {
        width: 40,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    stockStatus: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    inStockText: {
        color: '#166534',
    },
    outOfStockText: {
        color: '#dc2626',
    },
    itemActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    actionText: {
        fontSize: 14,
        color: '#6b7280',
    },
    removeText: {
        color: '#dc2626',
    },
});