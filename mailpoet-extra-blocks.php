<?php
/**
 * Plugin Name:       MailPoet Extra Blocks for Gutenberg
 * Description:       Extra MailPoet blocks for Gutenberg: Newsletter Archive, Newsletter Embed.
 * Version:           0.1.0
 * Requires Plugins:  mailpoet
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            alex-mpoet
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mailpoet-extra-blocks
 *
 * @package MailPoetExtraBlocks
 */

use MailPoetExtraBlocks\API\API;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';

/**
 * Registers the block using a `blocks-manifest.php` file
 */
function create_block_mailpoet_extra_blocks_init() {
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}

	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'create_block_mailpoet_extra_blocks_init' );

/**
 * Initialize the server-side API
 */
$api = new API();
$api->init();
