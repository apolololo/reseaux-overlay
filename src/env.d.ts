
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BREVO_API_KEY: string;
  readonly VITE_BREVO_LIST_ID: string;
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
