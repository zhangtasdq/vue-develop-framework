const webpack = require("webpack");
const merge = require("webpack-merge");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

const baseConfig = require("./webpack-base-config");
const { resolvePath } = require("./helper");
const CONFIG = require("./config");

let config = merge(baseConfig, {
    mode: "production",

    optimization: {
        minimizer: [
            new TerserPlugin(),
            new OptimizeCSSAssetsPlugin({})
        ],

        splitChunks: {
            cacheGroups: {
                vendorJs: {
                    name: "vendor-js",
                    chunks: "initial",
                    minChunks: 1,
                    maxSize: 1000 * 800,
                    minSize: 1000 * 300,
                    test(module) {
                        return module.type === "javascript/auto" && module.context.indexOf("node_module") !== -1;
                    }
                },

                vendorCss: {
                    name: "vendor-css",
                    chunks: "initial",
                    test(module) {
                        return module.type === "css/mini-extract" && module.context.indexOf("node_module") !== -1;
                    }
                }
            }
        }
    },

    module: {
        rules: [
            {
                test: /\.less/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: "css-loader" },
                    {
                        loader: "less-loader",
                        options: {
                            globalVars: {
                                "__DEVELOPMENT__": false
                            }
                        }
                    }
                ]
            },

            {
                test: /\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: "css-loader" }
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: `${CONFIG.APP_FOLDER_NAME}/css/[name]-[hash].css`,
            chunkFilename: `${CONFIG.APP_FOLDER_NAME}/css/[name]-[chunkhash].css`
        }),

        new CleanWebpackPlugin(["dist"], {
            root: resolvePath(".")
        })
    ]
});

config.plugins.unshift(new HtmlWebpackPlugin({
    template: resolvePath("index-template.html"),
    filename: resolvePath("dist/index.html"),
    favicon: resolvePath("devPkg/images/favicon.ico"),
    minify: {
        minifyCSS: true,
        removeComments: true,
        collapseWhitespace: true
    }
}));

config.plugins.push(new webpack.DefinePlugin({
    __DEVELOPMENT__: JSON.stringify(false),
}));

config.plugins.push(new ImageminPlugin({
    test: /\.(jpe?g|png|gif|svg)$/i
}));

module.exports = config;