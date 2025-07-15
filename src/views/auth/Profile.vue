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
                  v-model="profile.email"
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
            <v-btn text color="primary" class="ml-4 mt-4 float-right" @click="showPasswordDialog = true">
              Đổi mật khẩu
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
  <floating-contact />
  <v-dialog v-model="leaveDialog" max-width="400px">
  <v-card>
    <v-card-title class="text-h6">Bạn có muốn rời khỏi?</v-card-title>
    <v-card-text>Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="leaveDialog = false">Hủy</v-btn>
      <v-btn text color="red" @click="confirmLeave">Rời khỏi</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
<v-dialog v-model="showPasswordDialog" max-width="500">
  <v-card>
    <v-card-title class="text-h6">Đổi mật khẩu</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleChangePassword">
        <v-text-field
          v-model="password.oldPassword"
          label="Mật khẩu cũ"
          :type="showOldPassword ? 'text' : 'password'"
          :append-inner-icon="showOldPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showOldPassword = !showOldPassword"
          variant="outlined"
          dense
          required/>
        <v-text-field
          v-model="password.newPassword"
          label="Mật khẩu mới"
          :type="showNewPassword ? 'text' : 'password'"
          :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showNewPassword = !showNewPassword"
          variant="outlined"
          dense
          required/>
        <v-text-field
          v-model="password.confirmPassword"
          label="Xác nhận mật khẩu mới"
          :type="showConfirmPassword ? 'text' : 'password'"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          variant="outlined"
          dense
          required/>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="showPasswordDialog = false">Hủy</v-btn>
      <v-btn color="primary" @click="handleChangePassword">Lưu</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script setup>
import { ref, onMounted, warn } from 'vue'
import axios from 'axios'
import FloatingContact from '@/components/FloatingContact.vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { onBeforeRouteLeave } from 'vue-router'
import { getUser, saveUserSession } from '@/store/auth'

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const { snackbar, success, error } = useSnackbar()
const fileInput = ref(null)
const coverInput = ref(null)
const defaultCover = 'https://png.pngtree.com/background/20250106/original/pngtree-aesthetic-notebook-cover-page-background-picture-image_15510175.jpg'
const coverPreview = ref(null)

const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXdOqBvpRAvJ-3VDPk1VDqbmNzW7UONJqtkA&s'
const avatarPreview = ref(null)


const hasUnsavedChanges = () => {
  return JSON.stringify(profile.value) !== JSON.stringify(originalProfile.value)
}
const leaveDialog = ref(false)
const pendingNavigation = ref(null)

const profile = ref({
  username: '',
  email: '',
  fullname: '',
  phone: '',
  address: ''
})
const originalProfile = ref({ ...profile.value })

const showPasswordDialog = ref(false)
const password = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const handleChangePassword = async () => {
  console.log('User info from getUser():', getUser())
  if (
    !password.value.oldPassword ||
    !password.value.newPassword ||
    !password.value.confirmPassword
  ) {
    error('Vui lòng điền đủ thông tin đổi mật khẩu.')
    return
  }

  if (password.value.newPassword !== password.value.confirmPassword) {
    error('Mật khẩu mới và xác nhận mật khẩu không khớp.')
    return
  }

  const user = getUser()
  if (!user?.email) {
    error('Không tìm thấy thông tin người dùng.')
    return
  }

  try {
    const res = await axios.put('http://localhost:3000/users/change-password', {
      email: user.email,
      mat_khau_cu: password.value.oldPassword,
      mat_khau_moi: password.value.newPassword
    })

    success('Đổi mật khẩu thành công!')
    // Xóa input sau khi đổi mật khẩu thành công
    password.value.oldPassword = ''
    password.value.newPassword = ''
    password.value.confirmPassword = ''
    showPasswordDialog.value = false

  } catch (err) {
    console.error('Lỗi đổi mật khẩu:', err)
    error(err.response?.data?.error || 'Đổi mật khẩu thất bại')
  }
}

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

const onImageChange = async (e) => {
  const file = e.target?.files?.[0]
  if (file) {
    const base64 = await toBase64(file)
    avatarPreview.value = base64
  }
}

const uploadAvatar = () => {
  if (avatarPreview.value) {
    localStorage.setItem('user_avatar', avatarPreview.value)
    console.log('Avatar image saved to localStorage')
  }
}
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges()) {
    leaveDialog.value = true
    pendingNavigation.value = next // lưu hàm next để gọi sau
  } else {
    next()
  }
})

const confirmLeave = () => {
  leaveDialog.value = false
  if (pendingNavigation.value) {
    pendingNavigation.value() // tiếp tục điều hướng
  }
}
const validateProfile = () => {
  if (!profile.value.fullname || profile.value.fullname.trim() === '') {
    error('Tên không được để trống')
    return false
  }

  const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/
  if (!phoneRegex.test(profile.value.phone)) {
    error('Số điện thoại không hợp lệ, ví dụ 0912345678')
    return false
  }

  return true
}
const updateProfile = async () => {
  if (!validateProfile()) {
    return
  }
  const user = getUser()
  const userId = user?.id
  if (!userId) {
    console.error('Không có userId để cập nhật')
    return
  }

  try {
    const payload = {
      name: profile.value.fullname,
      phone: profile.value.phone,
      address: profile.value.address
    }
    const res = await axios.put(`http://localhost:3000/users/${userId}`, payload)
    console.log('Cập nhật profile thành công:', res.data)
    const updatedUser = {...getUser(),name: profile.value.fullname,phone: profile.value.phone,address: profile.value.address}
    saveUserSession(localStorage.getItem('token'), updatedUser)
    success('Cập nhật thành công')
    originalProfile.value = { ...profile.value }
  } catch (error) {
    console.error('Lỗi khi cập nhật profile:', error)
    error('Cập nhật thất bại')
  }
}

onMounted(async () => {
  const user = getUser()
  const userId = user?.id

  if (!userId) {
    console.error('Không tìm thấy user ID')
    return
  }

  try {
    const res = await axios.get(`http://localhost:3000/users/profile/${userId}`)
    const userData = res.data.data

    profile.value = {
      username: userData.username,
      email: userData.email,
      fullname: userData.name || '',
      phone: userData.phone || '',
      address: userData.address || ''
    }
    originalProfile.value = { ...profile.value }

    const savedCover = localStorage.getItem('user_cover')
    if (savedCover) coverPreview.value = savedCover

    const savedAvatar = localStorage.getItem('user_avatar')
    if (savedAvatar) avatarPreview.value = savedAvatar
  } catch (err) {
    console.error('❌ Không thể tải thông tin user:', err)
  }
})
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
