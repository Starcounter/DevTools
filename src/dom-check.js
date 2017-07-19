function starcounterDebugAidDomCheck(container) {
    var out = "\n";
    container.querySelectorAll("[slot]").forEach((elem) => {
        if (elem.skip) return;

        var name = elem.getAttribute("slot");
        if (!elem.parentNode.shadowRoot) {
            console.error("This element's parent does not have a Shadow Root, so why setting a slot on it?", elem);
            elem.skip = true;
            return;
        }

        var matching = elem.parentNode.shadowRoot.querySelector(`slot[name='${name}']`);
        if (!matching) {
            out += `        <slot name="${name}"></slot>\n`;
            elem.skip = true;
        }
    });

    if (out.length > 2) {
        console.warn("Seems that you forgot the following slot elements in your declarative-shadow-dom", out);
    }
}