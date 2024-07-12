const db = require("../models/index");
const Event = db.event;
const Moment = require("moment");
const Helpers = require("../helpers/index");
let Validator = require("validatorjs");

exports.store = async (req, res) => {
  let { name, start_date, end_date, allDay } = req.body;
  let moment_start = Moment(start_date).toString();
  let moment_end = Moment(end_date).toString();
  let id = await Helpers.generateId();
  let rules = {
    name: "required",
    allDay: "required|boolean",
    start_date: "required|date|before:end_date",
    end_date: "required|date|after:start_date",
  };
  let error_msg = {
    in: "invalid :attribute",
  };
  let validation = new Validator(
    { name, start_date, end_date, allDay },
    rules,
    error_msg
  );
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
        start_date: moment_start,
        end_date: moment_end,
        allDay,
      });
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
};

exports.lists = async (req, res) => {
  const events = await Event.findAll();
  let result = [];
  for await (let { id, name, start_date, end_date, allDay } of events) {
    result.push({ id, title: name, start: start_date, end: end_date, allDay });
  }
  res.json({
    code: 200,
    status: "success",
    message: ["get data success."],
    result,
  });
};

exports.details = async (req, res) => {
  let { id } = req.query,
    result;
  let rules = {
    id: "required|numeric",
  };
  let error_msg = {
    in: "invalid :attribute",
  };
  let validation = new Validator({ id }, rules, error_msg);
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
      const event = await Event.findOne({ where: { id } });
      result = {
        id: event.id,
        name: event.name,
        details: event.details,
        start: event.start_date,
        end: event.end_date,
      };
      res.json({
        code: 200,
        status: "success",
        message: ["get data success."],
        result: [result],
      });
    } catch (err) {
      console.log(err);
    }
  }
};
