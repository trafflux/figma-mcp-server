# Figma MCP Server

A TypeScript server implementing the [Model Context Protocol (MCP)](https://modelcontextprotocol.io) for the Figma API, enabling standardized context provision for LLMs.

## Overview

This server provides MCP-compliant access to Figma resources, allowing LLM applications to seamlessly integrate with Figma files, components, and variables. It implements the full MCP specification while providing specialized handlers for Figma's unique resource types.

### Key Features

- **MCP Resource Handlers**
  - Figma files access and manipulation
  - Variables and components management
  - Custom URI scheme (figma:///)
  
- **Robust Implementation**
  - Type-safe implementation using TypeScript
  - Request validation using Zod schemas
  - Comprehensive error handling
  - Token validation and API integration
  - Batch operations support

## Project Structure

```
figma-mcp-server/
├── src/
│   ├── index.ts         # Main server implementation
│   ├── types.ts         # TypeScript types & interfaces
│   ├── schemas.ts       # Zod validation schemas
│   ├── errors.ts        # Error handling
│   └── middleware/      # Server middleware
├── tests/
│   └── api.test.ts      # API tests
└── package.json
```

## Installation

```bash
npm install @modelcontextprotocol/sdk
npm install
```

## Configuration

1. Set up your Figma access token:
   ```bash
   export FIGMA_ACCESS_TOKEN=your_access_token
   ```

2. Configure the server (optional):
   ```bash
   export MCP_SERVER_PORT=3000
   ```

## Usage

### Starting the Server

```bash
npm run start
```

### Client Integration

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "path/to/figma-mcp-server",
});

const client = new Client({
  name: "figma-client",
  version: "1.0.0",
}, {
  capabilities: {}
});

await client.connect(transport);

// List available Figma resources
const resources = await client.request(
  { method: "resources/list" },
  ListResourcesResultSchema
);

// Read a specific Figma file
const fileContent = await client.request(
  {
    method: "resources/read",
    params: {
      uri: "figma:///file/key"
    }
  },
  ReadResourceResultSchema
);
```

## Resource URIs

The server implements a custom `figma:///` URI scheme for accessing Figma resources:

- Files: `figma:///file/{file_key}`
- Components: `figma:///component/{file_key}/{component_id}`
- Variables: `figma:///variable/{file_key}/{variable_id}`

## Development

### Setting Up Development Environment

```bash
npm install
npm run build
```

### Running Tests

```bash
npm test
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Implement comprehensive test suite
- [ ] Add support for more Figma API endpoints
- [ ] Implement caching layer
- [ ] Add rate limiting
- [ ] Enhance documentation
- [ ] Set up CI/CD pipeline

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [MCP Specification](https://spec.modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
