let terms = {};

async function loadData() {
    let termsLocation = './terms.json';
    if (navigator.userAgent.toLocaleLowerCase().indexOf('firefox') > 0) {
        const isProd = browser.runtime.id === "{2164fef6-64f4-4a8b-9a6d-9dd9c500dd88}";
        if (isProd) {
            termsLocation = 'https://raw.githubusercontent.com/code4romania/emergency-news-addon/master/src/terms.json';
        }
    }
    const httpData = await fetch(termsLocation);
    terms = await httpData.json();
    setTimeout(loadData, 1000 * 60 * 60);
}

browser.runtime.onMessage.addListener((request, sender) => {
    return Promise.resolve({ terms });
});

loadData();

if (!!chrome.contextMenus) {

    chrome.contextMenus.create({
        id: "highlight-terms",
        title: "Evidențiează surse oficiale",
        contexts: ["all"]
    }, () => {});

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        if (info.menuItemId == "highlight-terms") {
            const styles = [
                "dependencies/light.css",
                "emergency_news.css",
            ];
            styles.forEach((stylesName) => {
                chrome.tabs.insertCSS(tab.id, {
                    file: stylesName,
                }, () => {});
            })
            const scripts = [
                "dependencies/browser-polyfill.js",
                "dependencies/popper.js",
                "dependencies/tippy-bundle.umd.js",
                "emergency_news.js"
            ];
            scripts.forEach((scriptName) => {
                chrome.tabs.executeScript(tab.id, {
                    file: scriptName,
                }, () => {});
            })
        }
    });
}