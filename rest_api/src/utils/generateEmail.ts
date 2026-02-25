interface ReminderProps {
  userName: string;
  eventTask: string;
  date: string;
  actionUrl: string;
}

/**
 * Modern Email Template with a Dinosaur Brand Aesthetic
 */
export const generateEmail = (props: ReminderProps): string => {
  const { userName, eventTask, date, actionUrl } = props;

  // Replace this URL with your actual hosted SVG path
  const dinoLogoUrl = "https://drive.google.com/drive/folders/1JwFY3--oXIA5-yJnL7qxo8N60tBLpmX8"; 

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            margin: 0; padding: 0; background-color: #f1f5f9; 
        }
        .email-wrapper { padding: 40px 10px; background-color: #f1f5f9; }
        .card { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
        }
        .header { 
            padding: 40px 0 20px 0; 
            text-align: center; 
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }
        .logo { width: 80px; height: auto; margin: 0 auto; }
        .content { padding: 40px; color: #1e293b; }
        h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 20px 0; letter-spacing: -0.02em; }
        p { font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 24px 0; }
        
        .details-box { 
            background-color: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 12px; 
            padding: 20px; 
            margin-bottom: 30px; 
        }
        .details-row { margin-bottom: 8px; font-size: 14px; }
        .label { font-weight: 700; color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
        
        .btn-wrapper { text-align: center; }
        .btn { 
            display: inline-block; 
            background-color: #10b981; /* Professional Emerald Green */
            color: #ffffff !important; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 700; 
            font-size: 16px;
        }
        .footer { 
            padding: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #94a3b8; 
            background-color: #f8fafc; 
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="card">
            <div class="header">
                <img src="https://drive.google.com/file/d/13KgRAYp_wX9vz0kQ0PXe6gm6cUICsUQs/view?usp=sharing" alt="DinoCorp Logo" class="logo">
                <div style="font-weight: 900; color: #10b981; font-size: 20px; margin-top: 10px;">SYNOHABITS</div>
            </div>
            
            <div class="content">
                <h1>Don't let this go extinct!</h1>
                <p>Hi ${userName},</p>
                <p>Time is running out on your upcoming task. We wanted to give you a quick "roar" to make sure you're still on track., you are nearing losing your streak!, please complete your task before the close of day to retain your habit streak</p>
                
                <div class="details-box">
                    <div class="details-row">
                        <div class="label">Habit / Task</div>
                        <div style="font-size: 16px; font-weight: 600;">${eventTask}</div>
                    </div>
                    <div style="height: 12px;"></div>
                    <div class="details-row">
                        <div class="label">Due Date</div>
                        <div style="font-size: 16px; font-weight: 600;">${date}</div>
                    </div>
                </div>

                <div class="btn-wrapper">
                    <a href="${actionUrl}" class="btn">Take Action Now</a>
                </div>
            </div>

            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} SynoHabits.com • E4-18 Building, Ashesi</p>
                <p><a href="#" style="color: #10b981; text-decoration: none;">Privacy</a> • <a href="#" style="color: #10b981; text-decoration: none;">Unsubscribe</a></p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};