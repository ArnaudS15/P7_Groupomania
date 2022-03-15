<template>
    <div>
        <div class="likedislikecomment">
            <button class="btn-rate btn-rate--like"
                v-bind:class="{likeactive: userlike}"
                v-bind:disabled=userdislike
                v-on:click="reactLike"
            >
                Like<span v-if="like != 0"> {{ like }}</span>
            </button>
            <button class="btn-rate btn-rate--dislike"
                v-bind:class="{dislikeactive: userdislike}"
                v-bind:disabled=userlike
                v-on:click="reactDislike"
            >
                Dislike<span v-if="dislike != 0"> {{ dislike }}</span>
            </button>
            <button class="btn-comment" title="Je veux commenter !"
                v-on:click="toggle = !toggle">
                <span v-if="comment < 1">Commentaire {{ comment }}</span>
                <span v-else>Commentaires {{ comment }}</span>
            </button>
        </div>
        <form class="postcom" v-if="toggle || postcom" v-on:submit="createComment">
            <span class="success" v-if="formData.message">{{ formData.message }}</span>
            <span class="error" v-if="formData.error">{{ formData.error }}</span>
            <label for="comment">Publier un commentaire <i>( {{ formData.count }}/140 caractères )</i> :</label>
            <textarea name="comment" type="text" maxlength="140"
                v-model="formData.comment"
                v-on:keyup="validText(formData.comment)"
            ></textarea>
            <input type="submit" value="Envoyer" class="btn-submit" v-bind:disabled=btnDisabled>
        </form>
        <comments v-if="toggle || postcom" v-bind:id_post="id_post" v-bind:key="comment" v-bind:moderator="moderator" v-on:reload="comment--"></comments>
    </div> 
</template>

<script>
import axios from 'axios';
import config from '../../utils/config';
import Comments from './Comments.vue';

export default {
    name: 'LikeDislikeComment',
    data(){
        return{
            like: 0,
            userlike: false,
            dislike: 0,
            userdislike: false,
            comment: 0,
            userId: null,
            toggle: false,
            formData:{
                comment: null,
                error: null,
                valid: false,
                message: null,
                count: 0
            }
        }
    },
    computed: {
        btnDisabled(){
            if(this.formData.valid){
                return false;
            }else return true;
        }
    },
    props: ['id_post', 'postcom', 'moderator'],
    components: {
        'comments' : Comments     
    },
    methods:{
        reactLike(){
            let reaction = 0;
            this.userlike = !this.userlike;
            if(this.userlike){
                this.like ++;
                reaction = 1;
            }else this.like --;
            this.reaction(reaction);
        },
        reactDislike(){
            let reaction = 0;
            this.userdislike = !this.userdislike;
            if(this.userdislike){
                this.dislike ++;
                reaction = -1;
            }else this.dislike --;
            this.reaction(reaction);
        },
        reaction(like){
            const token = JSON.parse(sessionStorage.userAuth).token;

            axios({
                url: `${config.urlApi}/api/posts/${this.id_post}/like`,
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization' : `Bearer ${token}`
                },
                data: JSON.stringify({
                    id_user: this.userId,
                    like: like
                }) 
            })
            .then()
            .catch(error=> {
                if(error.response.status > 400){
                    document.location.href = `/error/${error.response.status}`;
                }
            });
        },
        validText(text){
            this.formData.count = text.length;
            if(text!= '' && text[0] != ' ' && text.length <= 140){
                this.formData.valid = true;
                this.formData.error = null;
                return true;
            }else{
                this.formData.valid = false;
                if(text.length > 500){this.formData.error = 'Longueur du champ dépassée !';}
                else this.formData.error = 'Champ invalide !';
                return false;
            }
        },
        createComment(e){
            e.preventDefault();
            const userId = JSON.parse(sessionStorage.userAuth).userId;
            const token = JSON.parse(sessionStorage.userAuth).token;
            const vm = this;
            this.formData.message = null;
            this.formData.error = null;

            if(!this.formData.comment){
                this.formData.error = "Vous n'avez pas entré de commentaires !";
            }else this.validText(this.formData.comment);

            if(!this.formData.error){
                axios({
                        url: `${config.urlApi}/api/comments/post/${this.id_post}`,
                        method: 'POST',
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'authorization' : `Bearer ${token}`
                        },
                        data: JSON.stringify({
                            id_user: userId,
                            comment: this.formData.comment
                        })                                                              
                    })
                    .then(function(res){
                        vm.formData.message = res.data.message;
                        vm.formData.comment = null;
                        vm.formData.valid = false;
                        vm.formData.count = 0;
                        vm.comment++;                                     
                    })
                    .catch(function(error){
                        let errormessage = error.response.data.error;
                        vm.formData.error = errormessage;
                    });
            }
        }
    },
    created(){
        this.userId = JSON.parse(sessionStorage.userAuth).userId;
        const token = JSON.parse(sessionStorage.userAuth).token;
        const vm = this;
        
        //Maj compteur likes
        axios({
                url: `${config.urlApi}/api/count/like`,
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization' : `Bearer ${token}`
                },
                data: JSON.stringify({
                    id_post: this.id_post,
                    id_user: this.userId
                }) 
            })
            .then(res =>{
                vm.like = res.data.like;
                vm.userlike = res.data.userlike;
            })
            .catch(error=> {
                if(error.response.status > 400){
                    document.location.href = `/error/${error.response.status}`;
                }
            });

        //Maj Compteur dislikes
        axios({
                url: `${config.urlApi}/api/count/dislike`,
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization' : `Bearer ${token}`
                },
                data: JSON.stringify({
                    id_post: this.id_post,
                    id_user: this.userId
                }) 
            })
            .then(res =>{
                vm.dislike = res.data.dislike;
                vm.userdislike = res.data.userdislike;
            })
            .catch(error=> {
                if(error.response.status > 400){
                    document.location.href = `/error/${error.response.status}`;
                }
            });

        //Maj nombre commentaires
        axios({
                url: `${config.urlApi}/api/count/comment`,
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization' : `Bearer ${token}`
                },
                data: JSON.stringify({
                    id_post: this.id_post,
                    id_user: this.userId
                }) 
            })
            .then(res =>{
                vm.comment = res.data.comment;
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
    .likedislikecomment{
        
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 5px;
    }

    .likedislikecomment button, .btn-submit{
        line-height: 25px;
        font-size: 1rem;
        border: none;
        border-radius: 5px;   
    }

    .btn-rate{
        width: 45%;
    }
    
    .btn-comment{
        margin-top: 10px;
        width: 100%;
    }

    .btn-comment:hover, .btn-submit:hover:not(:disabled){
        background-color: #000;
        color: #fff;
        transition: 400ms;
    }
    
    .btn-rate--like{
        background-color: #ffffff;
        color: #000000;
        outline: solid 1px #a3ebc5;
    }

    .btn-rate--like:hover:not(:disabled){
        background-color: #16d198;
        color: #fff;
        transition: 400ms;
    }

    .btn-rate--dislike{
        background-color: #ffffff;
        color: #000000;
        outline: solid 1px #ef6262;
    }

    .btn-rate--dislike:hover:not(:disabled){
        background-color: #ef4558;
        color: #fff;
        transition: 400ms;
    }

    .likeactive{
        background-color: #23dc3d;
        color: #ffffff;
    }

    .dislikeactive{
        background-color: #ef6262;
        color: #ffffff;
    }

    button:disabled{
        cursor: not-allowed;
    }

    .postcom{
        margin-top: 15px;
        display: flex;
        flex-direction: column
    }

    textarea{
        font-family: Helvetica, Arial, sans-serif;
        font-size: 1.1rem;
        margin-bottom: 10px;
        resize: none;    
    }

    .btn-submit{
        height: 30px;
        cursor: pointer;
    }

    .btn-submit:disabled{
        cursor: not-allowed;
    }

    .success{
        color: #78f589;
        font-size: 1.1rem;
    }

    .error{
        color: #db162a;
    }

    @media screen and (min-width: 1024px) {
        .reaction{
            height: 30px;
        }

        .btn-rate, .btn-comment{
            width: 30%;
            font-size: 1.2rem;
            margin-top: 0px
        }
    }
</style>