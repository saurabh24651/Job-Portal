import User from '../models/user.model.js';

// toggle save job
export const toggleSaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isSaved ? "Job removed from saved" : "Job saved successfully",
      savedJobs: user.savedJobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// toggle save questions
export const toggleSaveQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { type } = req.query; // either interview or role question
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let isSaved;
    let message;

    if (type === 'role') {
      isSaved = user.savedRoleQuestion.includes(questionId);
      if (isSaved) {
        user.savedRoleQuestion = user.savedRoleQuestion.filter(id => id.toString() !== questionId);
        message = "Question unsaved"
      } else {
        user.savedRoleQuestion.push(questionId);
        message = "Question saved"
      }
    } else {
      isSaved = user.savedInterviewQuestion.includes(questionId);
      if (isSaved) {
        user.savedInterviewQuestion = user.savedInterviewQuestion.filter(id => id.toString() !== questionId);
        message = "Question unsaved"
      } else {
        user.savedInterviewQuestion.push(questionId);
        message = "Question saved"
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message:error.message,
    //   savedInterviewQuestions:user.savedInterviewQuestions,
    //   savedRoleQuestions:user.savedRoleQuestions
    });
  }
}

// to get all saved items
export const getSavedItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate("savedJobs")
      .populate({
        path: "savedInterviewQuestion",
        populate: { path: "company" }
      })
      .populate({
        path: "savedRoleQuestion",
        populate: { path: "roleId" }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
  success: true,
  savedJobs: user.savedJobs || [],
  savedInterviewQuestions: user.savedInterviewQuestion || [],
  savedRoleQuestions: user.savedRoleQuestion || []
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}