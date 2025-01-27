document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle')
    const body = document.body
    const profilePicture = document.getElementById('hero-profile-picture')

    function setDarkMode(isDark) {
        body.classList.toggle('dark-mode', isDark)
        localStorage.setItem('darkMode', isDark ? 'enabled' : null)

        if (isDark) {
            profilePicture.style.filter = 'none'
        } else {
            profilePicture.style.filter = 'invert(1)'
        }
    }

    const isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled'
    setDarkMode(isDarkModeEnabled)

    darkModeToggle.addEventListener('click', () => {
        setDarkMode(!body.classList.contains('dark-mode'))
    })
})
