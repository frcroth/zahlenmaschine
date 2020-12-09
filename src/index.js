let codeEditorNode = document.getElementById("editor")

var codeMirror = CodeMirror(codeEditorNode, {
    value: ";zminst v1\nacc 1\nacc 2\nacc 4\nacc 8\nnop ;do nothing\njmp -4",
    lineNumbers: true,
    mode: 'zminst',
    firstLineNumber: 0
});

function execute() {

    zm.enterCode(codeMirror.doc.getValue())
    zm.execute()
}

function restart() {
    zm = new Zahlenmaschine()
    updateInfo()
}

function executeStep() {
    zm.enterCode(codeMirror.doc.getValue())
    zm.executeStep()
    updateInfo()
}

function updateInfo() {
    document.getElementById("accumulator").innerHTML = "Accumulator: " + zm.accumulator;
    document.getElementById("instruction-pointer").innerHTML = "Instruction pointer: " + zm.instructionPointer;
    document.getElementById("status").innerHTML = "Status: " + zm.status;
    document.getElementById("r1").innerHTML = "Data r1: " + zm.r1;
    document.getElementById("r2").innerHTML = "Data r2: " + zm.r2;
}

function loadFile() {
    const selectedFile = document.getElementById('uploadInput').files[0];
    selectedFile.text().then((text) => codeMirror.swapDoc(CodeMirror.Doc(text, 'zminst')))
}