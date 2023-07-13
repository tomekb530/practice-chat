<template>
  <div class="home">
    <MegaMenu class="topbar">
      <template #start>
          SuperChat
          <ChannelSwitcher :selectedChannel="channelSettings" :items="channelList"/>
      </template>
      <template #end>
        <span>Current user: {{ user?.displayName }}</span> <LogoutButton/>
      </template>
    </MegaMenu>
    <div class="messages" ref="messages">
      <MessageItem v-for="message in messagesData" :key="message.id" :message="message"/>
    </div>
    <div class="input">
      <TextEdit @enter="sendMessage"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .home{
    display: flex;
    flex-direction: column;
    height: 100%;
    .topbar{
      flex: 0 1 auto;
    }
    .messages{
      padding-bottom: 2rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
      max-height: 80%;
      flex: 1 1 auto;
      overflow-x: hidden;
      overflow-y: auto;
      :nth-child(odd of .message-item){
        background-color: #ffffff10;
      }
      :nth-child(even of .message-item){
        background-color: #ffffff20;
      }
    }

    .input{
      flex: 0 1 1rem;
      width: 100%;
    }
  }
</style>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useCurrentUser } from 'vuefire';
  import LogoutButton from '@/components/LogoutButton.vue';
  import MegaMenu from 'primevue/megamenu';
  import MessageItem from '@/components/MessageItem.vue';  
  import TextEdit from '@/components/TextEdit.vue';
  import { sendMessageData, getMessagesDataRealtime, getChannelSettings, getAllChannels } from '@/firebase';
  import ChannelSwitcher from '@/components/ChannelSwitcher.vue';
  import { MenuItem } from 'primevue/menuitem';
  import { Message } from '@/types/Message';
  const user = ref(useCurrentUser());
  const messages = ref();
  const messagesData = ref();
  const channel = ref(1);
  const channelSettings = ref();
  const channelList = ref([] as MenuItem[]);
  onMounted(() => {
    getData();
  });

  const sendMessage = (message: string) => {
    if(message.trim() === ''){
      return;
    }
    if(message.length > 1000){
      message = message.substring(0, 1000);
    }
    sendMessageData(message, channel.value);
  }

  const getData = () => {
    getChannelSettings(channel.value).then((data : any) => {
      channelSettings.value = data.data();
    });
    getAllChannels().then((data : any) => {
      channelList.value = [];
      data.forEach((doc : any) => {
        channelList.value.push({
          label: doc.data().name,
          command: () => {
            channel.value = doc.id;
            getData();
          }
        });
      });
    });
    getMessagesDataRealtime(channel.value, (data : any) => {
      messagesData.value = [];
      data.forEach((doc : any) => {
        var message = doc.data();
        var newMessage = new Message(message.message, message.user, message.displayName, message.timestamp, message.avatarUrl);
        messagesData.value.push(newMessage);
      });
      setTimeout(() => {
        if(messages.value){
          messages.value.scrollTop = messages.value.scrollHeight;
        }
      }, 100);
    });
  }
</script>
