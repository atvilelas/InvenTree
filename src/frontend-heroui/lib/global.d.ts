interface InventreeSettings {
  server_list: Record<string, { host: string; name: string }>;
  default_server: string;
  show_server_selector: boolean;
  base_url?: string;
  api_host?: string;
  sentry_dsn?: string;
  environment?: string;
}

interface Window {
  INVENTREE_SETTINGS: InventreeSettings;
}
