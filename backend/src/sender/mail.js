const nodemailer = require("nodemailer");

const OTP = Math.floor(1000 + Math.random() * 9000);

const sendMail = (User) => {
  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: User.email,
    subject: "Verify Your Email",
    text: `Dear ${User.username}
           We Received a request to Change Your Password
           Your OTP:${OTP}
           Please Go to Website And Verify OTP`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new Error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendMail,
  OTP,
};
