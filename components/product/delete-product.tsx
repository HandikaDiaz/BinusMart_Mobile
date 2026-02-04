import useDeleteProduct from '@/hooks/product/use-delete-product';
import { AlertTriangle, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';

interface DeleteProductModalProps {
    visible: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    onSuccess?: () => void;
}

export default function DeleteProductModal({
    visible,
    onClose,
    productId,
    productName,
    onSuccess,
}: DeleteProductModalProps) {
    const [confirmationText, setConfirmationText] = useState('');
    const { deleteProductAsync, isDeleting } = useDeleteProduct({ productId });

    const handleDelete = async () => {
        if (confirmationText !== 'DELETE') {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: "Please type 'DELETE' to confirm",
            });
            return;
        }

        try {
            await deleteProductAsync();
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Product deleted successfully!',
            });
            onSuccess?.();
            onClose();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to delete product',
            });
        }
    };

    const handleClose = () => {
        setConfirmationText('');
        onClose();
    };

    const isDeleteEnabled = confirmationText === 'DELETE';

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={styles.headerIconContainer}>
                            <AlertTriangle size={24} color="#ef4444" />
                        </View>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.modalTitle}>Delete Product</Text>
                            <Text style={styles.modalDescription}>
                                This action cannot be undone. This will permanently delete the product and remove all associated data.
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <X size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <View style={styles.warningBox}>
                            <Text style={styles.warningLabel}>
                                Product to be deleted:
                            </Text>
                            <Text style={styles.productName} numberOfLines={2}>
                                {productName}
                            </Text>
                        </View>

                        <View style={styles.confirmationSection}>
                            <Text style={styles.confirmationLabel}>
                                To confirm deletion, type{' '}
                                <Text style={styles.confirmationKeyword}>DELETE</Text> below:
                            </Text>
                            <TextInput
                                style={styles.confirmationInput}
                                value={confirmationText}
                                onChangeText={(text) => setConfirmationText(text.toUpperCase())}
                                placeholder="Type DELETE to confirm"
                                placeholderTextColor="#9ca3af"
                                autoFocus
                                autoCapitalize="characters"
                                onSubmitEditing={Keyboard.dismiss}
                            />
                            <Text style={styles.confirmationHint}>
                                This extra step prevents accidental deletion.
                            </Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleClose}
                            disabled={isDeleting}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.deleteButton,
                                (!isDeleteEnabled || isDeleting) && styles.disabledButton,
                            ]}
                            onPress={handleDelete}
                            disabled={!isDeleteEnabled || isDeleting}
                        >
                            {isDeleting ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <>
                                    <Trash2 size={16} color="white" />
                                    <Text style={styles.deleteButtonText}>Delete Product</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
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
        padding: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        alignItems: 'flex-start',
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitleContainer: {
        flex: 1,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    modalDescription: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
    content: {
        padding: 20,
    },
    warningBox: {
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    warningLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#dc2626',
        marginBottom: 4,
    },
    productName: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
    confirmationSection: {
        gap: 8,
    },
    confirmationLabel: {
        fontSize: 14,
        color: '#374151',
    },
    confirmationKeyword: {
        fontWeight: 'bold',
        color: '#dc2626',
    },
    confirmationInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: 'white',
        color: '#111827',
        marginTop: 4,
    },
    confirmationHint: {
        fontSize: 12,
        color: '#6b7280',
        fontStyle: 'italic',
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
    deleteButton: {
        backgroundColor: '#dc2626',
    },
    disabledButton: {
        backgroundColor: '#9ca3af',
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
});