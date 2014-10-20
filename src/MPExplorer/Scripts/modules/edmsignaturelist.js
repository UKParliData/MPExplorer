var edmSignature = function (dateSigned, memberPrinted, order) {
    this.dateSigned = dateSigned;
    this.name = memberPrinted;
    this.order = order * 1;
}


define(['Scripts/text!modules/edmsignaturelist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;
            
            self.edm = params.selectedItem;
            self.edms=ko.observableArray([]);
            self.isLoading=ko.observable(true);

            self.retriveSignatures = function (data) {
                var arr = [];

                if ((data != null) && (data.result != null) && (data.result.primaryTopic != null) && (data.result.primaryTopic.signature != null) && (data.result.primaryTopic.signature.length > 0)) {
                    var signatures = data.result.primaryTopic.signature;
                    for (var i = 0; i < signatures.length; i++)
                        arr.push(new edmSignature(signatures[i].dateSigned._value, signatures[i].memberPrinted, signatures[i].order));
                }
                arr.sort(function (left, right) {
                    return left.order === right.order ? left.order - right.order : left.order > right.order ? 1 : -1;
                });
                self.edms(arr);
                self.isLoading(false);
            };

            MPExplorer.getData("resources/"+self.edm.id+".json?_view=basic&_properties=signature.memberPrinted,signature.order,signature.dateSigned", self.retriveSignatures);

        },
        template: htmlText
    }
});
