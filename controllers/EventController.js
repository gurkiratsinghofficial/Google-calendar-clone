require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const User = require("../model/User");

const { validation } = require("../validation/validation");
const { constants } = require("../constants/constants");
const nodemailer = require("nodemailer");
const { sendResponse } = require("../response/sendResponse");

/**setup nodemailer */
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.eventControl = {
  /**
   * @description: Sends events data corresponding to a particular user
   * @param {object} req
   * @param {object} res
   */
  fetchEvents: async (req, res) => {
    try {
      /**Fetch token from request headers */
      const token = req.header(constants.AUTHORISATION);
      /**Verify the token */
      const userID = jwt.verify(token, process.env.TOKEN);
      if (!userID) return sendResponse(constants.USER_NOT_SIGN, res, 500);
      /**Check if user exists */
      const userinfo = await User.findOne({ _id: userID._id });
      if (!userinfo) return sendResponse(constants.INVALID_LOGIN, res, 500);
      else {
        return sendResponse(
          {
            events: userinfo.events,
          },
          res,
          200
        );
      }
    } catch (err) {
      return sendResponse(err.message, res, 500);
    }
  },
  /**
   * @description: Sends details of a particular event
   * @param {object} req
   * @param {object} res
   */
  fetchOneEvent: async (req, res) => {
    try {
      /**Fetch token from request headers */
      const token = req.header(constants.AUTHORISATION);
      /**Verify the token */
      const userID = jwt.verify(token, process.env.TOKEN);
      if (!userID) return sendResponse(constants.USER_NOT_SIGN, res, 500);
      /**Check if user exists */
      const userinfo = await User.findOne({ _id: userID._id });
      if (!userinfo) return sendResponse(constants.INVALID_LOGIN, res, 500);
      else {
        const newArray = userinfo.events;
        const result = newArray.filter(
          (event) => event.event_id === req.body.event_id
        );
        return sendResponse(result[0], res, 200);
      }
    } catch (err) {
      return sendResponse(err.message, res, 500);
    }
  },
  /**
   * @description: Adds new event into database
   * @param {object} req
   * @param {object} res
   */
  addEvent: async (req, res) => {
    try {
      //validate before adding event
      const { error } = validation.eventValidation(req.body);
      if (error) return sendResponse(error.details[0].message, res, 400);
      /**Fetch token from request headers */
      const token = req.header(constants.AUTHORISATION);
      /**Verify the token */
      const userID = jwt.verify(token, process.env.TOKEN);
      if (!userID) return sendResponse(constants.USER_NOT_SIGN, res, 500);
      /**Check if user exists */
      const userinfo = await User.findOne({ _id: userID._id });
      if (!userinfo) return sendResponse(constants.INVALID_LOGIN, res, 500);
      else {
        const {
          eventDate,
          startTime,
          endTime,
          title,
          description,
          guests,
        } = req.body;
        const updatedEvents = userinfo.events;
        const evId = uuidv4();
        /**update user eventlist */
        updatedEvents.push({
          event_id: evId,
          eventDate: eventDate,
          startTime: startTime,
          endTime: endTime,
          title: title,
          guests: guests ? guests : undefined,
          description: description,
          participant: false,
          organizer: userinfo.firstname + " " + userinfo.lastname,
          organizerEmail: userinfo.email,
        });
        await User.updateOne({ _id: userinfo._id }, { events: updatedEvents });
        /**updated eventlist for guests */
        if (guests && guests.length > 0) {
          for (let i = 0; i < guests.length; i++) {
            const guest = await User.findOne({ _id: guests[i]._id });
            let guestEvents = guest.events;
            guestEvents.push({
              event_id: evId,
              eventDate: eventDate,
              startTime: startTime,
              endTime: endTime,
              title: title,
              description: description,
              participant: true,
              organizer: userinfo.firstname + " " + userinfo.lastname,
              organizerEmail: userinfo.email,
            });
            await User.updateOne(
              { _id: guests[i]._id },
              { events: guestEvents }
            );
            /**Send email invite to guests */
            transporter.sendMail({
              to: guests[i].value,
              subject: "Invitation " + title,
              html: description,
            });
          }
        }
      }
      return sendResponse(constants.ADD_EVENT, res, 200);
    } catch (err) {
      return sendResponse(err.message, res, 500);
    }
  },
  /**
   * @description: updates existing event of a particular user
   * @param {object} req
   * @param {object} res
   */
  editEvent: async (req, res) => {
    try {
      //validate before adding event
      const { error } = validation.eventValidation(req.body);
      if (error) return sendResponse(error.details[0].message, res, 400);

      /**Fetch token from request headers */
      const token = req.header(constants.AUTHORISATION);
      /**Verify the token */
      const userID = jwt.verify(token, process.env.TOKEN);
      if (!userID) return sendResponse(constants.USER_NOT_SIGN, res, 500);
      /**Check if user exists */
      const userinfo = await User.findOne({ _id: userID._id });
      if (!userinfo) return sendResponse(constants.INVALID_LOGIN, res, 500);
      else {
        const {
          event_id,
          title,
          description,
          eventDate,
          startTime,
          endTime,
          organizer,
          organizerEmail,
        } = req.body;
        let guests = undefined;
        if (!req.body.guests) {
          guests = [];
        } else {
          guests = req.body.guests;
        }
        const eventList = userinfo.events;
        const found = eventList.find((event) => event.event_id === event_id);
        const ind = eventList.indexOf(found);
        eventList.splice(ind, 1);
        eventList.push(req.body);
        await User.updateOne({ _id: userinfo._id }, { events: eventList });

        const oldGuests = found.guests ? found.guests : [];

        for (let i = 0; i < oldGuests.length; i++) {
          const oldGuest = await User.findOne({ _id: oldGuests[i]._id });
          const oldEventList = oldGuest.events;
          const foundEvent = oldEventList.find(
            (event) => event.event_id === event_id
          );
          const eventInd = oldGuest.events.indexOf(foundEvent);
          oldEventList.splice(eventInd, 1);
          await User.updateOne(
            { _id: oldGuests[i]._id },
            { events: oldEventList }
          );
        }
        /**update guests eventlist */
        for (let i = 0; i < guests.length; i++) {
          let findGuest = await User.findOne({ _id: guests[i]._id });
          let newEventList = findGuest.events;
          newEventList.push({
            event_id: event_id,
            title: title,
            description: description,
            eventDate: eventDate,
            startTime: startTime,
            endTime: endTime,
            participant: true,
            organizer: organizer,
            organizerEmail: organizerEmail,
          });
          await User.updateOne(
            { _id: guests[i]._id },
            { events: newEventList }
          );
          /**send email invitation if new guest is added */
          if (
            oldGuests.some((guest) => guest.value !== guests[i].value) ||
            oldGuests.length < 1
          ) {
            transporter.sendMail({
              to: guests[i].label,
              subject: "Invitation " + title,
              html: description,
            });
          }
        }
      }
      return sendResponse(constants.UPDATE_EVENT, res, 200);
    } catch (err) {
      return sendResponse(err.message, res, 500);
    }
  },
  /**
   * @description: deletes an existing event
   * @param {object} req
   * @param {object} res
   */
  deleteEvent: async (req, res) => {
    try {
      //validate before adding event
      const { error } = validation.eventDeleteValidation(req.body);
      if (error) return sendResponse(error.details[0].message, res, 400);
      /**Fetch token from request headers */
      const token = req.header(constants.AUTHORISATION);

      /**Verify the token */
      const userID = jwt.verify(token, process.env.TOKEN);
      if (!userID) return sendResponse(constants.USER_NOT_SIGN, res, 500);

      /**Check if user exists */
      const userinfo = await User.findOne({ _id: userID._id });
      if (!userinfo) return sendResponse(constants.INVALID_LOGIN, res, 500);
      else {
        const updatedEvents = userinfo.events;
        const result = updatedEvents.filter(
          (event) => event.event_id !== req.body.event_id
        );
        await User.updateOne({ _id: userinfo._id }, { events: result });
        /**delete event from guests eventlist */
        if(req.body.guests){
        for (let i = 0; i < req.body.guests.length; i++) {
          const guestInfo = await User.findOne({ _id: req.body.guests[i]._id });
          const updatedGuestEvents = guestInfo.events;
          const newEvents = updatedGuestEvents.filter(
            (event) => event.event_id !== req.body.event_id
          );
          await User.updateOne({ _id: guestInfo._id }, { events: newEvents });
        }
      }
      }
      return sendResponse(constants.DELETE_EVENT, res, 200);
    } catch (err) {
      return sendResponse(err.message, res, 500);
    }
  },
};
