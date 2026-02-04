import type { Images } from '@/constants/type';
import { ImageIcon, Plus } from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageInput from './image-input';

interface ProductImagesSectionProps {
  images: Images[];
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onImageChange: (index: number, value: string) => void;
}

export default function ProductImagesSection({
  images,
  onAddImage,
  onRemoveImage,
  onImageChange,
}: ProductImagesSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <ImageIcon size={20} color="#4b5563" />
            <Text style={styles.title}>Product Images</Text>
          </View>

          {images.length < 10 && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddImage}
            >
              <Plus size={16} color="#4b5563" />
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.cardContent}>
        {images.map((image, index) => (
          <ImageInput
            key={index}
            index={index}
            image={image}
            isMain={index === 0}
            canRemove={images.length > 1}
            onImageChange={onImageChange}
            onRemoveImage={onRemoveImage}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 16,
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
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
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
});