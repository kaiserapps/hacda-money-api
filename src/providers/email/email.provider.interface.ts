export interface IEmailProvider {
    sendEmail(email: string, subject: string, body: string, templateId: string, substitutions?: any): Promise<any>;
}
