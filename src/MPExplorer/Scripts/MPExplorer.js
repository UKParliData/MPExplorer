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

            Generic.prototype.MP = function (urlId, name, party) {
                var splitUrl = urlId.split("/");
                var idIndex = splitUrl.length - 1;
                if (splitUrl[idIndex] === "")
                    idIndex = splitUrl.length - 2;
                this.url = urlId;
                this.id = urlId.split("/")[idIndex];
                this.name = name;
                this.party = party;
            }

            Generic.prototype.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            return Generic;
        })();
        MPExplorer.Generic = Generic;
    })(MPExplorer || (MPExplorer = {}));
})();