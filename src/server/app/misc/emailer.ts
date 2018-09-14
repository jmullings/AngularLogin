import * as SendGrid from 'sendgrid';
import {EmailTemplate} from 'email-templates';

/**
 * Static class email module that provides simple Plug and Play functions to send custom templated emails using the SendGrid API.
 */
export class Emailer {

    /**
     * Assign the API key required by SendGrid to send emails.
     * @param {string} key - The SendGrid API key.
     */
    public static initKey(key: string) {
        this.sendGrid = SendGrid(key);
    }

    /**
     * Send an HTML formatted, custom templated email using the SendGrid API.
     * @param {MailOptions} opts - Template email's delivery fields and content.
     * @param {Function} callback - The callback function that contains an error if an error occured with sending an email.
     */
    public static send(options: MailOptions, callback: (error: Error) => void) {
        new EmailTemplate(options.template).render(options.content, (err: Error, result: EmailTemplateResults) => {
            // If an error occured rendering the template
            if (err) {
                return callback(err);
            }
            // Create a SendGrid request which contains the email's content.
            const request = this.sendGrid.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: {
                    from: {
                        name: options.from.name,
                        email: options.from.email,
                    },
                    personalizations: [{
                        to: [{
                            name: options.to.name,
                            email: options.to.email,
                        }],
                        subject: options.subject,
                    }],
                    content: [{
                        type: 'text/html',
                        value: result.html,
                    }],
                },
            });
            // Send email via custom request using the SendGrid API
            this.sendGrid.API(request, (sendGridError: Error) => {
                return callback(sendGridError);
            });
        });
    }

    // Private static fields
    private static sendGrid = null;
}
