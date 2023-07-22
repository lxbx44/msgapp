
const openProfileBtn = document.querySelector('.i-p-usr');
const closeProfileBtn = document.querySelector('#pi-close');

const profileInfo = document.querySelector('.profile-info')
const profileInfoAll = document.querySelector('.profile-info *')


openProfileBtn.addEventListener('click', () => {
    profileInfo.style.display = 'block';
    profileInfo.style.animation = 'APP-openProfile 0.7s';
    profileInfoAll.style.animation = 'APP-openProfileAll 2s';
    profileInfo.style.height = '80vh';
    profileInfo.style.width = '60vw';
    profileInfoAll.style.opacity = '1';
});

closeProfileBtn.addEventListener('click', () => {
    profileInfo.style.animation = 'APP-closeProfile 0.7s';
    profileInfoAll.style.animation = 'APP-closeProfileAll 0.2s';
    profileInfo.style.height = '0';
    profileInfo.style.width = '0';
    profileInfoAll.style.opacity = '0';
});

window.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
        if (profileInfoAll.style.opacity == '1') {
            profileInfo.style.animation = 'APP-closeProfile 1s';
            profileInfoAll.style.animation = 'APP-closeProfileAll 0.5s';
            profileInfo.style.height = '0';
            profileInfo.style.width = '0';
            profileInfoAll.style.opacity = '0';
        } 
    }
});



// select chat

