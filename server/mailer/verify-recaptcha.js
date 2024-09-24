async function verifyRecaptcha(token) {
    const recaptchaSecret = process.env.GOOGLE_CAPTCHA_SECRET_KEY
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`

    const response = await fetch(recaptchaUrl, { method: 'POST' })
    const result = await response.json()
 
    return result.success
}

module.exports = verifyRecaptcha