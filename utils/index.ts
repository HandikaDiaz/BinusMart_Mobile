import { PaymentMethod, PaymentMethods } from '@/constants/type';

export const formatCurrency = (amount: number, currency: string = 'IDR'): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    }).format(amount);
};

export const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

export const getStatusColor = (status: string): { color: string; bgColor: string } => {
    const colors: Record<string, { color: string; bgColor: string }> = {
        'PENDING': { color: '#92400e', bgColor: '#fef3c7' },
        'PROCESSING': { color: '#1e40af', bgColor: '#dbeafe' },
        'SHIPPED': { color: '#7c3aed', bgColor: '#f3e8ff' },
        'DELIVERED': { color: '#065f46', bgColor: '#d1fae5' },
        'CANCELLED': { color: '#991b1b', bgColor: '#fee2e2' },
    };
    return colors[status] || { color: '#374151', bgColor: '#f3f4f6' };
};

export const generateRandomPaymentMethod = (): PaymentMethod => {
    const methods = [
        PaymentMethods.COD,
        PaymentMethods.CREDIT_CARD,
        PaymentMethods.BANK_TRANSFER,
        PaymentMethods.E_WALLET,
    ];
    return methods[Math.floor(Math.random() * methods.length)];
};

export const generateRandomDeliveryDate = (createdAt: Date): Date | null => {
    const isDelivered = Math.random() < 0.3;
    if (!isDelivered) return null;

    const createdDate = new Date(createdAt);
    const daysToAdd = Math.floor(Math.random() * 7) + 1;
    const deliveredDate = new Date(createdDate);
    deliveredDate.setDate(createdDate.getDate() + daysToAdd);
    return deliveredDate;
};

export const generateRandomIsPaid = (): boolean => {
    return Math.random() < 0.8;
};

export const generateRandomPaidDate = (createdAt: Date): Date | null => {
    const isPaid = generateRandomIsPaid();
    if (!isPaid) return null;

    const createdDate = new Date(createdAt);
    const hoursToAdd = Math.floor(Math.random() * 48);
    const paidDate = new Date(createdDate);
    paidDate.setHours(createdDate.getHours() + hoursToAdd);
    return paidDate;
};

export const generateRandomShippingInfo = () => {
    const addresses = [
        {
            street: "Jl. Sudirman No. 123",
            city: "Jakarta",
            state: "DKI Jakarta",
            zipCode: "10220",
            country: "Indonesia"
        },
        {
            street: "Jl. Thamrin No. 456",
            city: "Jakarta",
            state: "DKI Jakarta",
            zipCode: "10310",
            country: "Indonesia"
        },
        {
            street: "Jl. Gatot Subroto No. 789",
            city: "Jakarta",
            state: "DKI Jakarta",
            zipCode: "12950",
            country: "Indonesia"
        }
    ];

    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    const shippingPrice = Math.floor(Math.random() * 50000) + 10000;

    return {
        ...randomAddress,
        shippingPrice
    };
};