const Category = require("../Models/Category");
const Category_Movie = require("../Models/Category_Movie");
const Video = require("../Models/Video");
const Movie = require("../Models/Movie");
const Follow = require("../Models/Follows");
const Evaluate = require("../Models/Evaluate");
const Comment = require("../Models/Comment");
const User = require("../Models/User");
const moment = require("moment");

exports._countComment_eval_follow_byMovieId = async (req, res) => {
  let countComment = await Comment.find(
    { movie_id: req.params.movie_id },
    function (err, data) {
      if (err) {
        res.json({
          status: false,
          message: err.message,
        });
      } else {
        return data;
      }
    }
  );

  let countEval = await Evaluate.find(
    { movie_id: req.params.movie_id },
    function (err, data) {
      if (err) {
        res.json({
          status: false,
          message: err.message,
        });
      } else {
        return data;
      }
    }
  );

  let countFollow = await Follow.find(
    { movie_id: req.params.movie_id },
    function (err, data) {
      if (err) {
        res.json({
          status: false,
          message: err.message,
        });
      } else {
        return data;
      }
    }
  );

  res.json({
    status: true,
    countComment: countComment.length,
    countEval: countEval.length,
    countFollow: countFollow.length,
  });
};

exports._getUser_Id = async (req, res) => {
  let newUser = new User({
    create_at: moment().format("YYYY-MM-DD HH:mm"),
    login_at: moment().format("YYYY-MM-DD HH:mm"),
    google_id: "null",
    facebook_id: "null",
  });
  try {
    const user_Id = (await newUser.save())._id;
    res.json({
      result: true,
      message: "create user_id ok",
      user_id: user_Id,
    });
  } catch (err) {
    res.json({
      result: false,
      message: "create user_id false" + err.message,
    });
  }
};
// login
exports._login = async (req, res) => {
  if (req.params.type === "g") {
    if (req.body.google_id) {
      User.find({ google_id: req.body.google_id }, function (err, user) {
        if (err) {
          res.json({
            result: false,
            message: "login google fail (1) " + err.message,
            position: 1200,
          });
        } else {
          if (user[0] != null) {
            res.json({
              result: true,
              message: "login google ok  ",
              position: 200,
              items: user,
            });
          } else {
            let newUser = new User({
              create_at: moment().format("YYYY-MM-DD HH:mm"),
              login_at: moment().format("YYYY-MM-DD HH:mm"),
              google_id: req.body.google_id,
              google_name: req.body.google_name,
              google_token: req.body.google_token,
              google_gmail: req.body.google_gmail,
              google_photo: req.body.google_photo,
            //   facebook_id: null,
            //   facebook_name: null,
            //   facebook_token: null,
            //   facebook_gmail: null,
            //   facebook_photo: null,
            });
            newUser.save(function (err, result) {
              if (err) {
                res.json({
                  result: false,
                  message: "create user_id false" + err.message,
                  position: 1100,
                });
              } else {
                res.json({
                  result: true,
                  message: "create google ok",
                  items: [result],
                  position: 300,
                });
              }
            });
          }
        }
      });
    } else {
      res.json({
        result: false,
        message: "google not null ~",
        position: 999,
      });
    }
  } else if (req.params.type === "f") {
    if (req.body.facebook_id) {
      await User.find(
        { facebook_id: req.body.facebook_id },
        function (err, user) {
          if (err) {
            res.json({
              result: false,
              message: "login facebook fail (1) " + err.message,
              position: 1200,
            });
          } else {
            console.log(user[0]);
            if (user[0] != null) {
              res.json({
                result: true,
                message: "login facebook ok  ",
                position: 200,
                items: user,
              });
            } else {
              console.log(req.body.facebook_id);
              let newUser = new User({
                create_at: moment().format("YYYY-MM-DD HH:mm"),
                login_at: moment().format("YYYY-MM-DD HH:mm"),
                facebook_id: req.body.facebook_id,
                facebook_name: req.body.facebook_name,
                facebook_token: req.body.facebook_token,
                facebook_gmail: req.body.facebook_gmail,
                facebook_photo: req.body.facebook_photo,
                // google_id: null,
                // google_name: null,
                // google_token: null,
                // google_gmail: null,
                // google_photo: null,
              });
              newUser.save(function (err, data) {
                if (err) {
                  res.json({
                    result: false,
                    message: "create user_id false" + err.message,
                    position: 1100,
                  });
                } else {
                  res.json({
                    result: true,
                    message: "create facebook ok",
                    position: 300,
                    items: [data],
                  });
                }
              });
            }
          }
        }
      );
    } else {
      res.json({
        result: false,
        message: "facebook_id not null ~",
        position: 999,
      });
    }
  }
};

exports._asyncUser = async (req, res) => {
  if (req.params.type === "g") {
    User.findOne({ google_id: req.body.facebook_id }, function (err, user) {
      if (err) {
        res.json({
          result: false,
          message: "async user google fail " + err.message,
        });
      } else {
        if (user == [] || user == null || user == undefined) {
          console.log("abc");
          User.findOneAndUpdate(
            { _id: req.params.invite_id },
            {
              google_id: req.body.google_id,
              google_gmail: req.body.google_gmail,
              google_name: req.body.google_name,
              google_token: req.body.google_token,
              google_photo: req.body.google_photo,
            },
            function (e) {
              if (e) {
                res.json({
                  result: false,
                  message: "async user google fail " + e.message,
                });
              } else {
                res.json({
                  result: true,
                  position: 100,
                  message: "async user google ok",
                });
              }
            }
          );
        } else {
          res.json({
            result: false,
            message: "This google account is already in use",
            position: 400,
            items: user,
          });
        }
      }
    });
  } else if (req.params.type === "f") {
    User.findOne({ facebook_id: req.body.facebook_id }, function (err, user) {
      if (err) {
        res.json({
          result: false,
          message: "async user facebook fail " + err.message,
        });
      } else {
        if (user == [] || user == null || user == undefined) {
          console.log("abc");
          User.findOneAndUpdate(
            { _id: req.params.invite_id },
            {
              login_at: moment().format("YYYY-MM-DD HH:mm"),
              facebook_id: req.body.facebook_id,
              facebook_name: req.body.facebook_name,
              facebook_token: req.body.facebook_token,
              facebook_gmail: req.body.facebook_gmail,
              facebook_photo: req.body.facebook_photo,
            },
            function (e) {
              if (e) {
                res.json({
                  result: false,
                  message: "async user facebook fail " + e.message,
                });
              } else {
                res.json({
                  result: true,
                  position: 100,
                  message: "async user facebook ok",
                });
              }
            }
          );
        } else {
          res.json({
            result: false,
            message: "This facebook account is already in use",
            position: 400,
            items: user,
          });
        }
      }
    });
  }
};

// get user by _id
exports._getDataUser_by_id = async (req, res) => {
  User.find({ _id: req.params.id }, function (err, user) {
    if (err) {
      res.json({
        result: false,
        message: err.message,
        status: "Error get User",
      });
    } else {
      res.json({
        result: true,
        status: "Get User OK!",
        items: user,
      });
    }
  });
};
