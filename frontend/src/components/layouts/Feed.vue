<template v-bind:key="reload">
    <section>
        <button class="btn-publish" v-on:click="create">Ecrivez votre message</button>
        <article v-if="posts.length == 0">
            <p>Aucune publication à afficher pour le moment.</p>
        </article>
        <article v-else v-bind:key="index" v-for="(post, index) in posts">
            <div class="option" v-if="post.User.id_user == userId || moderator">
                <router-link v-if="post.User.id_user == userId" v-bind:to="`/post/modify/${post.id_post}`" class="btn-modify">Éditer</router-link>
                <button v-if="post.User.id_user == userId" class="btn-delpost" v-on:click="modalDelete(post.id_post)">Supprimer</button>
                <button v-if="moderator" class="btn-delpost" v-on:click="moderatePost(post.id_post)">Modérer</button>
            </div>
            <div class="author">
                <img v-if="post.User.avatar" v-bind:src="post.User.avatar" class="author__avatar" alt="avatar de l'utilisateur">
                <img v-else src="../../assets/images/avatar.jpg" class="author__avatar" alt="avatar de l'utilisateur">
                <div class="author__text">
                    <p>{{ post.User.firstname }} {{ post.User.lastname }}</p>
                    <p class="author__date">{{ formatDate(post.createdAt, post.updatedAt) }}</p>
                </div>
            </div>
            
            <router-link v-bind:to="`/post/view/${post.id_post}`">
                <div v-if="post.image_url" class="article__media">
                    <h2 class="article__title" v-if="post.title.length >= 0" >{{ post.title }}</h2>

                    <div class="article__img">
                        <img v-bind:src="post.image_url" v-bind:alt="post.title"> 
                    </div>
                </div>
                <div v-else class="article__content">
                    <h2 class="article__title">{{ post.title }}</h2>
                </div>
            </router-link>
            <likedislikecomment v-bind:id_post="post.id_post" v-bind:moderator="moderator"></likedislikecomment>           
        </article>
        <modaldeletepost v-if="modal" v-on:delete="deletePost(deleteidpost)" v-on:close="modal=false"></modaldeletepost>   
    </section>
</template>

<script>
import axios from 'axios';
import config from '../../utils/config';
import LikeDislikeComment from '../layouts/LikeDislikeComment.vue';
import ModalDeletePost from './ModalDeletePost.vue';

export default {
    name: 'Feed',
    data(){
        return{
            posts: [],
            userId: null,
            modal:false,
            deleteidpost: null
        }
    },
    props: ['moderator'],
    methods:{
        formatDate(createdDate, updatedate){
            const dateISO = new Date(updatedate)
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric', second:'numeric' };
            let date = dateISO.toLocaleDateString('fr-FR', options);
            
            if(createdDate == updatedate){
                return `Publié le ${date}`;
            }else return `Modifié le ${date}`;
        },
        modalDelete(id_post){
            this.deleteidpost = id_post;
            this.modal = true;
        },
            create: function(){
            document.location.href = '/post/create';
        },
        deletePost(id_post){
            const token = JSON.parse(sessionStorage.userAuth).token;
            const vm = this;

            axios.delete(`${config.urlApi}/api/posts/${id_post}`,{
                headers:{'authorization' : `Bearer ${token}`}
            })
            .then(()=> vm.$emit('reload'))
            .catch(error=> {
                if(error.response.status > 400){
                    document.location.href = `/error/${error.response.status}`;
                }
            });
        },
        moderatePost(id_post){
            const token = JSON.parse(sessionStorage.userAuth).token;
            const vm = this;

            axios.post(`${config.urlApi}/api/posts/${id_post}/moderate`,
                JSON.stringify({ moderate: true }),
                {
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization' : `Bearer ${token}`
                    }                     
                })
                .then(()=> vm.$emit('reload'))
                .catch(error=> {
                    if(error.response.status > 400){
                        document.location.href = `/error/${error.response.status}`;
                    }
                });
        }
    },
    components: {
        'likedislikecomment' : LikeDislikeComment,
        'modaldeletepost' : ModalDeletePost      
    },
    created(){
        const token = JSON.parse(sessionStorage.userAuth).token;
        this.userId = JSON.parse(sessionStorage.userAuth).userId;

        axios.get(`${config.urlApi}/api/posts`,{
                headers:{'authorization' : `Bearer ${token}`}
            })
            .then(res =>{
               this.posts = res.data;
            })
            .catch(error=> {
               if(error.response.status > 400){
                    document.location.href = `/error/${error.response.status}`;
                }
            });    
    }
}
</script>

<style>
    section{
        width: 95%;
        margin-top: 20px;
    }
    a:hover{
        text-decoration: none;
    }
    article{
        width: 100%;
        background-color: #081961;
        margin-bottom: 15px;
        padding: 50px;
        box-shadow: 10px;
    }
    .option{
        display: flex;
        justify-content: flex-end;
    }

    .author{
        display: flex;
        margin-top: -25px;
    }

    .author__avatar{
        width: 40px;
        height: 40px;
        object-fit: cover;
        object-position: 50% 50%;
        overflow: hidden;
        border-radius: 5px;
    }

    .author__text{
        margin-left: 5px;
        flex: 1;
        font-size: 1.2rem;
        overflow-wrap: break-word;
    }

    .author__text p{
        margin: 0;
    }
    
    .author__date{
        font-size: 1rem
    }

    .article__title{
        margin: 0;
        font-weight: normal;
        overflow-wrap: break-word; 
    }

    .article__img{
        text-align: center;
        margin-top: 5px;
    }

    .article__img img{
        max-width: 100%;
        max-height: 350px;
        margin: auto;
    }
    .article__content{
        margin-top: 1.5em;
        margin-bottom: 1.5em;
    }
    .article__media{
        margin-bottom: 1.5em;
        margin-top: 1em;
    }

    .btn-publish{
        font-size: 1.2rem;
        height: 40px;
        border: none;
        border-radius: 5px;
        padding: 0 20px;
        color: #ffffff;
        background-color: #e15057;
        margin-bottom: 10px;
    }
    button:hover{
        background-color: #000000;
        transition: 400ms;
        color: #ffffff;
    }
    .btn-modify, .btn-delpost{
        padding: 5px;
        border-radius: 5px;
        background-color: #ffffff;
        color: #000000;
        z-index: 0;   
    }
    .btn-modify:hover{
        background-color: #000000;
        color: #ffffff;
        transition: 400ms;
        text-decoration: none;
    }
    .btn-delpost{
        border: hidden;
        margin-left: 5px;
        font-size: 1rem;
        background-color: #ffffff;
    }
    
    @media screen and (min-width: 1024px) {
        section{
            width: 67%;
            margin-top: 0px
        }
        
        .author__text{
            font-size: 1.4rem;
        }

        .btn-modify, .btn-delpost{
            width: 15%;
            text-align: center;
        }
       
    }
    @media screen and (max-width: 1024px){
         .author{
            margin-top: 40px;
        }
         .btn-modify:hover{
        background-color: #000000;
        color: #ffffff;
        transition: 400ms;
        text-decoration: none;
        }
        .btn-delpost:hover{
        color: #ffffff;
        background-color: #000000;
        transition: 500ms;
    }
    }

</style>