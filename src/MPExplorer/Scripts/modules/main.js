require.config({
    baseUrl: "/",
    urlArgs: "bust=v2"
});

define(['Scripts/modules/conductor'], function (conductor) {
    ko.components.register('mp-selector', { require: 'Scripts/modules/mpselector.js' });
    ko.components.register('mp-viewer', { require: 'Scripts/modules/mpviewer.js' });
    ko.components.register('chart-viewer', { require: 'Scripts/modules/chartviewer.js' });
    ko.components.register('mp-voter', { require: 'Scripts/modules/mpvoter.js' });
    ko.components.register('division-list', { require: 'Scripts/modules/divisionlist.js' });
    ko.components.register('division-viewer', { require: 'Scripts/modules/divisionviewer.js' });
    ko.components.register('question-list', { require: 'Scripts/modules/questionlist.js' });
    ko.components.register('question-viewer', { require: 'Scripts/modules/questionviewer.js' });
    ko.components.register('full-question-list', { require: 'Scripts/modules/fullquestionlist.js' });
    ko.components.register('edm-list', { require: 'Scripts/modules/edmlist.js' });
    ko.components.register('edm-signature-list', { require: 'Scripts/modules/edmsignaturelist.js' });
    ko.components.register('busy-indicator', { template: { require: 'Scripts/text!modules/busyindicator.html' } });    

    $.support.cors = true;
    window.MPExplorer = new MPExplorer.Generic();
    window.conductorVM = new conductor();
    ko.applyBindings(window.conductorVM);
    toastr.options.positionClass = "toast-bottom-right";
});
    