<template>
  <div class="login-container">
    <div class="login-panel">
      <div class="panel-header">
        <router-link to="/login" class="link active-link">Đăng nhập</router-link>
        <router-link to="/register" class="link">Đăng ký</router-link>
      </div>

      <form @submit.prevent="login">
        
        <input id="username" v-model="username" type="text" placeholder="Nhập tên..." />

        
        <input id="password" v-model="password" type="password" placeholder="Nhập mật khẩu..." />

        <div class="forgot">Quên mật khẩu?</div>
        <button type="submit" class="login-btn">Đăng nhập <span>&rarr;</span></button>
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
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      console.log('Login:', this.username, this.password);
    },
  },
};
</script>

<style scoped>
.login-container {
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

.login-panel {
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
  margin: 10px 0 10px;
}

input::placeholder {
  color: #c6c6c6;
}

/* Hiệu ứng khi focus vào input */
input:focus {
  border-bottom: 2px solid #D37171;
}

.forgot {
  text-align: right;
  font-size: 13px;
  margin-bottom: 15px;
  color: #666;
  cursor: pointer;
}

.login-btn {
  width: 200px;           /* hoặc 50% nếu bạn muốn linh hoạt */
  padding:6px 10px;
  border: none;
  border-radius: 30px;
  background-color: #D37171;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin: 0 auto;          /* căn giữa nút */
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
