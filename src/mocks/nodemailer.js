const sendMailMock = jest.fn((mailOptions, callback) => {
    if (typeof callback === 'function') {
      callback(null, 'Email sent successfully');
    }
  });
  
  const createTransportMock = jest.fn(() => ({
    sendMail: sendMailMock,
  }));
  
  module.exports = {
    createTransport: createTransportMock,
    sendMailMock,
  };
  