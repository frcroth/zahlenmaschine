import ZahlenmaschineBox from "./build.js";

let boxNumber = 0;
function build(node) {
    document["box " + boxNumber] = new ZahlenmaschineBox();
    node.appendChild(document["box " + boxNumber].build());
    document["box " + boxNumber].codeMirror.refresh();
}

function buildAnother() {
    boxNumber++;
    build(document.getElementById("zm-container"));
}

build(document.getElementById("zm-container"));
document.getElementById("buildAnotherButton").onclick = buildAnother;
