import flatpickr from 'flatpickr';
import { timer, options } from './context';

flatpickr('#datetime-picker', options);

timer.elements.button.addEventListener('click', timer.setTimer.bind(timer));