<template>
    <div v-if="session">
        <profile></profile> 
        <section>
            <h2>Rédigez votre publication (Texte et image, ou simplement texte ou image seuls.)</h2>

            <p class="success" v-if="message">{{ message }}<br>Redirection automatique vers le feed.</p>
            <form v-on:submit="createPost" v-else>
                <span class="success" v-if="message">{{ message }}</span>
                <span class="error" v-if="error.global">{{ error.global }}</span>
                
                <label for="title">Votre message : <i>( {{ count }}/140 caractères )</i> : <span class="error" v-if="error.title">{{ error.title }}</span></label>
                <textarea type="text" name="title" class="text__post" maxlength="140"
                    v-model="formData.title"
                    v-on:keyup="validText(formData.title)"
                    v-bind:class="{valid: valid.title}"
                ></textarea>
                <p class="img__msg">Ajoutez une image si vous le souhaitez</p>
                <input type="file" class="v" accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" ref="file" v-on:change="upload()">
                <input type="submit" value="Publier" class="btnSubmit" v-bind:disabled="btnDisabled">
            </form>
        </section>
    </div>
</template>

<script>
import Profile from './layouts/Profile.vue';
import axios from 'axios';
import config from '../utils/config';

export default {
    name: 'CreatePost',
    data(){
        return{
            session: false,
            message: null,
            formData: {
                title: null,
                file: null
            },
            error: {
                global: null,
                title: null
            },
            valid:{
                title: false
            },
            count: 0
        }
    },
    computed: {
      btnDisabled(){
            if(this.valid.title === true || this.formData.file != null){
                return false;
            }
            else return true;
        }
    },
    components: {
        'profile': Profile
    },
    methods:{
        validText(text){
            this.count = text.length;
            if(text != '' && text[0] != ' ' && text.length <= 140){
                this.valid.title = true;
                this.error.title = null;
                return true;
            }else{
                this.valid.title = false;
                if(text.length > 140){this.error.title = 'Longueur du champ dépassée !';}
                else this.error.title = 'Champ invalide !';
                return false;
            }
        },
        upload(){
            this.formData.file = this.$refs.file.files[0];
        },
        createPost(e){
            e.preventDefault();
            const userId = JSON.parse(sessionStorage.userAuth).userId;
            const token = JSON.parse(sessionStorage.userAuth).token;
            const vm = this;
            
            let fileEmpty = !this.formData.file
            let textEmpty = (!this.formData.title || this.formData.title == '')

            this.message = null;
            this.error.global = null;
            this.error.title = null;
           

            if(textEmpty || fileEmpty){ 
                // Pour pouvoir valider une photo toute seule ou une image toute seule + Eviter le retour null en front si photo postée seule 
                if(textEmpty && fileEmpty)
                    this.error.global = 'Vous devez entrer un titre ou joindre un fichier !';
                else if(fileEmpty)
                    this.validText(this.formData.title)
                else if(textEmpty)
                    this.formData.title = "" // message vide pour bdd
            }
            
            if(!this.error.firstname && !this.error.lastname){
                let data = new FormData();
                data.append('image', this.formData.file);
                data.append('title', this.formData.title);
                data.append('id_user', userId);
                
                axios.post(`${config.urlApi}/api/posts`, data,
                    {                       
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'multipart/form-data',
                            'authorization' : `Bearer ${token}`
                        }                                     
                    })
                    .then(function(res){
                        vm.message = res.data.message;
                        vm.formData.title = null;
                        vm.formData.file = null;  
                        vm.valid.title = false;
                        setTimeout(()=>{
                            document.location.href = `/`;
                        }, 1000)                
                    })
                    .catch(function(error){
                        let errormessage = error.response.data.error;
                        vm.error.global = errormessage;
                    });
            }
        }
    },
    created(){
        if(!sessionStorage.userAuth){
            document.location.href = '/login';
        }else this.session = true;
    }
}
</script>

<style scoped>
    div{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    section{
        background-color: #081961;
        padding: 5px;
    }

    h2{
        margin-top: 10px;
        margin-bottom: 10px;
    }

    form{
        display: flex;
        flex-direction: column;
        line-height: 40px;
        font-size: 1.2rem;
    }

    input{
        height: 30px;
        font-size: 1.2rem;
        margin-bottom: 10px;    
    }
    .text__post{
        resize: none;
        font-size: 1.3em;
        height: 100px;
    }

    .btnSubmit{
        margin-top: 20px;
        height: 40px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .btnSubmit:hover:not(:disabled){
        background-color: #000000;
        color: #ffffff;
        transition: 400ms;
    }

    .btnSubmit:disabled{
        cursor: not-allowed;
    }

    .success{
        color: #78f589;
        font-size: 1.2rem;
    }

    .error{
        color: #e90c22;
    }
    
    @media screen and (min-width: 1024px) {
        div{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: flex-start;
        }
    }
</style>