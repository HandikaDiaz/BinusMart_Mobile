import api from "@/api/api";
import { productSchema, productType } from "@/constants/schema";
import type { Category, Variants } from "@/constants/type";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';

export default function useCreateProduct() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('basic');
    const [tagInput, setTagInput] = useState('');
    const [newSpecKey, setNewSpecKey] = useState('');

    const [formValues, setFormValues] = useState<productType>({
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
        variants: [{ variantName: '', price: 0, stock: 0, SKU: '', color: '', size: '', isPrimary: true }],
        specifications: [
            { specificationName: 'Brand', specificationDetail: '' },
            { specificationName: 'Model', specificationDetail: '' }
        ],
        metaTitle: '',
        metaDescription: '',
        tag: [],
        isActive: true,
        isFeatured: false,
    });

    const [errors, setErrors] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = useCallback(() => {
        try {
            const validationData = {
                ...formValues,
                length: parseFloat(formValues.length?.toString()) || 0,
                width: parseFloat(formValues.width?.toString()) || 0,
                height: parseFloat(formValues.height?.toString()) || 0,
                weight: parseFloat(formValues.weight?.toString()) || 0,
                warrantyPeriod: parseFloat(formValues.warrantyPeriod?.toString()) || 0,
                variants: formValues.variants?.map(v => ({
                    ...v,
                    price: parseFloat(v.price?.toString()) || 0,
                    stock: parseFloat(v.stock?.toString()) || 0,
                })) || [],
            };

            productSchema.parse(validationData);
            setErrors({});
            return true;
        } catch (error: any) {
            const newErrors: Record<string, any> = {};
            error.errors?.forEach((err: any) => {
                if (err.path) {
                    newErrors[err.path[0]] = err;
                }
            });
            setErrors(newErrors);
            return false;
        }
    }, [formValues]);

    const handleInputChange = useCallback((field: keyof productType, value: string) => {
        setFormValues(prev => {
            const numberFields = ['length', 'width', 'height', 'weight', 'warrantyPeriod'];
            const processedValue = numberFields.includes(field) 
                ? parseFloat(value) || 0 
                : value;
            
            return { ...prev, [field]: processedValue };
        });
        
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [errors]);

    const handleCategoryChange = useCallback((value: Category | string) => {
        setFormValues(prev => ({ ...prev, category: value }));
    }, []);

    const handleAddImage = useCallback(() => {
        if (formValues.images.length >= 10) return;
        setFormValues(prev => ({
            ...prev,
            images: [...prev.images, { url: '', isPrimary: false }]
        }));
    }, [formValues.images]);

    const handleRemoveImage = useCallback((index: number) => {
        if (formValues.images.length <= 1) return;
        setFormValues(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    }, [formValues.images]);

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
    }, [formValues.variants]);

    const handleVariantChange = useCallback((
        index: number,
        field: keyof Variants,
        value: string | number
    ) => {
        setFormValues(prev => {
            const newVariants = [...prev.variants];
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

    async function createProduct(data: productType) {
        const token = await AsyncStorage.getItem('token');
        const res = await api.post("/product/create", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    }

    const { mutateAsync: createProductMutation } = useMutation({
        mutationKey: ["createProduct"],
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["myProduct"] });
            Toast.show({
                type: 'success',
                text1: "Product created successfully!",
            });
        },
        onError: (error: any) => {
            console.error('Mutation error:', error);
            Toast.show({
                type: 'error',
                text1: "Failed to create product",
                text2: error.response?.data?.message || error.message || 'Something went wrong',
            });
        },
    });

    const prepareProductData = useCallback((): productType => {
        const validImages = (formValues.images || []).filter(i => i.url.trim() !== '');
        const validVariants = (formValues.variants || []).filter(v => v.variantName.trim() !== '');
        const validSpecs = (formValues.specifications || []).filter(s =>
            s.specificationName.trim() !== '' && s.specificationDetail.trim() !== ''
        );
        const validTags = (formValues.tag || []).filter(t => t.trim() !== '');

        return {
            ...formValues,
            images: validImages,
            variants: validVariants.map(v => ({
                ...v,
                price: typeof v.price === 'string' ? parseFloat(v.price) || 0 : v.price || 0,
                stock: typeof v.stock === 'string' ? parseInt(v.stock, 10) || 0 : v.stock || 0,
                isPrimary: v.isPrimary || false
            })),
            specifications: validSpecs,
            tag: validTags,
            length: typeof formValues.length === 'string' ? parseFloat(formValues.length) || 0 : formValues.length || 0,
            width: typeof formValues.width === 'string' ? parseFloat(formValues.width) || 0 : formValues.width || 0,
            height: typeof formValues.height === 'string' ? parseFloat(formValues.height) || 0 : formValues.height || 0,
            weight: typeof formValues.weight === 'string' ? parseFloat(formValues.weight) || 0 : formValues.weight || 0,
            warrantyPeriod: typeof formValues.warrantyPeriod === 'string' 
                ? parseInt(formValues.warrantyPeriod, 10) || 0 
                : formValues.warrantyPeriod || 0,
        };
    }, [formValues]);

    const submitProduct = useCallback(async (onSuccess?: () => void) => {
        try {
            if (!validateForm()) {
                console.log('Validation failed', errors);
                Toast.show({
                    type: 'error',
                    text1: "Validation error",
                    text2: "Please check all required fields",
                });
                return false;
            }

            setIsLoading(true);
            const productData = prepareProductData();
            await createProductMutation(productData);
            onSuccess?.();
            return true;
        } catch (error) {
            console.error('Error in submitProduct:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [validateForm, createProductMutation, prepareProductData, errors]);

    const resetForm = useCallback(() => {
        setFormValues({
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
            variants: [{ variantName: '', price: 0, stock: 0, SKU: '', color: '', size: '', isPrimary: true }],
            specifications: [
                { specificationName: 'Brand', specificationDetail: '' },
                { specificationName: 'Model', specificationDetail: '' }
            ],
            metaTitle: '',
            metaDescription: '',
            tag: [],
            isActive: true,
            isFeatured: false,
        });
        setActiveTab('basic');
        setTagInput('');
        setNewSpecKey('');
        setErrors({});
    }, []);

    return {
        activeTab,
        images: formValues.images || [],
        tags: formValues.tag || [],
        tagInput,
        variants: formValues.variants || [],
        specifications: formValues.specifications || [],
        newSpecKey,
        isLoading,
        formValues,
        errors,

        setActiveTab,
        setTagInput,
        setNewSpecKey,

        submitProduct,
        resetForm,

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
    };
}