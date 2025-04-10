import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	FormTokenField,
	Placeholder,
	Spinner,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';
import classnames from 'classnames';

import './editor.scss';

export function adjustIframeHeight( event ) {
	const iframe = event.target;
	if ( iframe?.contentWindow?.document?.body ) {
		iframe.style.height = `${
			iframe.contentWindow.document.body.firstElementChild.scrollHeight +
			1
		}px`;
	}
}

export default function Edit( { attributes, setAttributes } ) {
	const { newsletterId, newsletterSubject, previewUrl } = attributes;

	const wp = window.wp;
	const apiFetch = wp.apiFetch;

	const [ tokens, setTokens ] = useState(
		newsletterSubject ? [ newsletterSubject ] : []
	);
	const [ suggestions, setSuggestions ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	const fetchSuggestions = async ( input ) => {
		if ( input.length < 3 ) {
			setSuggestions( [] );
			return;
		}

		const response = await apiFetch( {
			path: `/mailpoet-extra-blocks/v1/newsletters?search=${ input }`,
		} );
		setSuggestions( response );
	};
	const debouncedFetchSuggestions = useDebounce( fetchSuggestions, 500 );

	const handleNewsletterChange = ( selectedTokens ) => {
		const selectedNewsletters = selectedTokens
			.map( ( item ) =>
				suggestions.find(
					( suggestion ) =>
						suggestion?.name.trim().toLowerCase() === item.toLowerCase()
				)
			)
			.filter( ( item ) => item !== undefined );
		if ( selectedNewsletters.length > 0 ) {
			const selectedNewsletter = selectedNewsletters.slice( -1 )[ 0 ]; // Get last item
			setAttributes( {
				newsletterId: parseInt( selectedNewsletter.id, 10 ),
				newsletterSubject: selectedNewsletter.name,
				previewUrl: selectedNewsletter.preview_url,
			} );
			setTokens( [ selectedNewsletter.name ] );
			setIsLoading( true );
		} else {
			setAttributes( {
				newsletterId: 0,
				newsletterSubject: '',
				previewUrl: '',
			} );
			setTokens( [] );
			setIsLoading( false );
		}
	};

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'mailpoet-extra-blocks' ) }>
					<FormTokenField
						__experimentalAutoSelectFirstMatch
						__experimentalExpandOnFocus
						__experimentalShowHowTo={ false }
						__next40pxDefaultSize
						label={ __(
							'Choose a newsletter',
							'mailpoet-extra-blocks'
						) }
						value={ tokens }
						onChange={ handleNewsletterChange }
						suggestions={ suggestions.map( ( v ) => v.name ) }
						onInputChange={ debouncedFetchSuggestions }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ ! newsletterId && (
					<Placeholder>
						{ __(
							'Choose a newsletter to embed in the block settings.',
							'mailpoet-extra-blocks'
						) }
					</Placeholder>
				) }
				{ newsletterId > 0 && ( ! previewUrl || isLoading ) && (
					<div className="spinner-container">
						<Spinner />
					</div>
				) }
				{ previewUrl && (
					<div
						className={ classnames( 'iframe-container', {
							'iframe-container-loading': isLoading,
						} ) }
					>
						<iframe
							src={ previewUrl }
							height={ 600 }
							title={ __(
								'Newsletter Preview',
								'mailpoet-extra-blocks'
							) }
							onLoad={ ( e ) => {
								adjustIframeHeight( e );
								setIsLoading( false );
							} }
						/>
					</div>
				) }
			</div>
		</>
	);
}
