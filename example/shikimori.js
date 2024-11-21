// ==UserScript==
// @name Просмотр аниме онлайн на shikimori.one
// @namespace http://tampermonkey.net/
// @version 0.3.2
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
    let videoWindow = null;

    const targetSelector = '.b-add_to_list.planned';
    const descriptionSelector = '.c-about';

    // Функция открытия или закрытия окна с iframe
    function toggleVideoPlayer(button) {
        if (!videoWindow || videoWindow.closed) {
            openVideoWindow();
            button.textContent = '✔ Закрыть';
        } else {
            closeVideoWindow();
            button.textContent = '▶ Смотреть онлайн';
        }
    }

    // Открытие окна с iframe-видеоплеером
    function openVideoWindow() {
        const shikimoriID = getShikimoriID();
        if (shikimoriID) {
            // Устанавливаем ширину и высоту с соотношением 16:9
            const width = 960;
            const height = Math.round(width * 9 / 16);

            // Открытие нового пустого окна с тем же заголовком, что и у текущей страницы
            videoWindow = window.open('', currentPageTitle, `width=${width},height=${height}`);

            if (videoWindow) {
                // Установка заголовка нового окна
                videoWindow.document.title = currentPageTitle;

                // Добавление стилей для корректного отображения iframe
                videoWindow.document.body.style.margin = '0';
                videoWindow.document.body.style.overflow = 'hidden';

                // Создание iframe и добавление в новое окно
                const videoIframe = videoWindow.document.createElement('iframe');
                videoIframe.src = `//kodik.cc/find-player?shikimoriID=${shikimoriID}`;
                videoIframe.width = '100%';
                videoIframe.height = '100%';
                videoIframe.frameBorder = 0;
                videoIframe.allowFullscreen = true;
                videoIframe.setAttribute('allow', 'autoplay *; fullscreen *');
                videoWindow.document.body.appendChild(videoIframe);
            }
        }
    }

    // Закрытие окна с видеоплеером
    function closeVideoWindow() {
        if (videoWindow && !videoWindow.closed) {
            videoWindow.close();
            videoWindow = null;
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
            if (videoWindow && !videoWindow.closed) {
                videoWindow.close();
            }
            watchOnlineButtonAdded = false;
            addWatchOnlineButton();
        }
    });
    titleObserver.observe(document.querySelector('title'), { subtree: true, characterData: true, childList: true });

})();
