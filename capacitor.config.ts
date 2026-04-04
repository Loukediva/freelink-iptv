import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.freelink.iptv',
  appName: 'Freelink',
  webDir: 'www',
  server: {
    // On repasse en http pour éviter les blocages de flux mixtes
    androidScheme: 'http', 
    cleartext: true,
    allowNavigation: ['*']
  },

  android: {
    allowMixedContent: true,
    buildOptions: {
      releaseType: 'APK'
    }
  },

  plugins: {
    // Ce plugin est CRUCIAL pour l'IPTV car il contourne le CORS du navigateur
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;