# Figma MCP Server

A Model Context Protocol server that interfaces with the Figma API, providing a comprehensive interface for managing Figma variables, components, and other design system elements.

## Features

### Variable Management
- Create, read, update, and delete variables
- Variable type validation
- Batch operations for efficient updates
- Support for variable modes and scopes
- Comprehensive variable validation

### File Operations
- File content retrieval
- Export capabilities
- Version history access

### Components and Styles
- Component management
- Style operations
- Team component library access

### Collaboration
- Comment creation and retrieval
- File collaboration features

## Installation

```bash
# Clone the repository
git clone https://github.com/TimHolden/figma-mcp-server.git
cd figma-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Figma access token:
```env
FIGMA_ACCESS_TOKEN=your_access_token_here
FIGMA_FILE_ID=optional_file_id_for_testing
```

## Usage

### Starting the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Running Tests
```bash
# Run API connection tests
npm test

# Run with auto-reload
npm run test:watch

# Run usage examples
npm run examples
```

### Variable Operations

```typescript
// Create a variable with validation
await server.handleRequest({
    method: 'figma/variables/create',
    params: {
        fileId: 'your_file_id',
        name: 'Primary Color',
        resolvedType: 'COLOR',
        value: '#007AFF',
        validation: {
            type: 'COLOR'
        }
    }
});

// Batch create variables
await server.handleRequest({
    method: 'figma/variables/batch/create',
    params: {
        fileId: 'your_file_id',
        variables: [
            { 
                name: 'Spacing/Small',
                resolvedType: 'FLOAT',
                value: 8,
                validation: { type: 'FLOAT', min: 0, max: 100 }
            },
            // ... more variables
        ]
    }
});
```

### Variable Modes

```typescript
// Create a new mode
await server.handleRequest({
    method: 'figma/variables/modes/create',
    params: {
        fileId: 'your_file_id',
        collectionId: 'collection_id',
        name: 'Dark Mode',
        variableValues: {
            'Primary Color': '#0A84FF'
        }
    }
});
```

## API Reference

### Variable Management
- `figma/variables/collections` - Get all variable collections
- `figma/variables/get` - Get variables in a file
- `figma/variables/create` - Create a variable with validation
- `figma/variables/batch/create` - Batch create variables
- `figma/variables/modes/create` - Create a variable mode
- `figma/variables/modes/update` - Update a variable mode

### File Operations
- `figma/files/get` - Get file content
- `figma/files/export` - Export file content
- `figma/files/versions` - Get file versions

### Components
- `figma/components/get` - Get component information
- `figma/team/components` - Get team components

### Comments
- `figma/comments/get` - Get file comments
- `figma/comments/post` - Create a comment

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT