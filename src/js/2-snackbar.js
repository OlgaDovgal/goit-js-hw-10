import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const formEl = document.querySelector('.form');
const inputEl = document.querySelector('input[name="delay"]');

const promiseGen = (delay, state) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (state) {
        case 'fulfilled':
          resolve(delay);
          break;
        case 'rejected':
          reject(delay);
          break;
      }
    }, delay);
  });
};
formEl.addEventListener('submit', event => {
  event.preventDefault();
  const selectedState = document.querySelector('input[name="state"]:checked');
  const delay = Number(inputEl.value);
  if (!selectedState || !inputEl.value) {
    iziToast.warning({
      title: 'Caution',
      message: 'You forgot important data',
    });
    return;
  }
  promiseGen(delay, selectedState.value)
    .then(delay => {
      iziToast.success({
        title: 'OK',
        message: `Fulfilled promise in ${delay}ms`,
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `Rejected promise in ${delay}ms`,
      });
    });
});
