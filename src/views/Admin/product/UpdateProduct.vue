<template>
  <v-container fluid>
    <v-row>
      <!-- Tiêu đề -->
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="text-h5 font-weight-bold mb-0">Chỉnh sửa sản phẩm</h3>
        </v-card>
      </v-col>

      <!-- Form chính -->
      <v-col cols="12">
        <v-card class="pa-6 elevation-3 rounded-lg">
          <v-form v-if="productLoaded" ref="formRef" @submit.prevent="submitProduct">
            <v-row>
              <!-- Cột trái -->
              <v-col cols="12" md="8">
                <h4 class="text-subtitle-1 font-weight-medium mb-4">Thông tin sản phẩm</h4>

                <v-text-field
                  v-model="product.name"
                  label="Tên sản phẩm"
                  variant="outlined"
                  :rules="[required,uniqueName]"
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
                      :rules="[required,positiveNumber]"
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
                <v-row class="mt-n5 mb-n9">
                    <v-col cols="6">
                      <v-text-field 
                        v-model="product.promotional"
                        label="Giá khuyến mãi"
                        type="number"
                        variant="outlined"
                        dense
                        rounded="lg"
                        :rules="[required, positiveNumber]"
                      ></v-text-field>
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
                      :rules="[required]"
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
                      :rules="[required]"
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
                  :rules="[required]"
                  rounded="lg"
                ></v-textarea>

                <!-- Trong <v-form> ngay sau phần thông tin sản phẩm -->
<v-card class="mt-6 pa-4" outlined rounded="lg">
  <v-row class="justify-space-between align-center mb-2">
    <h4 class="text-subtitle-1 font-weight-medium">Biến thể</h4>
    <div>
      <v-menu transition="scale-transition">
        <template #activator="{ props }">
          <v-btn color="secondary" size="small" v-bind="props">Tạo nhanh</v-btn>
        </template>
        <v-list>
          <v-list-item @click="variantDialog = true">
            <v-list-item-title>Tạo nhiều biến thể</v-list-item-title>
          </v-list-item>
          <v-list-item @click="quickCreateDialog = true">
            <v-list-item-title>Tạo size/màu mới</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-row>

  <v-card-text class="px-2">
    <div v-if="!sizes.length || !colors.length" class="text-center py-8">
      <v-icon size="40" color="warning">mdi-alert</v-icon>
      <p>Chưa có kích thước hoặc màu sắc. Vui lòng tạo nhanh!</p>
    </div>
    <div v-else>
      <div v-if="product.variants.length" class="variants-table">
        <div class="variants-header">
          <div class="variant-cell">Kích thước</div>
          <div class="variant-cell">Màu sắc</div>
          <div class="variant-cell">Số lượng</div>
          <div class="variant-cell" style="width:50px"></div>
        </div>
        <div v-for="(variant, idx) in product.variants" :key="idx" class="variants-row">
          <div class="variant-cell">
            <v-select
              v-model="variant.size_id"
              :items="sizes"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="compact"
              hide-details
              :rules="[required]"
              @change="handleVariantChange(idx)"
            />
          </div>
          <div class="variant-cell">
            <v-select
              v-model="variant.color_id"
              :items="colors"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="compact"
              hide-details
              :rules="[required]"
              @change="handleVariantChange(idx)"
            />
          </div>
          <div class="variant-cell">
            <v-text-field
              v-model="variant.stock_quantity"
              type="number"
              min="0"
              variant="outlined"
              density="compact"
              hide-details
              :rules="[required, positiveNumber]"
            />
          </div>
          <div class="variant-cell">
            <v-btn icon color="error" variant="text" @click="removeVariant(idx)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <v-icon size="40" color="grey-darken-1" class="mb-2">mdi-format-list-text</v-icon>
        <div class="text-grey-darken-1">Chưa có biến thể. Click vào "Tạo nhanh" để thêm biến thể</div>
      </div>
    </div>
  </v-card-text>
</v-card>

<!-- Dialog tạo nhanh nhiều biến thể -->
<v-dialog v-model="variantDialog" max-width="500">
  <v-card>
    <v-card-title class="text-subtitle-1">Tạo nhanh nhiều biến thể</v-card-title>
    <v-card-text>
      <v-row>
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

<!-- Dialog tạo nhanh size/màu -->
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
          dense
          :rules="[required, duplicateSizeRule]"
        />
        <v-text-field
          label="Tên màu sắc"
          v-model="newColor.name"
          variant="outlined"
          prepend-inner-icon="mdi-palette"
          dense
          :rules="[required, duplicateColorRule]"
        />
        <v-file-input
          label="Ảnh màu đại diện"
          v-model="newColor.code"
          accept="image/*"
          prepend-inner-icon="mdi-image"
          prepend-icon=""
          :rules="[required]"
          variant="outlined"
          dense
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="quickCreateDialog = false">Hủy</v-btn>
      <v-btn color="primary" text @click="saveQuickVariant">Lưu</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
              </v-col>
              <!-- dialog kiểm tra biến thể trùng -->
<v-dialog v-model="confirmVariantDialog" max-width="500">
  <v-card>
    <v-card-title class="text-h6">Cập nhật số lượng biến thể</v-card-title>
    <v-card-text>
      Biến thể <strong>Size: {{ confirmVariantData.sizeName }}</strong>,
      <strong>Màu: {{ confirmVariantData.colorName }}</strong> đã tồn tại.<br>
      Bạn có muốn cập nhật lại số lượng thành <strong>{{ confirmVariantData.quantity }}</strong> không?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="confirmVariantDialog = false">Không</v-btn>
      <v-btn color="primary" @click="onConfirmUpdateVariant">Có</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

              <!-- Cột phải -->
<v-col cols="12" md="4">
  <h4 class="text-subtitle-1 font-weight-medium mb-4">Hình ảnh sản phẩm</h4>
  <v-card-text class="px-4 mt-n4">
    <!-- Lưới ảnh -->
    <div class="image-grid">
      <div
        v-for="(image, index) in 5"
        :key="index"
        class="image-slot"
        :class="{ 'is-primary': index === 0 }"
      >
        <template
          v-if="index === 0 ? product.main_image_preview : product.sub_images_preview[index - 1]"
        >
          <v-img
            :src="index === 0 ? product.main_image_preview : product.sub_images_preview[index - 1]"
            aspect-ratio="1"
            cover
            class="rounded"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular indeterminate color="primary" />
              </div>
            </template>
          </v-img>
          <div class="image-actions">
            <v-btn
              icon="mdi-delete"
              color="error"
              variant="flat"
              size="small"
              @click="removeImage(index)"
            />
          </div>
        </template>
        <template v-else>
          <v-btn
            color="primary"
            variant="outlined"
            block
            height="100%"
            class="upload-btn"
            prepend-icon="mdi-camera"
            @click="triggerImageUpload(index)"
          >
            <span>{{ index === 0 ? 'Ảnh chính' : 'Thêm ảnh' }}</span>
          </v-btn>
        </template>
      </div>
    </div>

    <!-- Input ảnh ẩn -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleImageSelect"
    />

    <div class="text-caption text-grey mt-2">
      * Ô đầu tiên là ảnh chính<br />
      * Định dạng: .jpg, .jpeg, .png, .avif<br />
      * Kích thước tối đa: 2MB/ảnh
    </div>
  </v-card-text>

  <v-row>
    <v-col cols="6">
      <v-btn color="error" class="mt-4 w-100" @click="cancelEdit">Hủy</v-btn>
    </v-col>
    <v-col cols="6">
      <v-btn
        color="success"
        class="mt-4 w-100"
        :loading="loading"
        :disabled="loading"
        @click="submitProduct"
      >
        Cập nhật sản phẩm
      </v-btn>
    </v-col>
  </v-row>
</v-col>

              
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import productService from '@/services/Admin/products'
import brandService from '@/services/Admin/brands'
import categoryService from '@/services/Admin/categories'
import sizeService from '@/services/Admin/sizes'
import colorService from '@/services/Admin/colors'

import { useSnackbar } from '@/composables/useSnackbar'

// ======================
// Reactive state & refs
// ======================
const loading = ref(false)
const productLoaded = ref(false)
const formRef = ref(null)
const fileInput = ref(null)

const route = useRoute()
const router = useRouter()

const { showSnackbar } = useSnackbar()

const product = ref({
  id: null,
  name: '',
  price: null,
  promotional: null,
  description: '',
  brand_id: null,
  category_id: null,
  is_active: true,
  main_image: null,
  main_image_preview: '',
  sub_images: [null, null, null, null],
  sub_images_preview: ['', '', '', ''],
  variants: [{ size_id: null, color_id: null, stock_quantity: null }]
})

const brands = ref([])
const categories = ref([])
const sizes = ref([])
const colors = ref([])

const variantDialog = ref(false)
const quickCreateDialog = ref(false)
const confirmVariantDialog = ref(false)

const newSize = ref({ name: '' })
const newColor = ref({ name: '', code: '' })

const selectedColors = ref([])
const selectedSizes = ref([])
const defaultQuantity = ref(1)

const originalName = ref('')
const existingProductNames = ref([])

// ======================
// Validation rules
// ======================
const required = (v) => !!v || 'Trường này là bắt buộc.'

const positiveNumber = (v) => {
  const num = Number(v)
  return (!isNaN(num) && num > 0) || 'Phải là số dương.'
}

const uniqueName = (v) => {
  if (!v) return true;
  const currentName = v.trim().toLowerCase();
  if (currentName === originalName.value) return true;
  return !existingProductNames.value.includes(currentName) || 'Tên sản phẩm đã tồn tại.'
}

const duplicateSizeRule = (v) => {
  if (!v || typeof v !== 'string') return true
  return !sizes.value.some(size => size.name.trim().toLowerCase() === v.trim().toLowerCase()) || 'Tên kích thước đã tồn tại.'
}

const duplicateColorRule = (v) => {
  if (!v || typeof v !== 'string') return true
  return !colors.value.some(color => color.name.trim().toLowerCase() === v.trim().toLowerCase()) || 'Tên màu sắc đã tồn tại.'
}

// ======================
// Computed properties
// ======================
const totalNewVariants = computed(() => selectedColors.value.length * selectedSizes.value.length)

const canGenerateVariants = computed(() =>
  selectedColors.value.length > 0 &&
  selectedSizes.value.length > 0 &&
  defaultQuantity.value > 0
)

// ======================
// Image Handling
// ======================
const handleImageSelect = (event) => {
  const index = Number(fileInput.value.dataset.index)
  const file = event.target.files[0]

  if (!file) return

  const previewUrl = URL.createObjectURL(file)

  if (index === 0) {
    product.value.main_image = file
    product.value.main_image_preview = previewUrl
  } else {
    product.value.sub_images[index - 1] = file
    product.value.sub_images_preview[index - 1] = previewUrl
  }

  event.target.value = ''
}

const resetProductImages = () => {
  product.value.main_image = null
  product.value.main_image_preview = ''
  product.value.sub_images = [null, null, null, null]
  product.value.sub_images_preview = ['', '', '', '']
}

const triggerImageUpload = (index) => {
  fileInput.value.dataset.index = index
  fileInput.value.click()
}

const removeImage = (index) => {
  if (index === 0) {
    product.value.main_image = null
    product.value.main_image_preview = ''
  } else {
    product.value.sub_images[index - 1] = null
    product.value.sub_images_preview[index - 1] = ''
  }
}

const previewMainImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    product.value.main_image = file
    product.value.main_image_preview = URL.createObjectURL(file)
  }
}

const previewSubImage = (index) => {
  const file = product.value.sub_images[index]
  if (file) {
    product.value.sub_images_preview[index] = URL.createObjectURL(file)
  }
}

// ======================
// Product Data Loading
// ======================
const loadProduct = async (id) => {
  try {
    if (!product.value.main_image_preview) {
      resetProductImages()
    }

    const res = await productService.getProductById(id)
    const data = res.data.data
    originalName.value = data.name.trim().toLowerCase()

    product.value = {
      id: data.id,
      name: data.name,
      price: Number(data.price),
      promotional: Number(data.promotional),
      description: data.description,
      brand_id: Number(data.brand_id),
      category_id: Number(data.category_id),
      is_active: data.is_active === '1' || data.is_active === true,
      main_image: null,
      main_image_preview: data.product_image?.[0]?.url || '',
      sub_images: [null, null, null, null],
      sub_images_preview: data.product_image?.slice(1).map(img => img.url) || [],
      variants: Array.isArray(data.product_variants) && data.product_variants.length > 0
        ? data.product_variants.map(v => ({
            size_id: v.size_id,
            color_id: v.color_id,
            stock_quantity: v.stock_quantity
          }))
        : [{ size_id: null, color_id: null, stock_quantity: null }]
    }

    productLoaded.value = true
  } catch (error) {
    console.error('❌ Lỗi khi load sản phẩm:', error)
    showSnackbar('Lỗi khi tải dữ liệu sản phẩm', 'error')
  }
}

// ======================
// Reference Data Loading
// ======================
const loadReferences = async () => {
  try {
    const [brandRes, categoryRes, sizeRes, colorRes] = await Promise.all([
      brandService.getBrandsList(),
      categoryService.getCategoriesList(),
      sizeService.getSizesList(),
      colorService.getColorsList()
    ])

    brands.value = Array.isArray(brandRes.data) ? brandRes.data : brandRes.data.data || []
    categories.value = Array.isArray(categoryRes.data) ? categoryRes.data : categoryRes.data.data || []
    sizes.value = Array.isArray(sizeRes.data) ? sizeRes.data : sizeRes.data.data || []
    colors.value = Array.isArray(colorRes.data) ? colorRes.data : colorRes.data.data || []
  } catch (err) {
    console.error('Lỗi tham chiếu:', err)
    showSnackbar('Lỗi khi tải dữ liệu tham khảo', 'error')
  }
}

// ======================
// Variants Handling
// ======================

const confirmVariantData = ref({
  sizeName: '',
  colorName: '',
  quantity: 0,
  index: -1,
})

function handleVariantChange(idx) {
  const curr = product.value.variants[idx]
  if (!curr.size_id || !curr.color_id) return
  const dup = product.value.variants.some((v, i) =>
    i !== idx &&
    v.size_id === curr.size_id &&
    v.color_id === curr.color_id
  )
  if (dup) {
    showSnackbar('Biến thể đã tồn tại!', 'error')
    curr.size_id = null
    curr.color_id = null
  }
}
const onConfirmUpdateVariant = () => {
  const { index, sizeName, colorName, quantity } = confirmVariantData.value

  if (index !== -1) {
    product.value.variants[index].stock_quantity = quantity
    showSnackbar(`✅ Đã cập nhật số lượng cho biến thể Size: ${sizeName}, Màu: ${colorName}`, 'success')
  }

  // Reset dialog state
  confirmVariantDialog.value = false

  // Reset selected sau khi dialog xử lý xong
  variantDialog.value = false
  selectedColors.value = []
  selectedSizes.value = []
  defaultQuantity.value = 1
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

  let added = 0
  let pendingUpdate = false

  selectedColors.value.forEach(color => {
  selectedSizes.value.forEach(size => {
  const colorId = color.id ?? color
  const sizeId = size.id ?? size
  const existingIndex = product.value.variants.findIndex(
    (v) => v.color_id === colorId && v.size_id === sizeId
  )
  const colorName = color.name || (colors.value.find(c => c.id === colorId)?.name ?? '')
  const sizeName = size.name || (sizes.value.find(s => s.id === sizeId)?.name ?? '')
  if (existingIndex !== -1) {
    // Mở dialog xác nhận
    confirmVariantData.value = {
      sizeName,
      colorName,
      quantity: defaultQuantity.value,
      index: existingIndex,
    }
    confirmVariantDialog.value = true
    pendingUpdate = true
  } else {
    product.value.variants.push({
      color_id: colorId,
      size_id: sizeId,
      stock_quantity: defaultQuantity.value
    })
    added++
  }
})
})

if (added && !pendingUpdate) {
  showSnackbar(`Đã thêm ${added} biến thể mới`, 'success')
  variantDialog.value = false
  selectedColors.value = []
  selectedSizes.value = []
  defaultQuantity.value = 1
  } 
}


function removeVariant(idx) {
  product.value.variants.splice(idx, 1)
}

// ======================
// Quick Create Variant (Size/Color)
// ======================
const saveQuickVariant = async () => {
  try {
    // Kiểm tra size trùng
    if (newSize.value.name) {
      const isDuplicateSize = sizes.value.some(size => size.name.trim().toLowerCase() === newSize.value.name.trim().toLowerCase())
      if (isDuplicateSize) {
        showSnackbar('Tên kích thước đã tồn tại!', 'warning')
        return
      } else {
        const res = await axios.post('http://localhost:3000/sizes', newSize.value)
        sizes.value.push(res.data.data)
      }
    }

    // Kiểm tra màu trùng
    if (newColor.value.name && newColor.value.code) {
      const isDuplicateColor = colors.value.some(color => color.name.trim().toLowerCase() === newColor.value.name.trim().toLowerCase())
      if (isDuplicateColor) {
        showSnackbar('Tên màu sắc đã tồn tại!', 'warning')
        return
      } else {
        const form = new FormData()
        form.append('name', newColor.value.name)
        form.append('code', newColor.value.code)

        const res = await axios.post('http://localhost:3000/colors', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        colors.value.push(res.data.data)
      }
    }

    showSnackbar('Tạo nhanh biến thể thành công!', 'success')
    newSize.value = { name: '' }
    newColor.value = { name: '', code: '' }
    quickCreateDialog.value = false
  } catch (err) {
    console.error('Lỗi khi tạo biến thể nhanh:', err)
    showSnackbar('Lỗi khi tạo biến thể nhanh, vui lòng thử lại.', 'error')
  }
}

// ======================
// Form Submission
// ======================
const submitProduct = async () => {
  const isValid = await formRef.value?.validate?.()
  if (!isValid) {
    showSnackbar('Vui lòng kiểm tra lại các trường nhập liệu.', 'error')
    return
  }

  try {
    // Lấy danh sách sản phẩm hiện có
    const res = await productService.getProductsList()
    const products = res.data.data || []

    // Kiểm tra trùng tên, bỏ qua sản phẩm hiện tại (edit)
    const isDuplicate = products.some(p =>
      p.name.trim().toLowerCase() === product.value.name.trim().toLowerCase() &&
      p.id !== product.value.id
    )

    if (isDuplicate) {
      showSnackbar('Tên sản phẩm đã tồn tại, vui lòng chọn tên khác.', 'error')
      return
    }
  } catch (error) {
    console.error('Lỗi kiểm tra trùng tên sản phẩm:', error)
    showSnackbar('Lỗi khi kiểm tra tên sản phẩm', 'error')
    return
  }

  // Kiểm tra giá
  if (Number(product.value.price) <= 0) {
    showSnackbar('Giá bán phải lớn hơn 0.', 'error')
    return
  }

  // Kiểm tra biến thể
  if (!product.value.variants.length) {
    showSnackbar('Vui lòng thêm ít nhất 1 biến thể.', 'error')
    return
  }

  const invalidVariant = product.value.variants.some(variant =>
    !variant.size_id || !variant.color_id || variant.stock_quantity === null
  )
  if (invalidVariant) {
    showSnackbar('Vui lòng điền đầy đủ thông tin cho tất cả các biến thể.', 'error')
    return
  }

  loading.value = true
  const formData = new FormData()

  formData.append('name', product.value.name)
  formData.append('price', product.value.price)
  formData.append('promotional', product.value.promotional)
  formData.append('description', product.value.description)
  formData.append('brand_id', product.value.brand_id)
  formData.append('category_id', product.value.category_id)
  formData.append('is_active', product.value.is_active ? '1' : '0')

  // Ảnh chính mới
  if (product.value.main_image instanceof File) {
    formData.append('url', product.value.main_image)
  }

  // Ảnh phụ mới
  product.value.sub_images.forEach((file) => {
    if (file instanceof File) {
      formData.append('sub_images', file)
    }
  })

  // Ảnh phụ cũ giữ lại (URL)
  product.value.sub_images_preview.forEach((url) => {
    if (url) {
      formData.append('sub_images_url[]', url)
    }
  })

  // Biến thể
  formData.append('variants', JSON.stringify(product.value.variants))

  try {
    await productService.updateProduct(product.value.id, formData)
    showSnackbar('Cập nhật sản phẩm thành công', 'success')
    setTimeout(() => {
      router.push({ name: 'productManage' })
    }, 1500)
  } catch (error) {
    console.error(error)
    showSnackbar('Cập nhật sản phẩm thất bại', 'error')
  } finally {
    loading.value = false
  }
}

// ======================
// Other helpers
// ======================
const cancelEdit = () => {
  router.back()
}

// ======================
// Watchers
// ======================
watch(() => product.value.variants, (variants) => {
  const seen = new Map()
  for (let i = 0; i < variants.length; i++) {
    const key = `${variants[i].size_id}-${variants[i].color_id}`
    if (seen.has(key)) {
      product.value.variants.splice(i, 1)
      i--
      showSnackbar('Đã xoá biến thể bị trùng!', 'warning')
    } else {
      seen.set(key, i)
    }
  }
}, { deep: true })

// ======================
// Lifecycle hook
// ======================
onMounted(async () => {
  try {
    const res = await productService.getProductsList()
    existingProductNames.value = res.data.data.map(p => p.name.trim().toLowerCase())
  } catch (err) {
    console.error('Lỗi khi load danh sách sản phẩm:', err)
  }
  await loadReferences()
  const productId = route.params.id
  if (productId) {
    await loadProduct(productId)
  }
})
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


