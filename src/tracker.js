var Storage = require('wdqs-storage'),
	Svg = require('../lib/svg.js'),
	imgs = require('./imgs.js'),
	$ = require('jquery');
module.exports = function(wdqsui) {

	var enabled = !!(wdqsui.options.tracker.googleAnalyticsId);
	var trackEvents = true;
	var cookieId = "wdqsui_" + $(wdqsui.wrapperElement).closest('[id]').attr('id') + '_trackerId';

	var updateStatus = function() {
		/*
		 * Load settings. What can we track?
		 */
		var trackId = Storage.storage.get(cookieId);
		if (trackId === null) {
			//don't know! show consent window
			drawConsentWindow();
		} else {
			trackId = +trackId;
			if (trackId === 0) { // don't track
				enabled = false;
				trackEvents = false;
			} else if (trackId === 1) { // track visits
				enabled = true;
				trackEvents = false;
			} else if (trackId == 2) { //track everything
				enabled = true;
				trackEvents = true;
			}
		}
	}
	var init = function() {
		if (wdqsui.options.tracker.googleAnalyticsId) {

			updateStatus();

			//load script
			(function(i, s, o, g, r, a, m) {
				i['GoogleAnalyticsObject'] = r;
				i[r] = i[r] || function() {
					(i[r].q = i[r].q || []).push(arguments)
				}, i[r].l = 1 * new Date();
				a = s.createElement(o),
					m = s.getElementsByTagName(o)[0];
				a.async = 1;
				a.src = g;
				m.parentNode.insertBefore(a, m)
			})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

			ga('create', wdqsui.options.tracker.googleAnalyticsId, 'auto');
			ga('send', 'pageview');

		}
	};



	var drawConsentWindow = function() {
		var consentDiv = $('<div>', {
			class: 'consentWindow'
		}).appendTo(wdqsui.wrapperElement);
		var hide = function() {
			consentDiv.hide(400);
		};
		var storeConsent = function(id) {
			var action = 'no';
			if (id == 2) {
				action = 'yes';
			} else if (id == 1) {
				action = 'yes/no';
			}
			track('consent', action);
			Storage.storage.set(cookieId, id);
			updateStatus();

		}
		consentDiv.append(
			$('<div>', {
				class: 'consentMsg'
			}).html('We track user actions (including used endpoints and queries). This data is solely used for research purposes and to get insight into how users use the site. <i>We would appreciate your consent!</i>')
		);

		var buttonDiv = $('<div>', {
				class: 'buttons'
			})
			.appendTo(consentDiv)
			.append(
				$('<button>', {
					type: 'button',
					class: 'btn btn-default'
				})
				.append(
					$(Svg.getElement(imgs.checkMark))
					.height(11)
					.width(11)
				)
				.append($('<span>').text(' Yes, allow'))
				.click(function() {
					storeConsent(2)
					hide();
				})
			)
			.append(
				$('<button>', {
					type: 'button',
					class: 'btn btn-default'
				})
				.append(
					$(Svg.getElement(imgs.checkCrossMark))
					.height(13)
					.width(13)
				)
				.append($('<span>').html(' Yes, track site usage, but not<br>the queries/endpoints I use'))
				.click(function() {
					storeConsent(1);
					hide();
				})
			)
			.append(
				$('<button>', {
					type: 'button',
					class: 'btn btn-default'
				})
				.append(
					$(Svg.getElement(imgs.crossMark))
					.height(9)
					.width(9)
				)
				.append($('<span>').text(' No, disable tracking'))
				.click(function() {
					storeConsent(0);
					hide();
				})
			)
			.append(
				$('<button>', {
					type: 'button',
					class: 'btn btn-default'
				})
				.text('Ask me later')
				.click(function() {
					hide();
				})
			);
	};

	var track = function(category, action, label, value, nonInteraction) {
		if (enabled && ga) ga('send', 'event', category, action, label, value, {
			'nonInteraction': !!nonInteraction
		});
	};
	init();
	return {
		enabled: enabled,
		track: track,
		drawConsentWindow: drawConsentWindow,
	}
};