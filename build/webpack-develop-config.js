const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const CONFIG = require("./config");
const baseConfig = require("./webpack-base-config");
const { resolvePath, loadPersonalConfig } = require("./helper");

let personalConfig = loadPersonalConfig(CONFIG.PERSONAL_FILE_NAME),
    openBrowser = true; //打开默认浏览器

if (personalConfig && personalConfig.dev) {
    let devConfig = personalConfig.dev;

    if (devConfig.openBrowser) {
        openBrowser = devConfig.openBrowser;
    }
}


let config = merge(baseConfig, {
    devtool: "cheap-module-eval-source-map",
    mode: "development",

    output: {
        globalObject: "this"
    },

    module: {
        rules: [
            {
                test: /\.less/,
                use: [
                    { loader: "vue-style-loader" },
                    { loader: "css-loader" },
                    {
                        loader: "less-loader",
                        options: {
                            globalVars: {
                                "__DEVELOPMENT__": true
                            }
                        }
                    }
                ]
            },

            {
                test: /\.css$/,
                use: [
                    { loader: "vue-style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    },

    devServer: {
        host: "0.0.0.0",
        hot: true,
        inline: true,
        open: openBrowser,
        useLocalIp: true,
        port: 3010,
        contentBase: resolvePath("devPkg/lib"),
        proxy: {
        }
    }
});

config.plugins.unshift(new HtmlWebpackPlugin({
    template: resolvePath("index-template.html"),
    filename: resolvePath("dist/index.html"),
    favicon: resolvePath("devPkg/images/favicon.ico"),
}));
config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
config.plugins.push(new webpack.DefinePlugin({
    __DEVELOPMENT__: JSON.stringify(true),
}));

module.exports = config;
