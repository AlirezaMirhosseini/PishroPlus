<template>
  <Line :options="chartOptions" :data="chartData" style="height:170px"/>
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJSL,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJSL.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
ChartJSL.defaults.font.family = 'IranYekan'
ChartJSL.defaults.font.size = 10
ChartJSL.defaults.color = '#bcbcbc'

export default {
  name: 'LineChart',
  components: { Line },
  props: {
    chartData: {
      required: true,
      default: {}
    },
    chartOptions: {
      required: false,
      default: { responsive: true, maintainAspectRatio: false }
    }
  }
}
</script>
