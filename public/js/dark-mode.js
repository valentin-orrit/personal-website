document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle')
  const body = document.body
  const heroImage = document.querySelector('[data-hero-image]')
  
  const lightModeImage = '/img/hero-image.png'
  const darkModeImage = '/img/hero-image-dark.png'

  function setDarkMode(isDark) {
      body.classList.toggle('dark-mode', isDark)
      heroImage.src = isDark ? darkModeImage : lightModeImage
      localStorage.setItem('darkMode', isDark ? 'enabled' : null)
  }

  if (localStorage.getItem('darkMode') === 'enabled') {
      setDarkMode(true)
  }

  darkModeToggle.addEventListener('click', () => {
      setDarkMode(!body.classList.contains('dark-mode'))
  })
})