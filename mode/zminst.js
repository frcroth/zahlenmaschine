CodeMirror.defineMode('zminst', function (config) {

    keywords = ["jmp", "acc", "nop", "jre", "end", "rst", "jtr", "grt", "geq", "equ", "leq", "les", "neq", "add", "mul", "sub", "neg", "mov", "swp", "out", "inp", "mod", "rnr", "pus", "pop", "top"]

    storage = ["acc", "isp", "sta", "nul", "r1", "r2", "rnd", "sct"]

    return {
        startState: function () {
            return { comment: false }
        },
        token: function (stream, state) {
            word = ""
            while ((next = stream.next()) != null) {
                if (next == ";") {
                    state.comment_start = true;
                    break;
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
                state.comment = false;
                return "comment";
            }
            if (state.comment_start) {
                state.comment_start = false;
                state.comment = true;
                if (keywords.includes(word.replace(';',''))) {
                    return "keyword";
                }
            }
            if (word[word.length-1] == ':' && !state.comment) {
                // Labels
                return "string"
            }
            if (keywords.includes(word) && !state.comment) {
                return "keyword"
            }
            
            if (storage.includes(word) && !state.comment) {
                return "builtin"
            }
        },
        lineComment: ';'
    }
})
