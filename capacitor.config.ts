import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Raymi',
  webDir: 'www',
  "plugins": {
    "Filesystem": {
      "androidPermissions": {
        "read": true,
        "write": true
      }
    }
  }
};

export default config;
