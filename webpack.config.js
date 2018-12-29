const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackAutoInject = require("webpack-auto-inject-version");
const path = require("path");

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
    output: {
      filename: "[name].css"
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader?-url&minimize!sass-loader"
          })
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader?-url&minimize"
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin("[name].css"),
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
      })
    ]
  }

};