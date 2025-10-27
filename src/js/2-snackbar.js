import { elements, state, settings } from './context';

elements.form.addEventListener('submit', e => {
  e.preventDefault();
  if (!state.isValid()) return;
  settings.showMessage(settings.createPromise());
  elements.form.reset();
});