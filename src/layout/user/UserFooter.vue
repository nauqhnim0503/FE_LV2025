<template>
  <v-footer class="pa-8 text-black bg-grey-lighten-1" height="auto">
    <v-container>
      <v-row align="start" justify="space-between" class="footer-row" no-gutters>
        <!-- Cột: Về chúng tôi -->
        <v-col cols="12" md="4" class="footer-col">
          <h4 class="text-uppercase font-weight-bold mb-4">Về chúng tôi</h4>
          <p class="mb-4 footer-about-text">
            Chúng tôi là một công ty thương mại điện tử, chuyên cung cấp các sản phẩm điện tử chất lượng cao và dịch vụ chăm sóc khách hàng tốt nhất.
          </p>
          <div class="d-flex social-icons">
            <v-icon class="me-4" size="24">mdi-facebook</v-icon>
            <v-icon class="me-4" size="24">mdi-twitter</v-icon>
            <v-icon class="me-4" size="24">mdi-instagram</v-icon>
            <v-icon size="24">mdi-youtube</v-icon>
          </div>
        </v-col>

        <!-- Cột: Liên kết nhanh -->
        <v-col cols="12" md="4" class="footer-col">
          <h4 class="text-uppercase font-weight-bold mb-4">Liên kết nhanh</h4>
          <v-list density="compact" class="bg-transparent quick-links-list">
            <v-list-item
              v-for="(item, i) in quickLinks"
              :key="i"
              :to="item.route"
              class="px-0"
              link
            >
              <v-list-item-title class="quick-link-title">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Cột: Liên hệ -->
        <v-col cols="12" md="4" class="footer-col">
          <h4 class="text-uppercase font-weight-bold mb-4">Liên hệ chúng tôi</h4>
          <div class="mb-3 contact-item">
            <v-icon class="me-2" size="20">mdi-map-marker</v-icon>
            <span>180 Cao Lỗ, phường 4, quận 8, TPHCM</span>
          </div>
          <div class="mb-3 contact-item">
            <v-icon class="me-2" size="20">mdi-phone</v-icon>
            <span>+84 332 661 819</span>
          </div>
          <div class="contact-item">
            <v-icon class="me-2" size="20">mdi-email</v-icon>
            <span>minhquan2002tv@gmail.com</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
const quickLinks = [
  { title: 'Trang chủ', route: '/' },
  { title: 'Sản phẩm', route: '/products' },
  { title: 'Về chúng tôi', route: '/about' },
  { title: 'Liên hệ', route: '/contact' },
  { title: 'Chính sách bảo mật', route: '/privacy' }
]
</script>

<style scoped>
.v-footer {
  font-size: 15px;
  border-top: 1px solid #ddd;
flex-shrink: 0
}

/* Cột footer cách đều nhau */
.footer-row {
  gap: 32px; /* khoảng cách giữa cột */
  flex-wrap: nowrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Text ở About cho dễ đọc */
.footer-about-text {
  line-height: 1.6;
  color: #444;
}

/* Màu icon & hover */
.v-icon {
  color: #555;
  cursor: pointer;
  transition: color 0.3s ease;
}

.v-icon:hover {
  color: #1e88e5;
}

/* Social icons */
.social-icons {
  margin-top: auto; /* đẩy icon xuống dưới cùng */
}

/* Quick links */
.quick-links-list {
  padding-left: 0;
}

.quick-link-title {
  cursor: pointer;
  color: #222;
  transition: color 0.3s ease;
}

.quick-link-title:hover {
  color: #1e88e5;
}

/* Liên hệ */
.contact-item {
  display: flex;
  align-items: center;
  color: #444;
  font-size: 14px;
}

/* Responsive nhỏ hơn 768px */
@media (max-width: 767px) {
  .footer-row {
    gap: 16px;
  }
  .footer-col {
    margin-bottom: 24px;
  }
}
</style>
