let codeEditorNode = document.getElementById("editor")

var codeMirror = CodeMirror(codeEditorNode, {
    value: "acc 1\nacc 2\nacc 4\nacc 8\nnop\njmp -4",
    lineNumbers: true,
    mode: 'zminst',
    firstLineNumber: 0
  });

function execute(){
    
    zm.enterCode(codeMirror.doc.getValue())
    zm.execute()
}

function restart(){
    zm = new Zahlenmaschine()
    updateInfo()
}

function executeStep(){
    zm.enterCode(codeMirror.doc.getValue())
    zm.executeStep()
    updateInfo()
}

function updateInfo() {
    document.getElementById("accumulator").innerHTML = "Accumulator: " + zm.accumulator;
    document.getElementById("instruction-pointer").innerHTML = "Instruction pointer: " + zm.instructionPointer;
}