Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 便签名
    name: {
      type: String,
      value: ""
    },
    // 描述文案
    title: {
      type: String,
      value: ""
    },
    // 滚动数据来源
    list: {
      type: Array,
      value: []
    }
 
  },
 
  /**
   * 组件的初始数据
   */
  data: {
 
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     *跳转详情页 
     * @param {传递参数} item 
     */
    getopendetail:function(item) {
      console.log(item);
      this.triggerEvent('getopendetail', item.currentTarget.dataset.id);
    }
  }
})