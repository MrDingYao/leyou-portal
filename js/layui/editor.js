export default {
    template:"<div>\n" +
        "    <quill-editor v-model=\"content\"\n" +
        "                 ref=\"myTextEditor\"\n" +
        "                 :options=\"editorOption\"\n" +
        "                 @change=\"onChange\">\n" +
        "      <div id=\"toolbar\" slot=\"toolbar\">\n" +
        "        <select class=\"ql-size\">\n" +
        "          <option value=\"small\"></option>\n" +
        "          <!-- Note a missing, thus falsy value, is used to reset to default -->\n" +
        "          <option selected></option>\n" +
        "          <option value=\"large\"></option>\n" +
        "          <option value=\"huge\"></option>\n" +
        "        </select>\n" +
        "        <!-- Add subscript and superscript buttons -->\n" +
        "        <span class=\"ql-formats\"><button class=\"ql-script\" value=\"sub\"></button></span>\n" +
        "        <span class=\"ql-formats\"><button class=\"ql-script\" value=\"super\"></button></span>\n" +
        "        <span class=\"ql-formats\"><button type=\"button\" class=\"ql-bold\"></button></span>\n" +
        "        <span class=\"ql-formats\"><button type=\"button\" class=\"ql-italic\"></button></span>\n" +
        "        <span class=\"ql-formats\"><button type=\"button\" class=\"ql-blockquote\"></button></span>\n" +
        "        <span class=\"ql-formats\"><button type=\"button\" class=\"ql-list\" value=\"ordered\"></button></span>\n" +
        "        <span class=\"ql-formats\"><button type=\"button\" class=\"ql-list\" value=\"bullet\"></button></span>\n" +
        "        <span class=\"ql-formats\"><button type=\"button\" class=\"ql-link\"></button></span>\n" +
        "        <span class=\"ql-formats\">\n" +
        "        <button type=\"button\" @click=\"imgClick\" style=\"outline:none\">\n" +
        "        <svg viewBox=\"0 0 18 18\"> <rect class=\"ql-stroke\" height=\"10\" width=\"12\" x=\"3\" y=\"4\"></rect> <circle\n" +
        "          class=\"ql-fill\" cx=\"6\" cy=\"7\" r=\"1\"></circle> <polyline class=\"ql-even ql-fill\"\n" +
        "                                                                  points=\"5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12\"></polyline> </svg>\n" +
        "        </button>\n" +
        "      </span>\n" +
        "        <span class=\"ql-formats\"><button type=\"button\" class=\"ql-video\"></button></span>\n" +
        "      </div>\n" +
        "    </quill-editor>\n" +
        "  </div>",

    name:"myEditor",


    props: {
        value: {
            type: String
        },
        /*上传图片的地址*/
        uploadUrl: {
            type: String,
            default: '/'
        },
        /*上传图片的file控件name*/
        fileName: {
            type: String,
            default: 'file'
        },
        maxUploadSize:{
            type:Number,
            default: 1024 * 1024 * 500
        }
    },
    data() {
        return {
            content: '',
            editorOption: {
                modules: {
                    toolbar: '#toolbar'
                }
            },
        }
    },
    methods: {
        onChange() {
            this.$emit('input', this.content)
        },
        /*选择上传图片切换*/
        onFileChange(e) {
            var fileInput = e.target;
            if (fileInput.files.length === 0) {
                return
            }
            this.editor.focus();
            if (fileInput.files[0].size > this.maxUploadSize) {
                this.$alert('图片不能大于500KB', '图片尺寸过大', {
                    confirmButtonText: '确定',
                    type: 'warning',
                })
            }
            var data = new FormData;
            data.append(this.fileName, fileInput.files[0]);
            this.$http.post(this.uploadUrl, data)
                .then(res => {
                    if (res.data) {
                        this.editor.insertEmbed(this.editor.getSelection().index, 'image', res.data)
                    }
                })
        },
        /*点击上传图片按钮*/
        imgClick() {
            if (!this.uploadUrl) {
                console.log('no editor uploadUrl');
                return;
            }
            /*内存创建input file*/
            var input = document.createElement('input');
            input.type = 'file';
            input.name = this.fileName;
            input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
            input.onchange = this.onFileChange;
            input.click()
        }
    },
    computed: {
        editor() {
            return this.$refs.myTextEditor.quill
        }
    },
    components: {
        quilleditor: quillEditor
    },
    mounted() {
        this.content = this.value
    },
    watch: {
        'value'(newVal, oldVal) {
            if (this.editor) {
                if (newVal !== this.content) {
                    this.content = newVal
                }
            }
        },
    }

}