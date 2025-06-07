<template>
  <div class="register-container">
    <div class="register-panel">
      <div class="panel-header">
        <router-link to="/login" class="link">Đăng nhập</router-link>
        <router-link to="/register" class="link active-link">Đăng ký</router-link>
      </div>

      <form @submit.prevent="register">
        <input v-model="name" type="text" placeholder="Họ và tên" />

        <input v-model="username" type="text" placeholder="Tên đăng nhập" />

        <input v-model="password" type="password" placeholder="Mật khẩu" />

        <input v-model="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" />

        <button type="submit" class="register-btn">Đăng ký <span>&rarr;</span></button>
      </form>

      <div class="divider">
        <span>Hoặc</span>
      </div>

      <div class="social-login">
        <span class="social-icon">G</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    register() {
      console.log('Register:', this.name, this.username, this.password, this.confirmPassword);
      // Xử lý đăng ký ở đây
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-image: url('https://theme.hstatic.net/1000197303/1001046599/14/login-bg.jpg?v=16282');
  background-size: cover;
  background-position: center;
  font-family: 'Poppins', sans-serif;
}

.register-panel {
  width: 400px;
  min-height: 560px; /* giữ chiều cao tối thiểu đủ chứa trang dài nhất */
  background: white;
  color: black;
  padding: 30px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
}

.panel-header {
  display: flex;
  justify-content: center;
  gap: 30px;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 25px;
}

.link {
  color: black;
  text-decoration: none;
  opacity: 0.6;
  transition: all 0.3s ease;
  position: relative;
}

.link:hover {
  opacity: 1;
}

.active-link {
  opacity: 1;
}

.active-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: black;
  transition: all 0.3s;
}

input {
  width: 100%;
  padding: 15px 0;
  border: none;
  border-bottom: 2px solid #ccc;
  background: transparent;
  color: black;
  outline: none;
  transition: border-color 0.3s;
  margin: 10px 0;
}

input::placeholder {
  color: #c6c6c6;
}

input:focus {
  border-bottom: 2px solid #D37171;
}

.register-btn {
  width: 200px;
  padding: 6px 10px;
  border: none;
  border-radius: 30px;
  background-color: #D37171;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin: 0 auto;
  display: block;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #ccc;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.social-login {
  text-align: center;
}

.social-icon {
  font-size: 28px;
  background: #D37171;
  color: white;
  padding: 8px 16px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
