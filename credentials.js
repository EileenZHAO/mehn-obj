module.exports = {
    cookieSecret: '把你的cookie 秘钥放在这里',
    QQMail: {
        user: '1053496681@qq.com',
        // 进入QQ邮箱，->设置 -> 账户 -> pop3/ -> 启用第一个pop3/SMTP：简单邮件传输协议（simple mail transport protocol）
        password:'mngknbwvlcdabbbj',
    },           
    mongo: {
        
        development: {
            connectionString: 'mongodb://root:12345abc@localhost:27017/admin',
        },
        production: {
            connectionString: 'mongodb://root:12345abc@localhost:27017/admin',
        },
    },
};