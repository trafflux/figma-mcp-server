# Figma MCP Server

A Model Context Protocol server implementation for interfacing with the Figma API.

## Features

### File Operations
- Get file information and content
- Export files to various formats
- Get file version history
- Get and post comments

### Variable Management
- Read variable collections and variables
- Create new variables and collections
- Update existing variables
- Delete variables and collections
- Manage variable modes

### Components and Styles
- Get component information
- List team components
- Access style information

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and add your Figma API token:

```bash
cp .env.example .env
```

Then edit `.env` and add your Figma API token.

## Usage Examples

### Variables

1. Read Variables:
```typescript
// Get all variable collections
const collections = await client.request("figma/variables/collections", { 
    fileId: "your_file_id" 
});

// Get all variables in a file
const variables = await client.request("figma/variables/get", { 
    fileId: "your_file_id" 
});
```

2. Create Variables:
```typescript
// Create a variable collection
const collection = await client.request("figma/variables/collections/create", {
    fileId: "your_file_id",
    name: "My Colors",
    variableIds: []
});

// Create a variable
const variable = await client.request("figma/variables/create", {
    fileId: "your_file_id",
    collectionId: collection.id,
    name: "Primary Color",
    resolvedType: "COLOR",
    value: "#0066FF"
});
```

3. Update Variables:
```typescript
await client.request("figma/variables/update", {
    fileId: "your_file_id",
    variableId: "123",
    value: "#FF0000",
    name: "New Name" // optional
});
```

### Files

```typescript
// Get file information
const fileInfo = await client.request("figma/files/get", { 
    fileId: "your_file_id" 
});

// Export file
const exportInfo = await client.request("figma/files/export", {
    fileId: "your_file_id",
    format: "png",
    scale: 2
});
```

## Building

```bash
npm run build
```

## Running

```bash
npm start
```

## Development

```bash
npm run dev
```

## License

MIT