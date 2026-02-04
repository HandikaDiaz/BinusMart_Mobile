import { Tag, X } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ProductTagsSectionProps {
    tags: string[];
    tagInput: string;
    onTagInputChange: (value: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
}

export default function ProductTagsSection({
    tags,
    tagInput,
    onTagInputChange,
    onAddTag,
    onRemoveTag,
}: ProductTagsSectionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add tags (e.g., electronics, laptop, gaming)"
                    value={tagInput}
                    onChangeText={onTagInputChange}
                    onSubmitEditing={onAddTag}
                    returnKeyType="done"
                    placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                    style={[styles.addButton, !tagInput.trim() && styles.disabledButton]}
                    onPress={onAddTag}
                    disabled={!tagInput.trim()}
                >
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            {tags.length > 0 ? (
                <View style={styles.tagsContainer}>
                    {tags.map((tag) => (
                        <View key={tag} style={styles.tag}>
                            <Tag size={12} color="#6b7280" />
                            <Text style={styles.tagText}>{tag}</Text>
                            <TouchableOpacity
                                onPress={() => onRemoveTag(tag)}
                                style={styles.removeTagButton}
                            >
                                <X size={12} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={styles.placeholderText}>
                    Add tags to help customers find your product
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#374151',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: 'white',
        marginRight: 8,
    },
    addButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 12,
        color: '#374151',
        marginLeft: 4,
        marginRight: 4,
    },
    removeTagButton: {
        padding: 2,
    },
    placeholderText: {
        fontSize: 12,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
});