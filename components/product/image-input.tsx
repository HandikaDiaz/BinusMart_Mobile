import type { Images } from '@/constants/type';
import { ImageIcon, X } from 'lucide-react-native';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ImageInputProps {
    index: number;
    image: Images;
    isMain: boolean;
    canRemove: boolean;
    onImageChange: (index: number, value: string) => void;
    onRemoveImage: (index: number) => void;
}

export default function ImageInput({
    index,
    image,
    isMain,
    canRemove,
    onImageChange,
    onRemoveImage,
}: ImageInputProps) {
    const isExistingImage = image.url || "https://via.placeholder.com/128x128.png?text=No+Image";

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <ImageIcon size={16} color="#6b7280" />
                        <Text style={styles.title}>Image {index + 1}</Text>
                        {isMain && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>Main Image</Text>
                            </View>
                        )}
                    </View>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="https://example.com/product-image.webp"
                    value={image.url}
                    onChangeText={(value) => onImageChange(index, value)}
                    placeholderTextColor="#9ca3af"
                />

                {image.url ? (
                    <View style={styles.previewContainer}>
                        <Text style={styles.previewLabel}>Preview:</Text>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: isExistingImage }}
                                style={styles.image}
                                resizeMode="cover"
                                onError={() => {
                                    console.log('Image failed to load');
                                }}
                            />
                        </View>
                    </View>
                ) : null}
            </View>

            {canRemove && (
                <TouchableOpacity
                    onPress={() => onRemoveImage(index)}
                    style={styles.removeButton}
                >
                    <X size={16} color="#ef4444" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
    },
    header: {
        marginBottom: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    badge: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    badgeText: {
        fontSize: 10,
        color: '#6b7280',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: 'white',
        color: '#111827',
    },
    previewContainer: {
        marginTop: 12,
    },
    previewLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    imageContainer: {
        width: 128,
        height: 128,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 6,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        padding: 4,
        marginLeft: 8,
    },
});