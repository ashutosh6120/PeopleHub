const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // remove MiniCssExtractPlugin so styles are inlined into main.js
  // this is needed bcz single-spa only loads main.js not styles.scss
  singleSpaWebpackConfig.plugins = singleSpaWebpackConfig.plugins.filter(
    (plugin) => plugin.constructor.name !== 'MiniCssExtractPlugin'
  );

  // replace MiniCssExtractPlugin.loader with style-loader to inject CSS at runtime
  singleSpaWebpackConfig.module.rules.forEach((rule) => {
    if(rule.rules) {
      rule.rules.forEach((r) => {
        if(r.use) {
          r.use = r.use.map((u) => {
            const loader = typeof u === 'string' ? u : u.loader;
            if(loader && loader.includes('mini-css-extract-plugin')) {
              return { loader: 'style-loader' };
            }
            return u;
          });
        }
      });
    }
  });

  // Feel free to modify this webpack config however you'd like to
  return singleSpaWebpackConfig;
};
