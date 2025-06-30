import { ref } from 'vue'

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  loading: false,
})

export function useSnackbar() {
  const showSnackbar = (message, color = 'success',loading = false) => {
    snackbar.value.message = message
    snackbar.value.color = color
    snackbar.value.loading = loading
    snackbar.value.show = true
  }
  const hideSnackbar = () => {
  snackbar.value.show = false
  snackbar.value.loading = false
  snackbar.value.message = ''
  snackbar.value.color = 'success'
}

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
    success: (msg) => showSnackbar(msg, 'success', loading),
    error: (msg) => showSnackbar(msg, 'error', loading),
    info: (msg) => showSnackbar(msg, 'info', loading),
    warning: (msg) => showSnackbar(msg, 'warning', loading),
  }
}
