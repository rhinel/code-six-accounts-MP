//date.js
let app = getApp()
let ajax = require('../../assets/utils/request.js')
let formatDate = require('../../assets/utils/util.js').formatDate
Page({
    data: {
        det: {
            date: '',
            increased: 0,
            reduce: 0,
            calc: 0
        },
        loaded: false,
        list: [],
        page: 0,
        size: 5,
        end: false,
        count: 0
    },
    onLoad(options) {
        // 生命周期函数--监听页面加载
        this.setData({
            'det.date': options.date
        })
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 2000000
        })
        Promise.all([
            new Promise((resolve) => {
                this.bindGetDateDetList(resolve, true)
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
        let that = this
        if (app.globalData.reload) {
            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 2000000
            })
            Promise.all([
                new Promise((resolve) => {
                    this.bindGetDateDetList(resolve, true)
                }),
                new Promise((resolve) => {
                    this.bindGetCount(resolve)
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
                this.bindGetDateDetList(resolve, true)
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
                this.bindGetDateDetList(resolve)
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
    bindRecordDet(e) {
        wx.navigateTo({
            url: '/pages/record-det/record-det?recordId=' + e.currentTarget.dataset.recordid
        })
    },
    fixNum(n) {
        return Math.round(n * 100) / 100
    },
    // getData
    bindGetDateDetList(resolve, start) {
        let that = this
        let page = start ? 0 : that.data.page
        if (!that.data.loaded && !start || !start && that.data.end) {
            return false
        }
        that.setData({
            loaded: false
        })
        ajax('/inner/date/dateDetList', {
            date: that.data.det.date,
            page: page + 1,
            size: that.data.size
        }, (res) => {
            res.data.data.forEach((i) => {
                i.rCalc = that.fixNum(i.rIncreased - i.rReduce)
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
        ajax('/inner/date/one', {
            date: that.data.det.date
        }, (res) => {
            let data = res.data.data[0] || that.data.det
            data.date = formatDate(new Date(data.date))
            data.calc = that.fixNum(data.increased - data.reduce)
            that.setData({
                det: data
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