export default {
    name: "homeSettingSafe",

    template: "\
    <div style=\"height: 400px\">\
        <el-card class=\"box-card2\">\
            <el-tabs type=\"border-card\" class=\"box-card\" @tab-click='handleClick'>\
                <el-tab-pane label=\"修改密码\" :disabled='option===1'>\
                    <div v-show=\"show\">\
                        <el-row>\
                           <span>{{'绑定手机（' + formatPhone + '）'}}</span>\
                        </el-row>\
                        <el-row>\
                            <el-col :span=\"3\">\
                                短信验证:\
                            </el-col>\
                            <el-col :span=\"6\">\
                                <el-input placeholder=\"请输入验证码\" v-model='code'></el-input>\
                            </el-col>\
                            <el-col :span=\"1\">&nbsp;</el-col>\
                            <el-col :span=\"5\">\
                                <el-button type=\"primary\" size=\"small\" @click=\"createVerifyCode(phone)\" :disabled=\"message!=='获取短信验证码'\">\
                                    {{message}}\
                                </el-button>\
                            </el-col>\
                        </el-row>\
                        <el-button @click=\"checkVerifyCode\">确认</el-button>\
                    </div>\
                    <div v-show=\"!show\">\
                        <el-form ref=\"form\" :model=\"form\" :rules='rules' label-width=\"100px\">\
                           <el-form-item label=\"输入新密码:\">\
                                <el-col :span=\"7\">\
                                    <el-input v-model=\"form.password\" type='password' autocomplete=\"off\"></el-input>\
                                </el-col>\
                            </el-form-item>\
                            <el-form-item label=\"确认密码:\">\
                                <el-col :span=\"7\">\
                                    <el-input v-model=\"form.repassword\" type='password' autocomplete=\"off\"></el-input>\
                                </el-col>\
                            </el-form-item>\
                            <el-form-item>\
                                <el-button type=\"primary\" @click='submitPwd'>保存设置</el-button>\
                            </el-form-item>\
                        </el-form>\
                    </div>\
                    </el-tab-pane>\
                        <el-tab-pane label=\"修改绑定\" :disabled='option===2'>\
                            <div style=\"width: 700px\">\
                                <el-steps :active=\"active\" finish-status=\"success\" :space=\"200\">\
                                    <el-step title=\"步骤 1\"></el-step>\
                                    <el-step title=\"步骤 2\"></el-step>\
                                    <el-step title=\"步骤 3\"></el-step>\
                                </el-steps>\
                                <div v-if=\"active===0\">\
                                    <el-row>\
                                        <el-col :span=\"12\">\
                                            <span>{{'绑定手机（' + formatPhone + '）'}}</span>\
                                        </el-col>\
                                    </el-row>\
                                    <el-row>\
                                        <el-col :span=\"3\">\
                                            短信验证码:\
                                        </el-col>\
                                        <el-col :span=\"6\">\
                                            <el-input placeholder=\"请输入验证码\" v-model='code'></el-input>\
                                        </el-col>\
                                        <el-col :span=\"1\">&nbsp;</el-col>\
                                        <el-col :span=\"5\">\
                                            <el-button type=\"primary\" size=\"small\" @click=\"createVerifyCode(phone)\" :disabled=\"message!=='获取短信验证码'\">\
                                                {{message}}\
                                            </el-button>\
                                        </el-col>\
                                    </el-row>\
                                </div>\
                                <div v-if=\"active===1\">\
                                    <el-row>\
                                        <el-col :span=\"3\">\
                                            请输入新手机号:\
                                        </el-col>\
                                        <el-col :span=\"6\">\
                                            <el-input placeholder=\"请输入新手机号\" v-model='newPhone'></el-input>\
                                        </el-col>\
                                    </el-row>\
                                    <el-row>\
                                        <el-col :span=\"3\">\
                                            短信验证码:\
                                        </el-col>\
                                        <el-col :span=\"6\">\
                                            <el-input placeholder=\"请输入验证码\" v-model='code'></el-input>\
                                        </el-col>\
                                        <el-col :span=\"1\">&nbsp;</el-col>\
                                        <el-col :span=\"5\">\
                                            <el-button type=\"primary\" size=\"small\" @click=\"createVerifyCode(newPhone)\" :disabled=\"message!=='获取短信验证码'\">\
                                                {{message}}\
                                            </el-button>\
                                        </el-col>\
                                    </el-row>\
                                </div>\
                                <div v-if=\"active===2\">\
                                    <span style=\"color: #67C23A\"><i class=\"el-icon-success\" type=\"success\"></i></span>\
                                    <font size=\"6px\" style=\"color: red\">恭喜你，新手机绑定成功！</font>\
                                    <div>\
                                    <el-button type=\"text\">回到首页</el-button>\
                                    </div>\
                                </div>\
                                <el-button @click=\"next\" v-if=\"active < 2\">下一步</el-button>\
                            </div>\
                        </el-tab-pane>\
                    </el-tabs>\
                </el-card>\
            </div>",

    data(){

        var validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };

        var validateRepwd = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        return{
            ly,
            option:1,
            active: 0,
            show: true,
            form:{
                password:'',
                repassword:''
            },
            rules:{
                password:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {validator: validatePass, trigger: 'blur'}
                    ],
                repassword:[
                    {required: true, message: '请再次输入密码', trigger: 'blur'},
                    {validator: validateRepwd, trigger: ['blur', 'change']}
                    ]
            },
            phone:'',
            newPhone:'',
            message:'获取短信验证码',
            code:'',
            timer:''
        }
    },

    created(){
        // 查询用户绑定的手机
        ly.http.get("user/phone").then(({data}) => {
            this.phone = data
        })


    },

    methods: {
        next() {
            // 判断是不是在第一步,校验输入的验证码
            ly.verifyUser().then(() => {
                if (this.active === 0) {
                    ly.http.get("user/code?code=" + this.code +"&phone=" + this.phone).then(() => {
                        this.active++;
                        this.code = '';
                        clearInterval(this.timer);
                        this.message = "获取短信验证码";
                    }).catch((resp) => {
                        if (resp.statusCode === 401) {
                            this.$message.error("请输入正确的验证码");
                        } else {
                            this.$message.error("服务器异常");
                        }
                    });
                } else if(this.active === 1){
                    // 判断输入的验证码
                    ly.verifyUser().then(() => {
                        ly.http.get("user/code?code="+this.code +"&phone="+this.newPhone).then(() => {
                            // 发送请求修改绑定的手机
                            ly.http.put("user/phone","newPhone="+this.newPhone).then(({data}) => {
                                console.log(data);
                                if (data) {
                                    this.active++;
                                } else {
                                    this.$message.error("该手机已被绑定,请先解绑");
                                }

                            }).catch(() => {
                                this.$message.error("服务器异常,保存失败");
                            })
                        }).catch(() => {
                            this.$message.error("验证码错误,重新绑定失败")
                        })
                    }).catch(() => {
                        location.href = "/login.html?returnUrl="+location.href;
                    });
                }
            }).catch(() => {
                location.href = "/login.html?returnUrl="+location.href;
            })

        },

        // 发送验证码
        createVerifyCode(phone){
            ly.verifyUser().then(() => {
                ly.http.post("/user/send", "phone=" + phone);
                // 将按钮disabled，60秒后才可点击
                let timeCount = 60;
                this.timer = setInterval(() => {
                    timeCount--;
                    this.message = "(" + timeCount + ")秒后获取验证码";
                    if (timeCount === 0) {
                        clearInterval(this.timer);
                        this.message = "获取短信验证码";

                    }
                },1000);
            }).catch(() => {
                location.href = "/login.html?returnUrl="+location.href;
            })

        },

        // 保存密码设置
        submitPwd(){
            ly.verifyUser().then(() => {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        this.$confirm(this.form.repassword).then(() => {
                            ly.http.put("user/password","pwd="+this.form.repassword).then(() => {
                                this.$message.success("保存成功")
                            }).catch(() => {
                                this.$message.error("服务器异常,保存失败")
                            })
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }).catch(() => {
                location.href = "/login.html?returnUrl="+location.href;
            })
        },

        // 验证输入的验证码
        checkVerifyCode(){
            ly.verifyUser().then(() => {
                ly.http.get("user/code?code="+this.code +"&phone=" + this.phone).then(() => {
                    this.show = false;
                }).catch((resp) => {
                    if (resp.statusCode === 401) {
                        this.$message.error("请输入正确的验证码");
                    } else {
                        this.$message.error("验证码错误");
                    }
                })
            })
        },

        // 点击标签页的点击事件
        handleClick(){
            this.show = true;
            this.option = [1,2].filter(n => n !== this.option)[0];
            this.code = '';
            clearInterval(this.timer);
            this.message = "获取短信验证码";
        }
    },

    computed:{
        formatPhone(){
            for (let i = 3; i<7; i++){
                const phone = this.phone.toString();
                return phone.substr(0,3) + '****' + phone.substr(7)
            }
        }
    }
}