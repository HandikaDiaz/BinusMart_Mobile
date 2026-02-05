import type { Cart } from '@/constants/type';
import { Link } from 'expo-router';
import { AlertCircle, Heart, Minus, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
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
    const [localQuantity, setLocalQuantity] = useState(item.quantity);
    const [isUpdating, setIsUpdating] = useState(false);
    const debounceTimeoutRef = useRef<number | null>(null);
    const previousQuantityRef = useRef(item.quantity);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    useEffect(() => {
        if (previousQuantityRef.current !== item.quantity) {
            setLocalQuantity(item.quantity);
            previousQuantityRef.current = item.quantity;
        }
    }, [item.quantity]);

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > stock) return;
        setLocalQuantity(newQuantity);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(async () => {
            setIsUpdating(true);
            try {
                await onQuantityChange(item.id, newQuantity);
                previousQuantityRef.current = newQuantity;
            } catch (error) {
                setLocalQuantity(previousQuantityRef.current);
                console.error('Error updating quantity:', error);
            } finally {
                setIsUpdating(false);
            }
        }, 1000);
    };

    const handleDecrease = () => {
        const newQuantity = localQuantity - 1;
        if (newQuantity >= 1) {
            handleQuantityChange(newQuantity);
        }
    };

    const handleIncrease = () => {
        const newQuantity = localQuantity + 1;
        if (newQuantity <= stock) {
            handleQuantityChange(newQuantity);
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
            <View style={styles.topRow}>
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={handleSelect}
                >
                    <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                        {isSelected && <View style={styles.checkmark} />}
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

                <View style={styles.productBasicInfo}>
                    <View style={styles.nameAndPriceRow}>
                        <Link href={`/product/${item.product.id}`} asChild>
                            <TouchableOpacity style={styles.productNameContainer}>
                                <Text style={styles.productName} numberOfLines={2}>
                                    {item.variant.variantName}
                                </Text>
                            </TouchableOpacity>
                        </Link>

                        <Text style={styles.productPrice}>
                            {formatCurrency(item.variant.price)}
                        </Text>
                    </View>

                    <View style={styles.categoryContainer}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>
                                {item.product.category}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {item.product.shortDescription && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description} numberOfLines={2}>
                        {item.product.shortDescription}
                    </Text>
                </View>
            )}

            {item.variant.stock < 15 && item.variant.stock > 0 && (
                <View style={styles.stockWarning}>
                    <AlertCircle size={14} color="#d97706" />
                    <Text style={styles.stockWarningText}>
                        Hanya tersisa {item.variant.stock} item
                    </Text>
                </View>
            )}

            {item.variant.stock === 0 && (
                <View style={[styles.stockWarning, styles.outOfStockWarning]}>
                    <AlertCircle size={14} color="#dc2626" />
                    <Text style={styles.outOfStockText}>
                        Stok habis
                    </Text>
                </View>
            )}

            <View style={styles.bottomRow}>
                <View style={styles.quantitySection}>
                    <Text style={styles.quantityLabel}>Jumlah:</Text>

                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            style={[
                                styles.quantityButton,
                                localQuantity <= 1 && styles.quantityButtonDisabled
                            ]}
                            onPress={handleDecrease}
                            disabled={localQuantity <= 1 || isUpdating || item.variant.stock === 0}
                        >
                            <Minus
                                size={16}
                                color={localQuantity <= 1 ? '#9ca3af' : '#374151'}
                            />
                        </TouchableOpacity>

                        <View style={styles.quantityDisplay}>
                            <Text style={styles.quantityText}>{localQuantity}</Text>
                            {isUpdating && (
                                <View style={styles.updatingIndicator}>
                                    <View style={styles.updatingDot} />
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.quantityButton,
                                localQuantity >= item.variant.stock && styles.quantityButtonDisabled
                            ]}
                            onPress={handleIncrease}
                            disabled={localQuantity >= item.variant.stock || isUpdating || item.variant.stock === 0}
                        >
                            <Plus
                                size={16}
                                color={localQuantity >= item.variant.stock ? '#9ca3af' : '#374151'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.rightSection}>
                    <View style={styles.totalPriceContainer}>
                        <Text style={styles.totalPriceLabel}>Total:</Text>
                        <Text style={styles.totalPrice}>
                            {formatCurrency(item.variant.price * localQuantity)}
                        </Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.iconButton, styles.wishlistButton]}
                            disabled={item.variant.stock === 0}
                        >
                            <Heart size={18} color="#6b7280" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.iconButton, styles.removeButton]}
                            onPress={handleRemove}
                        >
                            <Trash2 size={18} color="#dc2626" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    checkboxContainer: {
        marginRight: 12,
        marginTop: 4,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    checkboxChecked: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    checkmark: {
        width: 10,
        height: 10,
        backgroundColor: '#ffffff',
        borderRadius: 2,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginRight: 12,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productBasicInfo: {
        flex: 1,
    },
    nameAndPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    productNameContainer: {
        flex: 1,
        marginRight: 8,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        lineHeight: 20,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryBadge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    categoryText: {
        fontSize: 12,
        color: '#4b5563',
        fontWeight: '500',
    },
    descriptionContainer: {
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    stockWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef3c7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    outOfStockWarning: {
        backgroundColor: '#fef2f2',
    },
    stockWarningText: {
        fontSize: 12,
        color: '#92400e',
        fontWeight: '500',
        marginLeft: 6,
    },
    outOfStockText: {
        fontSize: 12,
        color: '#dc2626',
        fontWeight: '500',
        marginLeft: 6,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 12,
    },
    quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityLabel: {
        fontSize: 14,
        color: '#4b5563',
        marginRight: 12,
        fontWeight: '500',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        overflow: 'hidden',
    },
    quantityButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    quantityButtonDisabled: {
        backgroundColor: '#f3f4f6',
    },
    quantityDisplay: {
        width: 40,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#d1d5db',
        position: 'relative',
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    updatingIndicator: {
        position: 'absolute',
        top: -3,
        right: -3,
        width: 8,
        height: 8,
    },
    updatingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3b82f6',
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    totalPriceContainer: {
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    totalPriceLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    wishlistButton: {
        backgroundColor: '#ffffff',
    },
    removeButton: {
        backgroundColor: '#ffffff',
    },
});