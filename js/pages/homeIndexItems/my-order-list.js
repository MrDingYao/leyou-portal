const myOrderList = {
  template: "\
    <div>\
        <div class=\"table-title\">\
            <table class=\"sui-table  order-table\">\
                <tr>\
                    <thead>\
                        <th width=\"35%\">宝贝</th>\
                        <th width=\"5%\">单价</th>\
                        <th width=\"5%\">数量</th>\
                        <th width=\"8%\">商品操作</th>\
                        <th width=\"10%\">实付款</th>\
                        <th width=\"10%\">交易状态</th>\
                        <th width=\"10%\">交易操作</th>\
                    </thead>\
                </tr>\
            </table>\
        </div>\
        <div class='order-detail'>\
            <div class=\"orders\">\
                <div class=\"choose-order\">\
                    <div class=\"sui-pagination pagination-large top-pages\">\
                        <ul>\
                            <li :class=\"{prev:true, disabled: search.page===1}\" @click=\"prevPage\">\
                                <a href=\"#\">上一页</a>\
                            </li>\
                            <li class=\"next\" :class=\"{next:true, disabled:search.page === totalPage}\" @click=\"nextPage\">\
                                <a href=\"#\">下一页</a>\
                            </li>\
                        </ul>\
                    </div>\
                </div>\
                <!-- order1 -->\
                <div v-for=\"(order,i) in orderList\" :key=\"i\">\
                    <div class=\"choose-title\">\
                        <label data-toggle=\"checkbox\" class=\"checkbox-pretty \">\
                            <input type=\"checkbox\" checked=\"checked\">\
                            <span>\
                                {{ly.formatDate(order.createTime,'yyyy-MM-dd hh:mm')+' 订单编号：'+order.orderId+'  店铺：哇哈哈 '}}\
                                <a>和我联系</a>\
                            </span>\
                        </label>\
                        <a class=\"sui-btn btn-info share-btn\">分享</a>\
                    </div>\
                    <table class=\"sui-table table-bordered order-datatable\">\
                    <tbody >\
                        <tr v-for=\"(detail,j) in order.orderDetails\" :key=\"j\">\
                            <td width=\"35%\">\
                                <div class=\"typographic\"><img :src=\"detail.image\" width=\"85px\" height=\"85px\"/>\
                                    <a :href=\"'home-orderDetail.html?orderId='+detail.orderId\" class=\"block-text\">{{detail.title}}</a>\
                                    <span class=\"guige\">\
                                        <span v-for=\"(v,k,i) in JSON.parse(detail.ownSpec)\" :key=\"k\">\
                                            {{k}}:{{v}}\
                                        </span>\
                                    </span>\
                                </div>\
                            </td>\
                            <td width=\"5%\" class=\"center\">\
                                <ul class=\"unstyled\">\
                                    <li class=\"o-price\">¥{{ly.formatPrice(detail.price)}}</li>\
                                    <li>¥{{ly.formatPrice(detail.price)}}</li>\
                                </ul>\
                            </td>\
                            <td width=\"5%\" class=\"center\">{{detail.num}}</td>\
                            <td width=\"8%\" class=\"center\"></td>\
                            <td width=\"10%\" class=\"center\" :rowspan=\"order.orderDetails.length\" v-if=\"j===0\">\
                                <ul class=\"unstyled\">\
                                    <li>¥{{ly.formatPrice(order.actualPay)}}</li>\
                                    <li>（含运费：￥{{ly.formatPrice(order.postFee ? order.postFee : 0)}}）</li>\
                                </ul>\
                            </td>\
                            <td width=\"10%\" class=\"center\" :rowspan=\"order.orderDetails.length\" v-if=\"j===0\">\
                                <ul class=\"unstyled\">\
                                    <li>{{orderStatus(order.status)}}</li>\
                                    <li><a :href=\"'home-orderDetail.html?orderId='+detail.orderId\" class=\"btn\">订单详情 </a></li>\
                                </ul>\
                            </td>\
                            <td width=\"10%\" class=\"center\" :rowspan=\"order.orderDetails.length\" v-if=\"j===0\">\
                                <ul class=\"unstyled\">\
                                    <li>\
                                        <a href=\"#\" class=\"sui-btn btn-info\">\
                                            {{optionStatus(order.status)}}\
                                        </a>\
                                    </li>\
                                    <li v-if='order.status<4'><el-button type='text'>取消订单</el-button></li>\
                                    <!-- 计算倒计时 -->\
                                    <li v-if='order.status === 3'>\
                                        <Icon type=\"md-clock\" />\
                                        {{calculateTime(order.orderStatus.consignTime)}}\
                                    </li>\
                                </ul>\
                            </td>\
                        </tr>\
                    </tbody>\
                </div>\
            </div>\
            <div class=\"choose-order\">\
                <div class=\"sui-pagination pagination-large top-pages\">\
                    <ul>\
                        <li :class=\"{prev:true, disabled: search.page===1}\" @click=\"prevPage\">\
                            <a href=\"#nav-bottom\">«上一页</a>\
                        </li>\
                        <li :class=\"{active: search.page === index(i)}\" v-for=\"i in Math.min(5,totalPage)\" :key=\"i\" @click=\"search.page = index(i)\">\
                            <a href=\"#nav-bottom\">\
                                {{index(i)}}\
                            </a>\
                        </li>\
                        <li class=\"dotted\" v-show=\"totalPage>5 && (totalPage-search.page)>2\">\
                            <span>...</span>\
                        </li>\
                        <li class=\"next\" :class=\"{next:true, disabled:search.page === totalPage}\" @click=\"nextPage\">\
                            <a href=\"#nav-bottom\">下一页»</a>\
                        </li>\
                    </ul>\
                    <div>\
                        <span>共{{totalPage}}页&nbsp;</span>\
                        <span>\
                            到<input type=\"text\" class=\"page-num\" v-model=\"jumpPage\" @keyup.enter=\"search.page = jumpPage\">页\
                            <a class=\"page-confirm\" @click=\"search.page = jumpPage\" href='#nav-bottom'>确定</a>\
                        </span>\
                    </div>\
                </div>\
            </div>\
            <div class=\"clearfix\"></div>\
        </div>\
    </div>\
    \
  " ,

  name:"myOrderList",
  props:{
      status:{                          // 状态：1、未付款 2、已付款,未发货 3、已发货,未确认 4、交易成功 5、交易关闭 6、已评价
          type:Number,
          default:1
      }
  },

  data(){
      return{
          ly,
          search: {
              page: 1,                 // 当前页码
              rows: 5                 // 每页显示数量

          },
          total: 0,                    // 总信息数
          totalPage: 0,                // 总页数
          orderList: [],               // 所有订单信息
          jumpPage:""                    // 跳页的输入页码
      }
  },

    created(){

        this.loadOrderList();
    },

    methods:{
        loadOrderList(){
            const page = this.search.page;
            const rows = this.search.rows;
            const status = this.status || 0;
            ly.http.get("order/order/list?page=" + page + "&rows=" + rows + "&status=" + status)
                .then(({data}) => {
                    this.orderList = data.items;
                    this.total = data.total;
                    this.totalPage = data.totalPage
                });
        },

        index(i) {
            if (this.totalPage <= 5 || this.search.page <= 3) {
                return i;
            }
            else if (this.totalPage - this.search.page >= 2) {
                return this.search.page - 3 + i;
            }
            else {
                return this.totalPage - 5 + i;
            }
        },

        // 上一页
        prevPage() {
            if (this.search.page > 1) {
                this.search.page--;
                //window.location.href = "http://www.leyou.com/home-index.html?" + ly.stringify(this.search);
                //this.loadOrderList();
            }
        },

        // 下一页
        nextPage() {
            if (this.search.page < this.totalPage) {
                this.search.page++;
                //window.location.href = "http://www.leyou.com/home-index.html?" + ly.stringify(this.search);
                //this.loadOrderList();
            }
        },

        // 计算发货后的倒计时,默认7天
        calculateTime(time){
            const sec = 604800 - (new Date().getTime() - new Date(time).getTime())/1000;
            const day = parseInt(sec/86400);
            const hour = parseInt(sec%86400/3600);
            const min = parseInt(sec%86400000%3600/60);
            return day + "天" + hour +"小时" + min +"分";
        },

        // 订单状态
        orderStatus(status) {
            switch (status) {
                case 1:
                    return '等待买家付款';
                case 2:
                    return '买家已付款';
                case 3:
                    return '卖家已发货';
                case 4, 5, 6:
                    return '交易成功';
            }
        },

        optionStatus(status) {
            switch (status) {
                case 1:
                    return '立即付款';
                case 2:
                    return '提醒发货';
                case 3:
                    return '确认收货';
                case 4:
                    return '评价';
                case 5, 6:
                    return '已评价';
            }
        }

    },

    watch:{
          status:{
              deep:true,
              handler(val){
                  if (val < 5) {
                      this.orderList = [];
                      // 对page进行判空，初始化
                      this.search.page = 1;
                      this.search.rows = 5;
                      this.status = val;
                      this.loadOrderList();
                  }

              }
          },

        search:{
          deep:true,
          handler(val){
            this.loadOrderList();
          }
        },

        jumpPage:{
          deep:true,
          handler(val){
              this.jumpPage = Math.min(val,this.totalPage) || "";
          }
        }
    }
};
export default myOrderList