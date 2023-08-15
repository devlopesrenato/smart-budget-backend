import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class EmailService {
    async sendMail(sendMailDto: SendMailDto): Promise<EmailResponse> {
        let transporter = await nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: sendMailDto.clientEmail,
            subject: sendMailDto.subject,
            html: sendMailDto.message,
        };
        try {
            const responseService = await transporter.sendMail(mailOptions);
            if (responseService.accepted.length === 0) {
                return { sent: false, info: responseService };
            } else {
                return { sent: true, info: responseService };
            }
        } catch (error) {
            console.log(error)
            return { sent: false, info: error };
        }
    }
}
