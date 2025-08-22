export declare function authenticateOAuth(clientId: string, clientSecret?: string, redirectUri?: string, scope?: string): Promise<string>;
export declare function getInfoSeller(oauthToken: string): Promise<string>;
export declare function productList(params: {
    filters?: {
        gtin?: string | string[];
        productReference?: string | string[];
        categoryReference?: string | string[];
        brandReference?: string;
        updatedAtFrom?: string;
        updatedAtTo?: string;
        q?: string;
    };
    cursor?: string | null;
    limit?: number;
    sortBy?: "updatedAt" | "createdAt" | "gtin";
    sortDir?: "asc" | "desc";
    "mockOnly.fields"?: string[];
}): Promise<any>;
export declare function productGet(params: {
    gtin: string;
}): Promise<any>;
export declare function productCount(params: {
    filters?: {
        gtin?: string | string[];
        productReference?: string | string[];
        categoryReference?: string | string[];
        brandReference?: string;
        updatedAtFrom?: string;
        updatedAtTo?: string;
        q?: string;
    };
}): Promise<any>;
export declare function productGetVariants(params: {
    groupReference: string;
    cursor?: string | null;
    limit?: number;
}): Promise<any>;
export declare function orderList(params: {
    filters?: {
        status?: string | string[];
        salesChannel?: string | string[];
        createdAtFrom?: string;
        createdAtTo?: string;
        customerEmail?: string;
        reference?: string;
    };
    cursor?: string | null;
    limit?: number;
    sortBy?: "createdAt" | "updatedAt" | "reference" | "totalAmount";
    sortDir?: "asc" | "desc";
}): Promise<any>;
export declare function orderGet(params: {
    orderId: string;
}): Promise<any>;
export declare function orderAcknowledge(params: {
    orderId: string;
}): Promise<any>;
export declare function orderShip(params: {
    orderId: string;
    trackingNumber: string;
    carrier: string;
}): Promise<any>;
export declare function orderCancel(params: {
    orderId: string;
    reason: string;
}): Promise<any>;
//# sourceMappingURL=mcp.d.ts.map