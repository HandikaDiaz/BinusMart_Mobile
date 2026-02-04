import api from "@/api/api";
import type { productType } from "@/constants/schema";
import type { Variants } from "@/constants/type";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import Toast from 'react-native-toast-message';

interface UseEditProductProps {
    productId: string;
    onSuccess?: () => void;
}

const defaultFormValues: productType = {
    productName: '',
    fullDescription: '',
    shortDescription: '',
    images: [{ url: '', isPrimary: false }],
    category: '',
    length: 0,
    width: 0,
    height: 0,
    dimensionUnit: 'CM',
    weight: 0,
    weightUnit: 'KG',
    material: '',
    warrantyPeriod: 0,
    warrantyType: 'MANUFACTURER',
    warrantyDetail: '',
    variants: [],
    specifications: [],
    metaTitle: '',
    metaDescription: '',
    tag: [],
    isActive: true,
    isFeatured: false,
};

export default function useEditProduct({ productId, onSuccess }: UseEditProductProps) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('basic');
    const [tagInput, setTagInput] = useState('');
    const [newSpecKey, setNewSpecKey] = useState('');

    const [formValues, setFormValues] = useState<productType>(defaultFormValues);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const { isLoading: isLoadingProduct, refetch } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await api.get(`/product/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                return res.data.data;
            } catch (error) {
                console.error('Error fetching product:', error);
                throw error;
            }
        },
        enabled: false,
    });

    const initializeForm = useCallback(async () => {
        try {
            setIsFormInitialized(false);
            const data = await refetch();

            if (data.data) {
                const product = data.data;
                const transformedData: productType = {
                    productName: product.productName || '',
                    fullDescription: product.fullDescription || '',
                    shortDescription: product.shortDescription || '',
                    images: product.image?.length > 0
                        ? product.image.map((img: any) => ({
                            url: img.url || '',
                            isPrimary: img.isPrimary || false
                        }))
                        : [{ url: '', isPrimary: false }],
                    category: product.category || '',
                    length: product.length || 0,
                    width: product.width || 0,
                    height: product.height || 0,
                    dimensionUnit: product.dimensionUnit || 'CM',
                    weight: product.weight || 0,
                    weightUnit: product.weightUnit || 'KG',
                    material: product.material || '',
                    warrantyPeriod: product.warrantyPeriod || 0,
                    warrantyType: product.warrantyType || 'MANUFACTURER',
                    warrantyDetail: product.warrantyDetail || '',
                    variants: product.variants?.length > 0
                        ? product.variants.map((variant: any) => ({
                            variantName: variant.variantName || '',
                            price: variant.price || 0,
                            stock: variant.stock || 0,
                            SKU: variant.SKU || '',
                            color: variant.color || '',
                            size: variant.size || '',
                            isPrimary: variant.isPrimary || false
                        }))
                        : [],
                    specifications: product.specifications?.length > 0
                        ? product.specifications.map((spec: any) => ({
                            specificationName: spec.specificationName || '',
                            specificationDetail: spec.specificationDetail || '',
                        }))
                        : [],
                    metaTitle: product.metaTitle || '',
                    metaDescription: product.metaDescription || '',
                    tag: product.tag || [],
                    isActive: product.isActive ?? true,
                    isFeatured: product.isFeatured ?? false,
                };

                setFormValues(transformedData);
                setIsFormInitialized(true);
            }
        } catch (error) {
            console.error('Error initializing form:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to load product data',
            });
        }
    }, [refetch, setFormValues, setIsFormInitialized]);

    // Update mutation
    const { mutateAsync: updateProductMutation, isPending: isUpdating } = useMutation({
        mutationKey: ["updateProduct", productId],
        mutationFn: async (data: productType) => {
            const token = await AsyncStorage.getItem('token');
            const res = await api.put(`/product/update/${productId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return res.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["products"] });
            await queryClient.invalidateQueries({ queryKey: ["product", productId] });
            await queryClient.invalidateQueries({ queryKey: ["myProduct"] });
            onSuccess?.();
        },
        onError: (error: any) => {
            console.error('Error updating product:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to update product',
            });
        }
    });

    // Form handlers
    const handleInputChange = useCallback((name: keyof productType, value: string) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleCategoryChange = useCallback((value: string) => {
        setFormValues(prev => ({ ...prev, category: value }));
    }, []);

    const handleAddImage = useCallback(() => {
        if (formValues.images.length >= 10) return;
        setFormValues(prev => ({
            ...prev,
            images: [...prev.images, { url: '', isPrimary: false }]
        }));
    }, [formValues.images.length]);

    const handleRemoveImage = useCallback((index: number) => {
        if (formValues.images.length <= 1) return;
        setFormValues(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    }, [formValues.images.length]);

    const handleImageChange = useCallback((index: number, value: string) => {
        setFormValues(prev => {
            const newImages = [...prev.images];
            newImages[index] = {
                url: value,
                isPrimary: index === 0
            };
            return { ...prev, images: newImages };
        });
    }, []);

    const handleAddTag = useCallback(() => {
        const trimmedInput = tagInput.trim();
        if (!trimmedInput) return;

        const alreadyExists = formValues.tag?.some(
            tag => tag.toLowerCase() === trimmedInput.toLowerCase()
        );

        if (!alreadyExists) {
            setFormValues(prev => ({
                ...prev,
                tag: [...(prev.tag || []), trimmedInput]
            }));
            setTagInput('');
        } else {
            Toast.show({
                type: 'error',
                text1: `Tag "${trimmedInput}" already exists`,
            });
        }
    }, [tagInput, formValues.tag]);

    const handleRemoveTag = useCallback((tagToRemove: string) => {
        setFormValues(prev => ({
            ...prev,
            tag: prev.tag?.filter(tag => tag !== tagToRemove) || []
        }));
    }, []);

    const handleAddVariant = useCallback(() => {
        setFormValues(prev => ({
            ...prev,
            variants: [
                ...(prev.variants || []),
                { variantName: '', price: 0, stock: 0, SKU: '', color: '', size: '', isPrimary: false }
            ]
        }));
    }, []);

    const handleRemoveVariant = useCallback((index: number) => {
        if (formValues.variants.length <= 1) return;
        setFormValues(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    }, [formValues.variants.length]);

    const handleVariantChange = useCallback((
        index: number,
        field: keyof Variants,
        value: string | number
    ) => {
        setFormValues(prev => {
            const newVariants = [...prev.variants];

            // Konversi ke number untuk price dan stock
            let processedValue = value;
            if (field === 'price' || field === 'stock') {
                processedValue = typeof value === 'string'
                    ? parseFloat(value) || 0
                    : value;
            }

            newVariants[index] = {
                ...newVariants[index],
                [field]: processedValue
            };
            return { ...prev, variants: newVariants };
        });
    }, []);

    const handleAddPresetSpecification = useCallback((spec: { specificationName: string; specificationDetail: string }) => {
        const alreadyExists = formValues.specifications?.some(
            s => s.specificationName.toLowerCase() === spec.specificationName.toLowerCase()
        );

        if (!alreadyExists) {
            setFormValues(prev => ({
                ...prev,
                specifications: [
                    ...(prev.specifications || []),
                    { specificationName: spec.specificationName, specificationDetail: spec.specificationDetail }
                ]
            }));
        } else {
            Toast.show({
                type: 'error',
                text1: `Specification "${spec.specificationName}" already exists!`,
            });
        }
    }, [formValues.specifications]);

    const handleAddSpecification = useCallback(() => {
        const trimmedKey = newSpecKey.trim();
        if (!trimmedKey) return;

        const alreadyExists = formValues.specifications?.some(
            spec => spec.specificationName.toLowerCase() === trimmedKey.toLowerCase()
        );

        if (!alreadyExists) {
            setFormValues(prev => ({
                ...prev,
                specifications: [
                    ...(prev.specifications || []),
                    { specificationName: trimmedKey, specificationDetail: '' }
                ]
            }));
            setNewSpecKey('');
        } else {
            Toast.show({
                type: 'error',
                text1: `Specification "${trimmedKey}" already exists!`,
            });
        }
    }, [newSpecKey, formValues.specifications]);

    const handleRemoveSpecification = useCallback((index: number) => {
        setFormValues(prev => ({
            ...prev,
            specifications: prev.specifications?.filter((_, i) => i !== index) || []
        }));
    }, []);

    const handleSpecificationChange = useCallback((
        index: number,
        field: 'specificationName' | 'specificationDetail',
        value: string
    ) => {
        setFormValues(prev => {
            const newSpecs = [...(prev.specifications || [])];
            newSpecs[index] = {
                ...newSpecs[index],
                [field]: value
            };
            return { ...prev, specifications: newSpecs };
        });
    }, []);

    const handleTagKeyPress = useCallback((e: any) => {
        if (e.nativeEvent.key === 'Enter') {
            handleAddTag();
        }
    }, [handleAddTag]);

    const submitProduct = useCallback(async () => {
        try {
            // Validate required fields
            if (!formValues.productName?.trim()) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Product name is required',
                });
                return false;
            }

            if (!formValues.fullDescription?.trim()) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Description is required',
                });
                return false;
            }

            if (!formValues.category) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Category is required',
                });
                return false;
            }

            if (!formValues.images.some(img => img.url.trim() !== '')) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'At least one image is required',
                });
                return false;
            }

            // Prepare data for API
            const productData: productType = {
                ...formValues,
                // Ensure numeric values are numbers
                length: typeof formValues.length === 'string' ? parseFloat(formValues.length) || 0 : formValues.length,
                width: typeof formValues.width === 'string' ? parseFloat(formValues.width) || 0 : formValues.width,
                height: typeof formValues.height === 'string' ? parseFloat(formValues.height) || 0 : formValues.height,
                weight: typeof formValues.weight === 'string' ? parseFloat(formValues.weight) || 0 : formValues.weight,
                warrantyPeriod: typeof formValues.warrantyPeriod === 'string'
                    ? parseInt(formValues.warrantyPeriod, 10) || 0
                    : formValues.warrantyPeriod,
                variants: formValues.variants.map(v => ({
                    ...v,
                    price: typeof v.price === 'string' ? parseFloat(v.price) || 0 : v.price,
                    stock: typeof v.stock === 'string' ? parseInt(v.stock, 10) || 0 : v.stock,
                })),
            };

            await updateProductMutation(productData);
            return true;
        } catch (error) {
            console.error('Error updating product:', error);
            return false;
        }
    }, [formValues, updateProductMutation]);

    const resetForm = useCallback(() => {
        setFormValues(defaultFormValues);
        setActiveTab('basic');
        setTagInput('');
        setNewSpecKey('');
        setIsFormInitialized(false);
    }, []);

    return {
        activeTab,
        images: formValues.images,
        tags: formValues.tag || [],
        tagInput,
        variants: formValues.variants,
        specifications: formValues.specifications || [],
        newSpecKey,
        isLoading: isLoadingProduct || isUpdating,
        formValues,
        errors: {},
        isInitialized: isFormInitialized,

        setActiveTab,
        setTagInput,
        setNewSpecKey,

        submitProduct,
        resetForm,
        initializeForm,

        handleInputChange,
        handleCategoryChange,
        handleAddImage,
        handleRemoveImage,
        handleImageChange,
        handleAddTag,
        handleRemoveTag,
        handleTagKeyPress,
        handleAddVariant,
        handleRemoveVariant,
        handleVariantChange,
        handleAddSpecification,
        handleAddPresetSpecification,
        handleRemoveSpecification,
        handleSpecificationChange,
    };
}