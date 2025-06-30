<template>
  <v-container fluid class="contact-page">
    <v-row justify="center">
      <!-- Bản đồ bên trái -->
      <v-col cols="12" md="6" class="map-col">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7839.923297266652!2d106.67510897461221!3d10.737439289409007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fad3fb62a95%3A0xa9576c84a879d1fe!2zMTgwIENhbyBM4buXLCBQaMaw4budbmcgNCwgUXXhuq1uIDgsIEjhu5MgQ2jDrSBNaW5oIDcwMDAwLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1751196596714!5m2!1sen!2s" 
          width="100%" 
          height="450" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          title="Bản đồ địa chỉ 180 Cao Lỗ"
        ></iframe>  
      </v-col>

      <!-- Thông tin liên hệ bên phải -->
      <v-col cols="12" md="6" class="contact-info">
        <h2>Liên hệ</h2>
        <div class="contact-item">
          <h3>Địa chỉ chúng tôi</h3>
          <p>180 Cao Lỗ, Phường 4, Quận 8, TP. Hồ Chí Minh</p>
        </div>
        <div class="contact-item">
          <h3>Email chúng tôi</h3>
          <p>cskh.stu@gmail.com</p>
        </div>
        <div class="contact-item">
          <h3>Điện thoại</h3>
          <p>1900123456</p>
        </div>
        <div class="contact-item">
          <h3>Thời gian làm việc</h3>
          <p>Thứ 2 đến Thứ 6 từ 8h đến 17h</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped>
.contact-page {
  font-family: 'Playfair Display', serif;
  max-width: 1100px;
  margin: 0 auto; /* căn giữa toàn bộ container */
}

.map-col, .contact-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 15px;
}

.contact-info h2 {
  font-weight: 700;
  margin-bottom: 20px;
}

.contact-item {
  margin-bottom: 25px;
}

.contact-item h3 {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.contact-item p {
  color: #555;
  line-height: 1.5;
}
</style>
