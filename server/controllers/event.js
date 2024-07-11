const db = require('../models/index');
const Event = db.event
exports.store = async (req, res) => {
    const { code, name, details, date } = req.body;
    const newEvent = await db.event.create({
        code,
        name,
        details,
        date,
    });
    res.json(newEvent);
}