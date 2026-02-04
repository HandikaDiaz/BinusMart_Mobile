import type { Variants } from '@/constants/type';
import { AlertCircle, Layers, Plus } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ProductVariantsSection from './product-variant-section';

interface VariantsTabProps {
    variants: Variants[];
    onAddVariant: () => void;
    onRemoveVariant: (index: number) => void;
    onVariantChange: (index: number, field: keyof Variants, value: string | number) => void;
};

const VariantsTab: React.FC<VariantsTabProps> = ({
    variants,
    onAddVariant,
    onRemoveVariant,
    onVariantChange,
}) => {
    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.headerRow}>
                        <View style={styles.titleContainer}>
                            <Layers size={20} color="#4b5563" />
                            <Text style={styles.title}>Product Variants</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={onAddVariant}
                        >
                            <Plus size={16} color="#4b5563" />
                            <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.description}>
                        Add different versions of this product (size, color, etc.)
                    </Text>

                    <ProductVariantsSection
                        variants={variants}
                        onRemoveVariant={onRemoveVariant}
                        onVariantChange={onVariantChange}
                    />

                    <View style={styles.tipBox}>
                        <AlertCircle size={16} color="#3b82f6" style={styles.alertIcon} />
                        <View style={styles.tipContent}>
                            <Text style={styles.tipTitle}>Variant Tips</Text>
                            <View style={styles.tipList}>
                                <Text style={styles.tipItem}>• First variant will be the default product</Text>
                                <Text style={styles.tipItem}>• Leave variant name empty to skip</Text>
                                <Text style={styles.tipItem}>• Prices can vary between variants</Text>
                                <Text style={styles.tipItem}>• Stock is managed per variant</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
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
    cardHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
        color: '#111827',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        backgroundColor: 'white',
    },
    buttonText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
    },
    cardContent: {
        padding: 20,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 20,
    },
    tipBox: {
        backgroundColor: '#eff6ff',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    alertIcon: {
        marginTop: 2,
    },
    tipContent: {
        marginLeft: 12,
        flex: 1,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e40af',
        marginBottom: 4,
    },
    tipList: {
        marginTop: 2,
    },
    tipItem: {
        fontSize: 13,
        color: '#4b5563',
        marginBottom: 2,
        lineHeight: 18,
    },
});

export default VariantsTab;