const VueLoaderPlugin = require("vue-loader/lib/plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");

const CONFIG = require("./config");
const { resolvePath } = require("./helper");

let config = {
    entry: {
        app: resolvePath("devPkg/main.js")
    },

    output: {
        path: resolvePath("dist"),
        publicPath: "/",
        filename: `${CONFIG.APP_FOLDER_NAME}/js/[name]-[hash].js`,
        chunkFilename: `${CONFIG.APP_FOLDER_NAME}/js/[name]-[chunkhash].js`
    },

    resolve: {
        extensions: [".vue", ".less", ".js", ".jsx", ".css"],
        alias: {
            "@": resolvePath("devPkg")
        }
    },

    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(js|vue)$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },

            {
                test: /\.worker\.js$/,
                loader: "worker-loader"
            },

            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },

            {
                test: /\.(png|jpeg|jpg|gif|ttf|woff|eot|svg|woff2)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 1024 * 8,
                            name: "[folder]/[hash].[ext]",
                            outputPath: `${CONFIG.APP_FOLDER_NAME}/assets`
                        }
                    }
                ]
            },

            {
                test: /\.vue$/,
                use: [
                    { loader: "vue-loader" }
                ]
            }
        ]
    },

    node: {
        __dirname: false
    },

    plugins: [
        new StyleLintPlugin({
            files: [
                "styles/**/*.{less, css}"
            ],
            context: resolvePath("devPkg")
        }),
        new VueLoaderPlugin()
    ]
};

module.exports = config;