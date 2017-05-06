//history.js
let ajax = require('../../assets/utils/request.js')
let formatDate = require('../../assets/utils/util.js').formatDate
Page({
    data: {
        loaded: false,
        list: [],
        page: 0,
        size: 5,
        end: false,
        count: 0
    },
    onLoad(options) {
        // 生命周期函数--监听页面加载
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 2000000
        })
        Promise.all([
            new Promise((resolve) => {
                this.bindGetDateList(resolve, true)
            }),
            new Promise((resolve) => {
                this.bindGetCount(resolve)
            })
        ]).then((data) => {
            wx.hideToast()
        })
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
        Promise.all([
            new Promise((resolve) => {
                this.bindGetDateList(resolve, true)
            }),
            new Promise((resolve) => {
                this.bindGetCount(resolve)
            })
        ]).then((data) => {
            wx.stopPullDownRefresh()
            wx.showToast({
                title: '获取成功',
                icon: 'success',
                duration: 1000
            })
        })
    },
    onReachBottom() {
        // 页面上拉触底事件的处理函数
        Promise.all([
            new Promise((resolve) => {
                this.bindGetDateList(resolve)
            })
        ]).then((data) => {
            wx.showToast({
                title: '获取成功',
                icon: 'success',
                duration: 1000
            })
        })
    },
    // actions
    bindAddRecord(e) {
        wx.navigateTo({
            url: '/pages/record-det/record-det'
        })
    },
    bindDateDet(e) {
        wx.navigateTo({
            url: '/pages/date/date?date=' + e.currentTarget.dataset.date
        })
    },
    fixNum(n) {
        return Math.round(n * 100) / 100
    },
    // getData
    bindGetDateList(resolve, start) {
        let that = this
        let page = start ? 0 : that.data.page
        if (!that.data.loaded && !start || !start && that.data.end) {
            return false
        }
        that.setData({
            loaded: false
        })
        ajax('/inner/date/list', {
            page: page + 1,
            size: that.data.size
        }, (res) => {
            res.data.data.forEach((i) => {
                i.date = formatDate(new Date(i.date))
                i.calc = that.fixNum(i.increased - i.reduce)
            })
            that.setData({
                list: page != 0 ? that.data.list.concat(res.data.data) : res.data.data,
                loaded: true,
                page: res.data.data.length > 0 ? page + 1 : page,
                end: res.data.data.length == 0 && !!page
            })
            resolve && resolve()
        }, (res) => {
            that.setData({
                loaded: true
            })
            wx.showToast({
                title: String(res.data.msg),
                image: '../../assets/error.png',
                icon: 'loading',
                duration: 2000
            })
        })
    },
    bindGetCount(resolve) {
        let that = this
        ajax('/inner/user/count', {}, (res) => {
            that.setData({
                count: res.data.data[0] && res.data.data[0].count
            })
            resolve && resolve()
        }, (res) => {
            wx.showToast({
                title: String(res.data.msg),
                image: '../../assets/error.png',
                icon: 'loading',
                duration: 2000
            })
        })
    }
})