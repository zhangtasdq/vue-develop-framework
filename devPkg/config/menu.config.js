const Menu = [
    {
        id: "baidu",
        name: "百度工具",
        icon: "iconfont iconbaidu",
        children: [
            {
                id: "BaiduRelateQuestion",
                name: "相关问题",
                data: {
                    component: "BaiduRelateQuestion"
                }
            },
            {
                id: "Hello",
                name: "Hello",
                data: {
                    component: "Hello"
                }
            }
        ]
    },
    {
        id: "World",
        name: "world",
        data: {
            component: "World"
        }
    }
];

export default Menu;