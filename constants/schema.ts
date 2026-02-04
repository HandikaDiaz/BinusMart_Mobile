import z from "zod";

export const productSchema = z.object({
    productName: z.string().min(1, "Product name is required"),
    fullDescription: z.string().min(1, "Description is required"),
    images: z.array(z.object({
        url: z.string(),
        isPrimary: z.boolean(),
    })),
    shortDescription: z.string(),
    category: z.string(),
    length: z.number(),
    width: z.number(),
    height: z.number(),
    dimensionUnit: z.string(),
    weight: z.number(),
    weightUnit: z.string(),
    material: z.string(),
    warrantyPeriod: z.number(),
    warrantyType: z.string(),
    warrantyDetail: z.string(),
    variants: z.array(z.object({
        variantName: z.string(),
        price: z.number(),
        stock: z.number(),
        SKU: z.string(),
        color: z.string(),
        size: z.string(),
        isPrimary: z.boolean(),
    })),
    specifications: z.array(z.object({
        specificationName: z.string(),
        specificationDetail: z.string(),
    })),
    metaTitle: z.string(),
    metaDescription: z.string(),
    tag: z.array(z.string()),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
});

export type productType = z.infer<typeof productSchema>;