<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" md="8">
        <!-- Thông tin giao hàng -->
        <v-card class="pa-6 mb-4" elevation="2" style="border-radius: 15px">
          <h2 class="text-h6 font-weight-bold mb-4 font-title">Thông tin giao hàng</h2>
          <v-text-field label="Họ và tên" v-model="shipping.name" :error-messages="shippingErrors.name" variant="outlined" dense @input="clearError('name')"/>
          <v-text-field label="Số điện thoại" v-model="shipping.phone" :error-messages="shippingErrors.phone" variant="outlined" dense @input="clearError('phone')"/>
          <v-text-field label="Email (không bắt buộc)" v-model="shipping.email" :error-messages="shippingErrors.email" variant="outlined" dense @input="clearError('email')" />
          <v-text-field label="Quốc gia" v-model="shipping.country" variant="outlined" dense disabled />
          <v-text-field label="Địa chỉ, tên đường" v-model="shipping.address" :error-messages="shippingErrors.address" variant="outlined" dense @input="clearError('address')"/>
          <v-menu
              v-model="addressMenu"
              :close-on-content-click="false"
              max-width="400"
              offset-y
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  label="Tỉnh/TP, Quận/Huyện, Phường/Xã"
                  v-model="addressText"
                  :error-messages="addressErrorMessages"
                  variant="outlined"
                  dense
                  readonly
                  @click="addressMenu = true"
                />
              </template>
          
              <v-card style="padding: 16px; width: 380px;">
                <v-select
                  :items="provinces"
                  item-title="name"
                  item-value="code"
                  v-model="shipping.province"

                  label="Tỉnh/TP"
                  dense
                  variant="outlined"
                  return-object
                  :menu-props="{ maxHeight: '250' }"
                  @update:modelValue="clearError('province')"
                />
                <v-select
                  :items="districts"
                  item-title="name"
                  item-value="code"
                  v-model="shipping.district"
                  label="Quận/Huyện"
                  dense
                  variant="outlined"
                  :disabled="!shipping.province"
                  return-object
                  :menu-props="{ maxHeight: '250' }"
                  class="mt-4"
                  @update:modelValue="clearError('district')"
                />
                <v-select
                  :items="wards"
                  item-title="name"
                  item-value="code"
                  v-model="shipping.ward"
                  
                  label="Phường/Xã"
                  dense
                  variant="outlined"
                  :disabled="!shipping.district"
                  return-object
                  :menu-props="{ maxHeight: '250' }"
                  class="mt-4"
                  @update:modelValue="clearError('ward')"
                />
            
                <v-btn
                  color="black"
                  block
                  class="mt-6"
                  @click="confirmAddress">
                  Xác nhận
                </v-btn>
              </v-card>
            </v-menu>
        </v-card>

        
        <!-- Phương thức thanh toán -->
<v-card class="pa-6 mb-4" elevation="2" style="border-radius: 15px">
  <h2 class="text-h6 font-weight-bold mb-4 font-title">Phương thức thanh toán</h2>

  <v-row dense no-gutters>
    <v-col cols="12" class="pa-0" v-for="method in paymentMethods" :key="method.value">
      <v-sheet
        :elevation="paymentMethod === method.value ? 2 : 1"
        class="d-flex align-center pa-3 mb-3 "
        style="border-radius: 12px; border: 1px solid #ddd; cursor: pointer"
        :class="paymentMethod === method.value ? 'border-black' : ''"
        @click="paymentMethod = method.value">
        <div class="d-flex align-center " style="gap: 12px; margin-left: 0">
          <v-radio
            :model-value="paymentMethod"
            :value="method.value"
            hide-details
            color="black"
            density="compact"
            @update:model-value="val => paymentMethod = val"
            class="ma-0 pa-0"
            style="margin-left: 0"
          ></v-radio>
          <v-img
            :src="method.icon"
            height="32"
            width="32"
            contain
          ></v-img>
          <div class="text-subtitle-2 font-weight-medium font-title">
            {{ method.label }}
          </div>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</v-card>


      </v-col>

      <!-- Giỏ hàng & Tóm tắt -->
      <v-col cols="12" md="4">
        <!-- Giỏ hàng -->
        <v-card class="pa-4 mb-4" elevation="2" style="border-radius: 15px">
  <h2 class="text-h6 font-weight-bold mb-4 font-title">Giỏ hàng</h2>

  <div v-if="hasItemsToCheckout">
  <div v-for="item in productToCheckout ? [productToCheckout] : cartItems" :key="item.id" class="mb-4">
  <v-row>
    <!-- Ảnh sản phẩm -->
    <v-col cols="3">
      <v-img :src="item.image" height="60" />
    </v-col>

    <!-- Thông tin sản phẩm + Giá tiền -->
    <v-col cols="6" class="d-flex flex-column justify-space-between">
      <div>
        <div class="font-weight-medium">{{ item.name }}</div>
        <div
          class="d-inline-flex align-center text-caption mt-1"
          style="
            cursor: pointer;
            background-color: #f5f5f5;
            padding: 4px 8px;
            border-radius: 6px;
            gap: 4px;
          "
          @click="openVariantDialog(item)">
          <div>{{ item.color }} / {{ item.size }}</div>
          <v-icon small>mdi-chevron-right</v-icon>
        </div>
      </div>

      <!-- Giá tiền nằm dưới thông tin sản phẩm -->
      <div class="mt-2 font-weight-bold price">{{ formatPrice(item.finalPrice * item.quantity) }}</div>
    </v-col>

    <!-- Nút xóa và tăng giảm số lượng -->
    <v-col
      cols="3"
      class="d-flex flex-column align-end justify-space-between"
      style="gap: 8px;">
      <!-- Icon thùng rác nằm trên cùng -->
        <v-btn
          icon
          size="small"
          @click="removeItem(item)"
          style="background-color: transparent !important; box-shadow: none !important;">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>

        <!-- Nút tăng giảm số lượng -->
        <div class="d-flex align-center" style="gap: 8px;">
        <v-btn
          icon
          small
          @click="decreaseQty(item)"
          style="background-color: transparent !important; box-shadow: none !important;">
        <v-icon>mdi-minus</v-icon>
        </v-btn>
        <div class="price">{{ item.quantity }}</div>
        <v-btn
          icon
          small
          @click="increaseQty(item)"
          style="background-color: transparent !important; box-shadow: none !important;">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </v-col>
  </v-row>
</div>
</div>

<!-- Hiển thị khi không có sản phẩm -->
<div v-else class="text-center pa-10">
  <v-icon size="48" color="grey">mdi-cart-off</v-icon>
  <p class="mt-2 text-subtitle-1 font-title">Không có sản phẩm trong giỏ hàng</p>
</div>

</v-card>
<v-dialog v-model="variantDialog" width="500">
  <v-card
    style="
      background-color: #f5f5f5;
      padding: 0;            
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between; ">
    <!-- Tiêu đề dialog -->
    <v-card-title
      class="justify-center text-h6 font-weight-bold position-relative font-title"
      style="
        background: white;
        border-radius: 8px 8px 0 0; 
        padding: 16px;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 0; ">

      Chọn phân loại
      <v-btn
        icon
        size="24"
        class="position-absolute"
        style="right: 8px; top: 8px; background-color: #f0f0f0; border-radius: 4px; min-width: 24px; height: 24px;"
        @click="variantDialog = false">
        <v-icon size="16">mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider class="mb-4" style="margin-top: 0;" />

    <div style="flex-grow: 1; overflow-y: auto; padding: 0 16px 16px 16px; box-sizing: border-box;">
      <!-- Thông tin sản phẩm -->
      <v-card-text
          style="
          background: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          width: 100%;
          box-sizing: border-box;
          margin-top: 0;">
        <v-row>
          <v-col cols="4">
            <v-img :src="selectedItem?.image" height="60" />
            <div v-if="outOfStock" style="color: red; font-weight: bold; margin-top: 8px; font-size: 14px;">
              Hết hàng
            </div>
          </v-col>
          <v-col cols="8">
            <div class="font-weight-medium">{{ selectedItem?.name }}</div>
            <div class="text-red font-weight-bold price">{{ formatPrice(selectedItem?.price || 0) }}</div>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Chọn màu -->
      <v-card-text
        style="
          background: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          width: 100%;
          box-sizing: border-box;">
        <div class="text-subtitle-2 font-weight-medium mb-3 font-title">Chọn màu</div>
          <div class="d-flex flex-wrap" style="gap: 8px;">
            <div
            v-for="color in availableColors"
            :key="color"
            :class="[
              'variant-option',
              { 
                active: selectedColor === color,
                dimmed: selectedSize && !filteredColors.includes(color)
              }]"
            @click="() => {
              if (selectedSize && !filteredColors.includes(color)) {
                selectedColor = color
                selectedSize = ''
                outOfStock = true  // <-- thêm dòng này
              } else {
                selectedColor = color
                outOfStock = false  // <-- reset khi chọn đúng
              }}">
            {{ color }}
          </div>
</div>

      </v-card-text>

      <!-- Chọn kích thước -->
      <v-card-text
        style="
          background: white;
          border-radius: 8px;
          padding: 16px;
          width: 100%;
          box-sizing: border-box;">
        <div class="text-subtitle-2 font-weight-medium mb-3 font-title">Chọn kích thước</div>
        <div class="d-flex flex-wrap" style="gap: 8px;">
          <div
          v-for="size in availableSizes"
          :key="size"
          :class="[
            'variant-option',
            { 
              active: selectedSize === size,
              dimmed: selectedColor && !filteredSizes.includes(size)
            }]"
          @click="() => {
            if (selectedColor && !filteredSizes.includes(size)) {
              selectedSize = size
              selectedColor = ''
              outOfStock = true  // <-- thêm dòng này
            } else {
              selectedSize = size
              outOfStock = false // <-- reset khi chọn đúng
            }}">
          {{ size }}
        </div>
        </div>
      </v-card-text>
    </div>

    <!-- Xác nhận -->
    <v-card-actions
      style="
        padding: 0 16px 16px 16px;
        margin-top: 0;
        background: transparent;">
      <v-btn
        color="black"
        variant="flat"
        style="width: 100%; justify-content: center;"
        @click="confirmVariantSelection"
        :disabled="outOfStock">
        Xác nhận
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


        <!-- Mã khuyến mãi -->
        <v-card class="pa-4 mb-4" elevation="2" style="border-radius: 15px">
            <h2 class="text-h6 font-weight-bold mb-4 font-title">Mã giảm giá</h2>
          <v-text-field
            v-model="discountCode"
            label="Mã giảm giá"
            append-inner-icon="mdi-tag"
            dense
            variant="outlined"/>
            <div class="text-caption text-primary mt-1" style="cursor: pointer;" @click="openDiscountDialog">
              🔖 Xem các mã giảm giá đã lưu
            </div>
          <v-btn class="mt-2" block @click="applyDiscount" color="black" dark>Áp dụng</v-btn>
        </v-card>
        <v-dialog v-model="showSavedCodes" width="500">
          <v-card>
            <v-card-title class="text-h6 font-title">Chọn mã giảm giá</v-card-title>
            <v-divider />
          
            <v-card-text>
              <v-radio-group v-model="selectedDiscountCode">
                <v-radio
                  v-for="(code, index) in savedCodes"
                  :key="index"
                  :value="code.code"
                  :disabled="code.isDisabled"
                  :class="{ 'disabled-discount': code.isDisabled }"
                  class="my-2">
                  <template #label>
                    <div>
                      <strong>{{ code.code }}</strong>
                      <div class="text-caption text-grey">
                        Giảm 
                        <span v-if="code.discount_type === 'fixed'">
                          {{ code.discount_value.toLocaleString('vi-VN') }}₫
                        </span>
                        <span v-else-if="code.discount_type === 'percent'">
                          {{ code.discount_value }}%
                        </span>
                        <span v-if="code.min_order_value">
                          đơn từ {{ code.min_order_value.toLocaleString('vi-VN') }}₫
                        </span>
                      </div>
                      <div
                        v-if="code.isDisabled"
                        class="text-caption text-red mt-1">
                        ⚠ Đơn hàng chưa đủ điều kiện sử dụng mã này
                      </div>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-card-text>
          
            <v-card-actions class="justify-end">
              <v-btn text @click="showSavedCodes = false">Hủy</v-btn>
              <v-btn color="black" @click="applySelectedDiscount">Áp dụng</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <!-- Tóm tắt đơn hàng -->
        <v-card class="pa-4" elevation="2" style="border-radius: 15px">
          <h2 class="text-h6 font-weight-bold mb-4 font-title">Tóm tắt đơn hàng</h2>
          <v-row>
            <v-col>Tổng tiền hàng</v-col>
            <v-col class="text-end price">{{ formatPrice(originalTotal) }}</v-col>
          </v-row>
          <v-row v-if="discountAmount > 0" class="text-success">
            <v-col>Mã giảm giá</v-col>
            <v-col class="text-end">- {{ formatPrice(discountAmount) }}</v-col>
          </v-row>
          <v-row>
            <v-col>Phí vận chuyển</v-col>
            <v-col class="text-end">Miễn phí</v-col>
          </v-row>
          <v-row class="font-weight-bold text-red text-subtitle-1">
            <v-col class="font-title">Tổng thanh toán</v-col>
            <v-col class="text-end">{{ formatPrice(totalPrice) }}</v-col>
          </v-row>

          <v-btn
            color="black"
            class="mt-4"
            block
            size="large"
            @click="placeOrder"
            :disabled="!hasItemsToCheckout">
            Đặt hàng
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Hộp thoại xác nhận xóa sản phẩm -->
<v-dialog v-model="confirmDeleteDialog" width="400">
  <v-card>
    <v-card-title class="text-h6 font-weight-bold font-title">
      Bạn muốn bỏ khỏi giỏ hàng
    </v-card-title>
    <v-card-text>
      <span class="font-weight-medium">{{ itemToDelete?.name }}</span>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn text @click="confirmDeleteDialog = false" color="grey">Quay lại</v-btn>
      <v-btn color="red" variant="flat" @click="confirmDelete">Bỏ sản phẩm</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>


<script setup>
import { ref, computed, watch, onMounted,reactive  } from 'vue'
import { useCart } from '@/store/useCart'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { createOrder } from '@/services/User/orderService';
import { getUser  } from '@/store/auth'  // hoặc nơi bạn lưu auth info
import { useSnackbar } from '@/composables/useSnackbar'

const { showSnackbar } = useSnackbar()

const router = useRouter()
const { cartItems, removeFromCart,updateQuantity,clearCart } = useCart()


// -- Reactive state --
const addressMenu = ref(false)
const addressText = ref('')

const provinces = ref([])
const districts = ref([])
const wards = ref([])

const shipping = ref({
  name: '',
  phone: '',
  email: '',
  country: 'Vietnam',
  address: '',
  province: null,
  district: null,
  ward: null,
})

const paymentMethod = ref('cod')
const discountCode = ref('')
const showSavedCodes = ref(false)
const savedCodes = ref([])
const selectedDiscountCode = ref('')
const discountAmount = ref(0)
const appliedDiscountId = ref(null)

const variantDialog = ref(false)
const selectedItem = ref(null)
const selectedColor = ref('')
const selectedSize = ref('')

// -- Constants / Static data --
const paymentMethods = [
  {
    value: 'cod',
    label: 'Thanh toán khi giao hàng (COD)',
    icon: 'https://cdn-icons-png.freepik.com/512/9198/9198191.png',
  },
  {
    value: 'vnpay',
    label: 'Thanh toán Online VNPAY',
    icon: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png',
  },
]

const availableColors = ref([])
const availableSizes = ref([])

// -- Computed properties --
const fullAddress = computed(() => {
  let str = ''
  if (shipping.value.ward) str += ', ' + shipping.value.ward.name
  if (shipping.value.district) str += ', ' + shipping.value.district.name
  if (shipping.value.province) str += shipping.value.province.name
  return str || ''
})

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const originalTotal = computed(() =>{
  if (productToCheckout.value) {
    return productToCheckout.value.finalPrice * (productToCheckout.value.quantity || 1)
  }
  return cartItems.value.reduce((total, item) => total + item.finalPrice * item.quantity, 0)
})

const totalPrice = computed(() =>
  originalTotal.value - discountAmount.value
)

const productToCheckout = ref(null)
// -- Lifecycle hooks --
onMounted(async () => {
  try {
    const res = await axios.get('https://provinces.open-api.vn/api/p/')
    provinces.value = res.data
  } catch (error) {
    console.error('Lỗi load provinces:', error)
  }
  const data = sessionStorage.getItem('checkoutProduct')
  if (data) {
    productToCheckout.value = JSON.parse(data)
    sessionStorage.removeItem('checkoutProduct') // Xóa sản phẩm 
  }
  const user = getUser()
  if(user?.id){
    try{
      const {data} = await axios.get(`http://localhost:3000/users/profile/${user.id}`)
      const profile = data.data

      shipping.value.name = profile.name || ''
      shipping.value.phone = profile.phone || ''
      shipping.value.email = profile.email || ''

    }catch(err){
      console.error('Lỗi khi lấy thông tin người dùng:', err)
    }
  }
})

// -- Watchers --
watch(() => shipping.value.province, async (newProvince) => {
  if (!newProvince) {
    districts.value = []
    wards.value = []
    shipping.value.district = null
    shipping.value.ward = null
    return
  }
  try {
    const res = await axios.get(`https://provinces.open-api.vn/api/p/${newProvince.code}?depth=2`)
    districts.value = res.data.districts || []
    wards.value = []
    shipping.value.district = null
    shipping.value.ward = null
  } catch (error) {
    console.error('Lỗi load districts:', error)
  }
})

watch(() => shipping.value.district, async (newDistrict) => {
  if (!newDistrict) {
    wards.value = []
    shipping.value.ward = null
    return
  }
  try {
    const res = await axios.get(`https://provinces.open-api.vn/api/d/${newDistrict.code}?depth=2`)
    wards.value = res.data.wards || []
    shipping.value.ward = null
  } catch (error) {
    console.error('Lỗi load wards:', error)
  }
})

// -- Methods -
const increaseQty = (item) => {
  if (item.quantity < item.maxQuantity) {
    if (cartItems.value.find(i => i.id === item.id)) {
      // Nếu item trong giỏ hàng
      updateQuantity(item.id, item.quantity + 1);
    } else {
      // Nếu là sản phẩm mua ngay (không trong giỏ hàng)
      item.quantity += 1; // Cập nhật trực tiếp
    }
  } else {
    showSnackbar(`Số lượng tối đa còn lại là ${item.maxQuantity}`,'warning');
  }
};

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    if (cartItems.value.find(i => i.id === item.id)) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      item.quantity -= 1;
    }
  } else if (item.quantity === 1) {
    itemToDelete.value = item;
    confirmDeleteDialog.value = true;
  }
};
const confirmDeleteDialog = ref(false)
const itemToDelete = ref(null)

const removeItem = (item) => {
  itemToDelete.value = item
  confirmDeleteDialog.value = true
}

const confirmDelete = () => {
  if (productToCheckout.value?.id === itemToDelete.value.id) {
    productToCheckout.value = null
  } else {
    removeFromCart(itemToDelete.value.id)
  }
  confirmDeleteDialog.value = false
}


//ktra còn sản phẩm để thanh toán hay ko
const hasItemsToCheckout = computed(() => {
  if (productToCheckout.value) return true;
  return cartItems.value.length > 0;
});
//định dạng tiền
function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}
//apply giam gia
const applyDiscount = async () => {
  if (!discountCode.value) {
    showSnackbar('Vui lòng nhập mã giảm giá.', 'warning')
    return
  }

  try {
    const res = await axios.get(`http://localhost:3000/discount_codes?code=${discountCode.value}`)
    const discountArray = res.data.data

    if (!discountArray.length) {
      showSnackbar('Mã giảm giá không hợp lệ hoặc đã hết hạn.', 'warning')
      return
    }
    const discount = discountArray.find(d => d.code.toUpperCase() === discountCode.value.toUpperCase())
    const now = new Date()
    if (!discount.is_active) {
      showSnackbar('Mã giảm giá không hợp lệ hoặc đã hết hạn.', 'warning')
      return
    }
    if (new Date(discount.end_date) < now) {
      showSnackbar('Mã giảm giá đã hết hạn.', 'warning')
      return
    }
    if (discount.used_count >= discount.usage_limit) {
      showSnackbar('Mã giảm giá đã hết lượt sử dụng.', 'warning')
      return
    }
    if (originalTotal.value < discount.min_order_value) {
      showSnackbar(`Đơn hàng phải tối thiểu ${formatCurrency(discount.min_order_value)} để áp dụng mã giảm giá.`, 'warning')
      return
    }
    appliedDiscountId.value = discount.id
    if (discount.discount_type === 'percent') {
      discountAmount.value = Math.round(originalTotal.value * (discount.discount_value / 100))
    } else if (discount.discount_type === 'fixed') {
      discountAmount.value = discount.discount_value
    }
    discountAmount.value = Math.min(discountAmount.value, originalTotal.value)
    showSnackbar('Mã giảm giá đã được áp dụng!', 'success')
  } catch (error) {
    console.error('Lỗi khi áp dụng mã giảm giá:', error)
    showSnackbar('Không thể áp dụng mã giảm giá. Vui lòng thử lại.', 'error')
  }
}
const openDiscountDialog = async () => {
  try {
    const saved = JSON.parse(localStorage.getItem('savedDiscounts') || '[]')
    const res = await axios.get('http://localhost:3000/discount_codes/home')
    const allDiscounts = res.data.data || []

    const allSaved = saved.map(discount => {
      const d = allDiscounts.find(x => x.code === discount.code)
      if (!d) return null

      const now = new Date()
      const isStarted = new Date(d.start_date) <= now
      const notExpired = new Date(d.end_date) > now
      const notUsedUp = d.used_count < d.usage_limit
      const isActive = d.is_active
      const meetsOrderValue = originalTotal.value >= d.min_order_value

      // Tính số tiền giảm thực tế
      let actualDiscount = 0
      if (d.discount_type === 'percent') {
        actualDiscount = Math.round(originalTotal.value * d.discount_value / 100)
      } else {
        actualDiscount = d.discount_value
      }
      actualDiscount = Math.min(actualDiscount, originalTotal.value)
    
      return {
        ...d,
        actual_discount: actualDiscount,
        isDisabled: !(isStarted && notExpired && notUsedUp && isActive && meetsOrderValue)
      }
    }).filter(Boolean)

    allSaved.sort((a, b) => b.actual_discount - a.actual_discount)
    savedCodes.value = allSaved
    selectedDiscountCode.value = discountCode.value
    showSavedCodes.value = true
  } catch (err) {
    console.error('Không thể tải hoặc kiểm tra mã đã lưu:', err)
    showSnackbar('Không thể tải danh sách mã giảm giá đã lưu.', 'error')
  }
}
const applySelectedDiscount = () => {
  discountCode.value = selectedDiscountCode.value
  showSavedCodes.value = false
}
const shippingErrors = reactive({
  name: '',
  phone: '',
  email:'',
  address: '',
  province: '',
  district: '',
  ward: ''
});

function validateShipping() {
  let valid = true;
  const nameRegex = /^[a-zA-Zàáạảãâấầậẩẫăắằặẳẵđèéẹẻẽêếềệểễíìịỉĩóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữýỳỷỹỵ\s]+$/;
  if (!shipping.value.name) {
    shippingErrors.name = 'Vui lòng nhập họ tên';
    valid = false;
  } else if (!nameRegex.test(shipping.value.name)) {
    shippingErrors.name = 'Họ tên chỉ có thể chứa chữ cái';
    valid = false;
  } else {
    shippingErrors.name = '';
  }

  const phoneRegex = /^\d{10}$/;
  if (!shipping.value.phone) {
    shippingErrors.phone = 'Vui lòng nhập số điện thoại';
    valid = false;
  } else if (!phoneRegex.test(shipping.value.phone)) {
    shippingErrors.phone = 'Số điện thoại phải có 10 chữ số';
    valid = false;
  } else {
    shippingErrors.phone = '';
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@/;
  if (shipping.value.email && !emailRegex.test(shipping.value.email)) {
    shippingErrors.email = 'Email phải có định dạng hợp lệ (ví dụ: example@gmail.com)';
    valid = false;
  } else {
    shippingErrors.email = '';
  }

  if (!shipping.value.address) {
    shippingErrors.address = 'Vui lòng nhập địa chỉ';
    valid = false;
  } else {
    shippingErrors.address = '';
  }

  if (!shipping.value.province) {
    shippingErrors.province = 'Vui lòng chọn tỉnh thành';
    valid = false;
  } else {
    shippingErrors.province = '';
  }

  if (!shipping.value.district) {
    shippingErrors.district = 'Vui lòng chọn quận/huyện';
    valid = false;
  } else {
    shippingErrors.district = '';
  }

  if (!shipping.value.ward) {
    shippingErrors.ward = 'Vui lòng chọn phường/xã';
    valid = false;
  } else {
    shippingErrors.ward = '';
  }

  return valid;
}
const addressErrorMessages = computed(() => {
  const errors = [];
  if (shippingErrors.province) errors.push(shippingErrors.province);
  if (shippingErrors.district) errors.push(shippingErrors.district);
  if (shippingErrors.ward) errors.push(shippingErrors.ward);
  return errors;
});
const clearError = (field) => {
  shippingErrors[field] = ''
}


async function placeOrder() {
  const user = getUser();
  if (!validateShipping()) {
    return;
  }
  const itemsToOrder = productToCheckout.value
  ? [{
      product_id: productToCheckout.value.productId,
      product_variant_id: productToCheckout.value.variantId,
      quantity: productToCheckout.value.quantity || 1,
      price: productToCheckout.value.price
    }]
  : cartItems.value
      .filter(item => item.productId && item.variantId && item.quantity > 0)
      .map(item => ({
        product_id: item.productId,
        product_variant_id: item.variantId,
        quantity: item.quantity,
        price: item.finalPrice || item.price
      }));
  if (itemsToOrder.length === 0) {
    showSnackbar('Giỏ hàng của bạn đang trống.','warning');
    return;
  }

  const orderPayload = {
    user_id: user.id,
    name: shipping.value.name,
    email: shipping.value.email ? shipping.value.email : null,
    address: `${shipping.value.address}, ${fullAddress.value}`,
    phone: shipping.value.phone,
    discount_code_id: appliedDiscountId.value || null,
    subtotal: originalTotal.value,
    discount_amount: discountAmount.value,
    total_amount: totalPrice.value,
    payment_method: paymentMethod.value.toUpperCase(),
    items: itemsToOrder
  };
  try {
    console.log("🚀 orderPayload gửi:", orderPayload);
    const response = await axios.post('http://localhost:3000/orders', orderPayload);
    const responseData = response.data;
    if (responseData.success) {
      if (paymentMethod.value.toLowerCase() === 'cod') {
        const orderId = responseData.data?.id;
        if (!orderId) {
          showSnackbar("Không nhận được ID đơn hàng từ server.", 'error');
          return;
        }
        showSnackbar("Đặt hàng thành công! Phương thức: COD", 'success');
        clearCart();
        setTimeout(() => {
          router.push({
            path: '/cod-return',
            query: { orderId }
          });
        }, 1000);
      } else if (paymentMethod.value.toLowerCase() === 'vnpay') {
        // VNPay có thể không có data.id, mà chỉ có payment_url
        const paymentUrl = responseData.payment_url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          showSnackbar("Không nhận được link thanh toán từ server.", 'error');
        }
      }
    } else {
      showSnackbar("Đặt hàng thất bại: " + responseData.message);
    }
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error);
    showSnackbar("Lỗi hệ thống khi đặt hàng.",'error');
  }
}

const productVariants = ref([])
const filteredSizes = computed(() => {
  // Chỉ lọc nếu đã chọn màu, còn chưa thì show toàn bộ size
  if (!selectedColor.value) return availableSizes.value
  return [
    ...new Set(
      productVariants.value
        .filter(v => v.colors?.name === selectedColor.value)
        .map(v => v.sizes?.name)
    )
  ]
})

const filteredColors = computed(() => {
  if (!selectedSize.value) return availableColors.value
  return [
    ...new Set(
      productVariants.value
        .filter(v => v.sizes?.name === selectedSize.value)
        .map(v => v.colors?.name)
    )
  ]
})

const openVariantDialog = async (item) => {
  selectedItem.value = { ...item }

  variantDialog.value = true
  outOfStock.value = false

  try {
    const res = await axios.get(`http://localhost:3000/products/${item.productId}`)
    const variants = res.data.data.product_variants || []
    productVariants.value = variants
    availableColors.value = [...new Set(variants.map(v => v.colors?.name))]
    availableSizes.value = [...new Set(variants.map(v => v.sizes?.name).filter(Boolean))]
    // ❗ Không set selectedColor/selectedSize ngay để người dùng tự chọn lại
    selectedColor.value = ''
    selectedSize.value = ''
  } catch (error) {
    console.error('Lỗi lấy phân loại sản phẩm:', error)
    showSnackbar('Không tìm thấy sản phẩm để lấy phân loại. Vui lòng thử lại.','warning')
  }
}

const updateItemWithVariant = (item, variant) => {
  item.color = selectedColor.value;
  item.size = selectedSize.value;
  item.variantId = variant.id;
  item.maxQuantity = variant.stock_quantity;

  if (item.quantity > variant.stock_quantity) {
    item.quantity = variant.stock_quantity;
  }
};

const confirmVariantSelection = () => {
  const variant = productVariants.value.find(v =>
    v.colors?.name === selectedColor.value &&
    v.sizes?.name === selectedSize.value
  );

  if (!variant) {
    showSnackbar('Không tìm thấy phân loại tương ứng.','warning');
    return;
  }

  if (typeof variant.stock_quantity !== 'number') {
    showSnackbar('Không có thông tin tồn kho.','warning');
    return;
  }

  // Cập nhật productToCheckout nếu đúng
  if (productToCheckout.value && selectedItem.value?.id === productToCheckout.value.id) {
    updateItemWithVariant(productToCheckout.value, variant);
  }

  // Cập nhật sản phẩm trong giỏ hàng nếu có
  const index = cartItems.value.findIndex(i => i.id === selectedItem.value.id);
  if (index !== -1) {
    updateItemWithVariant(cartItems.value[index], variant);
  }

  variantDialog.value = false;
};

const confirmAddress = () => {
  addressText.value = fullAddress.value
  addressMenu.value = false
}
const outOfStock = ref(false)


</script>

<style scoped>
.variant-option {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
}

.variant-option:hover {
  background-color: #f0f0f0;
}

.variant-option.active {
  border-color: black;
  background-color: #e0e0e0;
  font-weight: 500;
}
.variant-option.dimmed {
  opacity: 0.5;
}
.disabled-discount {
  opacity: 0.5;
  pointer-events: none;
}
</style>
