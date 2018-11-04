export default {
    name:'homeSettingInfo',
    template:"\
        <div>\
            <el-card>\
                <el-tabs type=\"border-card\" class=\"box-card\">\
                    <el-tab-pane label=\"基本资料\">\
                        <el-form ref=\"form\" :model=\"form\" label-width=\"80px\">\
                            <el-form-item label=\"昵称\">\
                                <el-input v-model=\"form.nickname\"></el-input>\
                            </el-form-item>\
                            <el-form-item label=\"性别\">\
                                <el-radio-group v-model=\"form.gender\">\
                                    <el-radio label=\"男\"></el-radio>\
                                    <el-radio label=\"女\"></el-radio>\
                                </el-radio-group>\
                            </el-form-item>\
                            <el-form-item label=\"生日\">\
                                <el-date-picker v-model=\"form.birthday\" type=\"date\" placeholder=\"选择日期\">\
                                </el-date-picker>\
                            </el-form-item>\
                            <el-form-item label=\"所在地\" prop=\"address\">\
                                <el-col :span=\"7\">\
                                <el-select v-model=\"form.province\" placeholder=\"请选择省份\" @change=\"selectP\">\
                                    <el-option v-for=\"item in area.provinces\" :key=\"item.id\" :label=\"item.name\" :value=\"item.name\">\
                                    </el-option>\
                                </el-select>\
                                </el-col>\
                                <el-col class=\"line\" :span=\"1\">&nbsp;</el-col>\
                                <el-col :span=\"7\">\
                                    <el-select v-model=\"form.city\" placeholder=\"请选择市\" @change=\"selectC\">\
                                        <el-option v-for=\"item in area.cities\" :key=\"item.id\" :label=\"item.name\" :value=\"item.name\">\
                                        </el-option>\
                                    </el-select>\
                                </el-col>\
                                <el-col class=\"line\" :span=\"1\">&nbsp;</el-col>\
                                <el-col :span=\"7\">\
                                    <el-select v-model=\"form.downtown\" placeholder=\"请选择县\">\
                                        <el-option v-for=\"item in area.downtowns\" :key=\"item.id\" :label=\"item.name\" :value=\"item.name\">\
                                        </el-option>\
                                    </el-select>\
                                </el-col>\
                            </el-form-item>\
                            <el-form-item label=\"职业\">\
                                <el-select v-model=\"form.job\">\
                                    <el-option v-for=\"job in allJob\" :value=\"job\"></el-option>\
                                </el-select>\
                            </el-form-item>\
                            <el-form-item>\
                                <el-button type=\"primary\" @click=\"handleSubmit\">保存设置</el-button>\
                            </el-form-item>\
                        </el-form>\
                    </el-tab-pane>\
                    <el-tab-pane label=\"上传头像\">\
                        <el-upload class=\"avatar-uploader\" \
                                   action=\"http://api.leyou.com/api/upload/image\" \
                                   ref=\"singleUpload\" \
                                   :show-file-list=\"false\" \
                                   :on-success=\"handleAvatarSuccess\" \
                                   :before-upload=\"beforeAvatarUpload\">\
                            <img v-if=\"form.image\" :src=\"form.image\" class=\"avatar\">\
                            <i v-else class=\"el-icon-plus avatar-uploader-icon\"></i>\
                        </el-upload>\
                    </el-tab-pane>\
                </el-tabs>\
            </el-card>\
        </div>\
    ",

    data(){
        return{
            form:{
                nickname: '',
                gender: '',
                birthday:'',
                job:'',
                province:'',
                city:'',
                downtown:'',
                image:''
            },

            allAreas: [],                   // 所有的省市区
            area: {
                provinces: [],               // 省信息数组
                cities: [],                  // 市信息数组
                downtowns: []                // 县信息数组
            },

            allJob:[
                '程序员',
                '男优',
                '女优',
                '按摩师',
                '理发师'
            ]
        }
    },

    created(){
        // 查询省市区信息
        ly.http.get("user/address/area").then(({data}) => {
            this.allAreas = data;
            this.area.provinces = data.filter(c => c.pid === 0)
        });
        this.getUserInfo();
    },

    methods: {
        // 获取用户的个人信息
        getUserInfo(){
            ly.http.get("user/userInfo").then(({data}) => {
                this.form = data || {
                    nickname: '',
                    gender: '',
                    birthday:'',
                    job:'',
                    province:'',
                    city:'',
                    downtown:'',
                    image:''
                };

            });

        },

        handleAvatarSuccess(res, file) {
            this.form.image = res;
            ly.http.post("user/info",this.form).then(() => {
                this.$message.success("头像保存成功");
            }).catch(() => {
                this.$message.error("服务器异常");
            })
        },

        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },

        handleSubmit(){
            console.log(this.form);
            ly.http.post("user/info",this.form).then(() => {
                this.$message.success("保存成功");
            }).catch(() => {
                this.$message.error("服务器异常");
            })
        },

        // 选择省份的change事件
        selectP() {
            this.area.cities = this.allAreas.filter(c =>
                c.pid === (this.allAreas.find(c => c.name === this.form.province).id)
            ) || [];
            this.area.downtowns = [];
            this.form.city = "";
            this.form.downtown = "";
        },

        // 选择市的change事件
        selectC() {
            this.area.downtowns = this.allAreas.filter(c =>
                c.pid === (this.allAreas.find(c => c.name === this.form.city).id)
            ) || [];
            this.form.downtown = "";
        }
    }
};
