<?php

namespace MailPoetExtraBlocks\API;

use MailPoet\API\API as MailPoetAPI;

/**
 * Segment-related REST API endpoints for MailPoet Extra Blocks
 */
class Segments extends Endpoint {
  public function init() {
    $this->addSegmentsGetEndpoint();
  }

  public function addSegmentsGetEndpoint() {
    add_action(
      'rest_api_init',
      function () {
        register_rest_route(
          Endpoint::API_ROOT,
          '/segments/',
          array(
            'methods'             => 'GET',
            'callback'            => array( $this, 'getSegments' ),
            'permission_callback' => array( $this, 'restrictToPostEditors' ),
          )
        );
      }
    );
  }

  private function checkRuntimeRequirements() {
    return class_exists( MailPoetAPI::class );
  }

  /**
   * Fetches MailPoet segments for the Newsletter Archive Block
   *
   * @since 0.1.0
   * @return WP_REST_Response The response object containing the results.
   */
  public function getSegments() {
    if ( ! $this->checkRuntimeRequirements() ) {
      return new \WP_REST_Response( array(), 404 );
    }
    $mailpoet_api = MailPoetAPI::MP( 'v1' );
    $lists        = $mailpoet_api->getLists();
    return new \WP_REST_Response( $lists, 200 );
  }
}
