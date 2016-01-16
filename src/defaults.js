'use strict';

var $ = require('jquery');
module.exports = {
    persistencyPrefix: function(wdqsgui) {
        return "wdqsgui_" + $(wdqsgui.wrapperElement).closest('[id]').attr('id') + "_";
    },
    allowEditorResize: true,
    api: {
        corsProxy: null,
        collections: null
    },
    tracker: {
        googleAnalyticsId: null,
        askConsent: true,
    },

    catalogueEndpoints: [{"endpoint":"http://wdm-rdf.wmflabs.org/bigdata/sparql","title":"WDQS Test"},{"endpoint":"https://query.wikidata.org/sparql","title":"WDQS Production"}]
};