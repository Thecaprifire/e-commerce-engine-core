const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.get("/", (req, res) => {
  res.send("<h1>Hello, this is the root route!<h1>");
});

router.use((req, res) => {
  res.send("<h1>Wrong Route! Testing</h1>");
});

module.exports = router;