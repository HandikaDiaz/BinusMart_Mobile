import useEditProduct from '@/hooks/product/use-edit-product';
import { Edit, Package, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import ProductFormTabs from './product-form-tabs';

interface EditProductModalProps {
    visible: boolean;
    onClose: () => void;
    productId: string;
    onSuccess?: () => void;
}

export default function EditProductModal({
    visible,
    onClose,
    productId,
    onSuccess,
}: EditProductModalProps) {
    const [isInitialized, setIsInitialized] = useState(false);

    const {
        activeTab,
        isLoading,
        formValues,
        errors,
        isInitialized: hookInitialized,

        setActiveTab,
        resetForm,
        initializeForm,

        images,
        tags,
        tagInput,
        variants,
        specifications,
        newSpecKey,

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
        submitProduct,
    } = useEditProduct({
        productId,
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Product updated successfully!',
            });
            onSuccess?.();
            handleClose();
        },
    });

    const categories = [
        'ELECTRONICS',
        'FASHION',
        'HOME',
        'BOOKS',
        'SPORTS',
        'OTHER',
    ];

    useEffect(() => {
        if (visible && productId && !isInitialized) {
            initializeForm();
            setIsInitialized(true);
        }
    }, [visible, productId, initializeForm, isInitialized]);

    const handleEditProduct = async () => {
        try {
            await submitProduct();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleClose = () => {
        resetForm();
        setIsInitialized(false);
        onClose();
    };

    const isFormValid = () => {
        return (
            formValues.productName?.trim() &&
            formValues.fullDescription?.trim() &&
            formValues.category &&
            images.some(img => img.url.trim() !== '')
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
                        {Object.entries(errors).map(([field]) => (
                            <View key={field} style={styles.errorItem}>
                                <Text style={styles.errorBullet}>•</Text>
                                <Text style={styles.errorText}>
                                    Error in {field}
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
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={styles.titleContainer}>
                            <Package size={24} color="#111827" />
                            <Text style={styles.modalTitle}>Edit Product</Text>
                        </View>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <X size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.modalDescription}>
                        Update product information. Changes will be saved when you click "Update Product".
                    </Text>

                    {/* Loading State */}
                    {!hookInitialized && visible ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#3b82f6" />
                            <Text style={styles.loadingText}>Loading product data...</Text>
                        </View>
                    ) : (
                        <>
                            {/* Error Display */}
                            {displayErrors()}

                            {/* Form Content */}
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

                            {/* Footer */}
                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={handleClose}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.submitButton,
                                        (!isFormValid() || isLoading) && styles.disabledButton,
                                    ]}
                                    onPress={handleEditProduct}
                                    disabled={!isFormValid() || isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Edit size={16} color="white" />
                                            <Text style={styles.submitButtonText}>Update Product</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '95%',
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#6b7280',
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
        marginVertical: 16,
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
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        gap: 12,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
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
        fontWeight: '600',
        color: 'white',
    },
});