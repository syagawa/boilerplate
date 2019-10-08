const WebpackAutoInject = require("webpack-auto-inject-version");
const path = require("path");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");


let ENV = process.env.NODE_ENV;
const MODE = process.env.APP_MODE;
if(ENV !== "production"){
  ENV = "development";
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
    ]
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
    plugins: [
      new OptimizeCSSAssetsPlugin({
          cssProcessor: require("cssnano")
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
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