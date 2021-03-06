//record-det.js
let app = getApp()
let ajax = require('../../assets/utils/request.js')
let formatDate = require('../../assets/utils/util.js').formatDate
Page({
  data: {
    det: {
      date: formatDate(new Date()),
      typeId: '',
      increased: 0,
      reduce: 0,
      recordId: '',
      calc: 0
    },
    typesIndex: 0,
    types: [],
    edit: true,
    updatting: false
  },
  onLoad(options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000000
    })
    // 生命周期函数--监听页面加载
    this.setData({
      'det.recordId': options.recordId || '',
      'edit': !options.recordId
    })
    let actions = [
      new Promise((resolve) => {
        this.bindGetTypes(resolve)
      })
    ]
    options.recordId && actions.push(
      new Promise((resolve) => {
        this.bindGetDet(resolve)
      })
    )
    Promise.all(actions).then((data) => {
      let that = this
      if (actions.length == 2) {
        let typesIndex = 0
        that.data.types.forEach((i, index) => {
          i.typeId == that.data.det.typeId && (typesIndex = index)
        })
        that.setData({
          'typesIndex': typesIndex
        })
      }
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
  // get data
  bindGetTypes(resolve) {
    let that = this
    ajax('/inner/types/minlist', {}, (res) => {
      that.setData({
        types: res.data.data,
        'det.typeId': res.data.data[0] && !that.data.det.typeId ? res.data.data[0].typeId : that.data.det.typeId
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
  bindGetDet(resolve) {
    let that = this
    ajax('/inner/record/one', {
      recordId: that.data.det.recordId
    }, (res) => {
      if (!res.data.data[0]) {
        wx.showToast({
          title: '记录不存在',
          image: '../../assets/error.png',
          icon: 'loading',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
        return false
      }
      let record = res.data.data[0]
      record.date = formatDate(new Date(record.date))
      record.calc = that.fixNum(record.increased - record.reduce)
      that.setData({
        det: record
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
  // data
  bindTypeDateChange(e) {
    let that = this
    that.setData({
      'det.date': e ? e.detail.value : formatDate(new Date())
    })
  },
  bindTypePickerChange(e) {
    let that = this
    that.setData({
      'typesIndex': e && that.data.types[e.detail.value] ? e.detail.value : 0,
      'det.typeId': e && that.data.types[e.detail.value] ? that.data.types[e.detail.value].typeId : ''
    })
  },
  bindinputIncreased(e) {
    let that = this
    that.setData({
      'det.increased': e ? e.detail.value : 0,
      'det.calc': that.fixNum((e ? e.detail.value : 0) - that.data.det.reduce)
    })
  },
  bindfocusIncreased(e) {
    let that = this
    if (that.data.det.increased === 0) {
      that.setData({
        'det.increased': e ? '' : 0,
        'det.calc': that.fixNum(0 - (that.data.det.reduce || 0))
      })
    }
  },
  bindblurIncreased(e) {
    let that = this
    if (that.data.det.increased === '') {
      that.setData({
        'det.increased': 0,
        'det.calc': that.fixNum(0 - (that.data.det.reduce || 0))
      })
    }
  },
  bindinputReduce(e) {
    let that = this
    that.setData({
      'det.reduce': e ? e.detail.value : 0,
      'det.calc': that.fixNum(that.data.det.increased - (e ? e.detail.value : 0))
    })
  },
  bindfocusReduce(e) {
    let that = this
    if (that.data.det.reduce === 0) {
      that.setData({
        'det.reduce': e ? '' : 0,
        'det.calc': that.fixNum((that.data.det.increased || 0) - 0)
      })
    }
  },
  bindblurReduce(e) {
    let that = this
    if (that.data.det.reduce === '') {
      that.setData({
        'det.reduce': 0,
        'det.calc': that.fixNum((that.data.det.increased || 0) - 0)
      })
    }
  },
  // actions
  bindEdit() {
    this.setData({
      'edit': true
    })
  },
  bindUp() {
    let that = this
    if (!that.data.det.date || !that.data.det.typeId) {
      wx.showToast({
        title: '参数不完整',
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
      if (!that.data.det.recordId) {
        title = '添加中'
        url = '/inner/record/add'
        ok = '添加成功'
      } else {
        title = '修改中'
        url = '/inner/record/edit'
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
          'edit': false,
          'det.recordId': that.data.det.recordId || res.data.data.insertId
        })
        app.globalData.reload = getCurrentPages().length
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
  bindDel() {
    let that = this
    if (!that.data.det.date || !that.data.det.typeId) {
      wx.showToast({
        title: '参数不完整',
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
      wx.showToast({
        title: '删除中',
        icon: 'loading',
        mask: true,
        duration: 2000000
      })
      ajax('/inner/record/del', that.data.det, (res) => {
        app.globalData.reload = getCurrentPages().length
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
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
  fixNum(n) {
    return Math.round(n * 100) / 100
  }
})