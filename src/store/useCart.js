import { ref, onMounted, onUnmounted } from 'vue'
import { CartService } from '@/services/User/cart.service'

export function useCart() {
  const cartItems = ref([])
  const cartCount = ref(0)
  const cartTotal = ref(0)

  // Cập nhật lại dữ liệu giỏ hàng từ service
  const updateCartData = () => {
    const cart = CartService.getCart()
    cartItems.value = cart.map(item => ({
      ...item,
      finalPrice: (item.promotional || 0)
    }))
    cartCount.value = cart.length
    cartTotal.value = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  }

  // Thêm sản phẩm vào giỏ
  const addToCart = async (product) => {
    try {
      await CartService.addToCart(product)
      updateCartData()
    } catch (error) {
      alert(error.message)
    }
  }

  // Cập nhật số lượng
  const updateQuantity = (itemId, quantity) => {
    const item = cartItems.value.find(i => i.id === itemId)
    if (!item) return

    if (item.maxQuantity && quantity > item.maxQuantity) {
      alert(`Số lượng tối đa còn lại là ${item.maxQuantity}`)
      quantity = item.maxQuantity
    }

    if (quantity < 1) quantity = 1

    CartService.updateQuantity(itemId, quantity)
    updateCartData()
  }

  // Xóa 1 sản phẩm
  const removeFromCart = (itemId) => {
    CartService.removeItem(itemId)
    updateCartData()
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    CartService.clearCart()
    updateCartData()
  }

  // Đặt lại giỏ hàng từ bên ngoài (nếu muốn cập nhật từ backend hoặc sửa trực tiếp)
  const setCart = (newCart) => {
    CartService.setCart(newCart)
    updateCartData()
  }

  // Lấy dữ liệu đơn hàng từ cart phù hợp API
  const getCartItemsForCheckout = () => {
    return cartItems.value.map(item => ({
      product_id: item.product_id, 
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
      price: item.finalPrice
    }))
  }

  // Lấy tổng tiền đơn hàng
  const getCartTotalAmount = () => {
    return cartTotal.value
  }

  // Lắng nghe thay đổi từ tab khác
  const handleStorageChange = (e) => {
    if (e.key === CartService.CART_KEY) {
      updateCartData()
    }
  }

  onMounted(() => {
    updateCartData()
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cart-updated', updateCartData)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
    window.removeEventListener('cart-updated', updateCartData)
  })

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    setCart,
    getCartItemsForCheckout,
    getCartTotalAmount
  }
}
