const myOrderList = {
  template: "\
    <div>\
        <div class='order-detail'>\
            <div class=\"orders\">\
                <div class=\"choose-order\">\
                    <div class=\"sui-pagination pagination-large top-pages\">\
                        <ul>\
                            <li class=\"prev disabled\"><a href=\"#\">上一页</a></li>\
                            <li class=\"next\"><a href=\"#\">下一页</a></li>\
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
                                    <a href=\"#\" class=\"block-text\">{{detail.title}}</a>\
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
                                    <li><a href=\"home-orderDetail.html\" class=\"btn\">订单详情 </a></li>\
                                </ul>\
                            </td>\
                            <td width=\"10%\" class=\"center\" :rowspan=\"order.orderDetails.length\" v-if=\"j===0\">\
                                <ul class=\"unstyled\">\
                                    <li>\
                                        <a href=\"#\" class=\"sui-btn btn-info\">\
                                            {{optionStatus(order.status)}}\
                                        </a>\
                                    </li>\
                                    <li>取消订单</li>\
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
                            <a href=\"javascript:void(0)\">«上一页</a>\
                        </li>\
                        <li :class=\"{active: search.page === index(i)}\" v-for=\"i in Math.min(5,totalPage)\" :key=\"i\" @click=\"search.page = index(i)\">\
                            <a href=\"javascript:void(0)\">\
                                {{index(i)}}\
                            </a>\
                        </li>\
                        <li class=\"dotted\" v-show=\"totalPage>5 && (totalPage-search.page)>2\">\
                            <span>...</span>\
                        </li>\
                        <li class=\"next\" :class=\"{next:true, disabled:search.page === totalPage}\" @click=\"nextPage\">\
                            <a href=\"javascript:void(0)\">下一页»</a>\
                        </li>\
                    </ul>\
                    <div>\
                        <span>共{{totalPage}}页&nbsp;</span>\
                        <span>\
                            到<input type=\"text\" class=\"page-num\">\
                            <button class=\"page-confirm\" onclick=\"alert(1)\">确定</button>页\
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
      }
  },

    created(){

        this.loadOrderList();
    },

    methods:{
        loadOrderList(){
            const page = this.search.page;
            const rows = this.search.rows;
            const status = this.status || 1;
            ly.http.get("order/order/list?page=" + page + "&rows=" + rows + "&status=" + status)
                .then(({data}) => {
                    console.log(data);
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
                window.location.href = "http://www.leyou.com/home-index.html?" + ly.stringify(this.search);
            }
        },

        // 下一页
        nextPage() {
            if (this.search.page < this.totalPage) {
                this.search.page++;
                window.location.href = "http://www.leyou.com/home-index.html?" + ly.stringify(this.search);
            }
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
              this.orderList = [];
              const search = ly.parse(location.search.substring(1));
              // 对page进行判空，初始化
              search.page = search.page ? parseInt(search.page) : 1;
              search.rows = search.rows ? parseInt(search.rows) : 5;
              this.status = val;
              this.loadOrderList();
          }
      }
    }
};
export default myOrderList