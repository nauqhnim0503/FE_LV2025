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
          <v-form v-if="productLoaded">
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

                <!-- Hiển thị ảnh hiện tại, cho phép đổi ảnh mới -->
                <div v-if="product.main_image_preview" class="mb-3">
                  <img :src="product.main_image_preview" alt="Ảnh chính hiện tại" style="width: 100%; border-radius: 8px;" />
                </div>
                <v-file-input
                  label="Đổi ảnh chính"
                  v-model="product.main_image"
                  accept="image/*"
                  prepend-inner-icon="mdi-image"
                  variant="outlined"
                  dense
                  rounded="lg"
                  class="mb-4"
                  style="height: 200px;"
                  @change="previewMainImage"
                ></v-file-input>

                <div>
                  <p class="mb-2 font-weight-medium">Ảnh phụ hiện tại:</p>
                  <v-row dense>
                    <v-col cols="6" v-for="(img, i) in product.sub_images_preview" :key="'preview-sub-' + i">
                      <img :src="img" alt="Ảnh phụ" style="width: 100%; border-radius: 8px; margin-bottom: 8px;" />
                    </v-col>
                  </v-row>
                </div>

                <v-row dense class="mb-2">
                  <v-col cols="6" v-for="i in 2" :key="'sub1-' + i">
                    <v-file-input
                      :label="'Ảnh phụ ' + i"
                      v-model="product.sub_images[i - 1]"
                      accept="image/*"
                      prepend-inner-icon="mdi-image"
                      variant="outlined"
                      dense
                      rounded="lg"
                      @change="previewSubImage(i - 1)"
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
                      variant="outlined"
                      dense
                      rounded="lg"
                      @change="previewSubImage(i + 1)"
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-btn color="error" class="mt-4 w-100" @click="cancelEdit">Hủy</v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn color="success" class="mt-4 w-100" @click="submitProduct">Cập nhật sản phẩm</v-btn>
                  </v-col>
                </v-row>
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
              dense
            ></v-text-field>
            <v-text-field
              label="Tên màu sắc"
              v-model="newColor.name"
              variant="outlined"
              prepend-inner-icon="mdi-palette"
              dense
            ></v-text-field>
            <v-file-input
              label="Ảnh màu đại diện"
              v-model="newColor.code"
              accept="image/*"
              prepend-inner-icon="mdi-image"
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
import { useRoute, useRouter } from 'vue-router'

import productService from '@/services/Admin/products'
import brandService from '@/services/Admin/brands'
import categoryService from '@/services/Admin/categories'
import sizeService from '@/services/Admin/sizes'
import colorService from '@/services/Admin/colors'

const route = useRoute()
const router = useRouter()
const productLoaded = ref(false)

const resetProductImages = () => {
  product.value.main_image = null;
  product.value.main_image_preview = '';
  product.value.sub_images = [null, null, null, null];
  product.value.sub_images_preview = ['', '', '', ''];
};

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

const snackbar = ref({ show: false, text: '', color: 'error' })
const showSnackbar = (text, color = 'error') => {
  snackbar.value = { show: true, text, color }
}

const quickCreateDialog = ref(false)
const newSize = ref({ name: '' })
const newColor = ref({ name: '', code: '' })

// ... các hàm xử lý như bạn đã viết (handleVariantChange, addVariant, removeVariant, previewMainImage, previewSubImage, ...)

// Load dữ liệu sản phẩm từ API (giữ nguyên)
const loadProduct = async (id) => {
  try {
    // Chỉ reset hình ảnh khi cần thiết, không reset nếu có ảnh cũ
    if (!product.value.main_image_preview) {
      resetProductImages();  // Đảm bảo rằng các hình ảnh được reset trước khi tải lại sản phẩm
    }

    const res = await productService.getProductById(id);
    const data = res.data.data;

    // Cập nhật thông tin sản phẩm
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
      main_image_preview: data.product_image?.[0]?.url || '', // Nếu có ảnh chính, hiển thị luôn
      sub_images: [null, null, null, null],
      sub_images_preview: data.product_image?.slice(1).map(img => img.url) || [], // Nếu có ảnh phụ, hiển thị luôn
      variants: Array.isArray(data.product_variants) && data.product_variants.length > 0
        ? data.product_variants.map(v => ({
            size_id: v.size_id,
            color_id: v.color_id,
            stock_quantity: v.stock_quantity
          }))
        : [{ size_id: null, color_id: null, stock_quantity: null }]
    };

    productLoaded.value = true;
  } catch (error) {
    console.error('❌ Lỗi khi load sản phẩm:', error);
    showSnackbar('Lỗi khi tải dữ liệu sản phẩm', 'error');
  }
};





// Load dữ liệu tham chiếu (brands, categories, sizes, colors) từ các service riêng biệt
const loadReferences = async () => {
  try {
    const [brandRes, categoryRes, sizeRes, colorRes] = await Promise.all([
      brandService.getBrandsList(),
      categoryService.getCategoriesList(),
      sizeService.getSizesList(),
      colorService.getColorsList()
    ])

    // Giả sử API trả về { data: [...] }
    brands.value = Array.isArray(brandRes.data) ? brandRes.data : brandRes.data.data || []
    categories.value = Array.isArray(categoryRes.data) ? categoryRes.data : categoryRes.data.data || []
    sizes.value = Array.isArray(sizeRes.data) ? sizeRes.data : sizeRes.data.data || []
    colors.value = Array.isArray(colorRes.data) ? colorRes.data : colorRes.data.data || []
  } catch (err) {
    console.error('Lỗi tham chiếu:', err)
    showSnackbar('Lỗi khi tải dữ liệu tham khảo', 'error')
  }
}


// Hàm submit sản phẩm, lưu nhanh biến thể, hủy ... giữ nguyên (chỉ thay productService)
const submitProduct = async () => {
  const formData = new FormData();

  formData.append('name', product.value.name);
  formData.append('price', product.value.price);
  formData.append('promotional', product.value.promotional);
  formData.append('description', product.value.description);
  formData.append('brand_id', product.value.brand_id);
  formData.append('category_id', product.value.category_id);
  formData.append('is_active', product.value.is_active ? '1' : '0');

  // Gửi ảnh chính mới nếu có
  if (product.value.main_image instanceof File) {
    formData.append('url', product.value.main_image);
  }

  // Gửi ảnh phụ mới nếu có
  product.value.sub_images.forEach((file) => {
    if (file instanceof File) {
      formData.append('sub_images', file); // nhiều ảnh có cùng key -> backend nhận mảng
    }
  });

  // Gửi danh sách ảnh phụ cũ cần giữ lại (URL)
  product.value.sub_images_preview.forEach((url) => {
    if (url) {
      formData.append('sub_images_url[]', url); // quan trọng: phải là sub_images_url[]
    }
  });

  // Gửi biến thể
  formData.append('variants', JSON.stringify(product.value.variants));

  try {
    await productService.updateProduct(product.value.id, formData);
    showSnackbar('Cập nhật sản phẩm thành công', 'success');
    setTimeout(() => {
      router.push({ name: 'productManage' });
    }, 1500);
  } catch (error) {
    console.error(error);
    showSnackbar('Cập nhật sản phẩm thất bại', 'error');
  }
};


const cancelEdit = () => {
  router.back()
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
const previewMainImage = (event) => {
  const file = event.target.files[0]; // Lấy ảnh mới
  if (file) {
    product.value.main_image = file; // Cập nhật ảnh chính mới
    product.value.main_image_preview = URL.createObjectURL(file); // Cập nhật preview
  }
};

const previewSubImage = (index) => {
  const file = product.value.sub_images[index]; // Lấy ảnh phụ mới
  if (file) {
    product.value.sub_images_preview[index] = URL.createObjectURL(file); // Cập nhật ảnh phụ preview
  }
};


onMounted(async () => {
  await loadReferences()
  const productId = route.params.id
  if (productId) {
    await loadProduct(productId)
  }
})

</script>



