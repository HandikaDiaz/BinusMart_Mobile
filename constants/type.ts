export const Roles = {
    USER: 'USER',
    ADMIN: 'ADMIN'
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Seller {
    id: string;
    name: string;
    email: string;
    avatar: string;
};

export const Categories = {
    ELECTRONICS: 'ELECTRONICS',
    FASHION: 'FASHION',
    HOME: 'HOME',
    BOOKS: 'BOOKS',
    SPORTS: 'SPORTS',
    OTHER: 'OTHER'
} as const;

export type Category = typeof Categories[keyof typeof Categories];

export interface Products {
    id: string;
    productName: string;
    fullDescription: string;
    image: Images[];
    shortDescription: string;

    category: Category;

    length: number;
    width: number;
    height: number;
    dimensionUnit: string;

    weight: number;
    weightUnit: string;

    material: string;

    warrantyPeriod: number;
    warrantyType: string;
    warrantyDetail: string;

    variants: Variants[];

    specifications: Specifications[];

    reviews: Review[];

    metaTitle: string;
    metaDescription: string;
    tag: string[];

    seller: Seller;
    sellerId: string;

    isActive: boolean;
    isFeatured: boolean;

    createdAt: Date;
    updatedAt: Date;
};

export interface Images {
    url: string;
    isPrimary: boolean;
};

export interface Variants {
    id?: string;
    variantName: string;
    price: number;
    stock: number;
    SKU: string;
    color: string;
    size: string;
    isPrimary: boolean;
};

export interface Specifications {
    specificationName: string;
    specificationDetail: string;
};

export interface Cart {
    id: string;
    quantity: number;
    status: string;
    userId: string;
    productId: string;
    product: Products;
    variantsId: string;
    variant: Variants;
    createdAt: Date;
    updatedAt: Date;
    paymentMethod?: PaymentMethod;
    isPaid?: boolean;
    paidAt?: string | null;
    deliveredAt?: string | null;
    shippingAddress?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    shippingPrice?: number;
}

export interface Review {
    comment: string;
    helpfulCount: number;
};

export const PaymentMethods = {
    COD: 'COD',
    CREDIT_CARD: 'CREDIT_CARD',
    BANK_TRANSFER: 'BANK_TRANSFER',
    E_WALLET: 'E_WALLET'
} as const;

export type PaymentMethod = typeof PaymentMethods[keyof typeof PaymentMethods];

export const OrderStatusT = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
} as const;

export type OrderStatus = typeof OrderStatusT[keyof typeof OrderStatusT];

export const orderStatusConfig: Record<OrderStatus, {
    label: string;
    color: string;
    bgColor: string;
    icon: string;
}> = {
    [OrderStatusT.PENDING]: {
        label: 'Pending',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: '⏳',
    },
    [OrderStatusT.PROCESSING]: {
        label: 'Processing',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        icon: '🔄',
    },
    [OrderStatusT.SHIPPED]: {
        label: 'Shipped',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        icon: '🚚',
    },
    [OrderStatusT.DELIVERED]: {
        label: 'Delivered',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: '✅',
    },
    [OrderStatusT.CANCELLED]: {
        label: 'Cancelled',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: '❌',
    },
};


export const paymentMethodConfig: Record<PaymentMethod, {
    label: string;
    icon: string;
}> = {
    [PaymentMethods.COD]: {
        label: 'Cash on Delivery',
        icon: '💵',
    },
    [PaymentMethods.CREDIT_CARD]: {
        label: 'Credit Card',
        icon: '💳',
    },
    [PaymentMethods.BANK_TRANSFER]: {
        label: 'Bank Transfer',
        icon: '🏦',
    },
    [PaymentMethods.E_WALLET]: {
        label: 'E-Wallet',
        icon: '📱',
    },
};
