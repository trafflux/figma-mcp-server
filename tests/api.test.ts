import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from 'axios';
import dotenv from 'dotenv';
import { FigmaAPIServer } from '../src/index';

dotenv.config();

async function testFigmaConnection() {
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
    if (!figmaToken) {
        throw new Error('FIGMA_ACCESS_TOKEN environment variable is required');
    }

    try {
        // Test basic API connection
        const response = await axios.get('https://api.figma.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${figmaToken}`
            }
        });
        console.log('✓ Successfully connected to Figma API');
        console.log('User info:', response.data);
        return true;
    } catch (error) {
        console.error('× Failed to connect to Figma API:', error.message);
        return false;
    }
}

async function testVariableOperations(fileId: string) {
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
    if (!figmaToken) {
        throw new Error('FIGMA_ACCESS_TOKEN environment variable is required');
    }

    try {
        // Test getting variable collections
        const collectionsResponse = await axios.get(
            `https://api.figma.com/v1/files/${fileId}/variable_collections`,
            {
                headers: {
                    'Authorization': `Bearer ${figmaToken}`
                }
            }
        );
        console.log('✓ Successfully retrieved variable collections');
        console.log('Collections:', collectionsResponse.data);

        // Test getting variables
        const variablesResponse = await axios.get(
            `https://api.figma.com/v1/files/${fileId}/variables`,
            {
                headers: {
                    'Authorization': `Bearer ${figmaToken}`
                }
            }
        );
        console.log('✓ Successfully retrieved variables');
        console.log('Variables:', variablesResponse.data);

        return true;
    } catch (error) {
        console.error('× Failed to test variable operations:', error.message);
        return false;
    }
}

// Run tests
async function runTests() {
    console.log('Starting Figma API tests...\n');

    // Test 1: Basic API Connection
    console.log('Test 1: Basic API Connection');
    const connectionSuccess = await testFigmaConnection();
    
    if (connectionSuccess) {
        // Test 2: Variable Operations (requires a file ID)
        console.log('\nTest 2: Variable Operations');
        console.log('Please provide a Figma file ID to test variable operations.');
        console.log('You can get this from any Figma file URL: figma.com/file/[FILE_ID]/...');
    }
}

runTests().catch(console.error);