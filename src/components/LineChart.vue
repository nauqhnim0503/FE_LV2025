<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
  orders: Array
})

const now = new Date()
const labels = Array.from({ length: 7 }, (_, i) =>
  new Date(now - (6 - i) * 24 * 3600 * 1000)
    .toLocaleDateString('en-CA') // YYYY-MM-DD
)

const revenueByDay = computed(() => {
  const map = Object.fromEntries(labels.map(l => [l, 0]))
  if (!props.orders || !Array.isArray(props.orders)) return labels.map(() => 0)

  props.orders.forEach(o => {
    const d = new Date(o.createdAt).toISOString().slice(0, 10)
    if (map[d] !== undefined) map[d] += o.total_amount
  })

  // Kiểm tra lại và trả về giá trị hợp lệ
  return labels.map(l => {
    const revenue = map[l]
    return isNaN(revenue) || revenue < 0 ? 0 : revenue
  })
})



const chartData = computed(() => {
  // Kiểm tra nếu không có doanh thu cho ngày nào, ta sẽ không hiển thị đường.
  if (revenueByDay.value.every(value => value === 0)) {
    return { labels, datasets: [] }; // Không hiển thị dữ liệu nếu tất cả là 0
  }

  return {
    labels,
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: revenueByDay.value,
        borderColor: '#1976D2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)', // Màu nền
        fill: true, // Để fill màu dưới đường
        tension: 0.4 // Mức độ cong của đường
      }
    ]
  };
});

const chartOptions = computed(() => {
  // Tính toán giá trị tối đa sau khi doanh thu đã được tính toán
  const maxRevenue = Math.max(...revenueByDay.value);
  const stepSize = Math.max(Math.ceil(maxRevenue / 100000), 1000000);

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0, // Đảm bảo trục Y bắt đầu từ 0
        max: Math.ceil(maxRevenue / 1000000) * 1000000 + 1000000, // Làm tròn lên giá trị tối đa
        ticks: {
          stepSize: stepSize, // Khoảng cách giữa các ticks là phù hợp với giá trị doanh thu
          callback: function(value) {
            return value.toLocaleString('vi-VN') + ' đ'; // Hiển thị dưới dạng tiền Việt Nam
          }
        }
      }
    }
  }
});





</script>

<style scoped>
canvas { max-height: 300px; }
</style>
