const db = require('../models/index');
const Event = db.event
const Moment = require('moment');
const Helpers = require('../helpers/index');
let Validator = require('validatorjs');

exports.store = async (req, res) => {
    let { name, details, start_date, end_date } = req.body
    let moment_start = Moment(start_date).toString();
    console.log(start_date, 'start_datestart_datestart_datestart_date');
    console.log(moment_start, 'moment_startmoment_startmoment_start');
    let moment_end = Moment(end_date).toString();
    console.log(end_date, 'start_datestart_datestart_datestart_date');
    console.log(moment_end, 'moment_startmoment_startmoment_start');
    let id = await Helpers.generateId();
    let rules = {
        name: "required",
        details: "required",
        start_date: "required|date|before:end_date",
        end_date: "required|date|after:start_date",
    };
    let error_msg = {
        in: "invalid :attribute",
    };
    let validation = new Validator({ name, details, start_date, end_date }, rules, error_msg);
    validation.checkAsync(passes, fails);

    function fails() {
        let message = [];
        for (var key in validation.errors.all()) {
        var value = validation.errors.all()[key];
        message.push(value[0]);
        }
        res.status(200).json({
        code: 401,
        status: "error",
        message: message,
        result: [],
        });
    }

  async function passes() {
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
}

exports.lists = async (req, res) => {
    const events = await Event.findAll();
    let result = []
    for await (let { id, name, details, start_date, end_date } of events) {
        result.push({ id, title: name, details, start: start_date, end: end_date })
    }
    res.json({
        code: 200,
        status: "success",
        message: ["get data success."],
        result,
    });
}

exports.details = async (req, res) => {
    const { id } = req.query
    const event = await Event.findOne({ where: { id } })
    res.json({
        code: 200,
        status: "success",
        message: ["get data success."],
        result: [event]
    });
}