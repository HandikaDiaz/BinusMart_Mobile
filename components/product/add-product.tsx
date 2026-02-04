import { Categories } from '@/constants/type';
import useCreateProduct from '@/hooks/product/use-create-product';
import { Package, Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ProductFormTabs from './product-form-tabs';

interface CreateProductModalProps {
    onProductCreated?: () => void;
}

export default function CreateProductModal({ onProductCreated }: CreateProductModalProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const {
        activeTab,
        isLoading,
        formValues,
        setActiveTab,
        resetForm,
        images,
        tags,
        tagInput,
        variants,
        specifications,
        newSpecKey,
        errors,
        handleInputChange,
        handleCategoryChange,
        handleAddImage,
        handleRemoveImage,
        handleImageChange,
        handleAddTag,
        handleRemoveTag,
        handleAddVariant,
        handleRemoveVariant,
        handleVariantChange,
        handleAddSpecification,
        handleAddPresetSpecification,
        handleRemoveSpecification,
        handleSpecificationChange,
        setTagInput,
        setNewSpecKey,
        submitProduct
    } = useCreateProduct();

    const categories = Object.values(Categories);

    const handleCreateProduct = async () => {
        if (!isFormValid()) {
            Alert.alert('Validation Error', 'Please fill all required fields');
            return;
        }

        try {
            await submitProduct(() => {
                setModalVisible(false);
                onProductCreated?.();
            });
        } catch (error) {
            console.error('❌ Error:', error);
            Alert.alert('Error', 'Failed to create product. Please try again.');
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        resetForm();
    };

    const isFormValid = () => {
        return (
            formValues.productName &&
            formValues.fullDescription &&
            formValues.category &&
            images.some(img => img.url !== '') &&
            variants.some(variant => variant.price > 0)
        );
    };

    const displayErrors = () => {
        if (errors && Object.keys(errors).length > 0) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>
                        Please fix the following errors:
                    </Text>
                    <View style={styles.errorList}>
                        {Object.entries(errors).map(([field, error]) => (
                            <View key={field} style={styles.errorItem}>
                                <Text style={styles.errorBullet}>•</Text>
                                <Text style={styles.errorText}>
                                    {error?.message?.toString() || `Error in ${field}`}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            );
        }
        return null;
    };

    return (
        <>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Plus size={18} color="white" />
                <Text style={styles.addButtonText}>Add New Product</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleModalClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.titleContainer}>
                                <Package size={24} color="#111827" />
                                <Text style={styles.modalTitle}>Create New Product</Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleModalClose}
                                style={styles.closeButton}
                            >
                                <X size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalDescription}>
                            Complete all sections to create a detailed product listing
                        </Text>

                        {displayErrors()}

                        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            <ProductFormTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                formData={formValues}
                                images={images}
                                categories={categories}
                                onInputChange={handleInputChange}
                                onCategoryChange={handleCategoryChange}
                                onAddImage={handleAddImage}
                                onRemoveImage={handleRemoveImage}
                                onImageChange={handleImageChange}
                                variants={variants}
                                onAddVariant={handleAddVariant}
                                onRemoveVariant={handleRemoveVariant}
                                onVariantChange={handleVariantChange}
                                tags={tags}
                                tagInput={tagInput}
                                newSpecKey={newSpecKey}
                                specifications={specifications}
                                onAddSpecification={handleAddSpecification}
                                onAddPresetSpecification={handleAddPresetSpecification}
                                onRemoveSpecification={handleRemoveSpecification}
                                onSpecificationChange={handleSpecificationChange}
                                onAddTag={handleAddTag}
                                onRemoveTag={handleRemoveTag}
                                onTagInputChange={setTagInput}
                                onNewSpecKeyChange={setNewSpecKey}
                            />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <Text style={styles.footerNote}>
                                Fill all required fields (*) to enable submission
                            </Text>
                            <View style={styles.footerButtons}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={handleModalClose}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.submitButton,
                                        (!isFormValid() || isLoading) && styles.disabledButton
                                    ]}
                                    onPress={handleCreateProduct}
                                    disabled={!isFormValid() || isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Package size={16} color="white" />
                                            <Text style={styles.submitButtonText}>Create Product</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    addButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    modalDescription: {
        fontSize: 14,
        color: '#6b7280',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    errorContainer: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 20,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#dc2626',
        marginBottom: 8,
    },
    errorList: {
        gap: 4,
    },
    errorItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    errorBullet: {
        color: '#dc2626',
        fontSize: 14,
    },
    errorText: {
        fontSize: 13,
        color: '#7f1d1d',
        flex: 1,
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        gap: 16,
    },
    footerNote: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
    footerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    submitButton: {
        backgroundColor: '#3b82f6',
    },
    disabledButton: {
        backgroundColor: '#9ca3af',
    },
    submitButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
    },
});