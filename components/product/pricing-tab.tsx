import { productType } from '@/constants/schema';
import type { Variants } from '@/constants/type';
import { AlertCircle, Box, DollarSign, Shield } from 'lucide-react-native';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface PricingTabProps {
    formData: productType;
    variants: Variants[];
    onInputChange: (name: keyof productType, value: string) => void;
    onVariantChange: (index: number, field: keyof Variants, value: string | number) => void;
}

export default function PricingTab({
    formData,
    variants,
    onInputChange,
    onVariantChange
}: PricingTabProps) {
    const defaultVariant = variants[0] || { price: '', stock: '' };

    const warrantyTypes = [
        { value: 'MANUFACTURER', label: 'Manufacturer' },
        { value: 'SELLER', label: 'Seller' },
        { value: 'INTERNATIONAL', label: 'International' },
        { value: 'LIMITED', label: 'Limited' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <DollarSign size={20} color="#4b5563" />
                    <Text style={styles.sectionTitle}>Pricing & Inventory (Default Variant)</Text>
                </View>

                <View style={styles.pricingRow}>
                    <View style={styles.field}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>
                                Price (Rp) *
                            </Text>
                            <AlertCircle size={12} color="#6b7280" />
                        </View>
                        <View style={styles.inputWithIcon}>
                            <DollarSign size={16} color="#9ca3af" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.priceInput]}
                                placeholder="0"
                                value={defaultVariant.price?.toString()}
                                onChangeText={(value) => onVariantChange(0, 'price', value)}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.field}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>
                                Stock *
                            </Text>
                            <AlertCircle size={12} color="#6b7280" />
                        </View>
                        <View style={styles.inputWithIcon}>
                            <Box size={16} color="#9ca3af" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.stockInput]}
                                placeholder="0"
                                value={defaultVariant.stock?.toString()}
                                onChangeText={(value) => onVariantChange(0, 'stock', value)}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Shield size={20} color="#4b5563" />
                    <Text style={styles.sectionTitle}>Warranty Information</Text>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Warranty Period (Months)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0"
                        value={formData.warrantyPeriod?.toString()}
                        onChangeText={(value) => onInputChange('warrantyPeriod', value)}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Warranty Type</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.warrantyTypeScroll}
                    >
                        <View style={styles.warrantyTypeContainer}>
                            {warrantyTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.value}
                                    style={[
                                        styles.warrantyTypeButton,
                                        formData.warrantyType === type.value && styles.warrantyTypeButtonActive,
                                    ]}
                                    onPress={() => onInputChange('warrantyType', type.value)}
                                >
                                    <Text style={[
                                        styles.warrantyTypeText,
                                        formData.warrantyType === type.value && styles.warrantyTypeTextActive,
                                    ]}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.warrantyDetailField}>
                    <Text style={styles.label}>Warranty Details</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Warranty coverage details..."
                        value={formData.warrantyDetail}
                        onChangeText={(value) => onInputChange('warrantyDetail', value)}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
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
        padding: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    pricingRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    field: {
        flex: 1,
        gap: 8,
        marginBottom: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        width: '100%',
    },
    priceInput: {
        paddingLeft: 36,
    },
    stockInput: {
        paddingLeft: 36,
    },
    warrantyRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    warrantyTypeScroll: {
        flexGrow: 0,
    },
    warrantyTypeContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 4,
    },
    warrantyTypeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        minWidth: 100,
    },
    warrantyTypeButtonActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
    },
    warrantyTypeText: {
        fontSize: 12,
        color: '#374151',
        textAlign: 'center',
    },
    warrantyTypeTextActive: {
        color: '#3b82f6',
        fontWeight: '500',
    },
    warrantyDetailField: {
        gap: 8,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
});