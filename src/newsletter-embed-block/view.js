const iframes = document.querySelectorAll(
	'.wp-block-mailpoet-newsletter-embed-block iframe'
);

const MailPoetNewletterEmbed = {
	adjustIframe( iframe ) {
		iframe.onload = function () {
			const iframeDocument =
				iframe.contentDocument || iframe.contentWindow.document;

			// Adjust height to fit content
			iframe.style.height =
				iframeDocument.body.firstElementChild.scrollHeight + 1 + 'px';

			// Force target="_blank" for all links
			const base = iframeDocument.createElement( 'base' );
			base.setAttribute( 'target', '_blank' );
			iframeDocument.head.appendChild( base );
		};
	},
};

iframes.forEach( MailPoetNewletterEmbed.adjustIframe );
