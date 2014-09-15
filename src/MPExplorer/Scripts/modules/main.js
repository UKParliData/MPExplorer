require.config({
    baseUrl: "/",
    urlArgs: "bust=" + (new Date()).getTime()
});

define(['Scripts/modules/master'], function (master) {
    ko.components.register('mp-selector', { require: 'Scripts/modules/mpselector.js' });
    ko.components.register('mp-viewer', { require: 'Scripts/modules/mpviewer.js' });
    ko.components.register('generic-header', { require: 'Scripts/modules/genericheader.js' });
    ko.components.register('chart-viewer', { require: 'Scripts/modules/chartviewer.js' });
    ko.components.register('mp-voter', { require: 'Scripts/modules/mpvoter.js' });
    ko.components.register('division-list', { require: 'Scripts/modules/divisionlist.js' });
    ko.components.register('division-viewer', { require: 'Scripts/modules/divisionviewer.js' });

    window.masterVM = new master();
    ko.applyBindings(masterVM);
});
