import { useAuth } from '@/hooks/auth/use-auth';
import { StyleSheet, View } from 'react-native';
import NavbarActions from './nav-actions';
import NavbarLogo from './nav-logo';

export default function Navbar() {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                    <View style={styles.logoPlaceholder} />
                    <View style={styles.actionsPlaceholder}>
                        <View style={styles.buttonPlaceholder} />
                        <View style={styles.buttonPlaceholder} />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <NavbarLogo />

                <NavbarActions
                    user={user}
                    onLogout={logout}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    content: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    loadingContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    loadingContent: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    logoPlaceholder: {
        height: 32,
        width: 128,
        backgroundColor: '#e5e7eb',
        borderRadius: 6,
    },
    actionsPlaceholder: {
        flexDirection: 'row',
        gap: 8,
    },
    buttonPlaceholder: {
        height: 36,
        width: 70,
        backgroundColor: '#e5e7eb',
        borderRadius: 6,
    },
});