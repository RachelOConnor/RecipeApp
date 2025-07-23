import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'RecipeApp',
  webDir: 'www',

  plugins:
  {
    SplashScreen:
    {
      launchShowDuration: 1000,
      launchAutoMode: true,
      backgroundColor: "rgb(255, 252, 246)",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};


export default config;
