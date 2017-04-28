let host = 'https://localhost/api'
// let host = 'https://www.rhinel.xyz/api'

let request = (path, data, callscue, callerr, callcomp) => {
    let token = wx.getStorageSync('token')
    data = Object.assign({}, data)
    token && (data.token = token)

    wx.request({
        url: host + path,
        data: data,
        method: 'POST',
        success(res) {
            if (res.data.code == '2001' && path.indexOf('/auth') < 0) {
                // 非auth接口，登陆失效或者未登陆，先报错后，清除旧登陆信息，跳转
                wx.removeStorageSync('token')
                wx.redirectTo({
                    url: '/pages/index/index'
                })
                wx.showToast({
                    title: String(res.data.code),
                    image: '../../assets/error.png',
                    icon: 'loading',
                    duration: 2000
                })
            } else if (res.data.code) {
                // 接口返回错误代码，继续执行，由方法自行判断，默认报错退出
                if (!callerr) {
                    wx.showToast({
                        title: String(res.data.code),
                        image: '../../assets/error.png',
                        icon: 'loading',
                        duration: 2000
                    })
                } else {
                    callerr(res)
                }
            } else {
                // 成功调用
                if (!callscue) {
                    wx.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    callscue(res)
                }
            }
        },
        fail(res) {
            wx.showToast({
                title: '接口出错',
                image: '../../assets/error.png',
                icon: 'loading',
                duration: 2000
            })
        },
        complete() {
            console.log(path + '接口完成')
            callcomp && callcomp()
        }
    })
}

module.exports = request