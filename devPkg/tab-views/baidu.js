// 相关问题
const RelateQuestion = () => import(/* webpackChunkName: "baidu-relate-question" */ "../pages/baidu/RelateQuestion.vue");
const Hello = () => import(/* webpackChunkName: "baidu-hello" */ "../pages/baidu/Hello.vue");
const World = () => import(/* webpackChunkName: "world" */ "../pages/baidu/World.vue");

const Views = [
    { name: "BaiduRelateQuestion", component: RelateQuestion },
    { name: "Hello", component: Hello },
    { name: "World", component: World },
];

export default Views;


