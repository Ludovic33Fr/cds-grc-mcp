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
//# sourceMappingURL=mcp.d.ts.map