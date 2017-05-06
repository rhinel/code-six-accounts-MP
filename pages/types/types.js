//types.js
let app = getApp()
let ajax = require('../../assets/utils/request.js')
let formatTime = require('../../assets/utils/util.js').formatTime
Page({
    data: {
        loaded: false,
        list: [],
        page: 0,
        size: 5,
        end: false
    },
    onLoad(options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 2000000
        })
        // 生命周期函数--监听页面加载
        Promise.all([
            new Promise((resolve) => {
                this.bindGetList(resolve, true)
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
        let that = this
        if (app.globalData.reload) {
            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 2000000
            })
            // 生命周期函数--监听页面加载
            Promise.all([
                new Promise((resolve) => {
                    this.bindGetList(resolve, true)
                })
            ]).then((data) => {
                wx.hideToast()
                app.globalData.reload --
            })
        }
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
                this.bindGetList(resolve, true)
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
        return false
        Promise.all([
            new Promise((resolve) => {
                this.bindGetList(resolve)
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
    bindAddType(e) {
        wx.navigateTo({
            url: '/pages/types-det/types-det'
        })
    },
    bindTypeDet(e) {
        wx.navigateTo({
            url: '/pages/types-det/types-det?typeId=' + e.currentTarget.dataset.typeid
        })
    },
    fixNum(n) {
        return Math.round(n * 100) / 100
    },
    // get data
    bindGetList(resolve, start) {
        let that = this
        let page = start ? 0 : that.data.page
        if (!that.data.loaded && !start || !start && that.data.end) {
            return false
        }
        that.setData({
            loaded: false
        })
        ajax('/inner/types/list', {
            page: page + 1,
            size: that.data.size
        }, (res) => {
            res.data.data.forEach((i) => {
                i.updateTime = formatTime(new Date(i.updateTime))
                i.theCalc = that.fixNum(i.increased - i.reduce)
            })
            that.setData({
                list: page != 0 ? that.data.list.concat(res.data.data) : res.data.data,
                loaded: true,
                page: res.data.data.length > 0 ? page + 1 : page,
                end: res.data.data.length == 0 && !!page
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