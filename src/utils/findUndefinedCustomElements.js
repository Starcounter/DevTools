export default function findUndefinedElements(window) {
    const allElements = window.document.querySelectorAll('*');
    const allElementsTagNames = new Set();
    for(const el of allElements) {
        allElementsTagNames.add(el.localName);
    }
    const customElementsTagNames = Array.from(allElementsTagNames).filter(el => el.includes('-')).filter(el => el != 'just-an-arbitrary-element-to-tell-sc-debug-aid-extension-was-installed');
    return customElementsTagNames.map(el => { return {name: el, isDefined: !!window.customElements.get(el)} });
}