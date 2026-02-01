import type { User } from '@/constants/type';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AuthSheet from './auth-sheet';
import NavbarUserMenu from './nav-user-menu';

interface NavbarActionsProps {
    user: User | null;
    onLogout: () => void;
}

export default function NavbarActions({
    user,
    onLogout,
}: NavbarActionsProps) {
    const [authModalVisible, setAuthModalVisible] = useState(false);
    const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

    return (
        <View style={styles.container}>
            {user ? (
                <NavbarUserMenu
                    user={user}
                    onLogout={onLogout}
                    onOpenAuthModal={(tab: any) => {
                        setAuthTab(tab);
                        setAuthModalVisible(true);
                    }}
                />
            ) : (
                <View style={styles.authButtons}>
                    <TouchableOpacity
                        style={[styles.button, styles.loginButton]}
                        onPress={() => {
                            setAuthTab('login');
                            setAuthModalVisible(true);
                        }}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.registerButton]}
                        onPress={() => {
                            setAuthTab('register');
                            setAuthModalVisible(true);
                        }}
                    >
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            )}

            <AuthSheet
                visible={authModalVisible}
                onClose={() => setAuthModalVisible(false)}
                defaultTab={authTab}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authButtons: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        minWidth: 70,
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#6b7280',
    },
    loginButtonText: {
        color: '#374151',
        fontWeight: '500',
    },
    registerButton: {
        backgroundColor: '#2563eb',
    },
    registerButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
});