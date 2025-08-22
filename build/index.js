#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getInfoSeller, productList, productGet, productCount, productGetVariants } from './mcp.js';
// Create server instance
const server = new McpServer({
    name: "cds-grc-mcp",
    version: "1.0.0",
});
// Register CDiscount tools
server.tool("GetInfoSeller", "Get seller information from an e-commerce marketplace. This method returns detailed seller profile including rating, sales statistics, policies, and verification status.", {
    oauthToken: z.string().describe("The OAuth token required to authenticate the request."),
}, async ({ oauthToken }) => {
    try {
        if (typeof oauthToken !== "string") {
            throw new Error("oauthToken is required and must be a string.");
        }
        const result = await getInfoSeller(oauthToken);
        return {
            content: [
                {
                    type: "text",
                    text: result,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
        };
    }
});
// Register Product tools
server.tool("ProductList", "List products with filtering, sorting, and pagination. Returns products respecting visibility rules based on createdBySeller flag.", {
    filters: z.object({
        gtin: z.union([z.string(), z.array(z.string())]).optional(),
        productReference: z.union([z.string(), z.array(z.string())]).optional(),
        categoryReference: z.union([z.string(), z.array(z.string())]).optional(),
        brandReference: z.string().optional(),
        updatedAtFrom: z.string().optional(),
        updatedAtTo: z.string().optional(),
        q: z.string().optional(),
    }).optional(),
    cursor: z.string().nullable().optional(),
    limit: z.number().min(1).max(1000).default(100),
    sortBy: z.enum(["updatedAt", "createdAt", "gtin"]).default("updatedAt"),
    sortDir: z.enum(["asc", "desc"]).default("desc"),
    "mockOnly.fields": z.array(z.string()).optional(),
}, async (params) => {
    try {
        const result = await productList(params);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
        };
    }
});
server.tool("ProductGet", "Get a single product by GTIN. Returns product respecting visibility rules based on createdBySeller flag.", {
    gtin: z.string().describe("The GTIN (EAN) of the product to retrieve."),
}, async ({ gtin }) => {
    try {
        const result = await productGet({ gtin });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
        };
    }
});
server.tool("ProductCount", "Count products matching the specified filters.", {
    filters: z.object({
        gtin: z.union([z.string(), z.array(z.string())]).optional(),
        productReference: z.union([z.string(), z.array(z.string())]).optional(),
        categoryReference: z.union([z.string(), z.array(z.string())]).optional(),
        brandReference: z.string().optional(),
        updatedAtFrom: z.string().optional(),
        updatedAtTo: z.string().optional(),
        q: z.string().optional(),
    }).optional(),
}, async (params) => {
    try {
        const result = await productCount(params);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
        };
    }
});
server.tool("ProductGetVariants", "Get product variants by group reference with pagination. Returns products respecting visibility rules.", {
    groupReference: z.string().describe("The group reference to find variants for."),
    cursor: z.string().nullable().optional(),
    limit: z.number().min(1).max(1000).default(100),
}, async (params) => {
    try {
        const result = await productGetVariants(params);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
        };
    }
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("CDS MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map