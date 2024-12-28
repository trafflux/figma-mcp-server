import axios from 'axios';
import dotenv from 'dotenv';
import { FigmaAPIServer } from '../src/index.js';

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
    } catch (error: any) {
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
    } catch (error: any) {
        console.error('× Failed to test variable operations:', error.message);
        return false;
    }
}

// Run tests
async function runTests() {
    console.log('Starting Figma API tests...\n');

    try {
        // Test 1: Basic API Connection
        console.log('Test 1: Basic API Connection');
        const connectionSuccess = await testFigmaConnection();
        
        if (connectionSuccess && process.env.FIGMA_FILE_ID) {
            // Test 2: Variable Operations
            console.log('\nTest 2: Variable Operations');
            await testVariableOperations(process.env.FIGMA_FILE_ID);
        } else {
            console.log('\nSkipping variable operations test - No file ID provided');
            console.log('Set FIGMA_FILE_ID in your .env file to test variable operations');
        }
    } catch (error: any) {
        console.error('Test execution failed:', error.message);
        process.exit(1);
    }
}

// Only run tests if this file is being run directly
if (import.meta.url.endsWith('/api.test.ts')) {
    runTests().catch((error) => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}