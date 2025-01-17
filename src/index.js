import ZahlenmaschineBox from "./build.js";

let boxNumber = 0;
document.boxes = [];
async function build(node) {
    document["box " + boxNumber] = new ZahlenmaschineBox(boxNumber);
    node.appendChild(await document["box " + boxNumber].build());
    document.boxes.push(document["box " + boxNumber]);
    document["box " + boxNumber].codeMirror.refresh();
}

function buildAnother() {
    boxNumber++;
    build(document.getElementById("zm-container"));
}

build(document.getElementById("zm-container"));
document.getElementById("buildAnotherButton").onclick = buildAnother;
