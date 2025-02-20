import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import { createServer } from "http";
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

class FigmaAPIServer {
    private server: Server;
    private figmaToken: string;
    private baseURL: string = 'https://api.figma.com/v1';
    private watchedResources: Map<string, { lastModified: string }> = new Map();
    private expressApp: express.Application;
    private httpServer: ReturnType<typeof createServer>;

    constructor(figmaToken: string) {
        if (!figmaToken) {
            throw new Error('FIGMA_ACCESS_TOKEN is required but not provided');
        }
        
        console.log(`Initializing server with token starting with: ${figmaToken.substring(0, 8)}...`);
        
        this.figmaToken = figmaToken;
        this.server = new Server({
            name: "figma-api-server",
            version: "1.0.0",
        }, {
            capabilities: {
                resources: {
                    subscribe: true,
                    listChanged: true,
                    list: true,
                    read: true,
                    watch: true
                },
                commands: {},
                events: {}
            }
        });

        this.expressApp = express();
        this.httpServer = createServer(this.expressApp);
        this.setupHandlers();
        this.setupExpress();
    }

    private setupExpress() {
        // Log all incoming requests
        this.expressApp.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });

        // CORS configuration
        this.expressApp.use(cors({
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'X-Figma-Token'],
            credentials: true
        }));

        // SSE endpoint
        this.expressApp.get('/events', async (req: express.Request, res: express.Response) => {
            console.log('New SSE connection attempt');
            
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            // Create SSE transport for this connection
            const sseTransport = new SSEServerTransport('/events', res);
            await sseTransport.start();

            const clientId = Date.now();
            console.log(`SSE Client ${clientId} connected`);

            // Handle incoming POST requests for this transport
            this.expressApp.post('/events', async (postReq: express.Request, postRes: express.Response) => {
                await sseTransport.handlePostMessage(postReq, postRes);
            });

            // Handle client disconnect
            req.on('close', () => {
                console.log(`SSE Client ${clientId} disconnected`);
                sseTransport.close().catch(console.error);
            });
        });

        // Health check endpoint
        this.expressApp.get('/health', (req: express.Request, res: express.Response) => {
            res.json({ status: 'healthy' });
        });
    }

    private setupHandlers() {
        // ... [Previous handlers implementation] ...
    }

    private async startHttpServer() {
        const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        const host = process.env.HOST || 'localhost';

        await new Promise<void>((resolve) => {
            this.httpServer.listen(port, () => {
                console.log(`HTTP server listening on http://${host}:${port}`);
                console.log(`SSE endpoint available at http://${host}:${port}/events`);
                resolve();
            });
        });
    }

    public async start() {
        console.log(`Server starting up...`);
        
        try {
            if (process.env.PORT) {
                // SSE mode with HTTP server
                await this.startHttpServer();
            } else {
                // Stdio mode
                console.log('Starting in stdio mode...');
                const stdioTransport = new StdioServerTransport();
                await this.server.connect(stdioTransport);
            }

            console.log('Server started successfully');
        } catch (error) {
            console.error('Error starting server:', error);
            throw error;
        }
    }
}

// Start the server
async function main() {
    try {
        console.log('Starting Figma MCP server...');
        console.log('Environment variables loaded:', {
            FIGMA_ACCESS_TOKEN: process.env.FIGMA_ACCESS_TOKEN ? 'Present' : 'Missing',
            PORT: process.env.PORT || 3000,
            HOST: process.env.HOST || 'localhost',
            NODE_ENV: process.env.NODE_ENV
        });

        const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
        if (!figmaToken) {
            throw new Error('FIGMA_ACCESS_TOKEN environment variable is required');
        }

        const server = new FigmaAPIServer(figmaToken);
        await server.start();
    } catch (error) {
        console.error('Fatal error starting server:', error);
        process.exit(1);
    }
}

main().catch(console.error);
