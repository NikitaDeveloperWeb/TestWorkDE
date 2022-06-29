import './scss/app.scss';

// form validation
// Определяем функции для отображения сообщения об ошибке
function printError(elemId, hintMsg) {
  document.getElementById(elemId).innerHTML = hintMsg;
}

const FIELD_NAME = document.getElementById('name');
const FIELD_EMAIL = document.getElementById('email');
const FIELD_MESSAGE = document.getElementById('message');
const btn = document.getElementById('btn');

function validation() {
  // Определяем переменные ошибок со значением по умолчанию
  let nameErr = true;
  let emailErr = true;
  let messageErr = true;
  let name = FIELD_NAME.value.trim();
  let email = FIELD_EMAIL.value.trim();
  let message = FIELD_MESSAGE.value.trim();
  // Проверяем имя
  if (name == '') {
    printError('nameErr', 'Пожалуйста, введите ваше имя');
  } else {
    var regex = /^[a-zA-Z\s]+$/;
    if (regex.test(name) === false) {
      printError('nameErr', 'Пожалуйста, введите правильное имя');
    } else {
      printError('nameErr', '');
      nameErr = false;
    }
  }

  // Проверяем адрес электронной почты
  if (email == '') {
    printError('emailErr', 'Пожалуйста, введите адрес вашей электронной почты');
  } else {
    // Регулярное выражение для базовой проверки электронной почты
    var regex = /^\S+@\S+\.\S+$/;
    if (regex.test(email) === false) {
      printError('emailErr', 'Пожалуйста, введите действительный адрес электронной почты');
    } else {
      printError('emailErr', '');
      emailErr = false;
    }
  }
  // Проверяем адрес электронной почты
  if (message == '') {
    printError('messageErr', 'Пожалуйста, введите ваше сообщение');
  } else {
    printError('messageErr', '');
    messageErr = false;
  }
  if ((nameErr || emailErr || messageErr) == true) {
    return false;
  } else {
    return true;
  }
}

// отправка формы

function onSubmitForm() {
  if (validation()) {
    fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits').then(
      notification(),
    );
  }
}

btn.addEventListener('click', onSubmitForm);

// уведлмление об отправке формы

function notification() {
  let element = document.createElement('div');
  element.className = 'alert';
  element.innerHTML = 'Your message successfully sent ';
  document.body.append(element);
}

// modal
const CloseIcon = document.querySelector('#close');
const ModalOverlay = document.querySelector('.modal__overlay');
const ModalBtn = document.querySelector('#modalButton');
const Modal = document.querySelector('#modal');
let stateModal = false;

// render
function renderModal() {
  if (stateModal) {
    Modal.style.display = '';
  } else {
    Modal.style.display = 'none';
  }
}
renderModal();
// fun for switch stet

function modalOpen() {
  stateModal = true;
  renderModal();
}
function modalClose() {
  stateModal = false;
  renderModal();
}
// event listener
ModalBtn.addEventListener('click', () => {
  modalOpen();
});
CloseIcon.addEventListener('click', () => {
  modalClose();
});
ModalOverlay.addEventListener('click', () => {
  modalClose();
});
