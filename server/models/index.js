const mongoose = require("mongoose");
mongoose.set("debug",true)
mongoose.Promise = Promise;
mongoose.connect(process.env.DB_URI || "mongodb://localhost/deaddrop",{
    keepAlive:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})

module.exports.Session = require("./session");