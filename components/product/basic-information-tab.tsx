import { productType } from '@/constants/schema';
import type { Images } from '@/constants/type';
import { Picker } from '@react-native-picker/picker';
import { Ruler, Type } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import ProductImagesSection from './product-image-section';

export interface Category {
  id: string;
  name: string;
}

interface BasicInformationTabProps {
  formData: productType;
  images: Images[];
  categories: Category[];
  onInputChange: (name: keyof productType, value: string) => void;
  onCategoryChange: (category: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onImageChange: (index: number, value: string) => void;
}

export default function BasicInformationTab({
  formData,
  images,
  categories,
  onInputChange,
  onCategoryChange,
  onAddImage,
  onRemoveImage,
  onImageChange,
}: BasicInformationTabProps) {
  const units = ['CM', 'INCH', 'MM'];
  const weightUnits = ['KG', 'G', 'LB'];

  const handleNumberChange = (name: keyof productType, value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    onInputChange(name, numericValue);
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Type size={20} color="#4b5563" />
            <Text style={styles.title}>Basic Information</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Product Name *
              <Text style={styles.required}> </Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              value={formData.productName}
              onChangeText={(value) => onInputChange('productName', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Category *
              <Text style={styles.required}> </Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(itemValue) => {
                  const selectedCategory = categories.find(cat => cat.id === itemValue);
                  if (selectedCategory) {
                    onCategoryChange(selectedCategory.id);
                  }
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select category" value="" />
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Short Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief product summary (max 200 characters)"
              value={formData.shortDescription}
              onChangeText={(value) => onInputChange('shortDescription', value)}
              multiline
              numberOfLines={3}
              maxLength={200}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Full Description *
              <Text style={styles.required}> </Text>
            </Text>
            <TextInput
              style={[styles.input, styles.largeTextArea]}
              placeholder="Detailed product description, features, benefits..."
              value={formData.fullDescription}
              onChangeText={(value) => onInputChange('fullDescription', value)}
              multiline
              numberOfLines={6}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Material</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Plastic, Metal"
              value={formData.material}
              onChangeText={(value) => onInputChange('material', value)}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ruler size={16} color="#4b5563" />
              <Text style={styles.sectionTitle}>Dimensions & Weight</Text>
            </View>

            <View style={styles.dimensionsGrid}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Length</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.length.toString()}
                  onChangeText={(value) => handleNumberChange('length', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Width</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.width.toString()}
                  onChangeText={(value) => handleNumberChange('width', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Height</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.height.toString()}
                  onChangeText={(value) => handleNumberChange('height', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>

            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dimension Unit</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.dimensionUnit}
                  onValueChange={(itemValue) => onInputChange('dimensionUnit', itemValue)}
                  style={styles.picker}
                >
                  {units.map(unit => (
                    <Picker.Item key={unit} label={unit} value={unit} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.weightContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Weight</Text>
                <View style={styles.weightInputRow}>
                  <TextInput
                    style={[styles.input, styles.weightInput]}
                    placeholder="0"
                    value={formData.weight.toString()}
                    onChangeText={(value) => handleNumberChange('weight', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                  <View style={styles.weightUnitPicker}>
                    <Picker
                      selectedValue={formData.weightUnit}
                      onValueChange={(itemValue) => onInputChange('weightUnit', itemValue)}
                      style={styles.picker}
                    >
                      {weightUnits.map(unit => (
                        <Picker.Item key={unit} label={unit} value={unit} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ProductImagesSection
        images={images}
        onAddImage={onAddImage}
        onRemoveImage={onRemoveImage}
        onImageChange={onImageChange}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  container: {
    padding: 16,
    gap: 16,
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
  },
  cardHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  cardContent: {
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  required: {
    color: '#ef4444',
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
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  largeTextArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  section: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  dimensionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  weightContainer: {
    flexDirection: 'row',
  },
  weightInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  weightInput: {
    flex: 1,
  },
  weightUnitPicker: {
    width: 100,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: 'white',
  },
});