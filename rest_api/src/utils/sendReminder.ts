import nodemailer from 'nodemailer';
import { generateEmail } from './generateEmail.ts';

export async function sendStreakReminder(user: any, habit:any) {
  // Prepare the Data Object correctly
  const data = {
    userName: user?.f_name || user?.user_name,
    eventTask: `Streak Nearing Reset for ${habit.title}
    You have committed to work on this habit ${habit.frequency.toLowerCase()}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    actionUrl: `${process.env.BASE_URL}/habits/${habit.id}`
  };

  // Generate the HTML template
  const htmlContent = generateEmail(data);

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Send the Mail
  try {
    await transporter.sendMail({
      from: '"SynoHabits" <reminders@synohabits.com>',
      to: user?.email,
      subject: "🔥 Quick Reminder: Save Your Streak!",
      html: htmlContent
    });
    console.log("Reminder sent to:", user?.email);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}