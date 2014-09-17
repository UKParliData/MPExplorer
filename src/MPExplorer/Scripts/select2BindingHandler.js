ko.bindingHandlers.select2 = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor();
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).select2('destroy');
        });
        $(element).select2(allBindings.select2);
    },
    update: function (element) {
        $(element).trigger('change');
    }
};
