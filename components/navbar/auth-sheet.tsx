import { useAuthLogin } from '@/hooks/auth/use-login';
import { useAuthRegister } from '@/hooks/auth/use-register';
import { Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface AuthModalProps {
    visible: boolean;
    onClose: () => void;
    defaultTab?: 'login' | 'register';
}

export default function AuthSheet({
    visible,
    onClose,
    defaultTab = 'login'
}: AuthModalProps) {
    const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
    const [showPassword, setShowPassword] = useState(false);

    const login = useAuthLogin(onClose);
    const register = useAuthRegister(onClose);

    const handleClose = () => {
        onClose();
        if (login.reset) login.reset();
        if (register.reset) register.reset();
        setTab('login');
        setShowPassword(false);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome to BinusMart</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <X size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        Sign in to your account or create a new one
                    </Text>

                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, tab === 'login' && styles.activeTab]}
                            onPress={() => setTab('login')}
                        >
                            <Text style={[styles.tabText, tab === 'login' && styles.activeTabText]}>
                                Login
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, tab === 'register' && styles.activeTab]}
                            onPress={() => setTab('register')}
                        >
                            <Text style={[styles.tabText, tab === 'register' && styles.activeTabText]}>
                                Register
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {tab === 'login' && (
                            <View style={styles.form}>
                                <View style={styles.inputContainer}>
                                    <Mail size={20} color="#9ca3af" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Enter your email"
                                        value={login.form.username || ''}
                                        onChangeText={login.setField('username')}
                                        style={styles.input}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={!login.isSubmitting}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Enter your password"
                                        value={login.form.password || ''}
                                        onChangeText={login.setField('password')}
                                        style={[styles.input, styles.passwordInput]}
                                        secureTextEntry={!showPassword}
                                        editable={!login.isSubmitting}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.passwordToggle}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} color="#9ca3af" />
                                        ) : (
                                            <Eye size={20} color="#9ca3af" />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={[styles.submitButton, login.isSubmitting && styles.submitButtonDisabled]}
                                    onPress={login.submit}
                                    disabled={login.isSubmitting}
                                >
                                    {login.isSubmitting ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.submitButtonText}>Sign In</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}

                        {tab === 'register' && (
                            <View style={styles.form}>
                                <View style={styles.inputContainer}>
                                    <User size={20} color="#9ca3af" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Enter your full name"
                                        value={register.form.fullname || ''}
                                        onChangeText={register.setField('fullname')}
                                        style={styles.input}
                                        editable={!register.isSubmitting}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Mail size={20} color="#9ca3af" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Enter your email"
                                        value={register.form.email || ''}
                                        onChangeText={register.setField('email')}
                                        style={styles.input}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={!register.isSubmitting}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Create a password"
                                        value={register.form.password || ''}
                                        onChangeText={register.setField('password')}
                                        style={[styles.input, styles.passwordInput]}
                                        secureTextEntry={!showPassword}
                                        editable={!register.isSubmitting}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.passwordToggle}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} color="#9ca3af" />
                                        ) : (
                                            <Eye size={20} color="#9ca3af" />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={[styles.submitButton, register.isSubmitting && styles.submitButtonDisabled]}
                                    onPress={register.submit}
                                    disabled={register.isSubmitting}
                                >
                                    {register.isSubmitting ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.submitButtonText}>Create Account</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        maxHeight: '80%',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
    },
    activeTabText: {
        color: '#111827',
    },
    content: {
        maxHeight: 400,
    },
    form: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    passwordInput: {
        paddingRight: 40,
    },
    passwordToggle: {
        position: 'absolute',
        right: 12,
        padding: 4,
    },
    submitButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});