
const openProfileBtn = document.querySelector('.i-p-usr');
const closeProfileBtn = document.querySelector('#pi-close');

const profileInfo = document.querySelector('.profile-info');

const profileInfoAll = profileInfo.querySelectorAll('*');

openProfileBtn.addEventListener('click', () => {
    profileInfo.style.display = 'block';

    profileInfo.style.animation = 'APP-openProfile 0.7s';
    profileInfo.style.height = '80vh';
    profileInfo.style.width = '60vw';

    profileInfoAll.forEach((el) => {
        el.style.animation = 'APP-openProfileAll 0.7s';
        setTimeout(() => {
            el.style.opacity = '1';
        }, 700)
    });
});

window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyP' && event.shiftKey) {
        profileInfo.style.display = 'block';

        profileInfo.style.animation = 'APP-openProfile 0.7s';
        profileInfo.style.height = '80vh';
        profileInfo.style.width = '60vw';

        profileInfoAll.forEach((el) => {
            el.style.animation = 'APP-openProfileAll 0.7s';
            setTimeout(() => {
                el.style.opacity = '1';
            }, 700)
        });
    };
});


closeProfileBtn.addEventListener('click', () => {
    profileInfo.style.animation = 'APP-closeProfile 0.7s';
    profileInfo.style.height = '0';
    profileInfo.style.width = '0';
    setTimeout(() => {
        profileInfo.style.display = 'none';
    }, 700) 
    profileInfoAll.forEach((el) => {
        el.style.animation = 'APP-closeProfileAll 0.7s';
        setTimeout(() => {
            el.style.opacity = '0';
        }, 600)
    });
});

window.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
        if (Array.from(profileInfoAll).every((el) => el.style.opacity === '1')) {
            profileInfo.style.animation = 'APP-closeProfile 0.7s';
            profileInfo.style.height = '0';
            profileInfo.style.width = '0';
            setTimeout(() => {
                profileInfo.style.display = 'none';
            }, 700) 
            profileInfoAll.forEach((el) => {
                el.style.animation = 'APP-closeProfileAll 0.7s';
                setTimeout(() => {
                    el.style.opacity = '0';
                }, 600)
            });
        } 
    }
});


// select chat

