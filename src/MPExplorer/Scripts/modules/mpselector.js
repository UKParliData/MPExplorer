var mp = function (id, name) {
    this.id = id;
    this.name = name;
    this.text = name;
}

define(['Scripts/text!modules/mpselector.html', 'Scripts/select2', 'Scripts/modules/select2BindingHandler'], function (htmlText) {
    return {
        viewModel: function () {
            var self = this;

            var mps = [];            
            mps.push(new mp(1,"abc 1"));
            mps.push(new mp(2, "abc 2"));
            mps.push(new mp(3, "def 3"));
            mps.push(new mp(4, "ghi 4"));

            self.names = mps;
            self.selectedMPId = ko.observable(null);

            self.selectedMP=ko.pureComputed(function () {
                return ko.utils.arrayFirst(self.names, function (item) {
                    return item.id == self.selectedMPId() * 1;
                });
            });

            self.formatLabel = function (mp) {
                return mp.name;
            };

            self.showMP = function () {
                window.masterVM.parameters({ selectedMP: self.selectedMP() });
                window.masterVM.selectedComponent("mp-voter");
            };
        },
        template: htmlText
    }
});
