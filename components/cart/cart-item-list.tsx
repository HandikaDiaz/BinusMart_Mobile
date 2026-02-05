import type { Cart } from '@/constants/type';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CartItemCard from './cart-item-card';

interface CartItemListProps {
    cart: Cart[];
    selectedItems: string[];
    allSelected: boolean;
    onSelectAll: (checked: boolean) => void;
    onSelectItem: (itemId: string, checked: boolean) => void;
    onQuantityChange: (itemId: string, quantity: number) => Promise<void>;
    onRemoveItem: (itemId: string) => void;
    subtotal?: number;
}

export default function CartItemList({
    cart,
    selectedItems,
    allSelected,
    onSelectAll,
    onSelectItem,
    onQuantityChange,
    onRemoveItem,
    subtotal = 0
}: CartItemListProps) {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <View style={styles.container}>
            <View style={styles.selectAllCard}>
                <View style={styles.selectAllContent}>
                    <View style={styles.selectAllRow}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => onSelectAll(!allSelected)}
                        >
                            <View style={[styles.checkbox, allSelected && styles.checkboxChecked]}>
                                {allSelected && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.selectAllText}>
                                Select All ({selectedItems.length} selected)
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.subtotalText}>
                            Total for selected: {formatCurrency(subtotal)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.itemsList}>
                {cart.map((item) => (
                    <CartItemCard
                        key={item.id}
                        item={item}
                        stock={item.variant.stock}
                        isSelected={selectedItems.includes(item.id)}
                        onSelect={onSelectItem}
                        onQuantityChange={onQuantityChange}
                        onRemove={onRemoveItem}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    selectAllCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    selectAllContent: {
        paddingVertical: 4,
    },
    selectAllRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
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
    selectAllText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    subtotalText: {
        fontSize: 14,
        color: '#6b7280',
    },
    itemsList: {
        gap: 12,
    },
});