
const getPfpPreference = () => {
    const pfpCookie = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('pfp='));
    return pfpCookie ? JSON.parse(decodeURIComponent(pfpCookie.split('=')[1])) : null;
};
