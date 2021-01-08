module.exports = (app) => {
  /**events object contains routes functions */
  const events = require("../controllers/EventController");

  /**import router */
  const router = require("express").Router();

  /**Routes related to events */
  router.get("/fetch", events.eventControl.fetchEvents);
  router.post("/fetchOneEvent", events.eventControl.fetchOneEvent);
  router.post("/add", events.eventControl.addEvent);
  router.put("/update", events.eventControl.editEvent);
  router.post("/delete", events.eventControl.deleteEvent);
  app.use("/api/event", router);
};
