<template>
    <div class="panel">
        <Panel>
            <template #header>
                <div class="header">
                    <h1>Login</h1>
                </div>
            </template>
            <div class="form">
                <InputText v-model="email" placeholder="Email" />
                <Password v-model="password" :feedback="false" placeholder="Password" promptLabel=" " @keyup.enter="signIn"/>
                <small v-if="errorMessage != ''" class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
                <Button @click="signIn" :loading="normalLoad" label="Login"/>
                <Button @click="signInGoogle" :loading="googleLoad" label="Login with Google"/>
                <hr>
                <Button @click="router.push({name:'register'})" label="Register"/>
            </div>
        </Panel>
    </div>
</template>

<script setup lang="ts">
    import { signInWithGoogle, signInWithEmail } from '@/firebase';
    import { getCurrentUser } from 'vuefire';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import Password  from 'primevue/password';
    import Panel from 'primevue/panel';
    import {ref} from 'vue';
    import router from '@/router';
    import { useToast } from "primevue/usetoast";
    const toast = useToast();
    const email = ref('');
    const password = ref('');
    const normalLoad = ref(false);
    const googleLoad = ref(false);
    const errorMessage = ref('');

    const signInGoogle = () => {
        googleLoad.value = true;
        errorMessage.value = '';
        signInWithGoogle().then((result) => {
            if (result.user) {
                router.push({name:'home'});
            }
        }).catch((error) => {
            errorMessage.value = error.message;
        }).finally(() => {
            googleLoad.value = false;
        });
    }

    const signIn = () => {
        normalLoad.value = true;
        errorMessage.value = '';
        signInWithEmail(email.value, password.value)
            .then((result) => {
                if (result.user) {
                    console.log(result.user);
                    router.push({name:'home'});
                    toast.add({
                        severity: "success",
                        summary: "Login successful",
                        detail: "Welcome back!",
                        life: 3000,
                    });
                }
            }).catch((error) => {
                if(error.code === 'auth/user-not-found'){
                    errorMessage.value = 'Wrong email or password';
                }
                else if(error.code === 'auth/invalid-email'){
                    errorMessage.value = 'Wrong email or password';
                }
                else if(error.code === 'auth/wrong-password'){
                    errorMessage.value = 'Wrong email or password';
                }
                else{
                    errorMessage.value = error.message;
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
    hr{
        width: 100%;
    }
</style>