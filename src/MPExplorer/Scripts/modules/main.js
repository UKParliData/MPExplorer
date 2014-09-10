require.config({
    baseUrl: "/",
    urlArgs: "bust=" + (new Date()).getTime()
});

define(['Scripts/knockout-3.2.0.debug', 'Scripts/modules/master'], function (ko, master) {
    ko.components.register('mp-selector', { require: 'Scripts/modules/mpselector.js' });
    ko.components.register('mp-viewer', { require: 'Scripts/modules/mpviewer.js' });
    ko.components.register('mp-voter', { require: 'Scripts/modules/mpvoter.js' });
    ko.components.register('division-list', { require: 'Scripts/modules/divisionlist.js' });
    ko.components.register('division-viewer', { require: 'Scripts/modules/divisionviewer.js' });

    window.masterVM = new master();
    ko.applyBindings(masterVM);
});
