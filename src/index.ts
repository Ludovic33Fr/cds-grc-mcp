#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { 
  getInfoSeller,
  authenticateOAuth, 
} from './mcp.js';

// Create server instance
const server = new McpServer({
  name: "cds-grc-mcp",
  version: "1.0.0",
});

// Register CDiscount tools
server.tool(
  "GetInfoSeller",
  "Get seller information from an e-commerce marketplace. This method returns detailed seller profile including rating, sales statistics, policies, and verification status.",
  {
    oauthToken: z.string().describe("The OAuth token required to authenticate the request."),
  },
  async ({ oauthToken }) => {
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
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "AuthenticateOAuth",
  "Authenticate using OAuth2 flow with PKCE (Proof Key for Code Exchange) and return an authentication token. This method opens a browser for user login and handles the complete OAuth2 authorization flow securely.",
  {},
  async () => {
    try {
      const clientId = "ftc78cbA5pb2cmjnHS23QAoU";
      const clientSecret = undefined;
      const redirectUri = "http://localhost:3000/callback";
      const scope = "photo";

      const result = await authenticateOAuth(clientId, clientSecret, redirectUri, scope);
      
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  },
);

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