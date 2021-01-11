module.exports = (app) => {
  /**users object contains routes functions */
  const users = require("../controllers/UserController");

  /**Import router */
  const router = require("express").Router();

  /**Multer setup */
  const multer = require("multer");
  /**set destination folder */
  const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  /**limit file size */
  const limits = {
    fileSize: 1024 * 1024,
  };
  /**Filter file format */
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter,
  });

  /**Routes related to user */
  router.post("/", upload.single("profilePhoto"), users.userControl.signUp);
  router.put("/", upload.single("profilePhoto"), users.userControl.update);
  router.post("/login", users.userControl.login);
  router.get("/confirmation/:token", users.userControl.confirmation);
  router.get("/fetchUser", users.userControl.findOneUser);
  router.get("/allUserData", users.userControl.allUserData);
  app.use("/api/users", router);
};
