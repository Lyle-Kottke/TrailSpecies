declare global {  
    namespace NodeJS {
        interface ProcessEnv {
            SUPABASE_KEY: string;
        }
    }
}

export {};