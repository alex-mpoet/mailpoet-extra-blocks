import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNumberControl as NumberControl,
	DatePicker,
	FormTokenField,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

import './editor.scss';

function DatePickerWithTextInput( {
	name,
	value,
	label,
	isOpen,
	setIsOpen,
	setAttributes,
} ) {
	return (
		<div className="date-picker-with-text-input">
			<TextControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ label }
				value={ value || '' }
				onFocus={ () => setIsOpen( true ) }
				readOnly
			/>
			{ value && (
				<Button
					className="clear-button"
					onClick={ () => {
						setAttributes( { [ name ]: '' } );
						setIsOpen( false );
					} }
				>
					&times;
				</Button>
			) }
			{ isOpen && (
				<DatePicker
					currentDate={ value }
					onChange={ ( newValue ) => {
						setAttributes( {
							[ name ]: newValue.split( 'T' )[ 0 ],
						} );
						setIsOpen( false );
					} }
					onClose={ () => setIsOpen( false ) }
				/>
			) }
		</div>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		segments,
		inTheLastDays,
		startDate,
		endDate,
		subjectContains,
		limit,
	} = attributes;

	const wp = window.wp;
	const ServerSideRender = wp.serverSideRender;
	const apiFetch = wp.apiFetch;

	const [ isStartDateOpen, setStartDateOpen ] = useState( false );
	const [ isEndDateOpen, setEndDateOpen ] = useState( false );

	const [ suggestions, setSuggestions ] = useState( [] );

	useEffect( () => {
		const fetchSuggestions = async () => {
			const response = await apiFetch( {
				path: `/mailpoet-extra-blocks/v1/segments`,
			} );
			setSuggestions( response );
		};

		fetchSuggestions();
	}, [ apiFetch ] );

	const handleSegmentsChange = ( selection ) => {
		const segmentIds = selection
			.map( ( item ) => {
				const match = suggestions.find(
					( suggestion ) =>
						suggestion.name.toLowerCase() === item.toLowerCase()
				);
				return match ? match.id : null;
			} )
			.filter( ( item ) => item !== null );
		setAttributes( { segments: segmentIds } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'mailpoet-extra-blocks' ) }
					className="wp-block-mailpoet-newsletter-archive-block-settings"
				>
					<FormTokenField
						__experimentalAutoSelectFirstMatch
						__experimentalExpandOnFocus
						__experimentalShowHowTo={ false }
						__next40pxDefaultSize
						label={ __(
							'Lists (leave empty to display all)',
							'mailpoet-extra-blocks'
						) }
						value={ suggestions
							.filter( ( v ) =>
								( segments || [] ).includes( v.id )
							)
							.map( ( v ) => v.name ) }
						onChange={ handleSegmentsChange }
						suggestions={ suggestions.map( ( v ) => v.name ) }
					/>
					<NumberControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __(
							'In the last N days',
							'mailpoet-extra-blocks'
						) }
						value={ inTheLastDays || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								inTheLastDays: parseInt( value, 10 ),
							} )
						}
					/>
					<DatePickerWithTextInput
						label={ __( 'Start date', 'mailpoet-extra-blocks' ) }
						name="startDate"
						value={ startDate }
						isOpen={ isStartDateOpen }
						setIsOpen={ setStartDateOpen }
						setAttributes={ setAttributes }
					/>
					<DatePickerWithTextInput
						label={ __( 'End date', 'mailpoet-extra-blocks' ) }
						name="endDate"
						value={ endDate }
						isOpen={ isEndDateOpen }
						setIsOpen={ setEndDateOpen }
						setAttributes={ setAttributes }
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __(
							'Subject contains',
							'mailpoet-extra-blocks'
						) }
						value={ subjectContains || '' }
						onChange={ ( value ) =>
							setAttributes( { subjectContains: value } )
						}
					/>
					<NumberControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __(
							'Maximum items to display',
							'mailpoet-extra-blocks'
						) }
						value={ limit || 0 }
						onChange={ ( value ) =>
							setAttributes( { limit: parseInt( value, 10 ) } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<ServerSideRender
					block="mailpoet/newsletter-archive-block"
					attributes={ {
						segments,
						inTheLastDays,
						startDate,
						endDate,
						subjectContains,
						limit,
					} }
				/>
			</div>
		</>
	);
}
