//列表数据加载
// $(function () {
//     $.getJSON("../data/list-data.json", function (data) {
//         $.each(data, function (index, list) {
//             $("#goods-list").append(
//                 "<li class='yui3-u-1-4'><div class='list-wrap' ><div class='p-img'><img src='" + list["img"] + "' alt=''></div><div class='price'><strong><em>¥</em> <i>" + list["n-price"] + "</i></strong></div>"
//                 + "<div class='attr'><em>" + list["desc"] + "</em></div><div class='cu'><em><span>促</span>"+ list["cu"] +"</em></div>"
//                 + "<div class='operate'><a href='success-cart.html' target='blank' class='sui-btn btn-bordered btn-danger'>加入购物车</a>"
//                 + "<a href='javascript:void(0);' class='sui-btn btn-bordered'>对比</a>"
//                 + "<a href='javascript:void(0);' class='sui-btn btn-bordered'>降价通知</a>"
//                 + "</div></div></li >"
//             );
//
//         })
//     })
// })

const collect = {
    template: `
                    <div class="goods-list">
                        <ul class="yui3-g" id="goods-list" >
                            <li class="yui3-u-1-4" v-for="(collect, i) in collects" :key="i">
                                <div class="list-wrap">
                                    <div class="p-img"><img :src="collect.image" alt=''></div>
                                    <div class="price"><strong><em>¥</em> <i>{{ly.formatPrice(collect.price)}}</i></strong></div>
                                    <div class="attr">
                                        <em>
                                             {{collect.title}}
                                             <span v-for="(v,k) in JSON.parse(collect.ownSpec)">
                                                {{v}}
                                             </span>
                                        </em>
                                    </div>
                                    <div class="cu"><em><span>促</span>满一件可参加超值换购</em></div>
                                    <div class="operate">
                                        <a href="success-cart.html" target="_blank"
                                           class="sui-btn btn-bordered btn-danger" @click.prevent="addCartFromCollect(collect.skuId,i)">加入购物车</a>
                                        <a href="javascript:void(0);" class="sui-btn btn-bordered">对比</a>
                                        <a href="javascript:void(0);" :class="{'btn-danger':collect.discount,'sui-btn':true,'btn-bordered':true}">降价通知</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                 
`
    ,
    name: "collect",
    data() {
        return {
            collects: [],
            skuIds: [],
            newestGoods: [],
            ly
        }
    },
    created() {
        ly.http("/cart/collect")
            .then(resp => {
                if (resp.data) {
                    resp.data.forEach(c => c.discount = false);
                    this.collects = resp.data;
                    this.collects.forEach(c => this.skuIds.push(c.skuId));
                    ly.http.post("/item/sku/ids", this.skuIds)
                        .then(resp => {
                            this.newestGoods = resp.data;
                            this.collects.forEach(c => {
                                this.newestGoods.forEach(good => {
                                    //是否降价
                                    if (good.id === c.skuId && good.price < c.price) {
                                        c.price = good.price;
                                        c.discount = true;
                                    }
                                })
                            })
                        });
                } else {
                    this.collects = [];
                }
            });
    },
    methods: {
        //从收藏添加到购物车，数量为1cart
        addCartFromCollect(id, i) {

            ly.http.get("auth/verify")
                .then(
                    ly.http.post("cart/collect2cart", {'skuId': id, 'num': 1}).then(() => {
                        console.log("第几个"+i)
                        this.collects.splice(i, 1)
                    }).catch(() => {
                        alert("服务器繁忙，请稍后操作")
                    })
                )
                .catch(resp => {
                    //未登录
                    window.location.href = "http://www.leyou.com/login.html?returnUrl=http://www.leyou.com/cart.html";
                })
        }
    }
}
export default collect;