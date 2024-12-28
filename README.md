# Figma MCP Server

A Model Context Protocol server implementation for interfacing with the Figma API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example` and add your Figma access token:
```bash
cp .env.example .env
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

## Development

For development with hot reloading:
```bash
npm run dev
```

## Environment Variables

- `FIGMA_ACCESS_TOKEN`: Your Figma API access token