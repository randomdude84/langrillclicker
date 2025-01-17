
const saveVersion = 0.1;

let langrillCount = 0;
let langrillsPerSecond = 0;
let clickMultiplier = 1;

let mouseX = 0;
let mouseY = 0;

function increaseLangrills() {
    langrillCount = langrillCount + (1 * clickMultiplier);
    updateDisplay();
    addLangrillInstances(1);
    console.log("langrills", langrillCount);
};

function langrillsPS() {
    setInterval(() => {
        langrillCount += langrillsPerSecond;
        updateDisplay();
    }, 1000);
};

function updateDisplay() {


    const langrillNumberElement = document.getElementById('langrillNumber');


    langrillNumberElement.textContent = formatNumber(langrillCount);


    document.getElementById('LangrillsPerSecond').textContent = `per second: ${langrillsPerSecond}`;

};

function formatNumber(number) {
    if (number >= 1e15) return (number / 1e15).toFixed(1) + ' quadrillion';  // Example: 1.1 quadrillion
    if (number >= 1e12) return (number / 1e12).toFixed(1) + ' trillion';  // Example: 1.3 trillion
    if (number >= 1e9) return (number / 1e9).toFixed(1) + ' billion';  // Example: 1.1 billion
    if (number >= 1e6) return (number / 1e6).toFixed(1) + ' million';  // Example: 1.3 million
    return number.toString();  // Return simple number
}



let canvas, ctx, instances, scrollSpeed, img;

function initializeCanvas() {
    canvas = document.getElementById('backgroundLeftCanvas');
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    instances = [];
    scrollSpeed = 1;

    img = new Image();
    img.src = 'https://cdn.jsdelivr.net/gh/randomdude84/langrillclickercdn@main/assets/img/langrillhead.png';

    img.onload = () => {
        console.log("Canvas Scroll Initialized");
        createLangrill();
    };

    img.onerror = () => {
        console.error('Failed to load the scroller.');
    };

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function addLangrillInstances(count) {
    for (let i = 0; i < count; i++) {
        const scale = Math.random() * 0.5 + 0.5;
        const brightness = Math.random();
        const newInstance = {
            x: Math.random() * canvas.width,
            y: canvas.height,
            width: 200 * scale,
            height: 80 * scale,
            brightness,
            rotationSpeed: (Math.random() * 0.2 - 0.1),
            startTime: Date.now(),
            fadeOut: 3,
            isDropping: false,
        };

        instances.push(newInstance);

        const index = instances.length - 1;
        setTimeout(() => {
            if (instances[index]) {
                instances[index].isDropping = true;
            }
        }, Math.random() * 1000);
    }
}


function createLangrill() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    for (const instance of instances) {
        const elapsedSeconds = (now - instance.startTime) / 1000;
        if (instance.isDropping) {
            if (elapsedSeconds > 10) {
                ctx.clearRect(img, instance.x, instance.y, instance.width, instance.height)
                instances.splice(instance, 1)
                continue;
            }
            instance.y += scrollSpeed;
            if (instance.y > canvas.height) {
                instance.y = -instance.height;
                instance.x = Math.random() * canvas.width;
            }
        }



        ctx.save();
        if (elapsedSeconds > 1) {
            ctx.globalAlpha = ctx.globalAlpha - 0.1
        };
        const rotationAngle = instance.rotationSpeed * elapsedSeconds;
        ctx.rotate(rotationAngle);
        ctx.filter = `blur(${instance.brightness * 3}px)`;
        ctx.drawImage(img, instance.x, instance.y, instance.width, instance.height);
        ctx.restore();
    }

    requestAnimationFrame(createLangrill);
}


function runBounce() {
    const button = document.getElementById('langrillHead');
    button.classList.add('clicked');


    setTimeout(() => {
        button.classList.remove('clicked');
    }, 500);
};


const audioCache = {};

function preloadAudio() {
    const Clicks = ["clickb1.mp3", "clickb2.mp3"];

    Clicks.forEach(file => {
        const audio = new Audio(`https://cdn.jsdelivr.net/gh/randomdude84/langrillclickercdn@main/assets/sounds/${file}`);
        audioCache[file] = audio;
    });

    console.log("Audio files preloaded:", Object.keys(audioCache));
}
preloadAudio();

let currentPopupSize = 25;  
const maxPopupSize = 50;  

function langrillInput(inputType) {
    console.log(inputType)
    const langrillHead = document.getElementById('langrillHead');



    function playClickAudio() {
        const Clicks = ["clickb1.mp3", "clickb2.mp3"];
        const randomIndex = Math.floor(Math.random() * Clicks.length);
        const randomFile = Clicks[randomIndex];

        const clickAudio = audioCache[randomFile];

        if (clickAudio) {
            try {
                clickAudio.currentTime = 0;
                clickAudio.play();
            } catch (e) {
                console.error('Click playback failed', e);
            }
        } else {
            console.error('Audio not found in cache:', randomFile);
        }
    }

    function promptBounce(bounceType) {
        langrillHead.classList.add(bounceType);
        langrillHead.addEventListener('animationend', () => {
            langrillHead.classList.remove(bounceType);
        }, { once: true });

    }

    function popupFX(AddedCount) {

        function tweenCounter() {
            var id = null;
            var pos = 0;
            var opacity = 1;
            const fadeDur = 3000;
            var fadeRate = 1 / (fadeDur / 10);
            clearInterval(id);
            id = setInterval(frame, 10);
            function frame() {
                if (pos == 350) {
                    clearInterval(id);
                } else {
                    pos--;
                    opacity -= fadeRate;
                    popup.style.transform = `translateY(${pos}px)`;
                    popup.style.opacity = opacity;
                }
            }
        }
        const popup = document.createElement('div');
        popup.id = "LangrillCounter_Popup"
        popup.classList.add('title', 'not-selectable');
        popup.style.position = 'absolute';
        popup.style.left = `${mouseX - 15}px`;
        popup.style.top = `${mouseY - 15}px`;
        popup.style.zIndex = 500
        popup.textContent = `+${AddedCount}`

        document.body.appendChild(popup);


        tweenCounter();
        setTimeout(() => {
            popup.remove();
        }, 5000);


        function tweenLangrill() {
            var id = null;
            var opacity = 1;
            const fadeDur = 1500; 
            const fadeRate = 1 / (fadeDur / 10);
            
            var xPos = langrill.offsetLeft; 
            var yPos = langrill.offsetTop;   
            var xVelocity = (Math.random() - 0.5) * 2; 
            var yVelocity = -2; 
            var gravity = 0.05;  
        
            clearInterval(id);
            id = setInterval(frame, 10);
        
            function frame() {
                if (opacity <= 0) {
                    clearInterval(id);  
                } else {
         
                    opacity -= fadeRate;
                    langrill.style.opacity = opacity;
        
                
                    xPos += xVelocity; 
                    yVelocity += gravity; 
                    yPos += yVelocity;  
        
              
                    langrill.style.left = `${xPos}px`;
                    langrill.style.top = `${yPos}px`;
                }
            }
        }

        const langrill = new Image();
        langrill.id = "Langrill_Popup";
        langrill.classList.add( 'not-selectable');
        langrill.style.position = 'absolute';
        langrill.style.left = `${mouseX - 15}px`;
        langrill.style.top = `${mouseY - 5}px`;

        popup.style.zIndex = 450
        langrill.style.width = `${currentPopupSize}px`;
        langrill.style.height = `${currentPopupSize * (35 / 30)}px`;

        langrill.style.pointerEvents = 'none';

        const randomRotation = Math.floor(Math.random() * 30);

        langrill.style.transform = `rotate(${randomRotation}deg)`;

        langrill.src = 'https://cdn.jsdelivr.net/gh/randomdude84/langrillclickercdn@main/assets/img/langrillhead.png';

        document.body.appendChild(langrill);

        tweenLangrill();

        if (currentPopupSize < maxPopupSize) {
            currentPopupSize += 2; 
        } else {
            currentPopupSize = 25; 
        }

    }

    if (inputType == "click") {
        increaseLangrills();
        promptBounce("bounce");
        const AddedCount = 1 * clickMultiplier
        popupFX(AddedCount);
        return;
    }

    if (inputType == "mouseup" || inputType == "mousedown") {
        playClickAudio();
        return;
    }

    if (inputType == "mouseenter" || inputType == "mouseleave") {
        promptBounce("bounce2");
        return;
    }

}

function saveData() {
    const data = {
        version: saveVersion,
        langrillCount,
        langrillsPerSecond,
        clickMultiplier
    };
    localStorage.setItem('gameData', JSON.stringify(data));
}

function loadData() {
    try {
        const data = JSON.parse(localStorage.getItem('gameData'));
        langrillCount = data.langrillCount || 0;
        langrillsPerSecond = data.langrillsPerSecond || 0;
        clickMultiplier = data.clickMultiplier || 1;
    } catch (e) {
        console.error("Failed to load save data:", e);
    }
}

function exportData() {
    const savedData = {
        langrillCount: localStorage.getItem('langrillCount') || 0,
        langrillsPerSecond: localStorage.getItem('langrillsPerSecond') || 0,
        clickMultiplier: localStorage.getItem('clickMultiplier') || 1
    }
    const compressedData = btoa(JSON.stringify(savedData));
    console.log(compressedData);

    return compressedData;
}

function importData(compressedData) {
    try {
        const savedData = JSON.parse(atob(compressedData));

        Object.keys(savedData).forEach(key => {
            localStorage.setItem(key, savedData[key]);
        });

        console.log("Imported Data:", savedData);
    } catch (e) {
        console.error("Failed to import data:", e);
    }
}

function startAutoSave() {
    setInterval(() => {
        saveData();
        console.log("Game data autosaved at", new Date().toLocaleTimeString());
    }, 60000);
}



function RunInit() {
    loadData();
    initializeCanvas();
    langrillsPS();
    updateDisplay();

    const langrillHead = document.getElementById('langrillHead');

    langrillHead.addEventListener('click', function (e) {
        langrillInput("click");
    });

    langrillHead.addEventListener('mousedown', function () {
        langrillInput("mousedown");
    });
    langrillHead.addEventListener('mouseup', function () {
        langrillInput("mouseup");
    });

    langrillHead.addEventListener('mouseenter', function () {
        langrillInput("mouseenter");
    });
    langrillHead.addEventListener('mouseleave', function () {
        langrillInput("mouseleave");
    });

    window.addEventListener("beforeunload", saveData);

    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    startAutoSave();
}

RunInit();