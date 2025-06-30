<template>
  <v-container fluid>
    <!-- Tiêu đề -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="text-h5 font-weight-bold mb-0">Thêm sản phẩm</h3>
        </v-card>
      </v-col>

      <!-- Form chính -->
      <v-col cols="12">
        <v-card class="pa-6 elevation-3 rounded-lg">
          <v-form ref="formRef" lazy-validation>
            <v-row>
              <!-- Cột trái: Thông tin sản phẩm -->
              <v-col cols="12" md="8">
                <v-card-text class="pa-0">
                  <h4 class="text-subtitle-1 font-weight-medium mb-4">Thông tin sản phẩm</h4>

                  <v-text-field v-model="product.name" label="Tên sản phẩm" variant="outlined" dense rounded="lg" class="mb-4" :rules="[required, uniqueName]" />

                  <v-row>
                    <v-col cols="6">
                      <v-text-field v-model="product.price" label="Giá bán" type="number" variant="outlined" dense rounded="lg" :rules="[required, positiveNumber]" />
                    </v-col>
                    <v-col cols="6" class="d-flex align-center">
                      <v-switch v-model="product.is_active" label="Cho phép bán" />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field v-model="product.promotional" label="Giá khuyến mãi" type="number" variant="outlined" dense rounded="lg" :rules="[required, positiveNumber]" />
                    </v-col>
                  </v-row>

                  <v-row class="mb-4">
                    <v-col cols="6">
                      <v-select v-model="product.category_id" :items="categories" item-title="name" item-value="id" label="Danh mục" variant="outlined" density="compact" rounded="lg" clearable :rules="[required]" />
                    </v-col>
                    <v-col cols="6">
                      <v-select v-model="product.brand_id" :items="brands" item-title="name" item-value="id" label="Thương hiệu" variant="outlined" density="compact" rounded="lg" clearable :rules="[required]" />
                    </v-col>
                  </v-row>

                  <v-textarea v-model="product.description" label="Mô tả sản phẩm" rows="4" variant="outlined" rounded="lg" class="mb-4" :rules="[required]" />

                  <!-- Biến thể sản phẩm -->
                  <v-card class="mt-6 pa-4" outlined rounded="lg">
                    <!-- Menu tạo nhanh -->
                    <v-menu transition="scale-transition">
                      <template #activator="{ props }">
                        <v-btn color="secondary" size="small" v-bind="props">Tạo nhanh</v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="variantDialog = true"><v-list-item-title>Tạo nhiều biến thể</v-list-item-title></v-list-item>
                        <v-list-item @click="quickCreateDialog = true"><v-list-item-title>Tạo size/màu mới</v-list-item-title></v-list-item>
                      </v-list>
                    </v-menu>

                    <v-card-text class="px-2">
                      <div v-if="!sizes.length || !colors.length" class="text-center py-8">
                        <v-icon size="40" color="warning">mdi-alert</v-icon>
                        <p>Chưa có kích thước hoặc màu sắc. Vui lòng tạo nhanh!</p>
                      </div>

                      <div v-else>
                        <!-- Bảng biến thể -->
                        <div v-if="product.variants.length" class="variants-table">
                          <div class="variants-header">
                            <div class="variant-cell">Kích thước</div>
                            <div class="variant-cell">Màu sắc</div>
                            <div class="variant-cell">Số lượng</div>
                            <div class="variant-cell" style="width: 50px"></div>
                          </div>

                          <div v-for="(variant, index) in product.variants" :key="index" class="variants-row">
                            <div class="variant-cell">
                              <v-select v-model="variant.size_id" :items="sizes" item-title="name" item-value="id" variant="outlined" density="compact" hide-details :rules="[required]" @change="handleVariantChange(index)" />
                            </div>
                            <div class="variant-cell">
                              <v-select v-model="variant.color_id" :items="colors" item-title="name" item-value="id" variant="outlined" density="compact" hide-details :rules="[required]" @change="handleVariantChange(index)" />
                            </div>
                            <div class="variant-cell">
                              <v-text-field v-model="variant.stock_quantity" type="number" min="0" variant="outlined" density="compact" hide-details :rules="[required, positiveNumber]" />
                            </div>
                            <div class="variant-cell">
                              <v-btn icon="mdi-delete" color="error" variant="text" density="comfortable" @click="removeVariant(index)" />
                            </div>
                          </div>
                        </div>

                        <div v-else class="text-center py-8">
                          <v-icon icon="mdi-format-list-text" size="40" color="grey-darken-1" class="mb-2" />
                          <div class="text-grey-darken-1">Chưa có biến thể. Click vào "Tạo nhanh" để thêm biến thể</div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-col>

              <!-- Cột phải: Hình ảnh sản phẩm -->
              <v-col cols="12" md="4">
                <h4 class="text-subtitle-1 font-weight-medium mb-4">Hình ảnh sản phẩm</h4>
                <v-card-text class="px-4 mt-n4">
                  <!-- Lưới ảnh -->
                  <div class="image-grid">
                    <div v-for="(image, index) in 5" :key="index" class="image-slot" :class="{ 'is-primary': index === 0 }">
                      <template v-if="index === 0 ? previewMainImage : previewSubImages[index - 1]">
                        <v-img :src="index === 0 ? previewMainImage : previewSubImages[index - 1]" aspect-ratio="1" cover class="rounded">
                          <template #placeholder>
                            <div class="d-flex align-center justify-center fill-height">
                              <v-progress-circular indeterminate color="primary" />
                            </div>
                          </template>
                        </v-img>
                        <div class="image-actions">
                          <v-btn icon="mdi-delete" color="error" variant="flat" size="small" @click="removeImage(index)" />
                        </div>
                      </template>
                      <template v-else>
                        <v-btn color="primary" variant="outlined" block height="100%" class="upload-btn" prepend-icon="mdi-camera" @click="triggerImageUpload(index)">
                          <span>{{ index === 0 ? 'Ảnh chính' : 'Thêm ảnh' }}</span>
                        </v-btn>
                      </template>
                    </div>
                  </div>

                  <!-- Input ảnh ẩn -->
                  <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleImageSelect" />

                  <div class="text-caption text-grey mt-2">
                    * Ô đầu tiên là ảnh chính<br />
                    * Định dạng: .jpg, .jpeg, .png, .avif<br />
                    * Kích thước tối đa: 2MB/ảnh
                  </div>
                </v-card-text>

                <!-- Nút lưu -->
                <v-btn color="success" class="mt-4 w-100" :loading="loading" :disabled="loading" @click="submitProduct">
                  Lưu sản phẩm
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

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
              :rules="[required, duplicateSizeRule]"
            ></v-text-field>
            <v-text-field
              label="Tên màu sắc"
              v-model="newColor.name"
              variant="outlined"
              prepend-inner-icon="mdi-palette"
              :rules="[required, duplicateColorRule]"
              prepend-icon=""
              dense
            ></v-text-field>
            <v-file-input
              label="Ảnh màu đại diện"
              v-model="newColor.code"
              accept="image/*"
              prepend-inner-icon="mdi-image"
              :rules="[required]"
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
    <!-- Dialog Tạo nhanh nhiều biến thể -->
<v-dialog v-model="variantDialog" max-width="500">
  <v-card>
    <v-card-title class="text-subtitle-1">Tạo nhanh biến thể</v-card-title>
    <v-card-text>
      <v-row>
        <!-- Chọn màu sắc -->
        <v-col cols="12">
          <v-combobox
            v-model="selectedColors"
            :items="colors"
            item-title="name"
            item-value="id"
            label="Chọn màu sắc"
            multiple
            chips
            closable-chips
            variant="outlined"
          >
            <template #chip="{ props, item }">
              <v-chip v-bind="props" :prepend-avatar="item.raw?.code">
                {{ item.title }}
              </v-chip>
            </template>
          </v-combobox>
        </v-col>

        <!-- Chọn kích thước -->
        <v-col cols="12">
          <v-combobox
            v-model="selectedSizes"
            :items="sizes"
            item-title="name"
            item-value="id"
            label="Chọn kích cỡ"
            multiple
            chips
            closable-chips
            variant="outlined"
          >
            <template #chip="{ props, item }">
              <v-chip v-bind="props">{{ item.title }}</v-chip>
            </template>
          </v-combobox>
        </v-col>

        <!-- Nhập số lượng mặc định -->
        <v-col cols="12">
          <v-text-field
            v-model="defaultQuantity"
            type="number"
            min="0"
            label="Số lượng mặc định"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="variantDialog = false">Hủy</v-btn>
      <v-btn color="primary" @click="generateVariants" :disabled="!canGenerateVariants">
        Tạo {{ totalNewVariants }} biến thể
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
  </v-container>
</template>


<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import axios from 'axios'
import productService from '@/services/Admin/products'
import { useSnackbar } from '@/composables/useSnackbar'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const { showSnackbar } = useSnackbar()
const fileInput = ref(null)
const formRef = ref(null)
const previewMainImage = ref(null)
const previewSubImages = ref([null, null, null, null])
const required = (v) => !!v || 'Trường này là bắt buộc.'
const positiveNumber = (v) => (v > 0) || 'Phải là số dương.'

const product = ref({
  name: '', price: null, promotional: null, description: '',
  brand_id: null, category_id: null, is_active: true,
  main_image: null, sub_images: [null, null, null, null],
  variants: []
})

const brands = ref([])
const categories = ref([])
const sizes = ref([])
const colors = ref([])
const existingProductNames = ref([])

const quickCreateDialog = ref(false)
const newSize = ref({ name: '' })
const newColor = ref({ name: '', code: '' })

const selectedColors = ref([])
const selectedSizes = ref([])
const defaultQuantity = ref(1)
const variantDialog = ref(false)

const totalNewVariants = computed(() => selectedColors.value.length * selectedSizes.value.length)
const canGenerateVariants = computed(() => selectedColors.value.length > 0 && selectedSizes.value.length > 0 && defaultQuantity.value > 0)

const uniqueName = (v) => !v || !existingProductNames.value.includes(v.trim().toLowerCase()) || 'Tên sản phẩm đã tồn tại.'
const duplicateSizeRule = (v) => !v || !sizes.value.some(size => size.name.trim().toLowerCase() === v.trim().toLowerCase()) || 'Tên kích thước đã tồn tại.'
const duplicateColorRule = (v) => !v || !colors.value.some(color => color.name.trim().toLowerCase() === v.trim().toLowerCase()) || 'Tên màu sắc đã tồn tại.'

onMounted(async () => {
  try {
    const res = await productService.getProductsList()
    existingProductNames.value = res.data.data.map(p => p.name.trim().toLowerCase())
  } catch (err) {
    console.error('Lỗi khi load sản phẩm:', err)
  }
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
    console.error('Lỗi khi load dữ liệu:', err)
  }
})

watch(() => product.value.main_image, (newFile, oldFile) => {
  if (oldFile) URL.revokeObjectURL(previewMainImage.value)
  previewMainImage.value = newFile instanceof File ? URL.createObjectURL(newFile) : null
})

watch(() => product.value.sub_images, (newFiles, oldFiles) => {
  oldFiles.forEach((oldFile, idx) => {
    if (oldFile && oldFile !== newFiles[idx]) URL.revokeObjectURL(previewSubImages.value[idx])
  })
  newFiles.forEach((file, idx) => {
    previewSubImages.value[idx] = file instanceof File ? URL.createObjectURL(file) : null
  })
}, { deep: true })

const handleVariantChange = (index) => {
  const current = product.value.variants[index]
  const isDuplicate = product.value.variants.some((v, i) => i !== index && v.size_id === current.size_id && v.color_id === current.color_id)
  if (isDuplicate) {
    showSnackbar('Biến thể đã tồn tại!', 'error')
    Object.assign(product.value.variants[index], { size_id: null, color_id: null })
  }
}

const removeVariant = (index) => product.value.variants.splice(index, 1)

const saveQuickVariant = async () => {
  try {
    if (newSize.value.name) {
      const isDuplicate = sizes.value.some(size => size.name.trim().toLowerCase() === newSize.value.name.trim().toLowerCase())
      if (isDuplicate) return showSnackbar('Tên kích thước đã tồn tại!', 'warning')
      const res = await axios.post('http://localhost:3000/sizes', newSize.value)
      sizes.value.push(res.data.data)
    }
    if (newColor.value.name && newColor.value.code) {
      const isDuplicate = colors.value.some(color => color.name.trim().toLowerCase() === newColor.value.name.trim().toLowerCase())
      if (isDuplicate) return showSnackbar('Tên màu sắc đã tồn tại!', 'warning')
      const form = new FormData()
      form.append('name', newColor.value.name)
      form.append('code', newColor.value.code)
      const res = await axios.post('http://localhost:3000/colors', form)
      colors.value.push(res.data.data)
    }
    showSnackbar('Tạo nhanh thành công!', 'success')
    newSize.value = { name: '' }
    newColor.value = { name: '', code: '' }
    quickCreateDialog.value = false
  } catch (err) {
    console.error('Lỗi tạo nhanh:', err)
    showSnackbar('Thao tác thất bại.', 'error')
  }
}

const generateVariants = () => {
  const invalidColors = selectedColors.value.filter(
    (c) => !colors.value.some((color) => color.id === (c.id ?? c))
  )
  const invalidSizes = selectedSizes.value.filter(
    (s) => !sizes.value.some((size) => size.id === (s.id ?? s))
  )

  if (invalidColors.length || invalidSizes.length) {
    let msg = ''
    if (invalidColors.length) msg += `Màu không hợp lệ: ${invalidColors.map(c => c.name || c).join(', ')}. `
    if (invalidSizes.length) msg += `Kích thước không hợp lệ: ${invalidSizes.map(s => s.name || s).join(', ')}. `
    showSnackbar(msg.trim(), 'error')
    return
  }

  selectedColors.value.forEach(color => {
    selectedSizes.value.forEach(size => {
      const colorId = color.id ?? color
      const sizeId = size.id ?? size

      const exists = product.value.variants.some(
        (v) => v.color_id === colorId && v.size_id === sizeId
      )

      if (!exists) {
        product.value.variants.push({
          color_id: colorId,
          size_id: sizeId,
          stock_quantity: defaultQuantity.value
        })
      }
    })
  })

  showSnackbar(`Đã thêm ${totalNewVariants.value} biến thể`, 'success')

  variantDialog.value = false
  selectedColors.value = []
  selectedSizes.value = []
  defaultQuantity.value = 1
}




const triggerImageUpload = (index) => {
  fileInput.value.dataset.index = index
  fileInput.value.click()
}

const removeImage = (index) => {
  if (index === 0) {
    product.value.main_image = null
  } else {
    product.value.sub_images[index - 1] = null
  }
}

const handleImageSelect = (e) => {
  const file = e.target.files[0]
  const index = parseInt(e.target.dataset.index)
  if (!file) return
  if (index === 0) {
    product.value.main_image = file
  } else {
    product.value.sub_images[index - 1] = file
  }
  e.target.value = ''
}

const resetImages = async () => {
  product.value.main_image = null
  product.value.sub_images = [null, null, null, null]
  previewMainImage.value = null
  previewSubImages.value = [null, null, null, null]
  await nextTick()
}

const submitProduct = async () => {
  try {
    const res = await productService.getProductsList()
    const isDuplicate = res.data.data.some(p => p.name.trim().toLowerCase() === product.value.name.trim().toLowerCase())
    if (isDuplicate) return showSnackbar('Tên sản phẩm đã tồn tại.', 'error')
  } catch (err) {
    console.error(err)
    return showSnackbar('Không thể kiểm tra tên sản phẩm.', 'error')
  }

  const validation = await formRef.value?.validate?.()
  if (!validation?.valid) return showSnackbar('Vui lòng kiểm tra lại các trường.', 'warning')
  if (!product.value.variants.length) return showSnackbar('Cần ít nhất một biến thể.', 'warning')

  const invalidVariant = product.value.variants.find(v => !v.size_id || !v.color_id || v.stock_quantity == null)
  if (invalidVariant) return showSnackbar('Điền đầy đủ thông tin biến thể.', 'warning')

  loading.value = true
  const formData = new FormData()
  Object.entries({
    name: product.value.name,
    price: product.value.price,
    promotional: product.value.promotional,
    description: product.value.description,
    brand_id: product.value.brand_id,
    category_id: product.value.category_id,
    is_active: product.value.is_active ? 'true' : 'false'
  }).forEach(([key, value]) => formData.append(key, value))

  formData.append('url', product.value.main_image)
  product.value.sub_images.forEach(file => file instanceof File && formData.append('sub_images', file))
  formData.append('variants', JSON.stringify(product.value.variants))

  try {
    await productService.createProducts(formData)
    showSnackbar('Thêm sản phẩm thành công!', 'success')
    setTimeout(() => {
      router.push('/admin/products') 
    }, 2000)
    product.value = { name: '', price: null, promotional: null, description: '', brand_id: null, category_id: null, is_active: true, main_image: null, sub_images: [null, null, null, null], variants: [] }
    await resetImages()
  } catch (err) {
    console.error('Lỗi tạo sản phẩm:', err)
    showSnackbar('Thêm sản phẩm thất bại!', 'error')
  } finally {
    loading.value = false
  }
}
watch(() => product.value.variants, (variants) => {
  const seen = new Map()

  for (let i = 0; i < variants.length; i++) {
    const key = `${variants[i].size_id}-${variants[i].color_id}`

    if (seen.has(key)) {
      const duplicateIndex = seen.get(key)

      // Xoá biến thể trước đó (cũ hơn)
      product.value.variants.splice(duplicateIndex, 1)

      // Vì splice đã xoá 1 phần tử trước i => i giảm đi 1
      i--

      showSnackbar(`Đã xoá biến thể bị trùng (màu + kích thước)`, 'warning')
      continue
    }

    // Lưu lại vị trí của biến thể theo key
    seen.set(key, i)
  }
}, { deep: true })

</script>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.image-grid > :first-child {
  grid-column: 1 / -1;
}
.image-slot {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));
}
.is-primary {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
}
.upload-btn {
  height: 100%;
  border-style: dashed;
  border-radius: 8px;
}
.image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
}
.variants-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.variants-header,
.variants-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 50px;
  gap: 8px;
  align-items: center;
}
.variant-cell {
  display: flex;
  align-items: center;
}
</style>


