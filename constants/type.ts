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

export interface Review {
    comment: string;
    helpfulCount: number;
};

