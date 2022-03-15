<template>
    <footer>
        <p>
            <a href="#">Groupomania</a>
            <a href="#">Politique de confidentialité</a>
            <a href="mailto:admin@groupomania.com">Contactez-nous</a>
        </p>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style scoped>
    footer{
        width: 100%;
        background-color: #081961;
        margin-top: 30px;
    }

    p{
        padding: 10px;
        margin: auto;
        display: flex;
        flex-direction: column;
    }

    a{
        width: 90%;
        text-align: center;
        margin: auto;   
    }

    a:nth-child(2){
        padding: 5px;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    @media screen and (min-width: 780px) {
        p{
            padding: 20px;
            max-width: 1200px;
            flex-direction: row;
            justify-content: space-around;    
        }

        a{
            width: 30%;  
        }

        a:nth-child(2){
            margin:0;
            border: none;
        }
    }
</style>