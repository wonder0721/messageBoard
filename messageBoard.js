const http = require('http')
const fs = require('fs')
const url = require('url')
const template = require('art-template')

// 为了方便的统一处理静态资源，将静态资源都存放在public目录里

var server = http.createServer()
server.on('request',function(req,res){
    // 使用url模块将url转化为一个URL相关对象，便于对url操作和解析
    var parseObj = url.parse(req.url,true)
    // console.log(parseObj)
    // 得到除参数外的url地址
    var pathname = parseObj.pathname
    if (pathname === '/') {
        fs.readFile('./views/index.html',function(error,data){
            if (error) {
                return res.end('/404')
            }
            else{
                // 服务端渲染将接受来的数据用template.render()的方法用模版引擎替换
                var data = template.render(data.toString(),{comments})
                res.end(data)
            }
        })
    }
    // 统一处理网页中需要的静态资源
    else if (pathname.indexOf('/public') === 0) {
        // console.log(pathname)
        fs.readFile('.' + pathname,function(error,data){
            if (error) {
                return res.end('/public/404')
            }
            else {
                res.end(data)
            }
        })
    }
    else if (pathname === '/post') {
        fs.readFile('./views/post.html',function(error,data){
            if (error) {
                return res.end('/public/404')
            }
            else {
                res.end(data)
            }
        })
    }
    else if (pathname === '/pinglun') {
        // 通过url对象的.query属性获得url传递参数
        // res.end(JSON.stringify(parseObj.query))
        var comment = parseObj.query
        comment.date = '2019-8-27'
        // 将参数存储到数组中
        comments.unshift( comment)
        // 302页面临时重定向到首页
        // 1.设置状态码302临时重定向（301永久重定向,304没有变化）
        // 2.在响应头中通过location告诉客户端需要重定向的地址
        // 3.如果客户端发现状态码302则会自动去响应头中寻找重定向的地址然后对地址发起新的请求
        res.statusCode = 302
        res.setHeader('Location','/')
        res.end()
    }
    else {
        fs.readFile('./views/error.html',function(error,data){
            if (error) {
                return res.end('404 NOT FOUND')
            }
            else {
                res.end(data)
            }
        })
    }
})

server.listen(3000,function(){
    console.log('server is running...')
})

var comments = [
    {
        name:'zs',
        msg:'今天天气不错',
        date:'2019-8-27'
    },
    {
        name:'ls',
        msg:'好想吃桃子',
        date:'2019-8-27'
    },
    {
        name:'ww',
        msg:'最新的电影看了吗？',
        date:'2019-8-27'
    },
]