let isStarted = false;
let currentThreshold = 65;

window.addEventListener('DOMContentLoaded', () => {
    const detectionButton = document.getElementById('button1'), 
        deactivateButton = document.getElementById('button2'),
        exitButton = document.getElementById('button3'),
        gasValue = document.getElementById('gas-value'),
        statusLight = document.querySelector('.status-light'),
        slider = document.getElementById('slider'),
        sliderValue = document.getElementById('slider-value'), 
        alarmSound = document.getElementById('alarm-sound');

    detectionButton.addEventListener('click', () => {
        isStarted = !isStarted;
        detectionButton.textContent = isStarted ? 'Stop' : 'Start';

        if (isStarted) {
            statusLight.classList.remove('red');
            statusLight.classList.add('green');
            gasValue.innerHTML = '<p>No leak detected</p>';
        } else {
            statusLight.classList.remove('red');
            statusLight.classList.remove('green');
            gasValue.innerHTML = '<p>Detection is off</p>';

            if (alarmSound) {
                alarmSound.pause();
            }
        }
    });

    deactivateButton.addEventListener('click', () => {
        if(isStarted) {
            if(statusLight.classList.contains('red')) {
                isStarted = false;

                statusLight.classList.remove('red');
                gasValue.innerHTML = '<p>Detection is off</p>';
                detectionButton.textContent = 'Start';

                if (alarmSound) {
                    alarmSound.pause();
                }
            }
        }
    });

    exitButton.addEventListener('click', () => {
        window.bridge.exit();
    });

    // treshold handling
    if (slider && sliderValue) {
        slider.addEventListener('input', () => {
            currentThreshold = parseFloat(slider.value);

            sliderValue.textContent = currentThreshold;
        });
    }
});

// gas value message handling
window.bridge.onMqttMessage((data) => {
    const { topic, message } = data;
    const gasValue = document.getElementById('gas-value'), 
        statusLight = document.querySelector('.status-light'),
        alarmSound = document.getElementById('alarm-sound');

    if(isStarted){
        if(message >= currentThreshold) {
            gasValue.innerHTML = `<p>${message} ppm</p>`;

            statusLight.classList.remove('green');
            statusLight.classList.add('red');

            alarmSound.currentTime = 0;
            alarmSound.play();
        } else {
            statusLight.classList.remove('red');
            statusLight.classList.add('green');

            gasValue.innerHTML = '<p>No leak detected</p>';

            if (alarmSound) {
                alarmSound.pause();
            }
        }
    }
});

window.bridge.onTimeout((data) => {
    const gasValue = document.getElementById('gas-value'), 
        statusLight = document.querySelector('.status-light'),
        alarmSound = document.getElementById('alarm-sound');
    
    if(isStarted) {
        statusLight.classList.remove('green');
        statusLight.classList.add('red');

        gasValue.innerHTML = '<p>Sensor connection lost!</p>';

        if (alarmSound) {
            alarmSound.pause();
        }
    }
});