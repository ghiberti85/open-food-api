const ImportService = require('../src/services/ImportService').default;

// Mock nodemailer from src/mocks/nodemailer.js
jest.mock('nodemailer', () => require('../src/mocks/nodemailer'));
const nodemailer = require('nodemailer');

describe('ImportService - Email Alert System', () => {
  const { sendMailMock } = nodemailer;

  beforeAll(() => {
    // Set environment variables for the test
    process.env.EMAIL_FROM = 'test@example.com';
    process.env.EMAIL_TO = 'recipient@example.com';
  });

  beforeEach(() => {
    // Clear the sendMailMock before each test
    sendMailMock.mockClear();
  });

  it('should send an email alert when an error occurs', async () => {
    // Call the alert function
    await ImportService.sendAlert('Test failure in CRON');

    // Assert that sendMail was called once
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0][0]).toMatchObject({
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Alerta de Falha no CRON de Importação',
      text: 'Test failure in CRON',
    });
  });

  it('should handle errors during email sending', async () => {
    // Simulate an error during email sending
    sendMailMock.mockImplementationOnce((mailOptions, callback) => {
      callback(new Error('Failed to send email'));
    });

    // Call the alert function
    await ImportService.sendAlert('Simulated error during email sending');

    // Assert that sendMail was called once
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });
});
