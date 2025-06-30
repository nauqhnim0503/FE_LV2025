<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="transparent" flat>
        <v-btn icon="mdi-arrow-left" :to="{ name: 'discountManagement' }" variant="text" />
        <v-toolbar-title>Chỉnh sửa mã giảm giá</v-toolbar-title>
      </v-toolbar>

      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-card-text>
          <v-row>
            <!-- Các trường form -->
            <v-col cols="12" md="6">
              <v-text-field v-model="discount.code" label="Mã giảm giá" disabled variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="discount.discount_type"
                :items="discountTypes"
                label="Loại giảm"
                item-title="label"
                item-value="value"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.discount_value"
                label="Giá trị giảm"
                type="number"
                :suffix="discount.discount_type === 'percent' ? '%' : ''"
                :prefix="discount.discount_type === 'fixed' ? '₫' : ''"
                :rules="[
                  rules.required,
                  rules.minValue(0),
                  ...(discount.discount_type === 'percent' ? [rules.maxValue(100)] : [])
                ]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.min_order_value"
                label="Giá trị đơn hàng tối thiểu"
                type="number"
                prefix="₫"
                :rules="[rules.required, rules.minValue(0)]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.usage_limit"
                label="Số lượt sử dụng"
                type="number"
                :rules="[rules.required, rules.minValue(1)]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.start_date"
                type="datetime-local"
                label="Bắt đầu"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="discount.end_date"
                type="datetime-local"
                label="Kết thúc"
                :rules="[rules.required, rules.endDateAfterStart]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12">
              <v-switch v-model="discount.is_active" label="Kích hoạt mã" color="success" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="error" variant="outlined" :to="{ name: 'discountManagement' }">Hủy</v-btn>
          <v-btn color="primary" type="submit" :loading="isSubmitting">Cập nhật</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const form = ref(null)
const isSubmitting = ref(false)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const discountTypes = [
  { label: 'Phần trăm (%)', value: 'percent' },
  { label: 'Giảm số tiền (₫)', value: 'fixed' }
]
const rules = {
  required: v => !!v || 'Trường bắt buộc',
  minValue: min => v => v >= min || `Tối thiểu là ${min}`,
  maxValue: max => v => v <= max || `Tối đa là ${max}`,
  endDateAfterStart: v => {
    if (!v || !discount.value.start_date) return true
    return new Date(v) > new Date(discount.value.start_date) || 'Phải sau thời gian bắt đầu'
  }
}
const discount = ref({
  code: '',
  discount_type: 'percent',
  discount_value: 0,
  min_order_value: 0,
  usage_limit: 1,
  start_date: '',
  end_date: '',
  is_active: true
})

onMounted(async () => {
  try {
    const { data } = await axios.get(`http://localhost:3000/discount_codes/${route.params.id}`)
    const item = data.data

    discount.value = {
      ...item,
      start_date: formatDateTime(item.start_date),
      end_date: formatDateTime(item.end_date),
      is_active: Boolean(item.is_active)
    }
  } catch (err) {
    console.log('Error fetching discount code:', err);  
    snackbar.value = { show: true, text: '❌ Không thể tải mã giảm giá', color: 'error' }
  }
})

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    snackbar.value = { show: true, text: '❌ Vui lòng kiểm tra lại thông tin!', color: 'error' }
    return
  }

  const payload = {
    ...discount.value,
    discount_value: +discount.value.discount_value,
    min_order_value: +discount.value.min_order_value,
    usage_limit: +discount.value.usage_limit,
    start_date: toLocalISOString(discount.value.start_date),
    end_date: toLocalISOString(discount.value.end_date),
    is_active: discount.value.is_active,
  }

  try {
    isSubmitting.value = true
    await axios.put(`http://localhost:3000/discount_codes/${route.params.id}`, payload)
    snackbar.value = { show: true, text: '✅ Cập nhật thành công', color: 'success' }
    router.push({ name: 'discountManagement' })
  } catch (err) {
    snackbar.value = { show: true, text: '❌ Lỗi khi cập nhật', color: 'error' }
  } finally {
    isSubmitting.value = false
  }
}


const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toISOString().slice(0, 16) // "YYYY-MM-DDTHH:mm"
}
function toLocalISOString(datetimeStr) {
  const date = new Date(datetimeStr)
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString()
}

</script>
