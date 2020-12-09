let codeEditorNode = document.getElementById("editor")

var codeMirror = CodeMirror(codeEditorNode, {
    value: ";zminst v1\nacc 1\nacc 2\nacc 4\nacc 8\nnop ;do nothing\njmp 1",
    lineNumbers: true,
    mode: 'zminst',
    firstLineNumber: 0
});

let stopped = false;

async function execute() {
    stopped = false;
    zm.enterCode(codeMirror.doc.getValue());
    let executeButton = document.getElementById("execute-button")
    executeButton.setAttribute("onclick", "stop()");
    executeButton.innerHTML = "<i class=\"fa fa-pause\"></i>";
    executeButton.setAttribute("title", "Stop execution");
    while (zm.running && !stopped){
        zm.executeStep();
        updateInfo()
        await new Promise(resolve => setTimeout(resolve, 700));
    }    
}

function stop() {
    let executeButton = document.getElementById("execute-button")
    executeButton.setAttribute("onclick", "execute()");
    executeButton.setAttribute("title", "Execute program");
    executeButton.innerHTML = "<i class=\"fa fa-play\"></i>";
    stopped = true;
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
    document.getElementById("accumulator-value").innerHTML = zm.accumulator;
    document.getElementById("instruction-pointer-value").innerHTML = zm.instructionPointer;
    document.getElementById("status-value").innerHTML = zm.status;
    document.getElementById("r1-value").innerHTML = zm.r1;
    document.getElementById("r2-value").innerHTML = zm.r2;
}

function loadFile() {
    const selectedFile = document.getElementById('uploadInput').files[0];
    selectedFile.text().then((text) => codeMirror.swapDoc(CodeMirror.Doc(text, 'zminst')))
}