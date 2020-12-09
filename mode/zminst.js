CodeMirror.defineMode('zminst', function (config) {

    keywords = ["jmp", "acc", "nop", "jab", "end", "rst", "jtr", "grt", "geq", "equ", "leq", "les"]

    storage = ["acc", "isp", "sta"]

    return {
        startState: function () {
            return {comment: false}
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
