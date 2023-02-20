window.inMenuScreen = true;

window.addEventListener('DOMContentLoaded', (e) => {
    const menuScreen = document.getElementById('menuScreen');
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
        menuScreen.style.setProperty('--title-left-offset', (window.innerWidth / 2 - (t_textSimulator.getBoundingClientRect().width + window.innerWidth * 0.01 + window.innerHeight * 0.3) / 2) + 'px');
    });
    menuScreen.style.setProperty('--title-left-offset', (window.innerWidth / 2 - (t_textSimulator.getBoundingClientRect().width + window.innerWidth * 0.01 + window.innerHeight * 0.3) / 2) + 'px');

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

    let titleBobController = setInterval(() => { });
    function titleBob() {
        titleContainer.style.transitionDuration = '2s';
        let timer = false;
        titleContainer.style.transform = 'translateY(-19vh)';
        titleBobController = setInterval(() => {
            timer = !timer;
            if (timer) titleContainer.style.transform = 'translateY(-21vh)';
            else titleContainer.style.transform = 'translateY(-19vh)';
        }, 2000);
    };
    let startTitleBob = setTimeout(titleBob, 3000);

    sandboxButton.onclick = (e) => {
        clearTimeout(startTitleBob);
        document.getElementById('restart').style.display = 'none';
        document.getElementById('saveCode').disabled = false;
        document.getElementById('saveCode').style.cursor = '';
        document.getElementById('generateSave').style.backgroundColor = '';
        document.getElementById('uploadSave').style.backgroundColor = '';
        document.getElementById('downloadSave').style.backgroundColor = '';
        document.getElementById('generateSave').style.cursor = '';
        document.getElementById('uploadSave').style.cursor = '';
        document.getElementById('downloadSave').style.cursor = '';
        document.getElementById('gridSize').disabled = false;
        document.getElementById('gridSize').style.cursor = '';
        document.getElementById('premadeSaves').style.display = '';
        sandboxMode = true;
        loadStoredSave();
        transitionToGame();
    };
    challengeButton.onclick = (e) => {
        clearTimeout(startTitleBob);
        document.getElementById('restart').style.display = '';
        document.getElementById('saveCode').disabled = true;
        document.getElementById('saveCode').style.cursor = 'not-allowed';
        document.getElementById('generateSave').style.backgroundColor = 'grey';
        document.getElementById('uploadSave').style.backgroundColor = 'grey';
        document.getElementById('downloadSave').style.backgroundColor = 'grey';
        document.getElementById('generateSave').style.cursor = 'not-allowed';
        document.getElementById('uploadSave').style.cursor = 'not-allowed';
        document.getElementById('downloadSave').style.cursor = 'not-allowed';
        document.getElementById('gridSize').disabled = true;
        document.getElementById('gridSize').style.cursor = 'not-allowed';
        document.getElementById('premadeSaves').style.display = 'none';
        sandboxMode = false;
    };

    transitionToMenu = () => {
        menuScreen.style.transitionDuration = '0s';
        menuScreen.style.backgroundColor = 'transparent';
        menuScreen.style.opacity = '1';
        menuScreen.style.visibility = '';
        menuScreen.style.pointerEvents = '';
        titleContainer.style.transitionDuration = '';
        window.inMenuScreen = true;
        t_bottom.style.transform = 'translateY(-50vh)';
        t_top.style.transform = 'translateY(50vh)';
        setTimeout(() => {
            menuScreen.style.transitionDuration = '';
            menuScreen.style.backgroundColor = '';
            t_bottom.style.transform = '';
            t_top.style.transform = '';
        }, 800);
        titleContainer.style.transform = 'translateY(-20vh)';
        setTimeout(() => {
            sandboxButton.style.transform = 'translateY(-40vh)';
        }, 600);
        setTimeout(() => {
            challengeButton.style.transform = 'translateY(-40vh)';
        }, 1000);
        setTimeout(() => {
            titleBob();
        }, 1500);
    };
    transitionToGame = () => {
        clearInterval(titleBobController);
        titleContainer.style.transitionDuration = '';
        titleContainer.style.transform = 'translateY(-165vh)';
        setTimeout(() => {
            challengeButton.style.transform = 'translateY(100vh)';
        }, 200);
        setTimeout(() => {
            sandboxButton.style.transform = 'translateY(100vh)';
        }, 300);
        setTimeout(() => {
            menuScreen.style.opacity = '0';
            window.inMenuScreen = false;
            menuScreen.style.pointerEvents = 'none';
        }, 600);
        setTimeout(() => {
            menuScreen.style.visibility = 'none';
        }, 1600);
    };
});
