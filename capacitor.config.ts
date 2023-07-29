import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.izmichael.traq',
    appName: 'Traq',
    webDir: 'build',
    server: {
        androidScheme: 'https'
    }
};

export default config;
