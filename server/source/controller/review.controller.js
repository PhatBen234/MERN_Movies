import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../model/review.model.js";

const create = async (req, res) => {
  try {
    const { movieId } = req.params;

    const review = new reviewModel({
      user: req.user.id,
      movieId,
      ...req.body,
    });

    await review.save();

    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user,
    });
  } catch {
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const review = await reviewModel.findOneAndDelete({
      _id: reviewId,
      user: req.user.id
    });

    if (!review) {
      return responseHandler.notfound(res, "Review not found");
    }

    responseHandler.ok(res, review);
  } catch {
    responseHandler.error(res);
  }
};


const getReviewsOfUser = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({
        user: req.user.id,
      })
      .sort("-createdAt");

    responseHandler.ok(res, reviews);
  } catch {
    responseHandler.error(res);
  }
};

export default { create, remove, getReviewsOfUser };
