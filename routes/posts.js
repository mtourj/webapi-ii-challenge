const express = require("express");

const database = require("../data/db");

const moment = require("moment");

const router = express.Router();

router.post("/", (req, res) => {
  // Creates a post using the information sent inside the request body.
  if (
    !req.body.title ||
    !req.body.title.trim() ||
    !req.body.contents ||
    !req.body.contents.trim()
  ) {
    res
      .status(400)
      .json({
        message: "Please provide 'title' and 'contents' fields to create post."
      });
  } else {
    console.log(`The time according to moment is ${moment().format()}`);
    const post = {
      title: req.body.title,
      contents: req.body.contents,
      created_at: moment().format(),
      updated_at: moment().format()
    };
    database
      .insert(post)
      .then(val => {
        res.status(201).json(post);
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message:
              "A server server error occured when saving the post to the database."
          });
      });
  }
});

router.post("/:id/comments", (req, res) => {
  // Creates a comment for the post with the specified id using information sent inside of the request body.
  database
    .findById(req.params.id)
    .then(result => {
      if (result.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        if (!req.body.text || !req.body.text.trim()) {
          res
            .status(400)
            .json({
              message: "Please provide 'text' field to create comment."
            });
        } else {
          const comment = {
            text: req.body.text,
            post_id: req.params.id,
            created_at: moment().format(),
            updated_at: moment().format()
          };
          database
            .insertComment(comment)
            .then(val => {
              res.status(201).json(comment);
            })
            .catch(err => {
              res
                .status(500)
                .json({
                  message:
                    "A server server error occured when saving the comment to the database."
                });
            });
        }
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({
          message: "There was an error looking up a post with the specified ID"
        });
    });
});

router.get("/", (req, res) => {
  // Returns an array of all the post objects contained in the database.
  database
    .find()
    .then(posts => {
      res.status(200).json({ posts });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  // 	Returns the post object with the specified id.
  database.findById(req.params.id)
  .then(posts => {
    console.log(posts);
    if(posts.length === 0){
      res.status(404).json({message: "The post with the specified ID does not exist."});
    } else {
      res.status(200).json(posts);
    }
  })
  .catch(err => {
    res.status(500).json({message: "There was an error retrieving the post from the database."});
  })
});

router.get("/:id/comments", (req, res) => {
  // Returns an array of all the comment objects associated with the post with the specified id.
  database.findPostComments(req.params.id)
  .then(comments => {
    res.status(200).json(comments);
  })
  .catch(err => {
    res.status(500).json({message: "There was an error retrieving comments for this post."});
  })
});

router.delete("/:id", (req, res) => {
  // Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
  database.findById(req.params.id)
  .then(posts => {
    if(posts.length === 0){
      res.status(404).json({message: "The post with the specified ID does not exist"});
      return;
    } else {
      const targetPost = posts[0];
      database.remove(req.params.id)
      .then(val => {
        res.status(200).json(targetPost);
      })
      .catch(err => {
        res.status(500).json({message: "An error occurred while trying to delete the specified post."});
      })
    }
  })
  .catch(err => {
    res.status(500).json({message: `There was an error finding the post with id ${req.params.id}`});
    return;
  })
});

router.put("/:id", (req, res) => {
  // 	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
  database.findById(req.params.id)
  .then(posts => {
    if(posts.length === 0){
      res.status(404).json({message: "The post with the specified ID does not exist."});
      return;
    }
  })
  .catch(err => {
    res.status(500).json({message: "An error occurred while trying to find the specified post."});
    return;
  })

  if (
    !req.body.title ||
    !req.body.title.trim() ||
    !req.body.contents ||
    !req.body.contents.trim()
  ) {
    res
      .status(400)
      .json({
        message: "Please provide 'title' and 'contents' fields to create post."
      });
  } else {
    const post = {
      title: req.body.title,
      contents: req.body.contents
    }
    database.update(req.params.id, post)
    .then(val => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({message: "The post information could not be modified."});
    })
  }
});

module.exports = router;
