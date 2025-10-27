import iziToast from 'izitoast';

iziToast.settings({
  timeout: 2000,
  theme: 'dark',
  position: 'topRight',
  resetOnHover: true,
  transitionIn: 'flipInX',
  transitionOut: 'flipOutX',
});

const toastMessage = message => iziToast.show({ message: [message] });

// Timer

export const timer = {
  intervalID: null,
  userDate: null,
  elements: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
    button: document.querySelector('[data-start]'),
    input: document.querySelector('#datetime-picker'),
  },
  isFutureDate() {
    if (this.userDate - Date.now() > 0) return true;
    toastMessage('Please choose a date in the future!');
    this.disableInterface(false);
    return false;
  },
  setTimer() {
    if (!this.isFutureDate()) return;
    this.startCountDown();
    this.disableInterface();
  },
  startCountDown() {
    this.intervalID = setInterval(() => {
      const left = this.userDate - Date.now();

      if (left <= 0) {
        this.stopTimer();
        return;
      }

      const time = this.convertMs(left);

      this.elements.days.textContent = this.pad(time.days);
      this.elements.hours.textContent = this.pad(time.hours);
      this.elements.minutes.textContent = this.pad(time.minutes);
      this.elements.seconds.textContent = this.pad(time.seconds);
    }, 1000);
  },
  stopTimer() {
    clearInterval(this.intervalID);
    this.enableInterface();
  },
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },
  pad(value) {
    return String(value).padStart(2, '0');
  },
  disableInterface(all = true) {
    if (all) this.elements.input.setAttribute('disabled', '');
    this.elements.button.setAttribute('disabled', '');
  },
  enableInterface(all = false) {
    if (all) this.elements.button.removeAttribute('disabled');
    this.elements.input.removeAttribute('disabled');
  },
};

export const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    timer.userDate = selectedDates[0];
    if (timer.isFutureDate()) timer.enableInterface(true);
  },
};

// Snackbar

export const elements = {
  form: document.querySelector('.form'),
  input: document.querySelector('[name="delay"]'),
  fulfilled: document.querySelector('[value="fulfilled"]'),
};

export const state = {
  input: null,
  fulfilled: null,
  init() {
    this.input = elements.input.value;
    this.fulfilled = elements.fulfilled.checked;
  },
  isValid() {
    this.init();

    if (this.input < 0) {
      toastMessage('Time must be a positive number!');
      return false;
    }

    return true;
  },
};

export const settings = {
  createPromise() {
    const ms = state.input;
    const status = Boolean(state.fulfilled);

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (status) {
          resolve(ms);
        } else {
          reject(ms);
        }
      }, ms);
    });
    return promise;
  },
  showMessage(p) {
    p.then(result =>
      toastMessage(`✅ Fulfilled promise in ${result} ms`)
    ).catch(error => toastMessage(`❌ Rejected promise in ${error} ms`));
  },
};