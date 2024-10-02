document.addEventListener('DOMContentLoaded', () => {
    const languageToggle = document.getElementById('languageToggle')
    const frIcon = languageToggle.querySelector('.fr-icon')
    const ukIcon = languageToggle.querySelector('.uk-icon')
    
    let translations = {}

    async function loadTranslations() {
        const pageName = document.body.dataset.page
        try {
            const response = await fetch(`/translations/${pageName}.json`)
            translations = await response.json()
        } catch (error) {
            console.error('Failed to load translations:', error)
        }
    }

    async function setLanguage(lang) {
        if (Object.keys(translations).length === 0) {
            await loadTranslations()
        }
        document.documentElement.lang = lang
        localStorage.setItem('language', lang)
        updateToggleDisplay(lang)
        updatePageContent(lang)
    }

    function updateToggleDisplay(lang) {
        if (lang === 'fr') {
            frIcon.style.display = 'inline-block'
            ukIcon.style.display = 'none'
        } else {
            frIcon.style.display = 'none'
            ukIcon.style.display = 'inline-block'
        }
    }

    function updatePageContent(lang) {
        const elements = document.querySelectorAll('[data-lang-key]')
        elements.forEach(element => {
            const key = element.getAttribute('data-lang-key')
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key] || key
            } else {
                element.textContent = translations[lang][key] || key
            }
        })
    
        // Update submit button value
        const submitButton = document.querySelector('input[type="submit"][data-lang-key="send-btn"]')
        if (submitButton) {
            submitButton.value = translations[lang][submitButton.getAttribute('data-lang-key')] || submitButton.value
        }
    }
    

    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguage(savedLanguage)

    languageToggle.addEventListener('click', () => {
        const newLang = document.documentElement.lang === 'en' ? 'fr' : 'en'
        setLanguage(newLang)
    })
})