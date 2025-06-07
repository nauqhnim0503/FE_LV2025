<template>
  <v-container fluid>
    <v-row>
      <!-- Tiêu đề -->
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="text-h5 font-weight-bold mb-0">Thêm sản phẩm</h3>
        </v-card>
      </v-col>

      <!-- Form chính -->
      <v-col cols="12">
        <v-card class="pa-6 elevation-3 rounded-lg">
          <v-form>
            <v-row>
              <!-- Cột trái -->
              <v-col cols="12" md="8">
                <h4 class="text-subtitle-1 font-weight-medium mb-4">Thông tin sản phẩm</h4>

                <v-text-field
                  v-model="product.name"
                  label="Tên sản phẩm"
                  variant="outlined"
                  dense
                  rounded="lg"
                ></v-text-field>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="product.price"
                      label="Giá bán"
                      type="number"
                      variant="outlined"
                      dense
                      rounded="lg"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" class="d-flex align-center">
                    <v-switch
                      v-model="product.is_active"
                      label="Cho phép bán"
                    ></v-switch>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-select
                      v-model="product.category_id"
                      :items="categories"
                      item-title="name"
                      item-value="id"
                      label="Danh mục"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      clearable
                    ></v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="product.brand_id"
                      :items="brands"
                      item-title="name"
                      item-value="id"
                      label="Thương hiệu"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      clearable
                    ></v-select>
                  </v-col>
                </v-row>

                <v-textarea
                  v-model="product.description"
                  label="Mô tả sản phẩm"
                  rows="4"
                  variant="outlined"
                  rounded="lg"
                ></v-textarea>

                <!-- Biến thể -->
                <v-card class="mt-6 pa-4" outlined rounded="lg">
                  <v-row class="justify-space-between align-center mb-2">
                    <h4 class="text-subtitle-1 font-weight-medium">Biến thể</h4>
                    <div>
                      <v-btn color="primary" class="me-2" @click="addVariant">Thêm biến thể</v-btn>
                      <v-btn color="secondary" @click="quickCreateDialog = true">Tạo nhanh biến thể</v-btn>
                    </div>
                  </v-row>

                  <div v-if="!sizes.length || !colors.length" class="text-center py-5">
                    <v-icon size="40" color="warning">mdi-alert</v-icon>
                    <p>Chưa có kích thước hoặc màu sắc. Vui lòng tạo nhanh!</p>
                  </div>

                  <div v-else>
                    <div v-for="(variant, index) in product.variants" :key="index" class="mb-3">
                      <v-row dense>
                        <v-col cols="4">
                          <v-select
                            v-model="variant.size_id"
                            :items="sizes"
                            item-title="name"
                            item-value="id"
                            label="Kích thước"
                            variant="outlined"
                            dense
                            clearable
                            @change="handleVariantChange(index)"
                          ></v-select>
                        </v-col>
                        <v-col cols="4">
                          <v-select
                            v-model="variant.color_id"
                            :items="colors"
                            item-title="name"
                            item-value="id"
                            label="Màu sắc"
                            variant="outlined"
                            dense
                            clearable
                            @change="handleVariantChange(index)"
                          ></v-select>
                        </v-col>
                        <v-col cols="3">
                          <v-text-field
                            v-model="variant.stock_quantity"
                            label="Số lượng"
                            type="number"
                            variant="outlined"
                            dense
                          ></v-text-field>
                        </v-col>
                        <v-col cols="1" class="d-flex justify-end align-center">
                          <v-tooltip text="Xóa biến thể" location="top">
                            <template #activator="{ props }">
                              <v-btn
                                icon
                                color="error"
                                variant="text"
                                size="small"
                                v-bind="props"
                                @click="removeVariant(index)"
                                class="elevation-0"
                                style="transform: translateY(-10px);">
                                <v-icon size="20">mdi-delete</v-icon>
                              </v-btn>
                            </template>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </v-card>
              </v-col>

              <!-- Cột phải -->
              <v-col cols="12" md="4">
                <h4 class="text-subtitle-1 font-weight-medium mb-4">Hình ảnh sản phẩm</h4>

                <v-file-input
                  label="Ảnh chính"
                  v-model="product.main_image"
                  accept="image/*"
                  prepend-inner-icon="mdi-image"
                  prepend-icon=""
                  variant="outlined"
                  dense
                  rounded="lg"
                  class="mb-4"
                  style="height: 200px;"
                ></v-file-input>

                <v-row dense class="mb-2">
                  <v-col cols="6" v-for="i in 2" :key="'sub1-' + i">
                    <v-file-input
                      :label="'Ảnh phụ ' + i"
                      v-model="product.sub_images[i - 1]"
                      accept="image/*"
                      prepend-inner-icon="mdi-image"
                      prepend-icon=""
                      variant="outlined"
                      dense
                      rounded="lg"
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-row dense>
                  <v-col cols="6" v-for="i in 2" :key="'sub2-' + i">
                    <v-file-input
                      :label="'Ảnh phụ ' + (i + 2)"
                      v-model="product.sub_images[i + 1]"
                      accept="image/*"
                      prepend-inner-icon="mdi-image"
                      prepend-icon=""
                      variant="outlined"
                      dense
                      rounded="lg"
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-btn color="success" class="mt-4 w-100" @click="submitProduct">
                  Lưu sản phẩm
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top">
      {{ snackbar.text }}
    </v-snackbar>

    <!-- Dialog tạo nhanh biến thể -->
    <v-dialog v-model="quickCreateDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Tạo nhanh biến thể</v-card-title>
        <v-card-text>
          <v-form ref="quickCreateForm">
            <v-text-field
              label="Tên kích thước"
              v-model="newSize.name"
              variant="outlined"
              prepend-inner-icon="mdi-tag"
              prepend-icon=""
              dense
            ></v-text-field>
            <v-text-field
              label="Tên màu sắc"
              v-model="newColor.name"
              variant="outlined"
              prepend-inner-icon="mdi-palette"
              prepend-icon=""
              dense
            ></v-text-field>
            <v-file-input
              label="Ảnh màu đại diện"
              v-model="newColor.code"
              accept="image/*"
              prepend-inner-icon="mdi-image"
              prepend-icon=""
              variant="outlined"
              dense
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="quickCreateDialog = false">Hủy</v-btn>
          <v-btn color="primary" text @click="saveQuickVariant">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import productService from '@/services/Admin/products'

// === State chính cho sản phẩm ===
const product = ref({
  name: '',
  price: null,
  description: '',
  brand_id: null,
  category_id: null,
  is_active: true,
  main_image: null,
  sub_images: [null, null, null, null],
  variants: []
})

// === Dữ liệu hỗ trợ ===
const brands = ref([])
const categories = ref([])
const sizes = ref([])
const colors = ref([])

// === Snackbar hiển thị thông báo ===
const snackbar = ref({ show: false, text: '', color: 'error' })
const showSnackbar = (text, color = 'error') => {
  snackbar.value = { show: true, text, color }
}

// === Quick Create Dialog ===
const quickCreateDialog = ref(false)
const newSize = ref({ name: '' })
const newColor = ref({ name: '', code: '' })

// === Biến thể sản phẩm ===
const isDuplicateVariant = (newVariant) =>
  product.value.variants.some(
    (v) => v.size_id === newVariant.size_id && v.color_id === newVariant.color_id
  )

const handleVariantChange = (index) => {
  const current = product.value.variants[index]
  const isDuplicate = product.value.variants.some(
    (v, i) =>
      i !== index &&
      v.size_id === current.size_id &&
      v.color_id === current.color_id
  )
  if (isDuplicate) {
    showSnackbar('Biến thể với kích thước và màu sắc này đã tồn tại!')
    product.value.variants[index].size_id = null
    product.value.variants[index].color_id = null
  }
}

const addVariant = () => {
  const last = product.value.variants.at(-1)
  if (!last || (last.size_id && last.color_id && last.stock_quantity != null)) {
    product.value.variants.push({ size_id: null, color_id: null, stock_quantity: null })
  } else {
    showSnackbar('Vui lòng điền đầy đủ thông tin biến thể trước khi thêm mới.')
  }
}

const removeVariant = (index) => {
  product.value.variants.splice(index, 1)
}

// === Tạo nhanh size và color ===
const saveQuickVariant = async () => {
  try {
    if (newSize.value.name) {
      const res = await axios.post('http://localhost:3000/sizes', newSize.value)
      sizes.value.push(res.data.data)
    }

    if (newColor.value.name && newColor.value.code) {
      const form = new FormData()
      form.append('name', newColor.value.name)
      form.append('code', newColor.value.code)

      const res = await axios.post('http://localhost:3000/colors', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      colors.value.push(res.data.data)
    }

    showSnackbar('Tạo nhanh biến thể thành công!', 'success')
    newSize.value = { name: '' }
    newColor.value = { name: '', code: '' }
    quickCreateDialog.value = false
  } catch (err) {
    console.error('Lỗi khi tạo biến thể nhanh:', err)
    showSnackbar('Lỗi khi tạo biến thể nhanh, vui lòng thử lại.')
  }
}

// === Tải dữ liệu khi load trang ===
onMounted(async () => {
  try {
    const [brandsRes, categoriesRes, sizesRes, colorsRes] = await Promise.all([
      axios.get('http://localhost:3000/brands'),
      axios.get('http://localhost:3000/categories'),
      axios.get('http://localhost:3000/sizes'),
      axios.get('http://localhost:3000/colors')
    ])
    brands.value = brandsRes.data.data
    categories.value = categoriesRes.data.data
    sizes.value = sizesRes.data.data
    colors.value = colorsRes.data.data
  } catch (err) {
    console.error('Lỗi khi load danh sách:', err)
  }
})

// === Gửi dữ liệu sản phẩm ===
const submitProduct = async () => {
  const formData = new FormData()
  formData.append('name', product.value.name)
  formData.append('price', product.value.price)
  formData.append('description', product.value.description)
  formData.append('brand_id', product.value.brand_id)
  formData.append('category_id', product.value.category_id)
  formData.append('is_active', product.value.is_active ? 'true' : 'false')
  formData.append('url', product.value.main_image)
  console.log('Ảnh phụ sắp gửi:', product.value.sub_images)

  product.value.sub_images.forEach((file, index) => {
  if (file instanceof File) {
    console.log(`✅ sub_images[${index}] is File: ${file.name}`)
    formData.append('sub_images', file)
  } else {
    console.warn(`⚠️ sub_images[${index}] is not File`, file)
  }
})

  formData.append('variants', JSON.stringify(product.value.variants))

  // Debug dữ liệu
  console.log('📦 FormData contents:')
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`📁 File - ${key}: ${value.name} (${value.type})`)
    } else {
      console.log(`${key}: ${value}`)
    }
  }

  try {
    await productService.createProducts(formData)
    showSnackbar('Thêm sản phẩm thành công!', 'success')

    // ✅ Reset dữ liệu về mặc định sau khi thêm thành công
    product.value = {
      name: '',
      price: null,
      description: '',
      brand_id: null,
      category_id: null,
      is_active: true,
      main_image: null,
      sub_images: [null, null, null, null],
      variants: []
    }
  } catch (err) {
    console.error('❌ Lỗi khi thêm sản phẩm:', err)
    if (err.response) console.error('📨 Response data:', err.response.data)
  }
}
</script>

