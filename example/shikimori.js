// ==UserScript==
// @name [SAP] Shikimori AnimePlay
// @namespace http://tampermonkey.net/
// @version 0.1.1
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

    const targetSelector = '#animes_show > section > div > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.cc.block';

    // Функция открытия модального окна с iframe
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
            videoModal.style.flexDirection = 'column';

            // Создание iframe и добавление в модальное окно
            const videoIframe = document.createElement('iframe');
            videoIframe.src = `//kodik.cc/find-player?shikimoriID=${shikimoriID}`;
            videoIframe.style.width = '100vw'; // Ширина iframe равна ширине экрана
            videoIframe.style.height = '56.25vw'; // Высота iframe для соотношения 16:9
            videoIframe.frameBorder = 0;
            videoIframe.allowFullscreen = true;
            videoIframe.setAttribute('allow', 'autoplay *; fullscreen *');
            videoModal.appendChild(videoIframe);

            // Создание кнопки закрытия
            const closeButton = document.createElement('button');
            closeButton.textContent = '✖';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.backgroundColor = '#ff4500';
            closeButton.style.color = '#ffffff';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '5px';
            closeButton.style.padding = '10px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.zIndex = '1001';
            closeButton.addEventListener('click', closeVideoModal);
            videoModal.appendChild(closeButton);

            // Добавление модального окна в документ
            document.body.appendChild(videoModal);

            // Переключение в горизонтальное положение
            if (window.screen.orientation && window.screen.orientation.lock) {
                window.screen.orientation.lock('landscape').catch(error => {
                    console.error('Ошибка при переключении в горизонтальное положение:', error);
                });
            }
        }
    }

    // Закрытие модального окна с видеоплеером
    function closeVideoModal() {
        if (videoModal) {
            document.body.removeChild(videoModal);
            videoModal = null;

            // Возврат в исходное положение
            if (window.screen.orientation && window.screen.orientation.unlock) {
                window.screen.orientation.unlock();
            }
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

            watchOnlineButton.addEventListener('click', openVideoModal);
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
