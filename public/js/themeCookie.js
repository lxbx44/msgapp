const getThemePreference = () => {
    const themeCookie = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('theme='));
    return themeCookie ? themeCookie.split('=')[1] : '';
};

const setThemePreference = (value) => {
    document.cookie = `theme=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
};

const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle('light-mode');

    const isLightMode = body.classList.contains('light-mode');
    setThemePreference(isLightMode ? 'light' : 'dark');
};

const modeToggle = document.querySelector('#mode-toggle');
const body = document.body;

window.addEventListener('DOMContentLoaded', () => {
    const savedThemePreference = getThemePreference();

    if (savedThemePreference === 'light') {
        body.classList.add('light-mode');
        modeToggle.checked = true;
    } else if (savedThemePreference === 'dark') {
        body.classList.remove('light-mode');
        modeToggle.checked = false;
    }
});

modeToggle.addEventListener('change', () => {
    toggleTheme();
});

