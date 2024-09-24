const contactForm = document.querySelector('.contact-form')
const name = document.getElementById('name')
const email = document.getElementById('email')
const subject = document.getElementById('subject')
const message = document.getElementById('message')


contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value
    }

    try {
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        const result = await response.json()

        if (!response.ok) {
            alert(`Failed to send message: ${result.message}`)
            return
        }

        if (result.status === 'success') {
            alert('Email sent')

            name.value = ''
            email.value = ''
            subject.value = ''
            message.value = ''
        } else {
            alert('Operation failed: ' + result.message)
        }

    } catch (error) {
        console.error('Error:', error)
        alert('Network error or cannot connect to server')
    }
})