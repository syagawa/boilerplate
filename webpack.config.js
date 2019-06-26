const WebpackAutoInject = require("webpack-auto-inject-version");
const path = require("path");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");


let ENV = process.env.NODE_ENV;
const MODE = process.env.APP_MODE;
let settings_override_file_name = "js/settings/settings.empty.js";
if(ENV !== "production"){
  ENV = "development";
  settings_override_file_name = "js/settings/settings.dev.js";
}
if(MODE === "test"){
  settings_override_file_name = "js/settings/settings.test.js";
}

module.exports = {
  "js": {
    mode: ENV,
    entry: {
      "bundle": "./src/js/main.js"
    },
    output: {
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /execute\.js$/,
          use: 'raw-loader'
        }
      ]
    },
    plugins: [
      new WebpackAutoInject({
        PACKAGE_JSON_PATH: 'package.json',
        components: {
          InjectAsComment: true
        },
        componentsOptions: {
          InjectAsComment: {
            tag: 'Build Version {version} - {date}'
          }
        }
      })
    ],
    resolve: {
      alias: {
        vue: 'vue/dist/vue.js',
        settings_override$: path.resolve(__dirname, settings_override_file_name)
      }
    }
  }
  ,
  "css": {
    mode: ENV,
    entry: {
      "bundle": [
        "./src/styles/main.scss"
      ]
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            'sass-loader',
          ],
        }
      ]
    },
    // optimization: {
    //   minimizer: [
    //     new OptimizeCSSAssetsPlugin({
    //       cssProcessor: require("cssnano")
    //     })
    //   ]
    // },
    plugins: [
      new OptimizeCSSAssetsPlugin({
          cssProcessor: require("cssnano")
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        // filename: devMode ? '[name].css' : '[name].[hash].css',
        // chunkFilename: MODE ? '[id].css' : '[id].[hash].css',
        filename: '[name].css'
      }),

      // new ExtractTextPlugin("[name].css"),
      new WebpackAutoInject({
        PACKAGE_JSON_PATH: 'package.json',
        components: {
          InjectAsComment: true
        },
        componentsOptions: {
          InjectAsComment: {
            tag: 'Build Version {version}'
          }
        }
      }),
      new FixStyleOnlyEntriesPlugin()
    ]
  }

};

if (ENV !== 'production') {
    module.exports.js.devtool = 'inline-source-map';
}
