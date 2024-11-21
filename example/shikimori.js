// ==UserScript==
// @name Просмотр аниме онлайн на shikimori.one
// @namespace http://tampermonkey.net/
// @version 0.3.3
// @description Добавляет кнопку "Смотреть онлайн" на странице с аниме и при нажатии выводит видеоплеер kodik для просмотра прямо на Shikimori
// @author XRay108
// @icon https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @match https://shikimori.one/animes/*
// @updateURL https://raw.githubusercontent.com/xray108/new-ss-xray-docker/refs/heads/master/example/shikimori.js
// @downloadURL https://raw.githubusercontent.com/xray108/new-ss-xray-docker/refs/heads/master/example/shikimori.js
// @grant none
// ==/UserScript==

(function() {
    'use strict';

    let currentPageTitle = document.title;
    let watchOnlineButtonAdded = false;
    let videoModal = null;

    const targetSelector = '.b-add_to_list.planned';
    const descriptionSelector = '.c-about';

    // Функция открытия или закрытия модального окна с iframe
    function toggleVideoPlayer(button) {
        if (!videoModal) {
            openVideoModal();
            button.textContent = '✔ Закрыть';
        } else {
            closeVideoModal();
            button.textContent = '▶ Смотреть онлайн';
        }
    }

    // Открытие модального окна с iframe-видеоплеером
    function openVideoModal() {
        const shikimoriID = getShikimoriID();
        if (shikimoriID) {
            // Создание модального окна
            videoModal = document.createElement('div');
            videoModal.style.position = 'fixed';
            videoModal.style.top = '0';
            videoModal.style.left = '0';
            videoModal.style.width = '100%';
            videoModal.style.height = '100%';
            videoModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            videoModal.style.zIndex = '1000';
            videoModal.style.display = 'flex';
            videoModal.style.justifyContent = 'center';
            videoModal.style.alignItems = 'center';

            // Создание iframe и добавление в модальное окно
            const videoIframe = document.createElement('iframe');
            videoIframe.src = `//kodik.cc/find-player?shikimoriID=${shikimoriID}`;
            videoIframe.width = '90%';
            videoIframe.height = '50%';
            videoIframe.frameBorder = 0;
            videoIframe.allowFullscreen = true;
            videoIframe.setAttribute('allow', 'autoplay *; fullscreen *');
            videoModal.appendChild(videoIframe);

            // Добавление модального окна в документ
            document.body.appendChild(videoModal);
        }
    }

    // Закрытие модального окна с видеоплеером
    function closeVideoModal() {
        if (videoModal) {
            document.body.removeChild(videoModal);
            videoModal = null;
        }
    }

    // Функция добавления кнопки
    function addWatchOnlineButton() {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement && !watchOnlineButtonAdded) {
            const watchOnlineButton = document.createElement('button');
            watchOnlineButton.textContent = '▶ Смотреть онлайн';
            watchOnlineButton.classList.add('b-link_button');
            // Добавление более заметного стиля кнопке
            watchOnlineButton.style.backgroundColor = '#ff4500'; // Яркий оранжевый цвет фона
            watchOnlineButton.style.color = '#ffffff'; // Белый цвет текста
            watchOnlineButton.style.fontSize = '16px'; // Увеличенный размер шрифта
            watchOnlineButton.style.fontWeight = 'bold'; // Жирный текст
            watchOnlineButton.style.padding = '10px 20px'; // Увеличенный отступ
            watchOnlineButton.style.border = 'none'; // Без границ
            watchOnlineButton.style.borderRadius = '5px'; // Слегка округленные углы
            watchOnlineButton.style.cursor = 'pointer'; // Указатель мыши в виде руки при наведении
            watchOnlineButton.style.transition = 'background-color 0.3s'; // Плавный переход фона при наведении

            // Добавление эффекта при наведении
            watchOnlineButton.addEventListener('mouseenter', () => {
                watchOnlineButton.style.backgroundColor = '#ff6347'; // Изменение цвета на более светлый при наведении
            });
            watchOnlineButton.addEventListener('mouseleave', () => {
                watchOnlineButton.style.backgroundColor = '#ff4500'; // Возврат к исходному цвету
            });

            watchOnlineButton.addEventListener('click', () => toggleVideoPlayer(watchOnlineButton));
            targetElement.parentNode.insertBefore(watchOnlineButton, targetElement.nextSibling);
            watchOnlineButtonAdded = true;
        }
    }

    // Функция извлечения Shikimori ID из URL с проверкой
    function getShikimoriID() {
        const urlParts = window.location.pathname.split('/');
        const idPart = urlParts[urlParts.length - 1];
        return idPart ? idPart.split('-')[0] : null;
    }

    // Инициализация
    addWatchOnlineButton();

    // Наблюдение за изменениями заголовка страницы
    const titleObserver = new MutationObserver(() => {
        if (document.title !== currentPageTitle) {
            currentPageTitle = document.title;
            if (videoModal) {
                closeVideoModal();
            }
            watchOnlineButtonAdded = false;
            addWatchOnlineButton();
        }
    });
    titleObserver.observe(document.querySelector('title'), { subtree: true, characterData: true, childList: true });

})();
