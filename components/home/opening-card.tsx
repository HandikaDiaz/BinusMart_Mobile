import { Search, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface OpeningCardProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    onSearch?: () => void;
}

export default function OpeningCard({
    searchQuery,
    setSearchQuery,
    onSearch
}: OpeningCardProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = () => {
        if (onSearch) {
            onSearch();
        } else {
            console.log('Searching for:', searchQuery);
        }
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.badgeContainer}>
                    <Sparkles size={20} color="#fff" />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Limited Time Offer</Text>
                    </View>
                </View>

                <Text style={styles.title}>
                    Discover Amazing Products
                </Text>
                <Text style={styles.subtitle}>
                    At Unbeatable Prices
                </Text>

                <Text style={styles.description}>
                    Shop the latest trends in electronics, fashion, home decor and more with free shipping on orders over $50.
                </Text>

                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Search size={20} color="#9ca3af" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search products, categories, brands..."
                            placeholderTextColor="#9ca3af"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearch}
                    >
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3b82f6',
        borderRadius: 16,
        margin: 16,
        overflow: 'hidden',
    },
    content: {
        padding: 20,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#dbeafe',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 24,
        lineHeight: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
    },
    searchButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
});