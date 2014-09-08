(function () {
    "use strict";

    var mpSelect = function () {
        var self = this;

        self.names = ko.observableArray();

        self.names.push({
            id: 0,
            name: "abc 1"
        });

        self.names.push({
            id: 1,
            name: "def 2"
        });

        self.names.push({
            id: 3,
            name: "ghi 1"
        });
    }

    

    ko.applyBindings(new mpSelect(), document.getElementById("body"));
    $("#mpSelect").select2({
        placeholder: "Select an MP",
        allowClear: true
    });
})();