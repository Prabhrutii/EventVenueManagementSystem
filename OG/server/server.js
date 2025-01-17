var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/EventHub");
var fs = require('fs');
var venue = require("./model/venue.js");
var activity = require("./model/activity.js");
var user = require("./model/user.js");
const nodemailer = require("nodemailer");

var dir = './uploads';
var upload = multer({
  storage: multer.diskStorage({

    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
});
app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

/* login api */
app.post("/login", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {

          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {

            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }

        } else {
          res.status(400).json({
            errorMessage: 'Username or password is incorrect!',
            status: false
          });
        }
      })
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* register api */
app.post("/register", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.firstName && req.body.lastName && req.body.password) {

      user.find({ username: req.body.username }, (err, data) => {

        if (data.length == 0) {

          let User = new user({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Registered Successfully.'
              });
            }
          });

        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        status: true
      });
    }
  });
}

/* Api to add venue */
app.post("/add-venue", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.name && req.body.address && req.body.slots && req.body.price) {

      let new_venue = new venue();
      new_venue.name = req.body.name;
      new_venue.address = req.body.address;
      new_venue.slots = req.body.slots;
      new_venue.price = req.body.price;
      new_venue.image = req.files[0].filename;
      new_venue.user_id = req.user.id;
      new_venue.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'venue Added successfully.'
          });
        }
      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to add Activity */
app.post("/add-activity", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.name && req.body.address && req.body.price && req.body.capacity && req.body.dateTime) {

      let new_activity = new activity();
      new_activity.name = req.body.name;
      new_activity.address = req.body.address;
      new_activity.price = req.body.price;
      new_activity.capacity = req.body.capacity;
      new_activity.dateTime = req.body.dateTime;
      new_activity.image = req.files[0].filename;
      new_activity.user_id = req.user.id;
      new_activity.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Activity Added successfully.'
          });
        }
      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});


/* Api to update venue */
app.post("/update-venue", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.name && req.body.address && req.body.slots && req.body.price &&
      req.body.id) {

      venue.findById(req.body.id, (err, new_venue) => {

        // if file already exist than remove it
        if (req.files && req.files[0] && req.files[0].filename && new_venue.image) {
          var path = `./uploads/${new_venue.image}`;
          fs.unlinkSync(path);
        }

        if (req.files && req.files[0] && req.files[0].filename) {
          new_venue.image = req.files[0].filename;
        }
        if (req.body.name) {
          new_venue.name = req.body.name;
        }
        if (req.body.address) {
          new_venue.address = req.body.address;
        }
        if (req.body.slots) {
          new_venue.slots = req.body.slots;
        }
        if (req.body.price) {
          new_venue.price = req.body.price;
        }

        new_venue.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'venue updated.'
            });
          }
        });

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to update Activity */
app.post("/update-activity", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.name && req.body.address && req.body.price &&
      req.body.capacity && req.body.id && req.body.dateTime) {

      activity.findById(req.body.id, (err, new_activity) => {

        // if file already exist than remove it
        if (req.files && req.files[0] && req.files[0].filename && new_activity.image) {
          var path = `./uploads/${new_activity.image}`;
          fs.unlinkSync(path);
        }

        if (req.files && req.files[0] && req.files[0].filename) {
          new_activity.image = req.files[0].filename;
        }
        if (req.body.name) {
          new_activity.name = req.body.name;
        }
        if (req.body.address) {
          new_activity.address = req.body.address;
        }
        if (req.body.price) {
          new_activity.price = req.body.price;
        }
        if (req.body.capacity) {
          new_activity.capacity = req.body.capacity;
        }
        if (req.body.dateTime) {
          new_activity.dateTime = req.body.dateTime;
        }

        new_activity.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'Activity updated.'
            });
          }
        });

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});


/* Api to delete venue */
app.post("/delete-venue", (req, res) => {
  try {
    if (req.body && req.body.id) {
      venue.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(200).json({
            status: true,
            title: 'venue deleted.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});


/* Api to delete activity */
app.post("/delete-activity", (req, res) => {
  try {
    if (req.body && req.body.id) {
      activity.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(200).json({
            status: true,
            title: 'Activity deleted.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});



/*Api to get and search venue with pagination and search by name*/
app.get("/get-venue", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        name: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    venue.find(query, { date: 1, name: 1, id: 1, address: 1, slots: 1, price: 1, image: 1 })
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        venue.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'venue retrived.',
                venues: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no venue!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/*Api to get and search activity with pagination and search by name*/
app.get("/get-activity", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        name: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    activity.find(query, { date: 1, name: 1, id: 1, address: 1, price: 1,capacity : 1, dateTime: 1, image: 1 })
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        activity.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'Activity retrived.',
                activities: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no Activity!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});


app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});



let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
 });
 transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
 });
 
 app.post("/send", function (req, res) {
  let mailOptions = {
    from: `${req.body.mailerState.email}`,
    to: process.env.EMAIL,
    subject: `Message from: ${req.body.mailerState.email}`,
    text: `${req.body.mailerState.message}`,
  };
 
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      console.log("== Message Sent ==");
      res.json({
        status: "success",
      });
    }
  });
 });