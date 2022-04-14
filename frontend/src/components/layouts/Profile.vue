<template>
    <aside>
        <img v-if="user.avatar" v-bind:src="user.avatar" v-on:click="modify" class="avatar" alt="avatar de l'utilisateur" title="Modifier mon profil">
        <img v-else src="../../assets/images/avatar.jpg" v-on:click="modify" class="avatar" alt="avatar de l'utilisateur" title="Modifier mon profil">
        <p>
            {{ user.firstname }}<br>
            {{ user.lastname }}<br>
        </p>
        <button v-on:click="modify" class="btn-profile">Profil</button>
        <button v-on:click="logout" class="btn-logout"><img src="../../assets/images/disconnect.png" alt=""><span>Déconnexion</span></button>
    </aside>
</template>

<script>
import axios from 'axios';
import config from '../../utils/config';

export default {
    name: 'Profile',
    data(){
        return{
            user: {
                firstname: null,
                lastname: null,
                avatar: null
            }
        }
    },
    methods:{
        logout: function(){
            sessionStorage.clear();
            document.location.href = '/login';
        },
        modify: function(){
            document.location.href = '/profile';
        },
        create: function(){
            document.location.href = '/post/create';
        }
    },
    created(){
        const userId = JSON.parse(sessionStorage.userAuth).userId;
        const token = JSON.parse(sessionStorage.userAuth).token;

        axios.get(`${config.urlApi}/api/auth/profile/${userId}`,{
                headers:{'authorization' : `Bearer ${token}`}
            })
            .then(res =>{
               this.user = {...res.data};
            })
            .catch(error=> {
                if(error.response.status > 400){
                    document.location.href = `/error/${error.response.status}`;
                }
            });    
    }    
}
</script>

<style scoped>
    aside{
        width: 95%;
        padding: 20px;
        background-color: #112441;
        font-size: 1.4rem;
        display: flex;
        justify-content: space-between;      
    }

    .avatar{
        width: 40px;
        height: 40px;
        object-fit: cover;
        object-position: 50% 50%;
        overflow: hidden;
        order: 1;
        border-radius: 25px;
    }

    p{
        overflow-wrap: break-word;
    }

    p, .btn-profile, .btn-logout span{
       display: none;
    }

    button{
        font-size: 1.2rem;
        height: 40px;
        border: none;
        border-radius: 5px;
    }

    button:hover{
        background-color: #121312;
        color: #ffffff;
        transition: 400ms;
    }

    .btn-logout{
        width: 40px;
        height: 40px;
        padding: 0;
        background-color: #e15057;
        order: 3;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .btn-logout img{
        width: 30px;
        height: 30px;
    }

    .btn-logout:hover {
        color: #fff;
        background-color: #000000;
        transition: 500ms;
    }

    @media screen and (min-width: 1024px) {
        aside{
            width: 25%;
            padding: 10px;
            flex-direction: column;            
        }

        .avatar{
            width: 100%;
            height: 100%;
            margin-top: 15px;
            order: initial;
        }

        p, .btn-profile, .btn-logout span{
            display:initial;
        }

        button{
            font-size: 1.4rem;
        }
        .btn-logout{
            width: 100%;
            margin-top: 15px;
            background-color: #e15057;
            order: initial;
            display: initial;
        }

        .btn-logout img{
            display: none;
        }
    }
</style>