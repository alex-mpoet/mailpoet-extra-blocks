<?php
/**
 * MailPoet Extra Blocks: Newsletter Archive Block server renderer
 *
 * @package MailPoetExtraBlocks
 * @subpackage NewsletterArchiveBlock
 * @since 0.1.0
 */

declare( strict_types = 1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$archive_params = array();

if ( ! empty( $attributes['segments'] ) && is_array( $attributes['segments'] ) ) {
	$archive_params['segments'] = join( ',', array_map( 'intval', $attributes['segments'] ) );
}
if ( ! empty( $attributes['inTheLastDays'] ) ) {
	$archive_params['in_the_last_days'] = (int) $attributes['inTheLastDays'];
}

$date_regex = '/^\d{4}-\d{2}-\d{2}$/';
if ( ! empty( $attributes['startDate'] ) && preg_match( $date_regex, $attributes['startDate'] ) ) {
	$archive_params['start_date'] = $attributes['startDate'];
}
if ( ! empty( $attributes['endDate'] ) && preg_match( $date_regex, $attributes['endDate'] ) ) {
	$archive_params['end_date'] = $attributes['endDate'];
}

if ( ! empty( $attributes['subjectContains'] ) ) {
	$archive_params['subject_contains'] = $attributes['subjectContains'];
}
if ( ! empty( $attributes['limit'] ) ) {
	$archive_params['limit'] = (int) $attributes['limit'];
}

$mailpoet_archive_params = '';
foreach ( $archive_params as $k => $v ) {
	$mailpoet_archive_params .= " $k=\"" . esc_attr( $v ) . '"';
}

echo '<div ' . wp_kses_data( get_block_wrapper_attributes() ) . '>';
echo do_shortcode( "[mailpoet_archive $mailpoet_archive_params]" );
echo '</div>';
