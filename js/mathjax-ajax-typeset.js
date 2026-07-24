// MathJax normally only typesets once, on the page's initial load.
// This theme uses ajax_loading (see js/duet.js) to swap .page__content via
// jQuery AJAX on internal navigation, without a full page reload - so any
// math on a page navigated to that way never gets typeset. This watches
// the content area for those swaps and re-triggers MathJax typesetting
// each time, independent of duet.js's own internals.
(function () {
	'use strict';

	if (typeof MutationObserver === 'undefined') {
		return;
	}

	function retypeset() {
		if (window.MathJax && window.MathJax.Hub) {
			window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
		}
	}

	function start() {
		var target = document.querySelector('.page') || document.body;
		var pending;

		var observer = new MutationObserver(function () {
			clearTimeout(pending);
			pending = setTimeout(retypeset, 150);
		});

		observer.observe(target, { childList: true, subtree: true });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', start);
	} else {
		start();
	}
})();
