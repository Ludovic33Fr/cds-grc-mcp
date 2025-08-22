#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getInfoSeller, productList, productGet, productCount, productGetVariants, orderList, orderGet, orderAcknowledge, orderShip, orderCancel } from './mcp.js';
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
// ===== OUTILS DE GESTION DES COMMANDES =====
server.tool("OrderList", "List orders with filtering, sorting, and pagination. Supports filtering by status, salesChannel, date range, customer email, and reference.", {
    filters: z.object({
        status: z.union([z.string(), z.array(z.string())]).optional(),
        salesChannel: z.union([z.string(), z.array(z.string())]).optional(),
        createdAtFrom: z.string().optional(),
        createdAtTo: z.string().optional(),
        customerEmail: z.string().optional(),
        reference: z.string().optional(),
    }).optional(),
    cursor: z.string().nullable().optional(),
    limit: z.number().min(1).max(1000).default(100),
    sortBy: z.enum(["createdAt", "updatedAt", "reference", "totalAmount"]).default("createdAt"),
    sortDir: z.enum(["asc", "desc"]).default("desc"),
}, async (params) => {
    try {
        const result = await orderList(params);
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
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}!`,
                },
            ],
        };
    }
});
server.tool("OrderGet", "Get detailed information about a specific order by its ID.", {
    orderId: z.string().describe("The unique identifier of the order"),
}, async (params) => {
    try {
        const result = await orderGet(params);
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
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}!`,
                },
            ],
        };
    }
});
server.tool("OrderAcknowledge", "Acknowledge an order (global acceptance, not per line). Only pending orders can be acknowledged.", {
    orderId: z.string().describe("The unique identifier of the order to acknowledge"),
}, async (params) => {
    try {
        const result = await orderAcknowledge(params);
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
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}!`,
                },
            ],
        };
    }
});
server.tool("OrderShip", "Ship an order with tracking number and carrier information. Only acknowledged orders can be shipped.", {
    orderId: z.string().describe("The unique identifier of the order to ship"),
    trackingNumber: z.string().describe("The tracking number for the shipment"),
    carrier: z.string().describe("The name of the shipping carrier"),
}, async (params) => {
    try {
        const result = await orderShip(params);
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
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}!`,
                },
            ],
        };
    }
});
server.tool("OrderCancel", "Cancel an order. Only pending or acknowledged orders can be cancelled.", {
    orderId: z.string().describe("The unique identifier of the order to cancel"),
    reason: z.string().describe("The reason for cancelling the order"),
}, async (params) => {
    try {
        const result = await orderCancel(params);
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
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}!`,
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