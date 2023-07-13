<template>
    <Button @click="logOut">Log-out</Button>
</template>



<script setup lang="ts">
import { signOut } from '@/firebase';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const logOut = () => {
    signOut();
    router.push({ name: 'login' });
    toast.add({
        severity: 'success',
        summary: 'Logout successful',
        detail: 'See you soon!',
        life: 3000,
    });
}

</script>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import router from '@/router';


export default defineComponent({
    name: 'LogoutButton',
    components: {
        Button,
    },
});
</script>