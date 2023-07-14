export const verifyToken = (coreApiKey: string, apiKey: string) => {
    return coreApiKey.toLocaleLowerCase() === apiKey.toLocaleLowerCase();
}