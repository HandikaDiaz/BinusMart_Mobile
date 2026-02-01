import { Link, useRouter } from 'expo-router'; // ← Hapus Link dari sini

import { LogOut, Package, User as ProfileIcon, ShoppingCart, User as UserIcon } from 'lucide-react-native';
import { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface NavbarUserMenuProps {
    user: any | null;
    onLogout: () => void;
    onOpenAuthModal: (tab: 'login' | 'register') => void;
}

export default function NavbarUserMenu({
    user,
    onLogout,
    onOpenAuthModal,
}: NavbarUserMenuProps) {
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter(); // ← Pakai useRouter dari expo-router

    const handleLogout = () => {
        onLogout();
        setMenuVisible(false);
        router.replace('/(tabs)'); // ← Navigasi ke home
    };


    if (user) {
        return (
            <>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <View style={styles.avatar}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' }}
                            style={styles.avatarImage}
                        />
                        <View style={styles.avatarFallback}>
                            <Text style={styles.avatarFallbackText}>
                                {user.fullname?.charAt(0) || 'U'}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <Modal
                    visible={menuVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setMenuVisible(false)}
                    >
                        <View style={styles.menuContainer}>
                            <View style={styles.menuContent}>
                                <View style={styles.menuHeader}>
                                    <Text style={styles.menuTitle}>My Account</Text>
                                    <View style={styles.userInfo}>
                                        <View style={styles.smallAvatar}>
                                            <Text style={styles.smallAvatarText}>
                                                {user.fullname?.charAt(0) || 'U'}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.userName}>{user.fullname}</Text>
                                            <Text style={styles.userEmail}>{user.email}</Text>
                                        </View>
                                    </View>
                                </View>

                                <ScrollView style={styles.menuItems}>
                                    <Link
                                        href='/product/product'
                                        onPress={() => setMenuVisible(false)}
                                        asChild
                                    >
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                        >
                                            <ProfileIcon size={20} color="#374151" />
                                            <Text style={styles.menuItemText}>My Product</Text>
                                        </TouchableOpacity>
                                    </Link>

                                    <Link
                                        href='/orders/orders'
                                        onPress={() => setMenuVisible(false)}
                                        asChild
                                    >
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                        // onPress={() => navigateTo('/(tabs)/orders')} // ← Perbaiki path
                                        >
                                            <Package size={20} color="#374151" />
                                            <Text style={styles.menuItemText}>My Orders</Text>
                                        </TouchableOpacity>
                                    </Link>

                                    <Link
                                        href='/cart/cart'
                                        onPress={() => setMenuVisible(false)}
                                        asChild
                                    >
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                        >
                                            <ShoppingCart size={20} color="#374151" />
                                            <Text style={styles.menuItemText}>My Cart</Text>
                                        </TouchableOpacity>
                                    </Link>

                                    <TouchableOpacity
                                        style={[styles.menuItem, styles.logoutItem]}
                                        onPress={handleLogout}
                                    >
                                        <LogOut size={20} color="#dc2626" />
                                        <Text style={styles.logoutText}>Logout</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </>
        );
    }

    return (
        <TouchableOpacity onPress={() => onOpenAuthModal('login')}>
            <View style={styles.guestAvatar}>
                <UserIcon size={20} color="#3b82f6" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarFallback: {
        width: '100%',
        height: '100%',
        backgroundColor: '#dbeafe',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarFallbackText: {
        color: '#1d4ed8',
        fontWeight: 'bold',
        fontSize: 16,
    },
    guestAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#dbeafe',
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    menuContent: {
        padding: 20,
    },
    menuHeader: {
        marginBottom: 20,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    smallAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#dbeafe',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallAvatarText: {
        color: '#1d4ed8',
        fontWeight: 'bold',
        fontSize: 16,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    userEmail: {
        fontSize: 14,
        color: '#6b7280',
    },
    menuItems: {
        maxHeight: 400,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    menuItemText: {
        fontSize: 16,
        color: '#374151',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 12,
    },
    logoutItem: {
        borderBottomWidth: 0,
    },
    logoutText: {
        fontSize: 16,
        color: '#dc2626',
        fontWeight: '500',
    },
});