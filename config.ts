// This file is used to provide the NASA API Key to the application.
// The key is sourced from the `process.env.API_KEY` environment variable.

// This declaration informs TypeScript that `process` exists in the global scope.
declare const process: {
    env: {
        API_KEY: string;
    }
};

export const NASA_API_KEY = process.env.API_KEY;
