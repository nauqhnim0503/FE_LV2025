<template>
  <v-container fluid class="pa-0 profile-page">
    <!-- Ảnh nền -->
    <div class="cover-image">
      <v-img
        :src="coverPreview || defaultCover"
        height="300px"
        cover
        class="cover-img">
        <!-- Nút chỉnh sửa -->
        <div class="cover-actions d-flex align-center">
          <v-icon @click="triggerCoverFile" class="mr-2" color="black" size="28">mdi-pencil</v-icon>
          <v-btn small color="pink" @click="uploadCover">Upload</v-btn>
        </div>
      
        <!-- input ẩn chọn ảnh nền -->
        <input
          type="file"
          ref="coverInput"
          accept="image/*"
          class="d-none"
          @change="onCoverChange"/>
      </v-img>
    </div>


    <v-row class="mt-n16 px-4">
      <!-- Thông tin tài khoản -->
      <v-col cols="12" md="8">
        <v-card elevation="2" class="pa-6">
          <h3 class="mb-4">Tài khoản của tôi</h3>
          <v-form ref="form">
            <!-- Hàng 1 -->
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.username"
                  label="Tên đăng nhập"
                  outlined
                  variant="outlined"
                  density="comfortable"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.email"
                  label="Địa chỉ email"
                  outlined
                  variant="outlined"
                  density="comfortable"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          
            <!-- Hàng 2 -->
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.fullname"
                  label="Họ và tên"
                  outlined
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.phone"
                  label="Số điện thoại"
                  outlined
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
          
            <!-- Hàng 3 -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="profile.address"
                  label="Địa chỉ"
                  outlined
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
          
            <!-- Nút cập nhật -->
            <v-btn color="pink" class="mt-4" @click="updateProfile">
              Cập nhật
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <!-- Ảnh đại diện -->
      <v-col cols="12" md="4" class="text-center position-relative">
        <!-- Avatar nổi nửa trên -->
        <v-avatar
          size="160"
          class="avatar-overlap">
          <v-img :src="avatarPreview || defaultAvatar"></v-img>
        </v-avatar>
      
        <!-- Card chứa nút chọn và upload -->
        <v-card elevation="2" class="pa-4">
        <div
          class="d-flex justify-center align-center flex-wrap gap-2 button-group">
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            class="d-none"
            @change="onImageChange"/>
          <v-btn color="primary" @click="triggerFileInput">
            Chọn ảnh
          </v-btn>
          <v-btn color="pink" @click="uploadAvatar">
            Upload
          </v-btn>
        </div>
      </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref,onMounted } from 'vue'

const fileInput = ref(null)
const coverInput = ref(null)
const defaultCover = 'https://png.pngtree.com/background/20250106/original/pngtree-aesthetic-notebook-cover-page-background-picture-image_15510175.jpg'
const coverPreview = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerCoverFile = () => {
  coverInput.value?.click()
}

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

const onCoverChange = async (e) => {
  const file = e.target?.files?.[0]
  if (file) {
    const base64 = await toBase64(file)
    coverPreview.value = base64
  }
}

const uploadCover = () => {
  if (coverPreview.value) {
    localStorage.setItem('user_cover', coverPreview.value)
    console.log('Cover image saved to localStorage')
  }
}

const profile = ref({
  username: 'khach1',
  email: 'name@gmail.com',
  fullname: '',
  phone: '',
  address: ''
})


const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXdOqBvpRAvJ-3VDPk1VDqbmNzW7UONJqtkA&s'
const avatarPreview = ref(null)

onMounted(() => {
  const savedCover = localStorage.getItem('user_cover')
  if (savedCover) {
    coverPreview.value = savedCover
  }

  const savedAvatar = localStorage.getItem('user_avatar')
  if (savedAvatar) {
    avatarPreview.value = savedAvatar
  }
})

const onImageChange = async (e) => {
  const file = e.target?.files?.[0]
  if (file) {
    const base64 = await toBase64(file)
    avatarPreview.value = base64
  }
}

const updateProfile = () => {
  // Gửi dữ liệu cập nhật lên server
  console.log('Updating profile:', profile.value)
}

const uploadAvatar = () => {
  if (avatarPreview.value) {
    localStorage.setItem('user_avatar', avatarPreview.value)
    console.log('Avatar image saved to localStorage')
  }
}

</script>

<style scoped>
.profile-page > * {
  max-width: 100%;
  box-sizing: border-box;
}
.cover-image {
  position: relative;
  z-index: 1;
}
.profile-page .v-card {
  z-index: 2;
  position: relative;
}
.avatar-overlap {
  position: absolute;
  top: -80px; /* vì avatar cao 160px => 160/2 */
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid white;
  z-index: 3;
}
.button-group {
  padding-top: 100px;
  gap: 50px;
}
.cover-actions {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 8px;
  border-radius: 8px;
  z-index: 2;
}
.cover-img {
  position: relative;
}
.avatar-wrapper {
  position: relative;
}

.avatar-actions {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 8px;
  border-radius: 8px;
  z-index: 4;
}
</style>
