import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { FigmaResourceHandler } from '../src/handlers/figma.js';
import {
  ListResourcesHandlerSchema,
  ListResourcesResponseSchema,
  ReadResourceHandlerSchema,
  ReadResourceResponseSchema
} from '../src/schemas.js';

describe('Figma MCP Server', () => {
  let server: Server;
  let client: Client;
  let handler: FigmaResourceHandler;

  beforeAll(async () => {
    // Setup server
    handler = new FigmaResourceHandler('mock-token');
    server = new Server(
      { name: 'test-server', version: '1.0.0' },
      { capabilities: { resources: {} } }
    );

    // Register handlers
    server.setRequestHandler(ListResourcesHandlerSchema, async () => {
      const resources = await handler.list();
      return { resources };
    });

    server.setRequestHandler(ReadResourceHandlerSchema, async (request) => {
      const contents = await handler.read(request.params.uri);
      return { contents };
    });

    // Setup client
    client = new Client(
      { name: 'test-client', version: '1.0.0' },
      { capabilities: {} }
    );

    // Connect client to server
    await client.connect();
  });

  describe('Resource Listing', () => {
    it('should list available resources', async () => {
      const response = await client.request(
        { 
          jsonrpc: '2.0',
          method: 'resources/list'
        },
        ListResourcesResponseSchema
      );

      expect(response).toHaveProperty('resources');
      expect(Array.isArray(response.resources)).toBe(true);
    });
  });

  describe('Resource Reading', () => {
    it('should read file contents', async () => {
      const response = await client.request(
        {
          jsonrpc: '2.0',
          method: 'resources/read',
          params: { uri: 'figma:///file/mock-key' }
        },
        ReadResourceResponseSchema
      );

      expect(response).toHaveProperty('contents');
      expect(Array.isArray(response.contents)).toBe(true);
    });

    it('should handle invalid URIs', async () => {
      await expect(
        client.request(
          {
            jsonrpc: '2.0',
            method: 'resources/read',
            params: { uri: 'invalid-uri' }
          },
          ReadResourceResponseSchema
        )
      ).rejects.toThrow();
    });
  });
});
