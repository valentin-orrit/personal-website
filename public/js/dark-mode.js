document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle')
    const body = document.body
    const profilePicture = document.getElementById('hero-profile-picture')

    function setDarkMode(isDark) {
        body.classList.toggle('dark-mode', isDark)
        localStorage.setItem('darkMode', isDark ? 'enabled' : null)

        if (profilePicture) {
            profilePicture.style.filter = isDark ? 'none' : 'invert(1)'
        }
    }

    const isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled'
    setDarkMode(isDarkModeEnabled)

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            setDarkMode(!body.classList.contains('dark-mode'))
        })
    }
})

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode')
}
