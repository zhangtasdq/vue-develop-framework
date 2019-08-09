const Dashboard = () => import(/* webpackChunkName: "dashboard-view" */"../pages/home/Dashboard.vue");

const routes = [
    { path: "/", redirect: "/dashboard" },
    { path: "/dashboard", name: "Dashboard", component: Dashboard }
];

export default routes;
