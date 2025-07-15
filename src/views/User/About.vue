<template>
  <v-container class="about-page" fluid>
    <!-- Title bên trái -->
    <v-row>
      <v-col cols="12">
        <h1 class="about-title">Giới thiệu</h1>
      </v-col>
    </v-row>

    <!-- Sub-title màu xám, căn giữa, 2 dòng đầu -->
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="10" class="sub-title text-center">
        Thương hiệu thời trang MARC – trực thuộc Công Ty Cổ Phần SX-TM<br/>
        Nét Việt chính thức ra mắt vào năm 2006.
      </v-col>
    </v-row>

    <!-- Paraph 1 + ảnh đầu tiên -->
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" class="text-center">
        <p class="about-paragraph">
          Với khơi nguồn từ lòng đam mê thời trang, khát khao mang đến cái đẹp cho tất cả phụ nữ và hơn thế nữa là mong muốn được góp phần tạo dựng hình ảnh mới lạ cho ngành công nghiệp thời trang Việt Nam, MARC đã tập trung đầu tư vào chất lượng và kiểu dáng sản phẩm để thương hiệu MARC Fashion trở thành một cái tên gần gũi hơn với khách hàng. 
          <br>Với phương châm <strong>"BRIGHTEN YOUR DAY"</strong>, MARC mong muốn mang lại cho khách hàng những sản phẩm tốt nhất để các bạn không chỉ thể hiện cá tính bản thân mà còn lan toả nguồn năng lượng tích cực, mạnh mẽ đến xung quanh.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-12">
      <v-col cols="12" md="10" class="text-center">
        <v-img
          src="https://file.hstatic.net/1000197303/file/gioi_thieu_935d79d638d54ac18d7199d31bb6e2c4_1024x1024.jpg"
          aspect-ratio="1"
          contain
          class="rounded-lg"
        ></v-img>
      </v-col>
    </v-row>

    <!-- Paraph 2 + ảnh thứ 2 -->
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="10" class="text-center">
        <p class="about-paragraph">
          Các mẫu thiết kế của MARC luôn mang đậm phong cách phóng khoáng và tự do. Sự kết hợp hài hoà giữa hai dòng thời trang basic và trendy khiến các thiết kế vừa mang tính tiện dụng, phù hợp với nhiều bối cảnh hằng ngày mà vẫn bắt kịp xu hướng mốt của năm.
          <br>Không chỉ đem đến cho khách hàng những sản phẩm mang phong cách và kiểu dáng độc đáo mà còn giới thiệu đến khách hàng những sản phẩm đạt chất lượng tốt nhất. Các mẫu thiết kế được kiểm duyệt kĩ càng từ khâu chọn chất liệu, dựng mẫu và hoàn thiện.
         <br> Chính vì thế, những thiết kế đến tay khách hàng luôn là những sản phẩm tinh tế nhất. Với đội ngũ chuyên nghiệp cùng sự kết hợp chặt chẽ và thống nhất của ban lãnh đạo, thương hiệu thời trang MARC hy vọng sẽ đáp ứng được sự yêu mến và tin cậy của quý khách hàng về dòng sản phẩm thời trang chất lượng cao.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-12">
      <v-col cols="12" md="10" class="text-center">
        <v-img
          src="https://file.hstatic.net/1000197303/file/gioi_thieu1_fab49d5d536c4c12a9ed153073254fe9_1024x1024.jpg"
          aspect-ratio="1"
          contain
          class="rounded-lg"
        ></v-img>
      </v-col>
    </v-row>

    <!-- Paraph 3 dưới ảnh 2 -->
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="10" class="text-center">
        <p class="about-paragraph">
          Dù cho bạn là cô nàng mạnh mẽ, độc lập hay nàng thơ nhẹ nhàng, ngọt ngào thì MARC tin mình có thể đáp ứng nhu cầu mặc đẹp mỗi ngày của bạn. Bạn không cần thay đổi phong cách để chạy theo xu hướng, là một quý cô hiện đại, bạn hãy tận dụng thời trang để làm mới bản thân và tự mình tạo ra những nguồn năng lượng trẻ trung, tích cực.
        </p>
      </v-col>
    </v-row>

    <!-- Đoạn kết in đậm, căn giữa -->
    <v-row justify="center" class="mb-12">
      <v-col cols="12" md="10" class="text-center final-paragraph">
        <strong>Còn chần chờ gì nữa, hãy đến với MARC để trở thành một cô nàng tự tin, yêu bản thân và yêu đời hơn.</strong>
      </v-col>
    </v-row>
  </v-container>
  <FloatingContact />
</template>

<script setup>
import FloatingContact from '@/components/FloatingContact.vue'
</script>

<style scoped>
.about-page {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #333;
  text-align: center;
  font-family: 'Playfair Display', serif; 
}

.about-title {
  font-weight: 700;
  font-size: 2.2rem;
  margin-bottom: 20px;
  text-align: left; /* Tiêu đề căn trái */
}

.sub-title {
  color: #777777;
  font-size: 1.2rem;
  line-height: 1.4;
  margin-bottom: 60px;
  white-space: pre-line; /* giữ xuống dòng */
}

.about-paragraph {
  margin-bottom: 24px;
  margin-left: auto;
  margin-right: auto;
}

.rounded-lg {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.final-paragraph {
  font-size: 1.25rem;
  margin-top: 50px;
}
</style>
