import type { Specifications } from '@/constants/type';
import { X } from 'lucide-react-native';
import React, { useCallback } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProductSpecificationsSectionProps {
    specifications: Specifications[];
    presetSpecifications: { icon: string; specificationName: string; specificationDetail: string }[];
    onAddSpecification: (spec: { specificationName: string; specificationDetail: string }) => void;
    onRemoveSpecification: (index: number) => void;
    onSpecificationChange: (index: number, field: 'specificationName' | 'specificationDetail', value: string) => void;
};

const ProductSpecificationsSection = React.memo(({
    specifications,
    presetSpecifications,
    onAddSpecification,
    onRemoveSpecification,
    onSpecificationChange,
}: ProductSpecificationsSectionProps) => {

    const handleSpecNameChange = useCallback((index: number, value: string) => {
        onSpecificationChange(index, 'specificationName', value);
    }, [onSpecificationChange]);

    const handleSpecDetailChange = useCallback((index: number, value: string) => {
        onSpecificationChange(index, 'specificationDetail', value);
    }, [onSpecificationChange]);

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Add Preset Specifications</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.presetContainer}
                >
                    {presetSpecifications.map((preset) => (
                        <TouchableOpacity
                            key={preset.specificationName}
                            style={[
                                styles.presetButton,
                                specifications.some(s => s.specificationName === preset.specificationName) &&
                                styles.disabledPresetButton
                            ]}
                            onPress={() => onAddSpecification({
                                specificationName: preset.specificationName,
                                specificationDetail: preset.specificationDetail
                            })}
                            disabled={specifications.some(s => s.specificationName === preset.specificationName)}
                        >
                            <Text>{preset.icon}</Text>
                            <Text style={styles.presetButtonText}>{preset.specificationName}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Specifications</Text>
                {specifications.length === 0 ? (
                    <Text style={styles.emptyText}>No specifications added yet.</Text>
                ) : (
                    <View style={styles.specificationsList}>
                        {specifications.map((spec, index) => (
                            <SpecificationRow
                                key={index}
                                index={index}
                                spec={spec}
                                onRemove={onRemoveSpecification}
                                onSpecNameChange={handleSpecNameChange}
                                onSpecDetailChange={handleSpecDetailChange}
                            />
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
});

interface SpecificationRowProps {
    index: number;
    spec: Specifications;
    onRemove: (index: number) => void;
    onSpecNameChange: (index: number, value: string) => void;
    onSpecDetailChange: (index: number, value: string) => void;
};

const SpecificationRow = React.memo(({
    index,
    spec,
    onRemove,
    onSpecNameChange,
    onSpecDetailChange
}: SpecificationRowProps) => {
    return (
        <View style={styles.row}>
            <View style={styles.inputsContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Key</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Processor"
                        value={spec.specificationName}
                        onChangeText={(value) => onSpecNameChange(index, value)}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Value</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Intel Core i7"
                        value={spec.specificationDetail}
                        onChangeText={(value) => onSpecDetailChange(index, value)}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </View>
            <TouchableOpacity
                onPress={() => onRemove(index)}
                style={styles.removeButton}
            >
                <X size={16} color="#ef4444" />
            </TouchableOpacity>
        </View>
    );
});

ProductSpecificationsSection.displayName = 'ProductSpecificationsSection';
SpecificationRow.displayName = 'SpecificationRow';

const styles = StyleSheet.create({
    container: {
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    presetContainer: {
        gap: 8,
        paddingVertical: 4,
    },
    presetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        backgroundColor: 'white',
        gap: 8,
    },
    disabledPresetButton: {
        opacity: 0.5,
    },
    presetButtonText: {
        fontSize: 14,
        color: '#374151',
    },
    emptyText: {
        fontSize: 14,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    specificationsList: {
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    inputsContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: 12,
    },
    inputGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
        color: '#374151',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: 'white',
    },
    removeButton: {
        padding: 8,
        marginTop: 26,
    },
});

export default ProductSpecificationsSection;