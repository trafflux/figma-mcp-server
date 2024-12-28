import { MCPError } from '@modelcontextprotocol/sdk';

export class ResourceNotFoundError extends MCPError {
  constructor(message: string) {
    super(100, message);
  }
}

export class ResourceAccessDeniedError extends MCPError {
  constructor(message: string) {
    super(101, message);
  }
}

export class ResourceTemporarilyUnavailableError extends MCPError {
  constructor(message: string) {
    super(102, message);
  }
}

export class InvalidFigmaTokenError extends MCPError {
  constructor() {
    super(-32603, 'Invalid or missing Figma access token');
  }
}

export class InvalidUriError extends MCPError {
  constructor(uri: string) {
    super(-32602, `Invalid Figma URI format: ${uri}`);
  }
}