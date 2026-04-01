const cartModel = require('../models/cart.model');

class CartService {
    async getOrCreateCart(userId) {
        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = await cartModel.create({ userId, items: [] });
        }
        return cart;
    }

    async getCartByUserId(userId) {
        return cartModel.findOne({ userId }).populate('items.productId');
    }

    async addItemToCart(userId, item) {
        const cart = await this.getOrCreateCart(userId);
        const existing = cart.items.find(
            (cartItem) =>
                cartItem.productId.toString() === item.productId &&
                cartItem.sku === item.sku
        );

        if (existing) {
            existing.quantity += item.quantity || 1;
        } else {
            cart.items.push({
                productId: item.productId,
                sku: item.sku,
                color: item.color || null,
                quantity: item.quantity || 1,
            });
        }

        await cart.save();
        return cart.populate('items.productId');
    }

    async removeItemFromCart(userId, productId) {
        const cart = await cartModel.findOne({ userId });
        if (!cart) return null;

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );
        if (itemIndex === -1) return null;

        cart.items.splice(itemIndex, 1);
        await cart.save();
        return cart.populate('items.productId');
    }

    async updateItemQuantity(userId, productId, sku, quantity) {
        const cart = await cartModel.findOne({ userId });
        if (!cart) return null;

        const item = cart.items.find(
            (cartItem) => cartItem.productId.toString() === productId && cartItem.sku === sku
        );
        if (!item) return null;

        item.quantity = quantity;
        await cart.save();
        return cart.populate('items.productId');
    }

    async deleteCart(userId) {
        return cartModel.findOneAndDelete({ userId });
    }
}

module.exports = new CartService();
