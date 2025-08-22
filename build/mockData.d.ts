export interface ProductCategory {
    reference: string;
    label: string;
    referencePath: string;
}
export interface ProductBrand {
    reference: string;
    name: string;
}
export interface ProductAttribute {
    reference: string;
    label: string;
    unit: string | null;
    values: string[];
    files: {
        index: number;
        mimeType: string;
        url: string;
        updatedAt: string;
    }[];
}
export interface ProductPicture {
    index: number;
    url: string;
}
export interface Product {
    gtin: string;
    productReference: string;
    title: string;
    language: "fr-FR" | "en-GB" | "es-ES";
    category: ProductCategory;
    brand: ProductBrand;
    attributes: ProductAttribute[];
    pictures: ProductPicture[];
    description: string;
    completeness: number;
    groupReference: string | null;
    createdBySeller: boolean;
    createdAt: string;
    updatedAt: string;
}
export declare const products: Product[];
//# sourceMappingURL=mockData.d.ts.map