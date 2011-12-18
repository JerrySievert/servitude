servitude.inject = function inject () {
    var i, domTarget;

    for (i = 0; i < servitude.css.length; i++) {
        var styleElem = document.createElement("style");

        styleElem.setAttribute("data-injected-css", servitude.css[i].index);
        styleElem.setAttribute("type", "text/css");
        styles = document.getElementsByTagName("style");
        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];
        domTarget.parentNode.appendChild(styleElem);
        if (styleElem.styleSheet) {
            styleElem.styleSheet.cssText = servitude.css[i].contents;
        } else {
            styleElem.appendChild(document.createTextNode(servitude.css[i].contents));
        }
    }

    for (i = 0; i < servitude.js.length; i++) {
        var jsElem = document.createElement("script");

        jsElem.setAttribute("data-injected-javascript", servitude.js[i].index);
        jsElem.setAttribute("type", "text/javascript");
        domTarget = document.getElementsByTagName("script")[0];
        domTarget.parentNode.appendChild(jsElem);
        jsElem.appendChild(document.createTextNode(servitude.js[i].contents));
    }
};
servitude.inject();
