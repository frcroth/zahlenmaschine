CodeMirror.defineMode('zminst', function (config) {

    keywords = ["jmp", "acc", "nop", "jab", "end", "rst", "jtr", "grt"]

    storage = ["acc", "isp", "sta"]

    return {
        token: function (stream, state) {
            word = ""
            while ((next = stream.next()) != null) {
                if (next == " ") {
                    break;
                }
                word += next;

            }
            if (keywords.includes(word)) {
                return "keyword"
            }
        },
        lineComment: ';'
    }
})
