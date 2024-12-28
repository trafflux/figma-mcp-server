import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Variable collection interface
interface VariableCollection {
    id: string;
    name: string;
    variableIds: string[];
    defaultModeId: string;
    modeIds: string[];
    remote: boolean;
}

// Variable interface
interface Variable {
    id: string;
    name: string;
    key: string;
    resolvedType: string;
    description: string;
    hiddenFromPublishing: boolean;
    scopes: string[];
    codeSyntax: {
        web: string;
        android: string;
        ios: string;
    };
    remote: boolean;
    value: any;
}

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
        this.setupVariableHandlers();
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

        // Export files
        this.server.setRequestHandler("figma/files/export", async (request) => {
            const { fileId, format, scale } = request.params;
            return await this.figmaRequest('GET', `/images/${fileId}`, {
                format: format || 'png',
                scale: scale || 1
            });
        });

        // Components API
        this.server.setRequestHandler("figma/components/get", async (request) => {
            const { fileId, nodeId } = request.params;
            return await this.figmaRequest('GET', `/components/${fileId}/${nodeId}`);
        });

        // Team components
        this.server.setRequestHandler("figma/team/components", async (request) => {
            const { teamId } = request.params;
            return await this.figmaRequest('GET', `/teams/${teamId}/components`);
        });

        // Comments API
        this.server.setRequestHandler("figma/comments/get", async (request) => {
            const { fileId } = request.params;
            return await this.figmaRequest('GET', `/files/${fileId}/comments`);
        });

        this.server.setRequestHandler("figma/comments/post", async (request) => {
            const { fileId, message, client_meta } = request.params;
            return await this.figmaRequest('POST', `/files/${fileId}/comments`, {
                message,
                client_meta
            });
        });

        // File versions
        this.server.setRequestHandler("figma/files/versions", async (request) => {
            const { fileId } = request.params;
            return await this.figmaRequest('GET', `/files/${fileId}/versions`);
        });

        // Styles
        this.server.setRequestHandler("figma/styles/get", async (request) => {
            const { styleId } = request.params;
            return await this.figmaRequest('GET', `/styles/${styleId}`);
        });

        // Projects
        this.server.setRequestHandler("figma/projects/files", async (request) => {
            const { projectId } = request.params;
            return await this.figmaRequest('GET', `/projects/${projectId}/files`);
        });

        // Image fills
        this.server.setRequestHandler("figma/images/get", async (request) => {
            const { fileId, ids } = request.params;
            return await this.figmaRequest('GET', `/images/${fileId}`, {
                ids: Array.isArray(ids) ? ids.join(',') : ids
            });
        });
    }

    private setupVariableHandlers() {
        // Get all variable collections in a file
        this.server.setRequestHandler("figma/variables/collections", async (request) => {
            const { fileId } = request.params;
            return await this.figmaRequest('GET', `/files/${fileId}/variable_collections`);
        });

        // Get variables in a file
        this.server.setRequestHandler("figma/variables/get", async (request) => {
            const { fileId } = request.params;
            return await this.figmaRequest('GET', `/files/${fileId}/variables`);
        });

        // Create a variable collection
        this.server.setRequestHandler("figma/variables/collections/create", async (request) => {
            const { fileId, name, variableIds = [] } = request.params;
            return await this.figmaRequest('POST', `/files/${fileId}/variable_collections`, {
                name,
                variableIds
            });
        });

        // Create a variable
        this.server.setRequestHandler("figma/variables/create", async (request) => {
            const { fileId, collectionId, name, resolvedType, value } = request.params;
            return await this.figmaRequest('POST', `/files/${fileId}/variables`, {
                name,
                resolvedType,
                collectionId,
                value
            });
        });

        // Update a variable
        this.server.setRequestHandler("figma/variables/update", async (request) => {
            const { fileId, variableId, ...updates } = request.params;
            return await this.figmaRequest('PUT', `/files/${fileId}/variables/${variableId}`, updates);
        });

        // Delete a variable
        this.server.setRequestHandler("figma/variables/delete", async (request) => {
            const { fileId, variableId } = request.params;
            return await this.figmaRequest('DELETE', `/files/${fileId}/variables/${variableId}`);
        });

        // Get variable modes
        this.server.setRequestHandler("figma/variables/modes", async (request) => {
            const { fileId, collectionId } = request.params;
            return await this.figmaRequest('GET', `/files/${fileId}/variable_collections/${collectionId}/modes`);
        });

        // Update variable collection
        this.server.setRequestHandler("figma/variables/collections/update", async (request) => {
            const { fileId, collectionId, ...updates } = request.params;
            return await this.figmaRequest('PUT', `/files/${fileId}/variable_collections/${collectionId}`, updates);
        });

        // Delete variable collection
        this.server.setRequestHandler("figma/variables/collections/delete", async (request) => {
            const { fileId, collectionId } = request.params;
            return await this.figmaRequest('DELETE', `/files/${fileId}/variable_collections/${collectionId}`);
        });
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