function floatAdd(arg1, arg2) {
    var arg1Arr = ("" + arg1).split("."),
        arg2Arr = ("" + arg2).split("."),
        decimalLength = Math.max(arg1Arr[1] ? arg1Arr[1].length : 0, arg2Arr[1] ? arg2Arr[1].length : 0),
        multiple = Math.pow(10, decimalLength);

    if (decimalLength === 0) {
        return arg1 + arg2;
    }

    return (mul(arg1, multiple) + mul(arg2, multiple)) / multiple;

    function mul(a, b) {
        let c = 0,
            d = a.toString();

        try {
            c += d.split(".")[1].length;
        } catch (f) {
        }

        return Number(d.replace(".", "") * b) / Math.pow(10, c);
    }
}

var EMPTY_VALUE = ["", null, undefined];
function isEmpty(value) {
    return EMPTY_VALUE.indexOf(value) !== -1;
}

var TableWorker = {
    handleMsg: function(data) {
        var msg = data.data,
            action = msg.action,
            data = null,
            result = { uid: msg.uid };

        switch (action) {
            case "calculateSummary":
                data = this.calculateSummary(msg.data);
                break;
            default:
                break;
        }

        result.data = data;
        self.postMessage(result);
    },

    calculateSummary: function(data) {
        var columns = data.columns,
            column = null,
            total = 0,
            value = "",
            rows = data.data,
            summary = [];

        for (var i = 0, j = columns.length; i < j; ++i) {
            column = columns[i];

            if (column.summary) {
                total = 0;
                for (var k = 0, p = rows.length; k < p; ++k) {
                    value = rows[k][column.field];

                    if (!isEmpty(value)) {
                        total = floatAdd(total, value);
                    }
                }

                summary.push({ field: column.field, value: total, summary: true });
            } else {
                summary.push({ field: column.field, value: ""});
            }
        }

        return summary;
    }
};


self.addEventListener("message", function (msg) {
    TableWorker.handleMsg(msg);
});