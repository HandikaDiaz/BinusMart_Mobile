import type { Variants } from '@/constants/type';
import { X } from 'lucide-react-native';
import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface VariantInputProps {
    index: number;
    variant: Variants;
    canRemove: boolean;
    onRemoveVariant: (index: number) => void;
    onVariantChange: (index: number, field: keyof Variants, value: string | number) => void;
};

const VariantInput = React.memo(({
    index,
    variant,
    canRemove,
    onRemoveVariant,
    onVariantChange,
}: VariantInputProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Variant {index + 1}</Text>
                {canRemove && (
                    <TouchableOpacity
                        onPress={() => onRemoveVariant(index)}
                        style={styles.removeButton}
                    >
                        <X size={16} color="#ef4444" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.inputGrid}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Variant Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Blue, Large"
                        value={variant.variantName}
                        onChangeText={(text) => onVariantChange(index, 'variantName', text)}
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Price (Rp) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0"
                        value={variant.price.toString()}
                        onChangeText={(text) => onVariantChange(index, 'price', parseFloat(text) || 0)}
                        keyboardType="numeric"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Stock</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0"
                        value={variant.stock.toString()}
                        onChangeText={(text) => onVariantChange(index, 'stock', parseInt(text) || 0)}
                        keyboardType="numeric"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>SKU</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Variant-SKU"
                        value={variant.SKU}
                        onChangeText={(text) => onVariantChange(index, 'SKU', text)}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </View>

            <View style={styles.secondRow}>
                <View style={[styles.inputGroup]}>
                    <Text style={styles.label}>Color</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Red, Blue"
                        value={variant.color}
                        onChangeText={(text) => onVariantChange(index, 'color', text)}
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={[styles.inputGroup]}>
                    <Text style={styles.label}>Size</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., S, M, L"
                        value={variant.size}
                        onChangeText={(text) => onVariantChange(index, 'size', text)}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </View>
        </View>
    );
});

VariantInput.displayName = 'VariantInput';

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    removeButton: {
        padding: 4,
    },
    inputGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
        marginBottom: 12,
    },
    inputGroup: {
        width: '50%',
        paddingHorizontal: 4,
        marginBottom: 12,
    },
    secondRow: {
        flexDirection: 'row',
        marginHorizontal: -4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        color: '#374151',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
        fontSize: 14,
        backgroundColor: 'white',
        color: '#111827',
    },
});

export default VariantInput;