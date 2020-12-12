const User = require("../Models/User");
const Movie = require("../Models/Movie");
const Comment = require("../Models/Comment");
const Evaluate = require("../Models/Evaluate");
const moment = require("moment");
const { populate } = require("../Models/Comment");

exports._addComment = async (req, res) => {
  await Comment.findOne(
    { user_id: req.body.user_id, movie_id: req.body.movie_id },
    function (err, data) {
      if (err) {
        res.json({
          result: false,
          position: 1,
          message: "check data evaluate fail " + err.message,
        });
      } else {
        if (data === [] || data === null) {
          let comment = new Comment({
            movie_id: req.body.movie_id,
            user_id: req.body.user_id,
            evaluate_id: req.body.movie_id,
            //evaluate_id: null,
            message: req.body.message,
            create_at: moment().format("YYYY-MM-DD HH:mm"),
          });
          comment.save(function (err) {
            if (err) {
              res.json({
                result: false,
                position: 1,
                message: "create comment fail " + err.message,
              });
            } else {
              res.json({
                result: true,
                position: 2,
                message:
                  "create comment ok " + moment().format("YYYY-MM-DD HH:mm"),
              });
            }
          });
        } else {
          Comment.findOneAndUpdate(
            { user_id: req.body.user_id, movie_id: req.body.movie_id },
            {
              message: req.body.message,
            },
            function (e1) {
              if (e1) {
                res.json({
                  result: false,
                  position: 1,
                  message: "update comment fail " + e1.message,
                });
              } else {
                res.json({
                  result: true,
                  position: 2,
                  message:
                    "update comment ok " + moment().format("YYYY-MM-DD HH:mm"),
                });
              }
            }
          );
        }
      }
    }
  );
};

exports._updateComment = async (req, res) => {
  await Comment.findOneAndUpdate(
    { _id: req.body._id },
    {
      message: req.body.message,
      update_at: moment().format("YYYY-MM-DD HH:mm"),
    },
    function (err, next, data) {
      if (err) {
        res.json({
          result: false,
          position: 1,
          message: "update Comment fail ~" + err.message,
        });
      } else {
        res.json({
          result: true,
          position: 2,
          message: "update comment ok " + moment().format("YYYY-MM-DD HH:mm"),
          items: data,
        });
      }
    }
  );
};

exports._findComment = async (req, res) => {
  await Comment.find({ movie_id: req.params.movie_id })
    .populate("user_id")
    .populate("evaluate_id")
    .exec(function (err, data) {
      if (err) {
        res.json({
          result: false,
          position: 1,
          message:
            "find comment by movie_id : " +
            req.params.movie_id +
            " fail : " +
            err.message,
        });
      } else {
        res.json({
          result: true,
          position: 2,
          message:
            "find comment by id: " +
            req.params.movie_id +
            " ok ~~  date: " +
            moment().format("YYYY-MM-DD HH:mm"),
          items: data,
        });
      }
    });
};

exports._getOne = async (req, res) => {
  await Comment.find(
    { user_id: req.params.user_id, movie_id: req.params.movie_id },
    function (err, data) {
      if (err) {
        res.json({
          result: false,
          position: 1,
          message:
            "find comment by user_id : " +
            req.params.movie_id +
            " fail : " +
            err.message,
        });
      } else {
        res.json({
          result: true,
          position: 2,
          message:
            "find comment by user_id: " +
            req.params.movie_id +
            " ok ~~  date: " +
            moment().format("YYYY-MM-DD HH:mm"),
          items: data,
        });
      }
    }
  );
};
