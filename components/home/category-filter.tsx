import { Categories } from '@/constants/type';
import { ChevronRight } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CategoryProps {
    categories: { label: string; value: string }[];
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
};

function getCategoryIcon(category: string) {
    const icons: Record<string, string> = {
        [Categories.ELECTRONICS]: '💻',
        [Categories.FASHION]: '👕',
        [Categories.HOME]: '🏠',
        [Categories.BOOKS]: '📚',
        [Categories.SPORTS]: '⚽',
        [Categories.OTHER]: '📦',
    };
    return icons[category] || '📦';
}

export default function CategoryFilter({
    categories,
    selectedCategory,
    setSelectedCategory
}: CategoryProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Shop by Category</Text>
                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => setSelectedCategory("ALL")}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <ChevronRight size={16} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContainer}
            >
                {categories.filter(c => c.value !== 'ALL').map((category) => (
                    <TouchableOpacity
                        key={category.value}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category.value && styles.categoryButtonActive
                        ]}
                        onPress={() => setSelectedCategory(category.value)}
                    >
                        <Text style={styles.categoryIcon}>
                            {getCategoryIcon(category.value)}
                        </Text>
                        <Text style={styles.categoryLabel}>{category.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAllText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '500',
    },
    categoriesScroll: {
        flexGrow: 0,
    },
    categoriesContainer: {
        paddingRight: 16,
    },
    categoryButton: {
        width: 80,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginRight: 12,
        backgroundColor: '#fff',
    },
    categoryButtonActive: {
        borderColor: '#3b82f6',
        backgroundColor: '#eff6ff',
    },
    categoryIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        textAlign: 'center',
    },
});