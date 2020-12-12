import ZahlenmaschineBox from "./build.js";

function build(node) {
    document.box1 = new ZahlenmaschineBox();
    node.appendChild(document.box1.build());
    document.box1.codeMirror.refresh();
}

build(document.getElementById("zm-container"));
