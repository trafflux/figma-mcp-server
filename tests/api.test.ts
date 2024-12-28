import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { FigmaResourceHandler } from '../src/handlers/figma.js';

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
    server.setRequestHandler('resources/list', async () => {
      const resources = await handler.list();
      return { resources };
    });

    server.setRequestHandler('resources/read', async (request) => {
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
        { method: 'resources/list' }
      );

      expect(response).toHaveProperty('resources');
      expect(Array.isArray(response.resources)).toBe(true);
    });
  });

  describe('Resource Reading', () => {
    it('should read file contents', async () => {
      const response = await client.request({
        method: 'resources/read',
        params: { uri: 'figma:///file/mock-key' }
      });

      expect(response).toHaveProperty('contents');
      expect(Array.isArray(response.contents)).toBe(true);
    });

    it('should handle invalid URIs', async () => {
      await expect(
        client.request({
          method: 'resources/read',
          params: { uri: 'invalid-uri' }
        })
      ).rejects.toThrow();
    });
  });
});
