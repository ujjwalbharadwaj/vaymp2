const express = require("express");
const User = require("../model/user");
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// create user
router.post("/create-user", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler("User already exists!", 400));
    }

    // const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    //   folder: "avatars",
    // });

    const user = {
      name,
      email,
      password,
      // avatar: {
      //   public_id: myCloud.public_id,
      //   url: myCloud.secure_url,
      // },
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      user = await User.create({
        name,
        email,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct password!", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  })
);

// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { email, password, phoneNumber, name } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide the correct password", 400));
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(201).json({
      success: true,
      user,
    });
  })
);

// update user avatar
// router.put(
//   "/update-avatar",
//   isAuthenticated,
//   catchAsyncErrors(async (req, res, next) => {
//     let existsUser = await User.findById(req.user.id);
//     if (req.body.avatar !== "") {
//       const imageId = existsUser.avatar.public_id;

//       await cloudinary.v2.uploader.destroy(imageId);

//       const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//         folder: "avatars",
//         width: 150,
//       });

//       existsUser.avatar = {
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
//       };
//     }

//     await existsUser.save();

//     res.status(200).json({
//       success: true,
//       user: existsUser,
//     });
//   })
// );

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    // Reset the isLastUsed flag for all addresses
    user.addresses.forEach(address => {
      address.isLastUsed = false;
    });

    const { _id, ...newAddressData } = req.body;

    if (_id) {
      // Update existing address
      const addressIndex = user.addresses.findIndex(address => address._id.toString() === _id);
      if (addressIndex > -1) {
        user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...newAddressData, isLastUsed: true };
      }
    } else {
      // Add new address
      newAddressData.isLastUsed = true;
      user.addresses.push(newAddressData);
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  })
);


// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    const addressId = req.params.id;

    await User.updateOne(
      {
        _id: userId,
      },
      { $pull: { addresses: { _id: addressId } } }
    );

    const user = await User.findById(userId);

    res.status(200).json({ success: true, user });
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect!", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("Password doesn't matched with each other!", 400)
      );
    }
    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  })
);

// find user information with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(201).json({
      success: true,
      user,
    });
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const users = await User.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      users,
    });
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User is not available with this id", 400));
    }

    // const imageId = user.avatar.public_id;

    // await cloudinary.v2.uploader.destroy(imageId);

    await User.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "User deleted successfully!",
    });
  })
);

// Forgot password

router.post(
  "/forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found with this email", 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash and set resetPasswordToken and resetPasswordTime fields
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordTime = Date.now() + 30 * 60 * 1000; // 30 minutes

    // Log the generated reset token and expiration time
    console.log("Generated reset token:", resetToken);
    console.log("Expiration time:", new Date(user.resetPasswordTime).toLocaleString());

    await user.save({ validateBeforeSave: false });

    // Create reset password URL
    const resetUrl = `http://localhost:3000/password/reset/${resetToken}`;

    // Send email
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`;

    try {
      await sendMail({
        email: user.email,
        subject: "Password Recovery",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to: ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTime = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Reset Password API
router.put(
  "/password/reset/:token",
  catchAsyncErrors(async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    console.log('Token received in URL:', req.params.token); // Debugging statement
    console.log('Hashed token for DB lookup:', resetPasswordToken); // Debugging statement

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTime: { $gt: Date.now() },
    });

    if (!user) {
      console.log('No user found or token expired'); // Debugging statement
      return next(new ErrorHandler("Password reset token is invalid or has expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
      console.log('Passwords do not match'); // Debugging statement
      return next(new ErrorHandler("Password does not match", 400));
    }

    // Set new password
    user.password = req.body.password;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  })
);







module.exports = router;
