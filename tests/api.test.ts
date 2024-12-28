import { z } from 'zod';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { FigmaResourceHandler } from '../src/handlers/figma.js';
import {
  ListResourcesResponseSchema,
  ReadResourceRequestSchema,
  ResourceSchema
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
    server.setRequestHandler(z.object({
      method: z.literal('resources/list')
    }), async () => {
      const resources = await handler.list();
      return { resources };
    });

    server.setRequestHandler(z.object({
      method: z.literal('resources/read'),
      params: ReadResourceRequestSchema
    }), async (request) => {
      const contents = await handler.read(request.params.uri);
      return { contents };
    });

    // Setup client
    client = new Client(
      { name: 'test-client', version: '1.0.0' },
      { capabilities: {} }
    );
  });

  describe('Resource Listing', () => {
    it('should list available resources', async () => {
      const response = await client.request(
        { method: 'resources/list' },
        ListResourcesResponseSchema
      );

      expect(response).toHaveProperty('resources');
      expect(Array.isArray(response.resources)).toBe(true);
      response.resources.forEach(resource => {
        expect(() => ResourceSchema.parse(resource)).not.toThrow();
      });
    });
  });

  describe('Resource Reading', () => {
    it('should read file contents', async () => {
      const response = await client.request(
        {
          method: 'resources/read',
          params: { uri: 'figma:///file/mock-key' }
        },
        z.object({
          contents: z.array(z.object({
            uri: z.string(),
            mimeType: z.string(),
            text: z.string()
          }))
        })
      );

      expect(response).toHaveProperty('contents');
      expect(Array.isArray(response.contents)).toBe(true);
    });

    it('should handle invalid URIs', async () => {
      await expect(
        client.request(
          {
            method: 'resources/read',
            params: { uri: 'invalid-uri' }
          },
          z.object({
            contents: z.array(z.object({
              uri: z.string(),
              mimeType: z.string(),
              text: z.string()
            }))
          })
        )
      ).rejects.toThrow();
    });
  });
});
