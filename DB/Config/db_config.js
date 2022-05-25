const mongoose = require('mongoose');

mongoose.connect(
  "mongodb+srv://salah:salah@cluster0.ugogl.mongodb.net/aws?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("Mongodb connected");
    else console.log("Connection error :" + err);
  }
)