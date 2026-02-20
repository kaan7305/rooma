// Email notification service
// In production, this would integrate with SendGrid, AWS SES, or similar

export interface EmailNotification {
  to: string;
  subject: string;
  template: 'booking-confirmation' | 'message-received' | 'booking-request' | 'password-reset' | 'welcome';
  data: Record<string, any>;
}

class EmailService {
  private queue: EmailNotification[] = [];

  async sendEmail(notification: EmailNotification): Promise<boolean> {
    console.log('📧 Sending email:', notification);
    
    // Simulate API call to email service
    return new Promise((resolve) => {
      setTimeout(() => {
        this.queue.push(notification);
        console.log('✅ Email sent successfully to:', notification.to);
        resolve(true);
      }, 500);
    });
  }

  async sendBookingConfirmation(userEmail: string, bookingDetails: any) {
    return this.sendEmail({
      to: userEmail,
      subject: 'Booking Confirmation - ROOMA',
      template: 'booking-confirmation',
      data: {
        propertyName: bookingDetails.propertyName,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        totalPrice: bookingDetails.totalPrice,
      },
    });
  }

  async sendMessageNotification(userEmail: string, senderName: string, propertyName: string) {
    return this.sendEmail({
      to: userEmail,
      subject: `New message from ${senderName}`,
      template: 'message-received',
      data: {
        senderName,
        propertyName,
      },
    });
  }

  async sendBookingRequest(hostEmail: string, guestName: string, propertyName: string) {
    return this.sendEmail({
      to: hostEmail,
      subject: 'New Booking Request',
      template: 'booking-request',
      data: {
        guestName,
        propertyName,
      },
    });
  }

  async sendWelcomeEmail(userEmail: string, userName: string) {
    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to ROOMA!',
      template: 'welcome',
      data: {
        userName,
      },
    });
  }

  async sendPasswordReset(userEmail: string, resetLink: string) {
    return this.sendEmail({
      to: userEmail,
      subject: 'Reset Your Password - ROOMA',
      template: 'password-reset',
      data: {
        resetLink,
      },
    });
  }

  getQueuedEmails() {
    return this.queue;
  }

  clearQueue() {
    this.queue = [];
  }
}

export const emailService = new EmailService();
