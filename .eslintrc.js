module.exports = {
    extends: [
        "plugin:vue/essential"
    ],
    env: {
        "node": true
    },
    parserOptions: {
        parser: "babel-eslint",
    },
    rules: {
        "extends": "eslint:recommended",
        "eqeqeq": ["off", "always"],
        "keyword-spacing": ["off", {"before": true, "after": true}],
        "key-spacing": ["off", {"beforeColon": false, "afterColon": true, "mode": "strict"}],
        "max-statements": ["off", 50],
        "space-before-function-paren": ["off", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],
        "indent": ["warn", 4, { "SwitchCase": 1} ],
        "camelcase": "off",
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-fallthrough": "off",
        "no-extend-native": "off",
        "dot-notation": "off",
        "default-case": "error"
    }
};
