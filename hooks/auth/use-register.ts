import api from '@/api/api';
import { RegisterSchema, type RegisterDTO } from '@/constants/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuth } from './use-auth';

export function useAuthRegister(onSuccess?: () => void) {
    const queryClient = useQueryClient();
    const { login: authLogin } = useAuth();
    const [form, setForm] = useState<RegisterDTO>({
        fullname: '',
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validasi dengan Zod
    const validateForm = () => {
        try {
            RegisterSchema.parse(form);
            setErrors({});
            return true;
        } catch (error: any) {
            const newErrors: Record<string, string> = {};
            error.errors.forEach((err: any) => {
                if (err.path) {
                    newErrors[err.path[0]] = err.message;
                }
            });
            setErrors(newErrors);
            return false;
        }
    };

    // Fungsi untuk set field
    const setField = (field: keyof RegisterDTO) => (value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Clear error ketika user mulai mengetik
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    async function registerUser(data: RegisterDTO) {
        const res = await api.post('/auth/register', data);
        const { token } = res.data;

        await authLogin(token);

        Toast.show({
            type: 'success',
            text1: 'Account created successfully',
        });

        onSuccess?.();
        return res.data;
    }

    const { mutateAsync } = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Registration failed',
                text2: error.response?.data?.message || 'Something went wrong',
            });
        },
    });

    const submit = async () => {
        if (!validateForm()) {
            Toast.show({
                type: 'error',
                text1: 'Validation error',
                text2: 'Please check your inputs',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await mutateAsync(form);
        } catch (error) {
            // Error sudah ditangani di onError mutation
        } finally {
            setIsSubmitting(false);
        }
    };

    const reset = () => {
        setForm({ fullname: '', email: '', password: '' });
        setErrors({});
        setIsSubmitting(false);
    };

    return {
        submit,
        form,
        setField,
        errors,
        isSubmitting,
        reset,
    };
}