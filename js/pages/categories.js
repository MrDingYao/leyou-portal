const lyCategory = {
    template: "\
    <div class='item bo' v-for='(first,i) in firstCategory' :key='first.id'> \
        <h3><a href=''>{{first.name}}</a></h3>\
        <!--<div class='item-list clearfix'>\
            <div class='subitem'>\
            <dl :class='fore+\"j+1\"' v-for='(second,j) in secondCategory(first)' :key='second.id'>\
                <dt><a href=''>{{second.name}}</a></dt>\
                <dd><em v-for='third in thirdCategory(second)' :key='third.id'><a href=''>{{third.name}}</a></em></dd>\
            </dl>\
            </div>\
        </div>-->\
    </div>\
    ",

    name:"categories",

    data(){
        return {
            ly,
            categories:[]
        }
    },

    created(){
        // 去后台查询所有的一级分类
        ly.http.get("item/category/all").then(({data}) => {
            this.categories = data;
        })
    },

    methods:{
        secondCategory(first){
            return this.categories.filter(c => c.parentId === first.id);
        },
        thirdCategory(second){
            return this.categories.filter(c => c.parentId === second.id);
        }
    },

    computed:{
        firstCategory(){
            return this.categories.filter(c => c.parentId === 0);
        }
    }
}

export default lyCategory;