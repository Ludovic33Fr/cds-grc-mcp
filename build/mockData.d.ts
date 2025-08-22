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
export interface OrderAddress {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
    email?: string;
}
export interface OrderItem {
    id: string;
    gtin: string;
    productReference: string;
    title: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: "pending" | "acknowledged" | "shipped" | "cancelled";
    trackingNumber?: string;
    carrier?: string;
}
export interface Order {
    id: string;
    reference: string;
    status: "pending" | "acknowledged" | "shipped" | "delivered" | "cancelled";
    salesChannel: "cdiscount" | "amazon" | "fnac" | "rakuten";
    customer: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    billingAddress: OrderAddress;
    shippingAddress: OrderAddress;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    taxAmount: number;
    totalAmount: number;
    currency: "EUR" | "USD";
    paymentMethod: "card" | "paypal" | "bank_transfer";
    paymentStatus: "pending" | "paid" | "failed";
    createdAt: string;
    updatedAt: string;
    acknowledgedAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
}
export declare const products: Product[];
export declare const orders: Order[];
export declare function resetOrdersData(): void;
//# sourceMappingURL=mockData.d.ts.map