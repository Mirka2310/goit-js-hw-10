import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'flatpickr/dist/flatpickr.min.css';

const startButton = document.querySelector('button');
const inputData = document.querySelector('input#datetime-picker');
const daysData = document.querySelector('[data-days]');
const hoursData = document.querySelector('[data-hours]');
const minutesData = document.querySelector('[data-minutes]');
const secondsData = document.querySelector('[data-seconds]');
const timer = document.querySelector('.timer');

let selectedDateTime;

const flatpickrOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDateTime = selectedDates[0];
    if (selectedDateTime < Date.now()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

let timerInterval;

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000, selectedDateTime);
}

function updateTimer(endDateTime) {
  const currentDate = new Date();
  const remainingTime = endDateTime - currentDate;
  const { days, hours, minutes, seconds } = convertMsToTime(remainingTime);
  daysData.textContent = addLeadingZero(days);
  hoursData.textContent = addLeadingZero(hours);
  minutesData.textContent = addLeadingZero(minutes);
  secondsData.textContent = addLeadingZero(seconds);
  if (remainingTime <= 0) {
    stopTimer();
  }
}

startButton.addEventListener('click', () => {
  if (selectedDateTime) {
    startTimer();
  }
});

function stopTimer() {
  clearInterval(timerInterval);
  daysData.textContent = '00';
  hoursData.textContent = '00';
  minutesData.textContent = '00';
  secondsData.textContent = '00';
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMsToTime(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

flatpickr(inputData, flatpickrOptions);
