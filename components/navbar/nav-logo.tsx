import { Link } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

export default function NavbarLogo() {
    return (
        <View style={styles.container}>
            <Link href={'/(tabs)'} style={styles.logoContainer}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoIcon}>
                        <ShoppingBag size={24} color="#fff" />
                    </View>
                    <Text style={styles.logoText}>BinusMart</Text>
                </View>
            </Link>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoIcon: {
        backgroundColor: '#3b82f6',
        padding: 8,
        borderRadius: 8,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
});