var MPExplorer;

(function () {
    (function (MPExplorer) {
        var Generic = (function () {
            function Generic() {
            };
            
            Generic.prototype.getData = function (endpoint, parameters, whenDone) {
                toastr.info(endpoint);
                $.ajax({
                    url: "http://lda.data.parliament.uk/" + endpoint,
                    data: parameters,
                    dataType: "jsonp",
                    //cache: false,
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
                this.name = name._value || name;
                this.party = party._value || party;
                this.gender = gender._value || gender || "";
                this.constituency = (constituency || {})._value || constituency;
                this.westminster = (gssCode || {})._value || gssCode;
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