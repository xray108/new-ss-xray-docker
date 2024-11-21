// ==UserScript==
// @name ÐŸÑ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€ Ð°Ð½Ð¸Ð¼Ðµ Ð¾Ð½Ð»Ð°Ð¹Ð½ Ð½Ð° shikimori.one
// @namespace http://tampermonkey.net/
// @version 0.3.1
// @description Ð”Ð¾Ð±Ð°Ð²Ð»ÑÐµÑ‚ ÐºÐ½Ð¾Ð¿ÐºÑƒ "Ð¡Ð¼Ð¾Ñ‚Ñ€ÐµÑ‚ÑŒ Ð¾Ð½Ð»Ð°Ð¹Ð½" Ð½Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ðµ Ñ Ð°Ð½Ð¸Ð¼Ðµ Ð¸ Ð¿Ñ€Ð¸ Ð½Ð°Ð¶Ð°Ñ‚Ð¸Ð¸ Ð²Ñ‹Ð²Ð¾Ð´Ð¸Ñ‚ Ð²Ð¸Ð´ÐµÐ¾Ð¿Ð»ÐµÐµÑ€ kodik Ð´Ð»Ñ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° Ð¿Ñ€ÑÐ¼Ð¾ Ð½Ð° Shikimori
// @author XRay108
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @match        https://shikimori.one/animes/*
// @updateURL    https://storage.oned4d.cc/js/shikimori/watch-shikimori.js
// @downloadURL  https://storage.oned4d.cc/js/shikimori/watch-shikimori.js
// @grant none
// ==/UserScript==
(function() {
    'use strict';

    let currentPageTitle = document.title;
    let watchOnlineButtonAdded = false;
    let videoWindow = null;

    const targetSelector = '.b-add_to_list.planned';
    const descriptionSelector = '.c-about';

    // Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ñ Ð¸Ð»Ð¸ Ð·Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ñ Ð¾ÐºÐ½Ð° Ñ iframe
    function toggleVideoPlayer(button) {
        if (!videoWindow || videoWindow.closed) {
            openVideoWindow();
            button.textContent = 'âœ– Ð—Ð°ÐºÑ€Ñ‹Ñ‚ÑŒ';
        } else {
            closeVideoWindow();
            button.textContent = 'â–¶ Ð¡Ð¼Ð¾Ñ‚Ñ€ÐµÑ‚ÑŒ Ð¾Ð½Ð»Ð°Ð¹Ð½';
        }
    }

    // ÐžÑ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð¾ÐºÐ½Ð° Ñ iframe-Ð²Ð¸Ð´ÐµÐ¾Ð¿Ð»ÐµÐµÑ€Ð¾Ð¼
    function openVideoWindow() {
        const shikimoriID = getShikimoriID();
        if (shikimoriID) {
            // Ð£ÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÐ¼ ÑˆÐ¸Ñ€Ð¸Ð½Ñƒ Ð¸ Ð²Ñ‹ÑÐ¾Ñ‚Ñƒ Ñ ÑÐ¾Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸ÐµÐ¼ 16:9
            const width = 960;
            const height = Math.round(width * 9 / 16);

            // ÐžÑ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð½Ð¾Ð²Ð¾Ð³Ð¾ Ð¿ÑƒÑÑ‚Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð° Ñ Ñ‚ÐµÐ¼ Ð¶Ðµ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ¾Ð¼, Ñ‡Ñ‚Ð¾ Ð¸ Ñƒ Ñ‚ÐµÐºÑƒÑ‰ÐµÐ¹ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹
            videoWindow = window.open('', currentPageTitle, `width=${width},height=${height}`);

            if (videoWindow) {
                // Ð£ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ° Ð½Ð¾Ð²Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð°
                videoWindow.document.title = currentPageTitle;

                // Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð¸Ð»ÐµÐ¹ Ð´Ð»Ñ ÐºÐ¾Ñ€Ñ€ÐµÐºÑ‚Ð½Ð¾Ð³Ð¾ Ð¾Ñ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ñ iframe
                videoWindow.document.body.style.margin = '0';
                videoWindow.document.body.style.overflow = 'hidden';

                // Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ iframe Ð¸ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð² Ð½Ð¾Ð²Ð¾Ðµ Ð¾ÐºÐ½Ð¾
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

    // Ð—Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð¾ÐºÐ½Ð° Ñ Ð²Ð¸Ð´ÐµÐ¾Ð¿Ð»ÐµÐµÑ€Ð¾Ð¼
    function closeVideoWindow() {
        if (videoWindow && !videoWindow.closed) {
            videoWindow.close();
            videoWindow = null;
        }
    }

    // Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÐºÐ½Ð¾Ð¿ÐºÐ¸
    function addWatchOnlineButton() {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement && !watchOnlineButtonAdded) {
            const watchOnlineButton = document.createElement('button');
            watchOnlineButton.textContent = 'â–¶ Ð¡Ð¼Ð¾Ñ‚Ñ€ÐµÑ‚ÑŒ Ð¾Ð½Ð»Ð°Ð¹Ð½';
            watchOnlineButton.classList.add('b-link_button');
            // Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð±Ð¾Ð»ÐµÐµ Ð·Ð°Ð¼ÐµÑ‚Ð½Ð¾Ð³Ð¾ ÑÑ‚Ð¸Ð»Ñ ÐºÐ½Ð¾Ð¿ÐºÐµ
            watchOnlineButton.style.backgroundColor = '#ff4500'; // Ð¯Ñ€ÐºÐ¸Ð¹ Ð¾Ñ€Ð°Ð½Ð¶ÐµÐ²Ñ‹Ð¹ Ñ†Ð²ÐµÑ‚ Ñ„Ð¾Ð½Ð°
            watchOnlineButton.style.color = '#ffffff'; // Ð‘ÐµÐ»Ñ‹Ð¹ Ñ†Ð²ÐµÑ‚ Ñ‚ÐµÐºÑÑ‚Ð°
            watchOnlineButton.style.fontSize = '16px'; // Ð£Ð²ÐµÐ»Ð¸Ñ‡ÐµÐ½Ð½Ñ‹Ð¹ Ñ€Ð°Ð·Ð¼ÐµÑ€ ÑˆÑ€Ð¸Ñ„Ñ‚Ð°
            watchOnlineButton.style.fontWeight = 'bold'; // Ð–Ð¸Ñ€Ð½Ñ‹Ð¹ Ñ‚ÐµÐºÑÑ‚
            watchOnlineButton.style.padding = '10px 20px'; // Ð£Ð²ÐµÐ»Ð¸Ñ‡ÐµÐ½Ð½Ñ‹Ð¹ Ð¾Ñ‚ÑÑ‚ÑƒÐ¿
            watchOnlineButton.style.border = 'none'; // Ð‘ÐµÐ· Ð³Ñ€Ð°Ð½Ð¸Ñ†
            watchOnlineButton.style.borderRadius = '5px'; // Ð¡Ð»ÐµÐ³ÐºÐ° Ð¾ÐºÑ€ÑƒÐ³Ð»Ñ‘Ð½Ð½Ñ‹Ðµ ÑƒÐ³Ð»Ñ‹
            watchOnlineButton.style.cursor = 'pointer'; // Ð£ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»ÑŒ Ð¼Ñ‹ÑˆÐ¸ Ð² Ð²Ð¸Ð´Ðµ Ñ€ÑƒÐºÐ¸ Ð¿Ñ€Ð¸ Ð½Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¸
            watchOnlineButton.style.transition = 'background-color 0.3s'; // ÐŸÐ»Ð°Ð²Ð½Ñ‹Ð¹ Ð¿ÐµÑ€ÐµÑ…Ð¾Ð´ Ñ„Ð¾Ð½Ð° Ð¿Ñ€Ð¸ Ð½Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¸

            // Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ„Ñ„ÐµÐºÑ‚Ð° Ð¿Ñ€Ð¸ Ð½Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¸
            watchOnlineButton.addEventListener('mouseenter', () => {
                watchOnlineButton.style.backgroundColor = '#ff6347'; // Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ Ñ†Ð²ÐµÑ‚Ð° Ð½Ð° Ð±Ð¾Ð»ÐµÐµ ÑÐ²ÐµÑ‚Ð»Ñ‹Ð¹ Ð¿Ñ€Ð¸ Ð½Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¸
            });
            watchOnlineButton.addEventListener('mouseleave', () => {
                watchOnlineButton.style.backgroundColor = '#ff4500'; // Ð’Ð¾Ð·Ð²Ñ€Ð°Ñ‚ Ðº Ð¸ÑÑ…Ð¾Ð´Ð½Ð¾Ð¼Ñƒ Ñ†Ð²ÐµÑ‚Ñƒ
            });

            watchOnlineButton.addEventListener('click', () => toggleVideoPlayer(watchOnlineButton));
            targetElement.parentNode.insertBefore(watchOnlineButton, targetElement.nextSibling);
            watchOnlineButtonAdded = true;
        }
    }

    // Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð¸Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ Shikimori ID Ð¸Ð· URL Ñ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ¾Ð¹
    function getShikimoriID() {
        const urlParts = window.location.pathname.split('/');
        const idPart = urlParts[urlParts.length - 1];
        return idPart ? idPart.split('-')[0] : null;
    }

    // Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ
    addWatchOnlineButton();

    // ÐÐ°Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ Ð·Ð° Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸ÑÐ¼Ð¸ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹
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
