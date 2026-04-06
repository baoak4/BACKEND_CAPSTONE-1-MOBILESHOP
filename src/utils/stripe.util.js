/**
 * Stripe helpers — test (sk_test_…) và live dùng chung API.
 * VND: không có đơn vị nhỏ hơn đồng (amount nguyên).
 * USD: amount theo cent (×100).
 */
let stripeSingleton = null;

function getStripe() {
    const key = process.env.STRIPE_PRIVATE_KEY;
    if (!key || typeof key !== 'string' || !key.trim()) {
        return null;
    }
    if (!stripeSingleton) {
        stripeSingleton = require('stripe')(key.trim());
    }
    return stripeSingleton;
}

/**
 * @param {number|string} amount - số tiền hiển thị (VD: 100000 VND hoặc 10.5 USD)
 * @param {string} currency - mã ISO, ví dụ 'vnd', 'usd'
 * @returns {number} số nguyên gửi Stripe (smallest currency unit)
 */
function amountToStripeSmallestUnit(amount, currency) {
    const cur = String(currency || 'vnd').toLowerCase();
    const n = Number(amount);
    if (!Number.isFinite(n) || n < 0) {
        throw new Error('Số tiền không hợp lệ');
    }
    if (cur === 'vnd' || cur === 'jpy' || cur === 'krw') {
        return Math.round(n);
    }
    return Math.round(n * 100);
}

module.exports = {
    getStripe,
    amountToStripeSmallestUnit,
};
