const merge = require("webpack-merge");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const productionConfig = require("./webpack-production-config");

let config = merge(productionConfig, {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerHost: "0.0.0.0",
            analyzerPort: 3011,
        })
    ]
});

module.exports = config;
