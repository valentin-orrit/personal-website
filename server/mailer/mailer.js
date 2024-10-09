const Mailjet = require('node-mailjet')

const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
})

const sendEmail = async (options) => {
    try {
        const request = mailjet.post("send", {'version': 'v3.1'}).request({
        Messages: [
            {
                From: {
                    Email: process.env.MJ_SENDER_EMAIL,
                    Name: "valentinorrit.com"
                },
                ReplyTo: {
                    Email: options.sender.email,
                    Name: options.sender.name
                },
                To: [
                    {
                        Email: options.to,
                        Name: options.name || "Recipient"
                    }
                ],
                Subject: options.subject,
                TextPart: options.text,
                HTMLPart: options.html
            }
        ]
    })

    const result = await request
    return true
    
    } catch (error) {
        console.error('Error sending email:', error.statusCode, error.message)
        return false
    }
}

module.exports = { sendEmail }