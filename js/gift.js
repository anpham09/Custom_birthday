function goToBirthdayPage() {
    const flash = document.createElement('div');
    flash.className = 'flash-effect';
    document.body.appendChild(flash);

    document.body.classList.add('fade-out');

    setTimeout(() => {
        window.location.href="birthday.html";
    }, 1500);
}