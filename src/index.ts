import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class FigmaAPIServer {
    private server: Server;
    private figmaToken: string;
    private baseURL = 'https://api.figma.com/v1';

    constructor(figmaToken: string) {
        this.figmaToken = figmaToken;
        this.server = new Server({
            name: "figma-api-server",
            version: "1.0.0",
        }, {
            capabilities: {
                resources: {},
                commands: {},
                events: {}
            }
        });

        this.setupAPIHandlers();
    }

    private async figmaRequest(method: string, endpoint: string, data?: any) {
        try {
            const response = await axios({
                method,
                url: `${this.baseURL}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${this.figmaToken}`,
                    'Content-Type': 'application/json'
                },
                data
            });
            return response.data;
        } catch (error) {
            console.error(`Figma API error: ${endpoint}`, error);
            throw error;
        }
    }

    private setupAPIHandlers() {
        // Files API
        this.server.setRequestHandler("figma/files/get", async (request) => {
            const { fileId } = request.params;
            return await this.figmaRequest('GET', `/files/${fileId}`);
        });

        // More handlers will be added here
    }

    public async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.log('Figma API Server started');
    }
}

// Start the server
async function main() {
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
    if (!figmaToken) {
        throw new Error('FIGMA_ACCESS_TOKEN environment variable is required');
    }

    const server = new FigmaAPIServer(figmaToken);
    await server.start();
}

main().catch(console.error);