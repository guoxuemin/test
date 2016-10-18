Page({
    data: {
        scrollLeft: 0,
        toggle: true,
        carIds: [44186, 46059, 72568],
        // carIds: [44186],
        diff: {},
        carData: {}

    },
    scrollX: function(e) {
        this.setData({
            scrollLeft: e.detail.scrollLeft
        })
    },
    onLoad: function(options) {


        this.initCarData();
    },
    // 显示隐藏相同项
    toggle: function() {

        this.setData({
            toggle: !this.data.toggle
        })
    },
    // 初始化车型数据
    initCarData: function() {
        var self = this;

        var idstr = this.data.carIds.join(",");

        wx.request({
            url: 'http://mrobot.pcauto.com.cn/xsp/s/auto/info/price/detailCompare.xsp?modelIds=' + idstr + '&rid=1',

            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log(res.data)
                self.setData({
                    carData: res.data
                })

                self.initDiff(res.data);
            }
        })

    },
    // 初始化各参数项相同情况
    initDiff: function(data) {
        var item = data.detailArray,
            i = 0,
            len = item.length;
        var diff = {};

        // 车型
        for (var i; i < len; i++) {

            var item2 = item[i].detail;



            // 分类，如价格、发动机等
            for (var k = 0, len2 = item2.length; k < len2; k++) {

                var item3 = item2[k].groupDetail,
                    groupName = item2[k].groupName;



                if (diff[groupName] == undefined) diff[groupName] = {};


                // 具体参数列表
                for (var j = 0, len3 = item3.length; j < len3; j++) {
                    var key, value;

                    if (j % 2 == 0) {
                        key = item3[j];
                        value = item3[++j];
                    }

                    // console.log(diff[key])
                    // console.log(value)
                    diff[groupName][key] = diff[groupName][key] == undefined ? [].concat(value) : diff[groupName][key].concat(value);
                }



            }

        }

        // 判断是否相同
        Object.keys(diff).forEach(function(key, index) {
            Object.keys(diff[key]).forEach(function(item, index) {

                var arr = diff[key][item].sort();

                if (arr[0] == arr[arr.length - 1]) {
                    diff[key][item] = true;
                } else {
                    diff[key][item] = false;
                }
            });

        });



        this.setData({
            diff: diff
        })
    },
    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {

    },
    onUnload: function() {

    }
})
