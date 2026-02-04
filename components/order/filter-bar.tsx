import { OrderStatus, orderStatusConfig, OrderStatusT } from '@/constants/type';
import { Picker } from '@react-native-picker/picker';
import { ArrowUpDown, Filter, Search } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    View
} from 'react-native';

interface FiltersBarProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    statusFilter: OrderStatus | 'ALL';
    setStatusFilter: (value: OrderStatus | 'ALL') => void;
    sortBy: 'newest' | 'oldest' | 'total_high' | 'total_low';
    setSortBy: (value: 'newest' | 'oldest' | 'total_high' | 'total_low') => void;
}

export default function FiltersBar({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
}: FiltersBarProps) {
    const statusOptions = [
        { label: 'All Status', value: 'ALL' },
        ...Object.values(OrderStatusT).map(status => ({
            label: orderStatusConfig[status].label,
            value: status,
        })),
    ];

    const sortOptions = [
        { label: 'Newest First', value: 'newest' },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'Total: High to Low', value: 'total_high' },
        { label: 'Total: Low to High', value: 'total_low' },
    ];

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Search size={16} color="#6b7280" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search orders by ID or product name..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                </View>

                <View style={styles.filtersContainer}>
                    <View style={styles.filterGroup}>
                        <Filter size={16} color="#6b7280" />
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={statusFilter}
                                onValueChange={(itemValue) => setStatusFilter(itemValue)}
                                style={styles.picker}
                            >
                                {statusOptions.map(option => (
                                    <Picker.Item
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.filterGroup}>
                        <ArrowUpDown size={16} color="#6b7280" />
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={sortBy}
                                onValueChange={(itemValue) => setSortBy(itemValue)}
                                style={styles.picker}
                            >
                                {sortOptions.map(option => (
                                    <Picker.Item
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        padding: 20,
        gap: 16,
    },
    searchContainer: {
        flex: 1,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 40,
        paddingVertical: 12,
        fontSize: 14,
        backgroundColor: 'white',
        color: '#111827',
    },
    filtersContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    filterGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pickerContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: 'white',
    },
    picker: {
        height: 44,
    },
});