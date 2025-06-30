<template>
  <v-carousel
    cycle
    height="550"
    hide-delimiter-background
    show-arrows="hover"
    class="custom-carousel"
  >
    <v-carousel-item
      v-for="(slide, i) in slides"
      :key="i"
      :src="slide.image"
      cover
    >
      <v-sheet
        height="100%"
        class="d-flex align-center justify-center"
        style="background: rgba(0,0,0,0)"
      />
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  name: 'UserBanner',
  data() {
    return {
      slides: [
        {
          image: 'https://theme.hstatic.net/1000197303/1001046599/14/slideshow_1.jpg?v=16282',
          
        },
        {
          image: 'https://theme.hstatic.net/1000197303/1001046599/14/slideshow_2.jpg?v=16282',
          
        },
        {
          image: 'https://theme.hstatic.net/1000197303/1001046599/14/img-home-collection2.jpg?v=16282',
          
        }
      ]
    }
  }
}
</script>
<style scoped>
.custom-carousel .v-window__container {
  transition: transform 0.8s ease-in-out, opacity 0.8s ease-in-out !important;
}
.custom-carousel .v-carousel-item {
  transition: opacity 0.8s ease, transform 0.8s ease;
}
</style>