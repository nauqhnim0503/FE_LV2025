// src/services/cart.service.js
export class CartService {
  static CART_KEY = 'shopping_cart'

  // Lấy giỏ hàng từ localStorage
  static getCart() {
    const cart = localStorage.getItem(this.CART_KEY)
    return cart ? JSON.parse(cart) : []
  }

  // Lưu giỏ hàng vào localStorage và phát event để đồng bộ
  static saveCart(cart) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    return cart
  }

  // Thêm sản phẩm vào giỏ hàng, có kiểm tra maxQuantity (tồn kho)
  static addToCart(product) {
    const cart = this.getCart()

    // Tìm sản phẩm đã tồn tại (dựa vào variantId)
    const existingIndex = cart.findIndex(item => item.variantId === product.variantId)
    
    if (existingIndex >= 0) {
      const existingItem = cart[existingIndex]
      const newQuantity = existingItem.quantity + product.quantity

      if (newQuantity > product.maxQuantity) {
        throw new Error(`Số lượng vượt quá giới hạn tồn kho (${product.maxQuantity})`)
      }

      existingItem.quantity = newQuantity
      // Cập nhật các thuộc tính khác nếu cần
      existingItem.price = product.price
      existingItem.promotional = product.promotional
      existingItem.originalPrice = product.originalPrice
      existingItem.maxQuantity = product.maxQuantity
    } else {
      cart.push({
        id: Date.now(), // ID duy nhất cho item trong cart
        productId: product.productId,
        variantId: product.variantId,
        name: product.name,
        image: product.image,
        color: product.color,
        size: product.size,
        price: product.price,
        promotional: product.promotional,
        originalPrice: product.originalPrice,
        quantity: product.quantity,
        maxQuantity: product.maxQuantity,
        error: ''
      })
    }

    return this.saveCart(cart)
  }

  // Cập nhật số lượng cho sản phẩm trong giỏ
  static updateQuantity(itemId, quantity) {
    const cart = this.getCart()
    const item = cart.find(i => i.id === itemId)
    if (!item) return cart

    if (quantity > item.maxQuantity) {
      item.quantity = item.maxQuantity
      item.error = `Số lượng tối đa là ${item.maxQuantity}`
    } else if (quantity < 1) {
      item.quantity = 1
      item.error = ''
    } else {
      item.quantity = quantity
      item.error = ''
    }

    return this.saveCart(cart)
  }

  // Xóa một sản phẩm khỏi giỏ hàng theo id
  static removeItem(itemId) {
    const cart = this.getCart()
    const newCart = cart.filter(i => i.id !== itemId)
    return this.saveCart(newCart)
  }

  // Xóa nhiều sản phẩm theo danh sách id
  static removeItems(itemIds) {
    const cart = this.getCart()
    const newCart = cart.filter(i => !itemIds.includes(i.id))
    return this.saveCart(newCart)
  }

  // Xóa sạch giỏ hàng
  static clearCart() {
    localStorage.removeItem(this.CART_KEY)
    window.dispatchEvent(new Event('cart-updated'))
    return []
  }
}
