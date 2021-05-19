const sendVerificationEmail = (receiver, hash) => {
  const nodemailer = require('nodemailer');
  const querystring = require('querystring');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  var mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: receiver,
    subject: 'Sähköpostin vahvistus',
    text: 'Vahvista sähköpostiosoite klikkaamalla ohessa olevaa linkkiä',
    html: `<p><a href="http://localhost:3001/api/verification/?${querystring.encode({ user: hash })}">Vahvista sähköposti</a></p>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
}

module.exports = {
  sendVerificationEmail,
};
