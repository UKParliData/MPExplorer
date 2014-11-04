var MPExplorer;

(function () {
    (function (MPExplorer) {
        var Generic = (function () {
            function Generic() {
            };
            
            Generic.prototype.getData = function (endpoint, whenDone) {
                toastr.info(endpoint.substring(0, endpoint.lastIndexOf("?") == -1 ? endpoint.length : endpoint.lastIndexOf("?")));
                $.ajax({
                    url: "http://lda.data.parliament.uk/" + endpoint,
                    cache: false,
                    success: function () {
                    },
                    error: function () {
                    }
                }).done(whenDone);
            };

            Generic.prototype.MP = function (urlId, name, party, gender, constituency, gssCode) {
                if (urlId!=null){
                    var splitUrl = urlId.split("/");
                    var idIndex = splitUrl.length - 1;
                    if (splitUrl[idIndex] === "")
                        idIndex = splitUrl.length - 2;

                    this.url = urlId;
                    this.id = urlId.split("/")[idIndex];
                }
                else{
                    this.url=null;
                    this.id=null;
                }
                this.name = name;
                this.party = party;
                this.gender = gender || "";
                this.constituency = constituency;
                this.westminster = gssCode;
            }

            Generic.prototype.ChartItem = function (index, values, categoryValue, sortValue) {
                this.index = index;
                this.values = values;
                this.categoryValue = categoryValue;
                this.sortValue = sortValue;
            }

            Generic.prototype.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            Generic.prototype.colours = ["#008FFA", "#FF9E2D", "#80B8B2"];
            return Generic;
        })();
        MPExplorer.Generic = Generic;
    })(MPExplorer || (MPExplorer = {}));
})();