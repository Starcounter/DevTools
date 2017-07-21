function starcounterDebugAidDomCheck(container) {
    var out = "\n";
    Array.prototype.forEach.call(container.querySelectorAll("[slot]"), function (elem) {
        if (elem.skip) return;

        var name = elem.getAttribute("slot");
        if (!elem.parentNode.shadowRoot) {
            console.error("This element's parent does not have a Shadow Root, so why setting a slot on it?", elem);
            elem.skip = true;
            return;
        }

        if (elem.assignedSlot === null) { //standards compliant browser
            out += `        <slot name="${name}"></slot>\n`;
            elem.skip = true;
        }
        else if (elem.offsetParent === null) { //other browsers guesswork
            out += `        <slot name="${name}"></slot>\n`;
            elem.skip = true;
        }
    });

    if (out.length > 2) {
        console.warn("Some elements cannot be matched to a slot element. Consider adding the following elements in declarative-shadow-dom", out);
    }
}