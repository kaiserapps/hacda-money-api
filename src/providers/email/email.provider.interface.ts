export interface IEmailProvider {
    sendEmail(email: string, subject: string, body: string, templateId: string, substitutions?: any): Promise<IEmail>;
}

export interface IEmail {
    to: string;
    from: string;
    subject: string;
    body: string;
}
