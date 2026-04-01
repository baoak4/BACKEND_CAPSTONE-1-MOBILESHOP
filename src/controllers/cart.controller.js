const cartService = require('../services/cart.service');
const throwError = require('../utils/throwError');

class CartController {
    async getMyCart(req, res, next) {
        try {
            const userId = req.user.userId;
            const cart = await cartService.getCartByUserId(userId);
            res.status(200).json({ message: "Get cart successfully", data: cart });
        } catch (error) {
            next(error);
        }
    }

    async addItemToCart(req, res, next) {
        try {
            const userId = req.user.userId;
            const item = req.body;
            const cart = await cartService.addItemToCart(userId, item);
            res.status(200).json({ message: "Add item to cart successfully", data: cart });
        } catch (error) {
            next(error);
        }
    }

    async removeItemFromCart(req, res, next) {
        try {
            const userId = req.user.userId;
            const { productId } = req.body;
            const result = await cartService.removeItemFromCart(userId, productId);
            if (!result) {
                throwError("Khong tim thay gio hang hoac san pham");
            }
            res.status(200).json({ message: "Remove item from cart successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async updateItemQuantity(req, res, next) {
        try {
            const userId = req.user.userId;
            const { productId, sku, quantity } = req.body;
            const result = await cartService.updateItemQuantity(userId, productId, sku, quantity);
            if (!result) {
                throwError("Khong tim thay gio hang hoac san pham");
            }
            return res.status(200).json({ message: "Cap nhat so luong thanh cong", data: result });
        } catch (error) {
            next(error);
        }
    }

    async deleteCart(req, res, next) {
        try {
            const userId = req.user.userId;
            await cartService.deleteCart(userId);
            res.status(200).json({ message: "Da xoa thanh cong" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CartController();
