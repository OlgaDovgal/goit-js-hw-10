import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'flatpickr/dist/flatpickr.min.css';
let userSelectedDate = null;
const btnStartEl = document.querySelector('button[data-start]');
btnStartEl.disabled = true;
const inputEl = document.querySelector('#datetime-picker');

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (!selectedDates[0] || selectedDates[0] <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#ef4040',
        titleColor: '#fff',
        messageColor: '#fff',
        progressBarColor: '#b51b1b',
      });
      btnStartEl.disabled = true;
      btnStartEl.classList.remove('enabled');
    } else {
      userSelectedDate = selectedDates[0];
      btnStartEl.classList.add('enabled');
      btnStartEl.disabled = false;
    }
  },
});
const timer = {
  deadline: userSelectedDate,
  intervalId: null,
  elements: {
    days: document.querySelector('span[data-days]'),
    hours: document.querySelector('span[data-hours]'),
    minutes: document.querySelector('span[data-minutes]'),
    seconds: document.querySelector('span[data-seconds]'),
  },
  start() {
    btnStartEl.disabled = true;
    inputEl.disabled = true;
    inputEl.classList.add('countdown');
    btnStartEl.classList.remove('enabled');
    this.intervalId = setInterval(() => {
      const diff = this.deadline - Date.now();
      if (diff <= 0) {
        this.stop();
        return;
      }
      const timeComponents = this.convertMs(diff);
      this.elements.days.textContent = this.addLeadingZero(timeComponents.days);
      this.elements.hours.textContent = this.addLeadingZero(
        timeComponents.hours
      );
      this.elements.minutes.textContent = this.addLeadingZero(
        timeComponents.minutes
      );
      this.elements.seconds.textContent = this.addLeadingZero(
        timeComponents.seconds
      );
    }, 1000);
  },
  stop() {
    clearInterval(this.intervalId);
    for (const key in this.elements) {
      this.elements[key].textContent = '00';
    }
    inputEl.disabled = false;
    inputEl.classList.remove('countdown');
  },
  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },
  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  },
};
btnStartEl.addEventListener('click', () => {
  timer.deadline = userSelectedDate;
  timer.start();
});
