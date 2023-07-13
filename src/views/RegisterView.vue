<template>
    <div class="panel">
        <Panel>
            <template #header>
                <div class="header">
                    <h1>Register</h1>
                </div>
            </template>
            <div class="form">
                <InputText v-model="name" placeholder="Name" :class="{ 'p-invalid' : nameErrorMessage}"/>
                <small v-if="nameErrorMessage != ''" class="p-error" id="text-error">{{ nameErrorMessage || '&nbsp;' }}</small>
                <InputText v-model="email" placeholder="Email" :class="{ 'p-invalid' : emailErrorMessage}"/>
                <small v-if="emailErrorMessage != ''" class="p-error" id="text-error">{{ emailErrorMessage || '&nbsp;' }}</small>
                <Password v-model="password" :feedback="false" placeholder="Password" promptLabel=" " :class="{ 'p-invalid' : passErrorMessage}"/>
                <Password v-model="passwordRepeat" :feedback="false" placeholder="Repeat Password" promptLabel=" " :class="{ 'p-invalid' : passErrorMessage}" @keyup.enter="register"/>
                <small v-if="passErrorMessage != ''" class="p-error" id="text-error">{{ passErrorMessage || '&nbsp;' }}</small>
                <Button @click="register" :loading="normalLoad" label="Register"/>
                <small v-if="globalErrorMessage != ''" class="p-error" id="text-error">{{ globalErrorMessage || '&nbsp;' }}</small>
                <hr>
                <Button @click="router.push({name:'login'})" label="Login"/>
            </div>
        </Panel>
    </div>
</template>

<script setup lang="ts">
    import { createUserWithEmail, setDisplayName } from '@/firebase';
    import { getCurrentUser } from 'vuefire';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import Password  from 'primevue/password';
    import Panel from 'primevue/panel';
    import {ref} from 'vue';
    import router from '@/router';
    const email = ref('');
    const password = ref('');
    const passwordRepeat = ref('');
    const normalLoad = ref(false);
    const emailErrorMessage = ref('');
    const passErrorMessage = ref('');
    const nameErrorMessage = ref('');
    const globalErrorMessage = ref('');
    const name = ref('');
    const register = () => {
        globalErrorMessage.value = '';
        nameErrorMessage.value = '';
        passErrorMessage.value = '';
        emailErrorMessage.value = '';
        email.value = email.value.trim();
        name.value = name.value.trim();
        
        if(!name.value){
            nameErrorMessage.value = 'Name cannot be empty';
            return;
        }

        if(!email.value){
            emailErrorMessage.value = 'Email cannot be empty';
            return;
        }

        if(password.value !== passwordRepeat.value){
            passErrorMessage.value = 'Passwords do not match';
            return;
        }

        if(password.value.length < 6){
            passErrorMessage.value = 'Password must be at least 6 characters long';
            return;
        }

        normalLoad.value = true;
        createUserWithEmail(email.value, password.value)
            .then((result) => {
                if (result.user) {
                    console.log(result.user);
                    setDisplayName(name.value)?.then(() => {
                        router.push({name:'home'});
                    });
                }
            }).catch((error) => {
                if(error.code === 'auth/email-already-in-use'){
                    emailErrorMessage.value = 'Email already in use';
                }
                else{
                    globalErrorMessage.value = error.message;
                }
            }).finally(() => {
                normalLoad.value = false;
            });
    }
</script>

<script lang="ts">
export default {
    
}
</script>


<style scoped lang="scss">
    .panel{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .form{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        row-gap: 1rem;
    }
    .header{
        text-align: center;
        width: 100%;
    }
    a{
        font-size: small;
    }
    hr{
        width: 100%;
    }
</style>