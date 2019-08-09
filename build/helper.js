const path = require("path");
const fs = require("fs");

const STR_REPLACE_REG = /#\{\s*(\w+)\s*\}/g;

function resolvePath(target) {
    return path.resolve(__dirname, "..", target);
}

function compile(str, data) {
    return str.replace(STR_REPLACE_REG, function(match, key) {
        return data[key];
    });
}

function loadPersonalConfig(fileName) {
    let filePath = path.resolve(__dirname, fileName),
        isExist = fs.existsSync(filePath);

    if (isExist) {
        let data = fs.readFileSync(filePath, "utf-8");
        if (data) {
            return JSON.parse(data);
        }
    }
    return null;
}

module.exports.resolvePath = resolvePath;
module.exports.compile = compile;
module.exports.loadPersonalConfig = loadPersonalConfig;
