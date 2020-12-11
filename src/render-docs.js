'use strict';

function ajax(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(this.responseText);
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.send();
    });
}

async function importMarkdownToElement(mdDocument, elementId) {
    if (typeof showdown !== 'undefined') {
        let converter = new showdown.Converter({ tables: true });
        let md = await ajax(mdDocument);
        if (md) {
            let html = converter.makeHtml(md);
            let element = document.getElementById(elementId);
            element.innerHTML = html;
        } else {
            let element = document.getElementById(elementId);
            element.innerHTML = "<h2>Sorry, failed to load docs.</h2>";
        }
    } else {
        console.log("Failed to load showdown. Please enable external scripts!");
    }
}

async function loadDocs() {
    await importMarkdownToElement("doc/general.md", "general-container");
    await importMarkdownToElement("doc/operations.md", "operations-container");

    // Bootstrap
    document.querySelectorAll("table").forEach((tableNode) => tableNode.classList.add("table"));
}
