<?php
/**
 * MailPoet Extra Blocks: Newsletter Embed Block server renderer
 *
 * @package MailPoetExtraBlocks
 * @subpackage NewsletterEmbedBlock
 * @since 0.1.0
 */

declare( strict_types = 1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! empty( $attributes['previewUrl'] ) ) {
	?><div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
		<div class="iframe-container">
			<iframe src="<?php echo esc_attr( $attributes['previewUrl'] ); ?>" height="600"></iframe>
		</div>
	</div>
	<?php
}
