import { productType } from '@/constants/schema';
import type { Images, Specifications, Variants } from '@/constants/type';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import BasicInformationTab from './basic-information-tab';
import PricingTab from './pricing-tab';
import SpecificationsTab from './spesification-tab';
import VariantsTab from './variants-tab';

interface ProductFormTabsProps {
    activeTab: string;
    onTabChange: (value: string) => void;
    formData: productType;

    images: Images[];
    categories: string[];
    onInputChange: (name: keyof productType, value: string) => void;
    onCategoryChange: (category: string) => void;
    onAddImage: () => void;
    onRemoveImage: (index: number) => void;
    onImageChange: (index: number, value: string) => void;

    variants: Variants[];
    onAddVariant: () => void;
    onRemoveVariant: (index: number) => void;
    onVariantChange: (index: number, field: keyof Variants, value: string | number) => void;

    tags: string[];
    tagInput: string;
    newSpecKey: string;
    specifications: Specifications[];
    onAddSpecification: () => void;
    onAddPresetSpecification: (spec: { specificationName: string; specificationDetail: string }) => void;
    onRemoveSpecification: (index: number) => void;
    onSpecificationChange: (index: number, field: 'specificationName' | 'specificationDetail', value: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
    onTagInputChange: (value: string) => void;
    onNewSpecKeyChange: (value: string) => void;
}

export default function ProductFormTabs({
    activeTab,
    onTabChange,
    formData,
    images,
    categories,
    variants,
    onInputChange,
    onCategoryChange,
    onAddImage,
    onRemoveImage,
    onImageChange,
    onAddVariant,
    onRemoveVariant,
    onVariantChange,
    tags,
    tagInput,
    newSpecKey,
    specifications,
    onAddSpecification,
    onAddPresetSpecification,
    onRemoveSpecification,
    onSpecificationChange,
    onAddTag,
    onRemoveTag,
    onTagInputChange,
    onNewSpecKeyChange
}: ProductFormTabsProps) {
    const tabs = [
        { id: 'basic', label: 'Basic' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'variants', label: 'Variants' },
        { id: 'specs', label: 'Specifications' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.tabList}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[
                            styles.tabTrigger,
                            activeTab === tab.id && styles.activeTab,
                        ]}
                        onPress={() => onTabChange(tab.id)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab.id && styles.activeTabText
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'basic' && (
                    <BasicInformationTab
                        formData={formData}
                        images={images}
                        categories={categories.map(name => ({ id: name, name }))}
                        onInputChange={onInputChange}
                        onCategoryChange={onCategoryChange}
                        onAddImage={onAddImage}
                        onRemoveImage={onRemoveImage}
                        onImageChange={onImageChange}
                    />
                )}

                {activeTab === 'pricing' && (
                    <PricingTab
                        formData={formData}
                        variants={variants}
                        onVariantChange={onVariantChange}
                        onInputChange={onInputChange}
                    />
                )}

                {activeTab === 'variants' && (
                    <VariantsTab
                        variants={variants}
                        onAddVariant={onAddVariant}
                        onRemoveVariant={onRemoveVariant}
                        onVariantChange={onVariantChange}
                    />
                )}

                {activeTab === 'specs' && (
                    <SpecificationsTab
                        specifications={specifications}
                        newSpecKey={newSpecKey}
                        tags={tags}
                        tagInput={tagInput}
                        formData={formData}
                        onAddSpecification={onAddSpecification}
                        onAddPresetSpecification={onAddPresetSpecification}
                        onRemoveSpecification={onRemoveSpecification}
                        onSpecificationChange={onSpecificationChange}
                        onAddTag={onAddTag}
                        onRemoveTag={onRemoveTag}
                        onInputChange={onInputChange}
                        onTagInputChange={onTagInputChange}
                        onNewSpecKeyChange={onNewSpecKeyChange}
                    />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabList: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    tabTrigger: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        paddingVertical: 10,
    },
    activeTab: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6b7280',
    },
    activeTabText: {
        color: '#111827',
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
    },
});