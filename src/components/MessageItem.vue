<template>
    <div class="message-item">
        <div class="message-item__header">
            <Avatar :image="message.avatarUrl" shape="circle" size="large" />
            <div class="message-item__name">{{message.displayName}}</div>
            <div class="message-item__time">{{new Date(message.timestamp).toLocaleTimeString()}}</div>
        </div>
        <div class="message-item__content">
            {{message.message}}
        </div>
    </div>
</template>

<script setup lang="ts">

import Avatar from 'primevue/avatar';

</script>

<style lang="scss" scoped>
.message-item {
    display: grid;
    overflow: hidden;
    grid-template-columns: 8%  1fr;
    align-items: center;
    padding: 1%;
    border-radius: 0.5rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    &__header {
        margin-right: 1rem;
    }
    &__content {
        font-size: 1.2rem;
    }
    &__name {
        font-weight: bold;
        margin-right: 0.5rem;
    }
    &__time {
        font-size: 0.8rem;
        color: #999;
    }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { Message } from '@/types/Message';

export default defineComponent({
    name: 'MessageItem',
    props: {
        message: {
            type: Message,
            required: true,
        },
    },
});
</script>