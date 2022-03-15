import Main from './components/Main';
import Account from './components/Account';
import ModifyProfile from './components/ModifyProfile';
import ErrorPage from './components/ErrorPage';
import View from './components/View';
import CreatePost from './components/CreatePost';
import ModifyPost from './components/ModifyPost';  

export default [
    {path: '/', component: Main},
    {path: '/login', component: Account},
    {path: '/profile',  component: ModifyProfile},
    {path: '/error/:status', component: ErrorPage},
    {path: '/post/view/:id_post', component: View},
    {path: '/post/create', component: CreatePost},
    {path: '/post/modify/:id_post', component: ModifyPost}
];