import api from '@/api/api';
import { LoginDTO, LoginSchema } from '@/constants/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuth } from './use-auth';

export function useAuthLogin(onSuccess?: () => void) {
    const queryClient = useQueryClient();
    const { login: authLogin } = useAuth();
    const [form, setForm] = useState<LoginDTO>({
        username: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validasi dengan Zod
    const validateForm = () => {
        try {
            LoginSchema.parse(form);
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
    const setField = (field: keyof LoginDTO) => (value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Clear error ketika user mulai mengetik
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    async function loginUser(data: LoginDTO) {
        const res = await api.post('/auth/login', data);
        const { token } = res.data;

        await authLogin(token);

        Toast.show({
            type: 'success',
            text1: 'Login successful',
        });

        onSuccess?.();
        return res.data;
    }

    const { mutateAsync } = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Login failed',
                text2: error.response?.data?.message || 'Check your email and password',
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
        setForm({ username: '', password: '' });
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