CodeMirror.defineMode('zminst', function (config) {

    keywords = ["jmp", "acc", "nop", "jre", "end", "rst", "jtr", "grt", "geq", "equ", "leq", "les", "neq", "add", "mul", "sub", "neg", "mov", "swp", "out", "inp", "mod"]

    storage = ["acc", "isp", "sta", "nul", "r1", "r2"]

    return {
        startState: function () {
            return { comment: false }
        },
        token: function (stream, state) {
            word = ""
            while ((next = stream.next()) != null) {
                if (next == ";") {
                    state.comment = true
                }
                if (next == " " && !state.comment) {
                    break;
                }
                if (stream.eol()) {
                    word += next;
                    break;
                }
                word += next;

            }
            if (state.comment) {
                state.comment = false
                return "comment"
            }
            if (keywords.includes(word) && !state.comment) {
                return "keyword"
            }
        },
        lineComment: ';'
    }
})
