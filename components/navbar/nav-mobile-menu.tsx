import { useNavigation } from '@react-navigation/native';
import { Home, LogOut, Package, ShoppingBag, ShoppingCart } from 'lucide-react-native';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NavbarMobileMenuProps {
    visible: boolean;
    user: any | null;
    onClose: () => void;
    onLogout: () => void;
    onOpenAuthModal: (tab: 'login' | 'register') => void;
}

export default function NavbarMobileMenu({
    visible,
    user,
    onClose,
    onLogout,
    onOpenAuthModal,
}: NavbarMobileMenuProps) {
    const navigation = useNavigation();

    const navItems = [
        { icon: <Home size={20} color="#374151" />, label: 'Home', path: 'Home' },
        { icon: <Package size={20} color="#374151" />, label: 'Products', path: 'Products' },
        { icon: <ShoppingBag size={20} color="#374151" />, label: 'My Orders', path: 'Orders' },
        { icon: <ShoppingCart size={20} color="#374151" />, label: 'Cart', path: 'Cart' },
    ];

    const navigateTo = (route: string) => {
        navigation.navigate(route as never);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView style={styles.content}>
                        {navItems.map((item) => (
                            <TouchableOpacity
                                key={item.path}
                                style={styles.navItem}
                                onPress={() => navigateTo(item.path)}
                            >
                                {item.icon}
                                <Text style={styles.navItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}

                        {!user ? (
                            <View style={styles.authSection}>
                                <TouchableOpacity
                                    style={[styles.authButton, styles.loginButton]}
                                    onPress={() => {
                                        onClose();
                                        onOpenAuthModal('login');
                                    }}
                                >
                                    <Text style={styles.authButtonText}>Login</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.authButton, styles.registerButton]}
                                    onPress={() => {
                                        onClose();
                                        onOpenAuthModal('register');
                                    }}
                                >
                                    <Text style={styles.registerButtonText}>Register</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={() => {
                                    onLogout();
                                    onClose();
                                }}
                            >
                                <LogOut size={20} color="#dc2626" />
                                <Text style={styles.logoutText}>Logout</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>

                <TouchableOpacity style={styles.closeArea} onPress={onClose} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    container: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        maxHeight: '60%',
    },
    content: {
        padding: 16,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    navItemText: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    authSection: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    authButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: '#f3f4f6',
    },
    registerButton: {
        backgroundColor: '#e5e7eb',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    authButtonText: {
        color: '#374151',
        fontWeight: '500',
    },
    registerButtonText: {
        color: '#374151',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginTop: 16,
    },
    logoutText: {
        fontSize: 16,
        color: '#dc2626',
        fontWeight: '500',
    },
    closeArea: {
        flex: 1,
    },
});