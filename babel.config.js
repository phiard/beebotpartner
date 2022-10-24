module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-paper/babel',
      [
        "module-resolver",
        {
          root:["./"],
          alias: {
            "@config": "./beebot.config.js",
            "@languages": "./i18n/supportedLanguages.js",
            "@src": "./src",
            "src": "./src",
            "screens": "./src/navigation/screens",
            "@component": "./src/components",
            "@nav": "./src/navigation",
            "@asset": "./src/assets",
            "@lib": "./src/lib",
            "@style": "./src/style",
          }
        }
      ]
    ]
  };
};
