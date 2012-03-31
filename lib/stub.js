var servitude = servitude || {
    "errors": [ ],
    "injectCSS": function (data) {
        var styleElem = document.createElement("style");

        styleElem.setAttribute("data-injected-css", data.filename);
        styleElem.setAttribute("type", "text/css");
        styles = document.getElementsByTagName("style");
        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];
        domTarget.parentNode.appendChild(styleElem);
        if (styleElem.styleSheet) {
            styleElem.styleSheet.cssText = data.data;
        } else {
            styleElem.appendChild(document.createTextNode(data.data));
        }
    },
    "injectJS": function (data) {
        var jsElem = document.createElement("script");

        jsElem.setAttribute("data-injected-javascript", data.filename);
        jsElem.setAttribute("type", "text/javascript");
        domTarget = document.getElementsByTagName("script")[0];
        domTarget.parentNode.appendChild(jsElem);
        jsElem.text = data.data;
    }
};
