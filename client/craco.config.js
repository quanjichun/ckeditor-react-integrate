const CKEditorWebpackPlugin = require("@ckeditor/ckeditor5-dev-webpack-plugin");
const { styles } = require("@ckeditor/ckeditor5-dev-utils");

module.exports = {
  webpack: {
    configure: (config, { env, paths }) => {
      config.plugins.push(new CKEditorWebpackPlugin({ language: "en", addMainLanguageTranslationsToAllAssets: true}));

      const regExpThemeIconSvg = /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/;
      const regExpThemeCss = /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/;
      const cssRegex = /\.css$/;
      const cssModuleRegex = /\.module\.css$/;
      config.module.rules.push(
        { test: regExpThemeIconSvg, use: ["raw-loader"] },
        {
          test: regExpThemeCss,
          use: [
            {
              loader: "style-loader",
              //   options: { injectType: "singletonStyleTag" }
            },
            {
              loader: "postcss-loader",
              options: styles.getPostCssConfig({
                themeImporter: {
                  themePath: require.resolve("@ckeditor/ckeditor5-theme-lark"),
                },
                minify: true,
              }),
            },
          ],
        }
      );

      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((subRule) => {
            if (String(subRule.test) === String(cssRegex)) {
              subRule.exclude = [
                cssModuleRegex,
                regExpThemeCss
              ];
            }

            if (String(subRule.test) === String(cssModuleRegex)) {
              subRule.exclude = [regExpThemeCss];
            }

            if (
              String(subRule.loader).includes("file-loader") &&
              Array.isArray(subRule.exclude)
            ) {
              subRule.exclude.push(regExpThemeIconSvg, regExpThemeCss);
            }
          });
        }
      });

      return config;
    },
  },
};
