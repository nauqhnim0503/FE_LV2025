<template>
  <v-container fluid class="pa-0">
    <v-card>
      <!-- Header -->
      <v-toolbar color="transparent" flat>
        <v-tooltip location="bottom" text="Quay lại danh sách">
          <template #activator="{ props }">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              :to="{ name: 'discountManagement' }"
              v-bind="props"
            ></v-btn>
          </template>
        </v-tooltip>
        <v-toolbar-title class="text-h6 ml-2">Thêm mã giảm giá</v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Form -->
      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-card-text>
          <v-row>
            <!-- Mã giảm giá -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.code"
                label="Mã giảm giá"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Loại giảm giá -->
            <v-col cols="12" md="6">
              <v-select
                v-model="discount.discount_type"
                :items="discountTypes"
                item-title="label"
                item-value="value"
                label="Loại giảm giá"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Giá trị giảm -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.discount_value"
                :type="'number'"
                :min="0"
                :max="discount.discount_type === 'percent' ? 100 : null"
                :prefix="discount.discount_type === 'fixed' ? '₫' : ''"
                :suffix="discount.discount_type === 'percent' ? '%' : ''"
                label="Giá trị giảm"
                :rules="[
                  rules.required,
                  rules.minValue(0),
                  ...(discount.discount_type === 'percent' ? [rules.maxValue(100)] : [])
                ]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Giá trị đơn hàng tối thiểu -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.min_order_value"
                type="number"
                prefix="₫"
                label="Giá trị đơn hàng tối thiểu"
                :rules="[rules.required, rules.minValue(0)]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Số lượt sử dụng -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.usage_limit"
                type="number"
                label="Số lượt sử dụng tối đa"
                :rules="[rules.required, rules.minValue(1)]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Ngày bắt đầu -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.start_date"
                type="datetime-local"
                label="Thời gian bắt đầu"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Ngày kết thúc -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.end_date"
                type="datetime-local"
                label="Thời gian kết thúc"
                :rules="[rules.required, rules.endDateAfterStart]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Trạng thái -->
            <v-col cols="12">
              <v-switch
                v-model="discount.is_active"
                label="Kích hoạt mã giảm giá"
                color="success"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Action buttons -->
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" color="error" :to="{ name: 'discountManagement' }">
            Hủy
          </v-btn>
          <v-btn color="primary" :loading="isSubmitting" type="submit" class="ml-2">
            Tạo mã giảm giá
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="top right">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Router
const router = useRouter()

// Form reference
const form = ref(null)
const isSubmitting = ref(false)

// Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Discount form data
const discount = ref({
  code: '',
  discount_type: 'percent',
  discount_value: null,
  min_order_value: null,
  usage_limit: null,
  start_date: '',
  end_date: '',
  is_active: true
})

// Discount types
const discountTypes = [
  { label: 'Giảm theo phần trăm', value: 'percent' },
  { label: 'Giảm theo số tiền', value: 'fixed' }
]

// Validation rules
const rules = {
  required: v => !!v || 'Trường bắt buộc',
  minValue: min => v => v >= min || `Tối thiểu là ${min}`,
  maxValue: max => v => v <= max || `Tối đa là ${max}`,
  endDateAfterStart: v => {
    if (!v || !discount.value.start_date) return true
    return new Date(v) > new Date(discount.value.start_date) || 'Phải sau thời gian bắt đầu'
  }
}

// Helper
const showMessage = (text, color = 'success') => {
  snackbar.value = { show: true, text, color }
}

// Handle submit
const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    showMessage('Vui lòng kiểm tra lại thông tin', 'error')
    return
  }

  try {
    isSubmitting.value = true
    
    const payload = {
      ...discount.value,
      discount_value: +discount.value.discount_value,
      min_order_value: +discount.value.min_order_value,
      usage_limit: +discount.value.usage_limit,
      start_date: new Date(discount.value.start_date).toISOString(),
      end_date: new Date(discount.value.end_date).toISOString(),
      is_active: discount.value.is_active,
    }
    console.log(payload)
    await axios.post('http://localhost:3000/discount_codes', payload)

    showMessage('✅ Tạo mã giảm giá thành công!')
    router.push({ name: 'discountManagement' })

  } catch (err) {
    console.error('❌ Lỗi khi tạo mã giảm giá:', err)
    showMessage(
      err.response?.data?.message || '❌ Lỗi khi tạo mã giảm giá!',
      'error'
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>
