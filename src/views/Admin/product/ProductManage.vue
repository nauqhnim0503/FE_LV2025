  <template>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4">
            <v-row align="center">
              <v-col cols="6">
                  <h2 class="mb-0">Quản lý sản phẩm</h2>
              </v-col>
              <v-col cols="6" class="text-right">
                  <v-btn
                      color="primary"
                      :to="{ name: 'createProducts' }"
                      prepend-icon="mdi-plus">
                      Thêm sản phẩm
                  </v-btn>  
              </v-col>
            </v-row>  
          </v-card>     
        </v-col>

        <v-col cols="12">
        <v-card class="pa-4">
        <v-card-text>
          <v-row>
            <!-- Search -->
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="search"
                label="Tìm kiếm sản phẩm"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              ></v-text-field>
            </v-col>

            <!-- Brand Filter -->
            <v-col cols="12" sm="3">
              <v-select
                v-model="selectedBrand"
                :items="brands"
                item-title="name"
                item-value="id"
                label="Thương hiệu"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                @update:model-value="handleFilterChange"
              ></v-select>
            </v-col>

            <!-- Category Filter -->
            <v-col cols="12" sm="3">
              <v-select
                v-model="selectedCategory"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Danh mục"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                @update:model-value="handleFilterChange"
              ></v-select>
            </v-col>

            <!-- Status Filter -->
            <v-col cols="12" sm="2">
              <v-select
                v-model="selectedStatus"
                :items="statusOptions"
                item-title="text"
                item-value="value"
                label="Trạng thái"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-col cols="12">
          <!-- Bảng dữ liệu -->
          <v-data-table
            :headers="headers"
            :items="filteredProducts"
            item-value="id"
            class="elevation-1 mt-4"
          >
            <template #[`item.name`]="{ item }">
              <router-link style="text-decoration: none;" :to="{ name: 'productDetails', params: { id: item.id } }">
                {{ item.name }}
              </router-link>
            </template>
            <template #[`item.image`]="{ item }">
              <v-img
                :src="item.product_image?.[0]?.url"
                max-width="80"
                max-height="80"
                cover
                class="rounded"
              ></v-img>
            </template>
            
            <!-- Biến thể -->
            <template #[`item.variants`]="{ item }">
              <div>
                <v-chip
                  v-for="(variant, index) in item.product_variants"
                  :key="variant.id"
                  color="primary"
                  text-color="white"
                  small
                  class="ma-1"
                >
                  {{ variant.sizes?.name || variant.size_id }} / {{ variant.colors?.name || variant.color_id }} ({{ variant.stock_quantity }})
                </v-chip>
              </div>
            </template>

            <!-- Ngày tạo -->
            <template #[`item.createdAt`]="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <!-- Trạng thái -->
            <template #[`item.is_active`]="{ item }">
              <v-chip
                :color="item.is_active ? 'green' : 'red'"
                text-color="white"
                small
              >
                {{ item.is_active ? 'Đang bán' : 'Ngừng bán' }}
              </v-chip>
            </template>

            <!-- Thao tác -->
            <template #[`item.actions`]="{ item }">
              <div class="d-flex justify-center gap-2">
                <!-- Nút chỉnh sửa -->
                <v-tooltip text="Chỉnh sửa" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      density="comfortable"
                      variant="text"
                      color="primary"
                      :to="{ name: 'updateProducts', params: { id: item.id } }"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <!-- Nút bật tắt trạng thái -->
                <v-tooltip :text="item.is_active ? 'Ngừng bán' : 'Mở bán'" location="top">
                  <template #activator="{ props }">
                    <v-switch
                      v-bind="props"
                      hide-details
                      density="compact"
                      color="success"
                      :model-value="item.is_active"
                      @update:model-value="() => toggleStatus(item)"
                      :disabled="loadingIds.includes(item.id)"
                      inset
                    ></v-switch>
                  </template>
                </v-tooltip>
              </div>
            </template>
          </v-data-table>
        </v-col>
        </v-card>
      </v-col>
      </v-row>

      <!-- Snackbar thông báo -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
        top
        right
      >
        {{ snackbar.message }}
        <template #actions>
          <v-btn text @click="snackbar.show = false">Đóng</v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';

  // Reactive state
  const search = ref('');
  const categories = ref([]);
  const brands = ref([]);
  const products = ref([]);

  const selectedStatus = ref(null);
  const selectedBrand = ref(null);
  const selectedCategory = ref(null);

  const loadingIds = ref([]); // Danh sách sản phẩm đang cập nhật trạng thái

  const snackbar = ref({
    show: false,
    message: '',
    color: 'success', // success hoặc error
  });

  // Headers bảng dữ liệu
  const headers = [
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: '60',
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      align: 'start',
      width: '200',
      sortable: false
    },
    {
      title: 'Ảnh sản phẩm',
      key: 'image',
      align: 'left',
      width: '200',
      sortable: false
    },
    {
      title: 'Giá bán',
      key: 'price',
      align: 'start',
      width: '120'
    },
    {
      title: 'Giá khuyến mãi',
      key: 'promotional',
      align: 'start',
      width: '187'
    },
    {
    title: 'Biến thể',
    key: 'variants', 
    align: 'start',
    sortable: false,
    width: '400'
    },
    {
      title: 'Trạng thái',
      key: 'is_active',
      align: 'center',
      width: '120'
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      align: 'center',
      width: '150'
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      width: '150',
      sortable: false
    }
  ]

  // Tùy chọn trạng thái
  const statusOptions = [
    { text: 'Đang bán', value: true },
    { text: 'Ngừng bán', value: false }
  ];

  // Hàm fetch dữ liệu ban đầu
  onMounted(async () => {
    try {
      const [brandsRes, categoriesRes, productsRes] = await Promise.all([
        axios.get('http://localhost:3000/brands'),
        axios.get('http://localhost:3000/categories'),
        axios.get('http://localhost:3000/products')
      ]);

      brands.value = brandsRes.data.data;
      categories.value = categoriesRes.data.data;
      products.value = productsRes.data.data;
    } catch (err) {
      console.error('Lỗi khi fetch dữ liệu:', err);
    }
  });

  // Lọc sản phẩm theo search, brand, category, status
  const filteredProducts = computed(() => {
    return products.value.filter((product) => {
      const matchesSearch = (product.name || '').toLowerCase().includes((search.value || '').toLowerCase());
      //const matchesSearch = String(product.price).includes(search.value || '');
      const matchesBrand = selectedBrand.value !== null ? product.brand_id === selectedBrand.value : true;

      const matchesCategory = selectedCategory.value !== null ? product.category_id === selectedCategory.value : true;

      const matchesStatus = selectedStatus.value !== null ? product.is_active === selectedStatus.value : true;

      return matchesSearch && matchesBrand && matchesCategory && matchesStatus;
    });
  });

  // Cập nhật trạng thái sản phẩm, có ràng buộc disable toggle khi đang cập nhật
  const toggleStatus = async (item) => {
    if (loadingIds.value.includes(item.id)) return; // tránh click nhiều lần cùng lúc

    loadingIds.value.push(item.id);
    try {
      const newStatus = !item.is_active;

      await axios.patch(`http://localhost:3000/products/${item.id}`, {
        is_active: newStatus
      });

      item.is_active = newStatus;

      snackbar.value = {
        show: true,
        message: `Cập nhật trạng thái sản phẩm "${item.name}" thành công!`,
        color: 'success',
      };
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
      snackbar.value = {
        show: true,
        message: `Cập nhật trạng thái sản phẩm "${item.name}" thất bại!`,
        color: 'error',
      };
    } finally {
      loadingIds.value = loadingIds.value.filter(id => id !== item.id);
    }
  };

  // Định dạng ngày tháng
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  </script>
  <style scoped>
  .text-right {
    text-align: right;
  }
  </style>
