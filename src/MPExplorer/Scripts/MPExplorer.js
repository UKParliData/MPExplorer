var MPExplorer;

(function () {
    (function (MPExplorer) {
        var Generic = (function () {
            function Generic() {
            };

            Generic.prototype.getData = function (endpoint, whenDone) {
                toastr.info(endpoint.substring(0, endpoint.lastIndexOf("?") == -1 ? endpoint.length : endpoint.lastIndexOf("?")));
                $.ajax({
                    url: "http://url/" + endpoint,
                    cache: false,
                    success: function () {
                    }
                }).done(whenDone);
            };

            return Generic;
        })();
        MPExplorer.Generic = Generic;
    })(MPExplorer || (MPExplorer = {}));
})();