/* eslint-disable no-console */
import $ from 'jquery';

import getYear from './getYear';
import getWhyILove from './getWhyILove';
import { post as apiClientPost } from './api.client';
import './index.scss';

$('.center__text').text(getWhyILove());

$('.footer__year').text(getYear());

const signButton = document.querySelector('.form__sign');
const email = document.querySelector('.form__email');
const password = document.querySelector('.form__password');

signButton.onclick = () => {
  apiClientPost('auth', {}, {
    email: email.value,
    password: password.value,
  })
    .then(console.dir)
    .then(() => {
      window.location.href = '/protected';
    })
    .catch((error) => {
      $('.errors').text(error);
      console.dir(error);
    });
};
