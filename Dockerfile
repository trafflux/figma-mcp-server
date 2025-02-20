FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies including dev dependencies
RUN npm install

# Copy source code and config files
COPY . .

# Verify TypeScript can locate MCP SDK
RUN ls -la node_modules/@modelcontextprotocol/sdk/dist

# Build TypeScript
RUN npm run build

# Create production image
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy MCP SDK files
COPY --from=builder /app/node_modules/@modelcontextprotocol node_modules/@modelcontextprotocol

# Set production environment
ENV NODE_ENV=production

# Ensure proper stdio handling
CMD ["node", "dist/index.js"]
