export const env = {
    ENV: process.env.NEXT_APP_ENV as 'production' | 'staging' | 'development',
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT as string,
}