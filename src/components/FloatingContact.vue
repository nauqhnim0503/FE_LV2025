<template>
  <div class="floating-contact">
    <!-- Facebook button (mở trang) -->
    <v-btn
      icon
      color="blue darken-3"
      class="mb-2"
      :class="{ shake: shouldShake }"
      @click="openFacebook"
    >
      <v-icon>mdi-facebook</v-icon>
    </v-btn>

    <!-- Zalo button -->
    <v-btn
      icon
      color="white"
      class="mb-2"
      :class="{ shake: shouldShake }"
      @click="toggleZaloChat"
    >
      <v-img
        src="@/assets/zalo.png"
        alt="Zalo"
        width="40"
        height="40"
        cover
      />
    </v-btn>

    <!-- Phone button -->
    <v-btn
      icon
      color="red darken-1"
      class="mb-2"
      :class="{ shake: shouldShake }"
      @click="callPhone"
    >
      <v-icon>mdi-phone</v-icon>
      <v-tooltip activator="parent" location="left">
        <span>0909 123 456</span>
      </v-tooltip>
    </v-btn>

    <!-- Zalo chat popup -->
    <div
      v-if="showZaloChat"
      class="chat-popup"
      @click.self="toggleZaloChat"
    >
      <iframe
        src="https://zalo.me/2367277342345316999"
        frameborder="0"
        allowfullscreen
        class="chat-iframe"
      ></iframe>
      <button class="close-btn" @click="toggleZaloChat">✖</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const shouldShake = ref(true)
const showZaloChat = ref(false)

onMounted(() => {
  setTimeout(() => {
    shouldShake.value = false
  }, 5000)
})

const openFacebook = () => {
  window.open('https://www.facebook.com/DHCNSG', '_blank') // 🔁 sửa lại đường dẫn fanpage của bạn
}

const toggleZaloChat = () => {
  showZaloChat.value = !showZaloChat.value
}

const callPhone = () => {
  window.open('tel:0332661819')
}
</script>
<style scoped>
.floating-contact {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInUp 0.8s ease-out;
}

/* Hover hiệu ứng zoom */
.v-btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.v-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Hiệu ứng fade-in */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 🔁 Hiệu ứng rung rung */
.shake {
  animation: shakeAnim 1.5s infinite ease-in-out;
}

@keyframes shakeAnim {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-3px);
  }
  40% {
    transform: translateX(3px);
  }
  60% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
}

/* Zalo chat popup */
.chat-popup {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  height: 450px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
  z-index: 10000;
}

.chat-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.close-btn {
  position: absolute;
  top: 4px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
  z-index: 10001;
}
</style>
