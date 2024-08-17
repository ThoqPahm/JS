document.querySelectorAll('.advertisementLink').forEach(link => {
    link.addEventListener('click', function() {
        const currentTime = new Date().getTime();
        localStorage.setItem('linkClickedTime', currentTime);
        hideTimeoutMessage(this); // Ẩn thông báo quá hạn khi người dùng nhấp vào liên kết
    });
});

document.querySelectorAll('.confirmButton').forEach(button => {
    button.addEventListener('click', function() {
        const container = this.closest('.container');
        const urlInput = container.querySelector('.urlInput').value;
        const spinner = container.querySelector('.spinner');
        const buttonText = container.querySelector('.buttonText');
        const isValidUrl = urlInput.startsWith('http://') || urlInput.startsWith('https://');
        const isLongEnough = urlInput.length >= 80;
        const isNotBlacklistedDomain = !urlInput.includes('tinnuocngoai.com') && !urlInput.includes('google.com');

        spinner.style.display = 'inline-block';
        buttonText.style.display = 'none';
        this.disabled = true;

        setTimeout(() => {
            if (container.querySelector('.timeoutMessage').style.opacity == 1) {
                showTimeoutMessage('Quá hạn nghiệm vụ, vui lòng load lại trang lấy lại mã quảng cáo mới!', container);
            } else if (!checkLinkClicked()) {
                showErrorMessage('Vui lòng vào đường link bên trên để lấy mã quảng cáo', container);
            } else if (isValidUrl && isLongEnough && isNotBlacklistedDomain) {
                redirectToDownload();
            } else {
                showErrorMessage('Có vẻ như đây không phải mã quảng cáo', container);
            }

            spinner.style.display = 'none';
            buttonText.style.display = 'inline';
            this.disabled = false;
        }, 2000);
    });
});

document.querySelectorAll('.clearButton').forEach(button => {
    button.addEventListener('click', function() {
        const container = this.closest('.container');
        container.querySelector('.urlInput').value = '';
    });
});

function getLinkClickedTime() {
    const linkClickedTime = localStorage.getItem('linkClickedTime');
    return linkClickedTime ? parseInt(linkClickedTime, 10) : null;
}

function checkLinkClicked() {
    const linkClickedTime = getLinkClickedTime();
    if (linkClickedTime) {
        const currentTime = new Date().getTime();
        if (currentTime - linkClickedTime <= 120000) { // 2 phút = 120000 ms
            return true;
        } else {
            localStorage.removeItem('linkClickedTime');
            document.querySelectorAll('.container').forEach(container => {
                showTimeoutMessage('Quá hạn nghiệm vụ, vui lòng load lại trang lấy lại mã quảng cáo mới!', container);
            });
        }
    }
    return false;
}

function showErrorMessage(message, container) {
    const errorMessage = container.querySelector('.errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.opacity = 1;
    setTimeout(() => {
        errorMessage.style.opacity = 0;
    }, 3000);
}

function showTimeoutMessage(message, container) {
    const timeoutMessage = container.querySelector('.timeoutMessage');
    timeoutMessage.textContent = message;
    timeoutMessage.style.opacity = 1;
    timeoutMessage.classList.add('blink');
}

function hideTimeoutMessage(container) {
    const timeoutMessage = container.querySelector('.timeoutMessage');
    timeoutMessage.style.opacity = 0;
    timeoutMessage.classList.remove('blink');
}

window.onload = function() {
    checkLinkClicked();
};

setInterval(() => {
    checkLinkClicked();
}, 10000);

const style = document.createElement('style');
style.textContent = `
    .blink {
        animation: blink 1s step-start 0s infinite;
    }
    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);
