<template>
  <v-container fluid>
    <h2 class="mb-4 font-weight-bold">🎬 Reels sản phẩm</h2>

    <v-slide-group v-model="current" show-arrows center-active class="reel-slider">
      <v-slide-item
        v-for="(reel, index) in reels"
        :key="reel.id"
        class="reel-slide">
        <v-card
          width="180"
          height="280"
          class="pa-2 d-flex flex-column align-center justify-space-between fade-in-up card-hover"
          :style="{ animationDelay: `${index * 100}ms` }">
          <video
            :src="getVideoUrl(reel.video_url)"
            controls
            height="200"
            width="160"
            style="object-fit: cover; border-radius: 12px; cursor: pointer"
            @click.prevent="handleVideoClick($event, reel)"></video>

          <div class="mt-2 text-center" style="width: 100%">
            <h3 class="text-subtitle-1 font-weight-medium text-truncate" style="max-width: 160px">
              {{ reel.title }}
            </h3>
            <v-btn
              color="primary"
              size="small"
              class="mt-1 animated-btn"
              @click="goToProduct(reel.product_id)">
              Xem sản phẩm
            </v-btn>
          </div>
        </v-card>
      </v-slide-item>
    </v-slide-group>

    <!-- Dialog hiển thị video giữa màn hình -->
    <v-dialog v-model="dialog" max-width="450">
      <v-card class="pa-4 rounded-lg" style="background-color: black; color: white; position: relative;">
        <video
          v-if="selectedReel"
          :src="getVideoUrl(selectedReel.video_url)"
          controls
          autoplay
          style="width: 100%; border-radius: 12px"
        ></video>
        <div class="mt-4 text-center" v-if="selectedReel">
          <h3 class="text-h6">{{ selectedReel.title }}</h3>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const reels = ref([])
const current = ref(0)
const router = useRouter()
const dialog = ref(false)
const selectedReel = ref(null)

const handleVideoClick = (event, reel) => {
  event.preventDefault()

  // Dừng tất cả video ngoại trừ video trong dialog
  const videos = document.querySelectorAll('video')
  videos.forEach(video => {
    video.pause()
    video.currentTime = 0
  })

  // Delay mở dialog để đảm bảo video bên ngoài đã dừng
  requestAnimationFrame(() => {
    selectedReel.value = reel
    dialog.value = true
  })
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/reels');
    reels.value = res.data.map(item => ({
      ...item,
      video_url: item.video_url.replace(/\\/g, '/')
    }))
  } catch (err) {
    console.error('Lỗi load reels:', err)
  }
})

const getVideoUrl = (path) => {
  if (!path) return ''
  return `http://localhost:3000/${path.replace(/\\/g, '/')}`
}

const goToProduct = (id) => {
  router.push(`/product/${id}`)
}

watch(dialog, (isOpen) => {
  if (!isOpen) {
    const dialogVideo = document.querySelector('.v-dialog video')
    if (dialogVideo) {
      dialogVideo.pause()
      dialogVideo.currentTime = 0
    }
  }
})
</script>

<style scoped>
.reel-slider {
  overflow-x: auto;
}
.reel-slide {
  min-width: 180px;
  max-width: 180px;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.animated-btn {
  border-radius: 999px;
  background: linear-gradient(135deg, #4f46e5, #3b82f6); /* Gradient xanh tím */
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  font-weight: 500;
  text-transform: none;
}

.animated-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.5);
  background: linear-gradient(135deg, #4338ca, #2563eb);
}
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.card-hover:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
.card-hover video:hover {
  transform: scale(1.03);
  transition: transform 0.3s ease;
}
</style>
