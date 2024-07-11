const db = require('../models/index');
const Event = db.event
const Moment = require('moment');
const Helpers = require('../helpers/index');
exports.store = async (req, res) => {
    let { name, details, start_date, end_date } = req.body
    let moment_start = Moment(start_date).startOf('day').toString();
    let moment_end = Moment(end_date).endOf('day').toString();
    let id = await Helpers.generateId();
    try {
        await Event.create({
            id,
            name,
            details,
            start_date: moment_start,
            end_date: moment_end
        })
        res.json({
            code: 201,
            status: "success",
            message: ["store data success."],
            result: [],
        });
    } catch (err) {
        console.log(err);
    }
}

exports.lists = async (req, res) => {
    const events = await Event.findAll();
    let result = []
    for await (let { id, name, details, start_date, end_date } of events) {
        start_date = Moment(start_date).format('YYYY-MM-DD');
        end_date = Moment(end_date).format('YYYY-MM-DD');
        result.push({ id, name, details, start: start_date, end: end_date })
    }
    res.json({
        code: 200,
        status: "success",
        message: ["get data success."],
        result,
    });
}