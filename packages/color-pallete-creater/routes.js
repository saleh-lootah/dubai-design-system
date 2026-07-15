const router = require("express").Router();
const RunAPI = require("./main");

router.all("/getcolors", RunAPI);

module.exports = router;