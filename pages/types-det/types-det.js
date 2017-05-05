//types-det.js
let ajax = require('../../assets/utils/request.js')
let formatTime = require('../../assets/utils/util.js').formatTime
let formatDate = require('../../assets/utils/util.js').formatDate
Page({
    data: {
        editting: true,
        updatting: false,
        det: {
            typeId: '',
            name: '',
            detail: '',
            increased: 0,
            reduce: 0,
            calc: 1,
            theCalc: 0
        },
        loaded: false,
        list: [],
        page: 0,
        size: 5,
        end: false
    },
    onLoad(options) {
        // 生命周期函数--监听页面加载
        let that = this
        if (!options.typeId) {
            that.setData({
                'editting': true
            })
        } else {
            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 2000000
            })
            that.setData({
                'det.typeId': options.typeId,
                'editting': false
            })
            Promise.all([
                new Promise((resolve) => {
                    this.bindGetDet(resolve)
                }),
                new Promise((resolve) => {
                    this.bindGetList(resolve, true)
                })
            ]).then((data) => {
                wx.hideToast()
            })
        }
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
    onReachBottom() {
        // 页面上拉触底事件的处理函数
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
    // data
    bindinputName(e) {
        this.setData({
            'det.name': e ? e.detail.value : ''
        })
    },
    bindinputDetail(e) {
        this.setData({
            'det.detail': e ? e.detail.value : ''
        })
    },
    bindChangeCalcType() {
        let that = this
        if (!that.data.editting) {
            return false
        }
        that.setData({
            'det.calc': 1 - that.data.det.calc
        })
    },
    // actions
    bindEdit() {
        this.setData({
            'editting': true
        })
    },
    bindSave() {
        let that = this
        if (!that.data.det.name) {
            wx.showToast({
                title: '请输入名称',
                image: '../../assets/error.png',
                icon: 'loading',
                duration: 2000
            })
        } else {
            if (that.data.updatting) {
                return false
            }
            that.setData({
                'updatting': true
            })
            let title = ''
            let url = ''
            let ok = ''
            if (!that.data.det.typeId) {
                title = '添加中'
                url = '/inner/types/add'
                ok = '添加成功'
            } else {
                title = '修改中'
                url = '/inner/types/edit'
                ok = '修改成功'
            }
            wx.showToast({
                title: title,
                icon: 'loading',
                mask: true,
                duration: 2000000
            })
            ajax(url, that.data.det, (res) => {
                wx.showToast({
                    title: ok,
                    icon: 'success',
                    duration: 1000
                })
                that.setData({
                    'editting': false,
                    'det.typeId': that.data.det.typeId || res.data.data.insertId
                })
            }, (res) => {
                wx.showToast({
                    title: String(res.data.msg),
                    image: '../../assets/error.png',
                    icon: 'loading',
                    duration: 2000
                })
            }, (res) => {
                that.setData({
                    'updatting': false
                })
            })
        }
    },
    bindRecordDet(e) {
        wx.navigateTo({
            url: '/pages/record-det/record-det?recordId=' + e.currentTarget.dataset.recordid
        })
    },
    fixNum(n) {
        return Math.round(n * 100) / 100
    },
    // get data
    bindGetDet(resolve) {
        let that = this
        ajax('/inner/types/one', {
            typeId: that.data.det.typeId
        }, (res) => {
            let data = res.data.data[0] || that.data.det
            data.theCalc = that.fixNum(data.increased - data.reduce)
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
    },
    bindGetList(resolve, start) {
        let that = this
        let page = start ? 0 : that.data.page
        if (!that.data.loaded && !start || !start && that.data.end) {
            return false
        }
        that.setData({
            loaded: false
        })
        ajax('/inner/types/typeDetList', {
            typeId: that.data.det.typeId,
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
    }
})