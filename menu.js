window.inMenuScreen = true;

window.addEventListener('DOMContentLoaded', (e) => {
    const transitionScreen = document.getElementById('transitionScreen');
    const titleContainer = document.getElementById('titleContainer');
    const t_redpixel = document.getElementById('t_redpixel');
    const t_textRed = document.getElementById('t_textRed');
    const t_textPixel = document.getElementById('t_textPixel');
    const t_textSimulator = document.getElementById('t_textSimulator');
    const t_bottom = document.getElementById('t_bottom');
    const t_top = document.getElementById('t_top');
    const sandboxButton = document.getElementById('sandboxButton');
    const challengeButton = document.getElementById('challengeButton');

    window.addEventListener('resize', (e) => {
        transitionScreen.style.setProperty('--title-left-offset', (window.innerWidth / 2 - (t_textSimulator.getBoundingClientRect().width + window.innerWidth * 0.01 + window.innerHeight * 0.3) / 2) + 'px');
    });
    transitionScreen.style.setProperty('--title-left-offset', (window.innerWidth / 2 - (t_textSimulator.getBoundingClientRect().width + window.innerWidth * 0.01 + window.innerHeight * 0.3) / 2) + 'px');

    setTimeout(() => {
        t_redpixel.style.transition = '200ms ease-in transform';
        t_textRed.style.transition = '200ms ease-in transform';
        t_textPixel.style.transition = '200ms ease-in transform';
        t_textSimulator.style.transition = '200ms ease-in transform';
        t_redpixel.style.transform = 'none';
    }, 200);
    setTimeout(() => {
        t_textRed.style.transform = 'none';
    }, 800);
    setTimeout(() => {
        t_textPixel.style.transform = 'none';
    }, 900);
    setTimeout(() => {
        t_textSimulator.style.transform = 'none';
    }, 1000);
    setTimeout(() => {
        titleContainer.style.transform = 'translateY(-20vh)';
    }, 1500);
    setTimeout(() => {
        sandboxButton.style.transform = 'translateY(-40vh)';
    }, 2200);
    setTimeout(() => {
        challengeButton.style.transform = 'translateY(-40vh)';
    }, 2600);

    document.getElementById('sandboxButton').onclick = (e) => {
        transitionToGame();
    };

    transitionToMenu = () => {
        // bars do the chompy thing
    };
    transitionToGame = () => {
        titleContainer.style.transform = 'translateY(-165vh)';
        setTimeout(() => {
            challengeButton.style.transform = 'translateY(100vh)';
        }, 200);
        setTimeout(() => {
            sandboxButton.style.transform = 'translateY(100vh)';
        }, 300);
        setTimeout(() => {
            transitionScreen.style.opacity = '0';
            window.inMenuScreen = false;
            transitionScreen.style.pointerEvents = 'none';
        }, 600);
        setTimeout(() => {
            transitionScreen.style.visibility = 'none';
        }, 1600);
    };

});
