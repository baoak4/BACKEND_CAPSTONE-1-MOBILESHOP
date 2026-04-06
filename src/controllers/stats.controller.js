const statsService = require('../services/stats.service');

class StatsController {
    async adminDashboard(req, res, next) {
        try {
            const data = await statsService.getAdminDashboard();
            return res.status(200).json({
                message: 'Thống kê admin',
                data,
            });
        } catch (err) {
            next(err);
        }
    }

    async shopDashboard(req, res, next) {
        try {
            const shopUserId = req.user.userId;
            const data = await statsService.getShopDashboard(shopUserId);
            return res.status(200).json({
                message: 'Thống kê shop',
                data,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StatsController();
