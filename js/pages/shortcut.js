const shortcut = {
    template: "\
    <div class='py-container'> \
        <div class='shortcut'> \
            <ul class='fl'> \
               <li class='f-item'>乐优欢迎您！</li> \
               <li class='f-item' v-if='user && user.username'>\
               尊敬的会员，<span style='color: red;'>{{user.username}}</span>\
               &nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' @click='outLogin'>退出登陆</a>\
               </li>\
               <li v-else class='f-item'> \
                   请<a href='javascript:void(0)' @click='gotoLogin'>登录</a>　 \
                   <span><a href='register.html' target='_blank'>免费注册</a></span> \
               </li> \
           </ul> \
           <ul class='fr'> \
               <li class='f-item'><a href='home-index.html' target='_blank'>我的订单</a></li> \
               <li class='f-item space'></li> \
               <li class='f-item'><a href='home-index.html' target='_blank'>我的乐优</a></li> \
               <li class='f-item space'></li> \
               <li class='f-item'>乐优会员</li> \
               <li class='f-item space'></li> \
               <li class='f-item'>企业采购</li> \
               <li class='f-item space'></li> \
               <li class='f-item'>关注乐优</li> \
               <li class='f-item space'></li> \
               <li class='f-item' id='service'> \
                   <span>客户服务</span> \
                   <ul class='service'> \
                       <li><a href='cooperation.html' target='_blank'>合作招商</a></li> \
                       <li><a href='shoplogin.html' target='_blank'>商家后台</a></li> \
                       <li><a href='cooperation.html' target='_blank'>合作招商</a></li> \
                       <li><a href='#'>商家后台</a></li> \
                   </ul> \
               </li> \
               <li class='f-item space'></li> \
               <li class='f-item'>网站导航</li> \
           </ul> \
       </div> \
    </div>\
    ",
    name: "shortcut",
    data() {
        return {
            user: null
        }
    },
    created() {
        ly.http.get("/auth/verify")
            .then(resp => {
                this.user = resp.data;
            })
    },
    methods: {
        // 跳转至登陆页面
        gotoLogin() {
            window.location = "login.html?returnUrl=" + window.location;
        },

        // 退出登陆
        outLogin(){
            const filter = ["getOrderInfo","home-index","pay","payfail","paysuccess"];
            ly.http.delete("/auth").then(() => {
                this.user = null;
                const start = window.location.href.split(".com/")[1].split(".")[0];
                const returnUrl = window.location.href.split(".com/")[1];
                if (filter.includes(start)) {
                    window.location.href = "/login.html?returnUrl="+returnUrl;
                }

            })
        }
    }
}
export default shortcut;