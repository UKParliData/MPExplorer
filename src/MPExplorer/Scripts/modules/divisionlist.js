define(['Scripts/text!modules/divisionlist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            var divs = [];
            divs.push({
                number: 1,
                date: "01.01.2001",
                name:"Bill 1",
                voting:"Yes"
            });
            divs.push({
                number: 2,
                date: "01.01.2001",
                name:"Bill 2",
                voting:"No"
            });
            divs.push({
                number: 3,
                date: "01.01.2001",
                name:"Bill 3",
                voting:"Maybe"
            });
            divs.push({
                number: 4,
                date: "01.01.2001",
                name:"Bill 4",
                voting:"No idea"
            });

            self.selectedMP = params.selectedMP;
            self.selectedVoting = params.selectedVoting;
            self.divisions = ko.observableArray(divs);

            self.showDivision = function () {
                window.masterVM.parameters({
                    selectedMP: self.selectedMP,
                    selectedDivision: this,
                    selectedVoting: params.selectedVoting()
                });
                window.masterVM.selectedComponent("division-viewer");
            }
            
        },
        template: htmlText
    }
});
