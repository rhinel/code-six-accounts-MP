//history.js
let ajax = require('../../assets/utils/request.js')
Page({
    data: {

    },
    onLoad(options) {
        // 生命周期函数--监听页面加载
        ajax('/inner/auth/check', {}, (res) => { }, (res) => {
            wx.reLaunch({
                url: '/pages/index/index'
            })
        })
    },
    onReady() {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow() {
        // 生命周期函数--监听页面显示

    },
    onHide() {
        // 生命周期函数--监听页面隐藏

    },
    onUnload() {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh() {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom() {
        // 页面上拉触底事件的处理函数

    }
})