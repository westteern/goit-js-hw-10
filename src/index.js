import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './js/fetchCountries.js';

import markupList from './templates/list.hbs';
import markupItem from './templates/item.hbs';

import './css/styles.css';

const notifySettings = Notify.init({
  position: 'center-top',
});
const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  clearInput();
  const name = e.target.value.trim();
  if (name === '') {
    return Notify.info(
      `It can't be empty field! Please, fill it up with at least two letters!`
    );
  }
  fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length === 1) {
        countryInfoRef.insertAdjacentHTML('beforeend', markupItem(data));
      }
      if (data.length >= 2 && data.length <= 10) {
        return countryListRef.insertAdjacentHTML('beforeend', markupList(data));
      }
    })
    .catch(err => Notify.failure('Oops, there is no country with that name'));
}

function clearInput() {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}
