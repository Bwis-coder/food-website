import { MailtrapClient } from 'mailtrap'

const sendMail = async (email, subject, message) => {
  try {
    const TOKEN = process.env.API_TOKEN;

    const client = new MailtrapClient({
      token: TOKEN,
    });

    const sender = {
      email: "hello@demomailtrap.co",
      name: "Mailtrap Test",
    };
    const recipients = [
      {
        email,
      },
    ];

    client
      .send({
        from: sender,
        to: recipients,
        subject,
        text: message,
      })
      .then(console.log, console.error);
  } catch (error) {
    console.error("Error sending test email:", error);
  }
};

export { sendMail };

// domain 84e3971f032812a27ee0af28406e8e6f

// token e7602ffb8825ee12aa3e5971e51e2a36
