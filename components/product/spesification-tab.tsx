import { productType } from '@/constants/schema';
import type { Specifications } from '@/constants/type';
import { Code, Globe } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import ProductSpecificationsSection from './product-spesification-section';
import ProductTagsSection from './product-tag-section';

interface SpecificationsTabProps {
    specifications: Specifications[];
    newSpecKey: string;
    tags: string[];
    tagInput: string;
    formData: productType;
    onAddSpecification: () => void;
    onAddPresetSpecification: (spec: { specificationName: string; specificationDetail: string }) => void;
    onRemoveSpecification: (index: number) => void;
    onSpecificationChange: (index: number, field: 'specificationName' | 'specificationDetail', value: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
    onInputChange: (name: keyof productType, value: string) => void;
    onTagInputChange: (value: string) => void;
    onNewSpecKeyChange: (value: string) => void;
}

export default function SpecificationsTab({
    specifications,
    newSpecKey,
    tags,
    tagInput,
    formData,
    onAddSpecification,
    onAddPresetSpecification,
    onRemoveSpecification,
    onSpecificationChange,
    onAddTag,
    onRemoveTag,
    onInputChange,
    onTagInputChange,
    onNewSpecKeyChange,
}: SpecificationsTabProps) {

    const presetSpecifications = [
        { icon: '⚙️', specificationName: 'Processor', specificationDetail: '' },
        { icon: '💾', specificationName: 'RAM', specificationDetail: '' },
        { icon: '💿', specificationName: 'Storage', specificationDetail: '' },
        { icon: '🖥️', specificationName: 'Display', specificationDetail: '' },
        { icon: '🔋', specificationName: 'Battery', specificationDetail: '' },
        { icon: '📷', specificationName: 'Camera', specificationDetail: '' },
        { icon: '⚡', specificationName: 'Power', specificationDetail: '' },
        { icon: '📊', specificationName: 'Performance', specificationDetail: '' },
    ];

    const handleSubmitEditing = () => {
        if (newSpecKey.trim()) {
            onAddSpecification();
        }
    };

    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.headerRow}>
                            <View style={styles.titleContainer}>
                                <Code size={20} color="#4b5563" />
                                <Text style={styles.title}>Specifications & Details</Text>
                            </View>
                        </View>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.specInput}
                                placeholder="Add new spec key"
                                value={newSpecKey}
                                onChangeText={onNewSpecKeyChange}
                                onSubmitEditing={handleSubmitEditing}
                                placeholderTextColor="#9ca3af"
                            />
                            <TouchableOpacity
                                style={[styles.addSpecButton, !newSpecKey.trim() && styles.disabledButton]}
                                onPress={onAddSpecification}
                                disabled={!newSpecKey.trim()}
                            >
                                <Text style={styles.addSpecButtonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.cardContent}>
                        <ProductSpecificationsSection
                            specifications={specifications}
                            presetSpecifications={presetSpecifications}
                            onAddSpecification={onAddPresetSpecification}
                            onRemoveSpecification={onRemoveSpecification}
                            onSpecificationChange={onSpecificationChange}
                        />
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.titleContainer}>
                            <Globe size={20} color="#4b5563" />
                            <Text style={styles.title}>SEO Optimization</Text>
                        </View>
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Meta Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="SEO title for search engines"
                                value={formData.metaTitle}
                                onChangeText={(value) => onInputChange('metaTitle', value)}
                                placeholderTextColor="#9ca3af"
                            />
                            <Text style={styles.helperText}>
                                Recommended: 50-60 characters
                            </Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Meta Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="SEO description for search engines"
                                value={formData.metaDescription}
                                onChangeText={(value) => onInputChange('metaDescription', value)}
                                multiline
                                numberOfLines={4}
                                placeholderTextColor="#9ca3af"
                            />
                            <Text style={styles.helperText}>
                                Recommended: 150-160 characters
                            </Text>
                        </View>

                        <ProductTagsSection
                            tags={tags}
                            tagInput={tagInput}
                            onTagInputChange={onTagInputChange}
                            onAddTag={onAddTag}
                            onRemoveTag={onRemoveTag}
                        />
                    </View>
                </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
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
        
        marginBottom: 16,
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
        marginBottom: 16,
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
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    specInput: {
        width: 150,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: 'white',
        marginRight: 8,
    },
    addSpecButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        backgroundColor: 'white',
    },
    disabledButton: {
        opacity: 0.5,
    },
    addSpecButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
    },
    cardContent: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
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
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    helperText: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
    },
});