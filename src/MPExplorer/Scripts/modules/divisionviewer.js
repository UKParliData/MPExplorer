define(['Scripts/knockout-3.2.0.debug', 'Scripts/text!modules/divisionviewer.html'], function (ko, htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedMP = params.selectedMP;
            self.selectedDivision = params.selectedMP;
            self.divisionName = params.selectedDivision.name;
            self.divisionExtract = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio turpis, ultricies nec cursus vitae, ultricies eget nisl. Integer faucibus accumsan lobortis. Duis accumsan ante nibh, a feugiat urna porttitor vel. Donec elit tortor, scelerisque vel ipsum non, venenatis sagittis risus. Cras auctor nibh quis ligula sollicitudin, ac euismod ligula malesuada. Praesent eu leo convallis, rhoncus ex non, molestie dolor. Ut feugiat mi non tempor dignissim. In vitae tortor at purus pulvinar porta non id lorem. Proin purus erat, fringilla a risus placerat, laoreet dapibus risus. Vestibulum bibendum quis nisi id lacinia. Etiam faucibus lorem in eros sodales mattis eu nec risus.";

        },
        template: htmlText
    }
});