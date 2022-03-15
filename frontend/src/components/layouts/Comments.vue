<template>
    <div class="comments" >
        <h3>Commentaires</h3>

        <p v-if="comments.length == 0">Cette publication n'a aucun commentaire.</p>
        <div v-else v-bind:key="index" v-for="(comment, index) in comments" class="comments_div">
            <div class="option">
                <button class="btn-del btn-del--mini" title="Supprimer mon commentaire"
                    v-if="comment.id_user == userId"
                    v-on:click="deleteComment(comment.id_comment)"
                ><img src="../../assets/images/delete.png" alt="Supprimer le commentaire"><span class="btn-del--big">Supprimer</span></button>
                <button class="btn-del btn-del--modo"
                    v-if="moderator" 
                    v-on:click="moderateComment(comment.id_comment)"
                ><img src="../../assets/images/moderate.png" alt="Modérer le commentaire"><span class="btn-del--mm">Modérer</span></button>
            </div>
            <div class="author">
                <img v-if="comment.User.avatar" v-bind:src="comment.User.avatar" class="author__avatar" alt="avatar de l'utilisateur">
                <img v-else src="../../assets/images/avatar.jpg" class="author__avatar" alt="avatar de l'utilisateur">
                <div class="author__comment">
                    <p>{{ comment.User.firstname }} {{ comment.User.lastname }}</p>
                    <p class="author__date">{{ formatDate(comment.createdAt, comment.updatedAt) }}</p>
                </div>
            </div> 
            <p class="author__comment_text">{{ comment.comment }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import config from '../../utils/config';

export default {
    name: 'Comments',
    data(){
        return{
            comments: [],
            userId: null
        }
    },
    props: ['id_post', 'moderator'],
    methods:{
        formatDate(createdDate, updatedate){
            const dateISO = new Date(updatedate)
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric', second:'numeric' };
            let date = dateISO.toLocaleDateString('fr-FR', options);
            
            if(createdDate == updatedate){
                return `Publié le ${date}`;
            }else return `Modifié le ${date}`;
        },
        deleteComment(id_comment){
            const token = JSON.parse(sessionStorage.userAuth).token;
            const vm = this;
            
            axios.delete(`${config.urlApi}/api/comments/${id_comment}`,{
                headers:{'authorization' : `Bearer ${token}`}
            })
            .then(()=>vm.$emit('reload'))
            .catch(error=> {
                if(error.response.status > 400){
                    document.location.href = `/error/${error.response.status}`;
                }
            });
        },
        moderateComment(id_comment){
            const token = JSON.parse(sessionStorage.userAuth).token;
            const vm = this;

            axios.post(`${config.urlApi}/api/comments/${id_comment}/moderate`,
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
    created(){
        const token = JSON.parse(sessionStorage.userAuth).token;
        this.userId = JSON.parse(sessionStorage.userAuth).userId;

        axios.get(`${config.urlApi}/api/comments/post/${this.id_post}`,{
                headers:{'authorization' : `Bearer ${token}`}
            })
            .then(res =>{
               this.comments = res.data;
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
    h3{
        font-size: 1.4rem;
        margin-top: 15px;
        padding-bottom: 15px;
    }
    
    .comments_div{
        position: relative;
        margin-bottom: 5px;
        padding: 5px;
    }

    .comments_div p{
        margin: 0px;
        overflow-wrap: break-word;
    }
    .author{
        margin-bottom: 1rem;
    }
    .author__comment{
        margin-left: 10px;
    }
    .author__comment_text{
        padding-bottom: 2rem; 
    }
    .author__date{
        font-size: 0.8rem;
    }
    
    .option{
        position: absolute;
        top: 5px;
        right: 5px;
    }

    .btn-del{
        border:none;
        border-radius: 5px;
        background-color: #ffffff;
        margin-right: 5px;
    }

    .btn-del:hover{
        color: #fff;
        background-color: #000000;
        transition: 400ms;
    }
    .btn-del--modo img{
        width: 20px;
        height: 20px;
    }
    .btn-del--mini img{
        width: 20px;
        height: 20px;
    }

    .btn-del--big{
        display: none;
    }
    
    .btn-del--mm{
        display: none;
    }

    @media screen and (min-width: 1024px) {
        .btn-del{
            font-size: 1rem;
            padding: 5px 10px;
        }

        .btn-del--mini img{
            display: none;
        }

        .btn-del--big{
            display: initial;
        }
        .btn-del--modo img{
            display: none;
        }
        .btn-del--mm{
            display: initial;
        }
        
    }
    @media screen and (max-width: 1024px){
         .option{
            margin-top: 100px;
        }
    }
</style>