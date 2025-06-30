<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  }
})

const STATUS_LIST = ['Chờ xác nhận', 'Đã xác nhận', 'Đang vận chuyển', 'Đã giao', 'Đã hủy']

const counts = computed(() => {
  const map = Object.fromEntries(STATUS_LIST.map(s => [s, 0]))
  console.log('orders in PieChart:', props.orders)
  if (!props.orders) return STATUS_LIST.map(() => 0)
  props.orders.forEach(o => {
  console.log(o.status)
  if (map[o.status] !== undefined) {
    map[o.status]++
  }
})
  return STATUS_LIST.map(s => map[s])
})

const chartData = computed(() => ({
  labels: STATUS_LIST,
  datasets: [{
    data: counts.value,
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF'
    ]
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    }
  }
}
</script>

<template>
  <div style="width: 350px; height: 200px; margin: auto;">
  <Pie :data="chartData" :options="chartOptions" />
</div>
</template>
