<?php

namespace MailPoetExtraBlocks\API;

use MailPoet\DI\ContainerWrapper;
use MailPoet\Newsletter\NewslettersRepository;
use MailPoet\Newsletter\Url as NewsletterUrl;
use MailPoet\Subscribers\SubscribersRepository;
use MailPoetVendor\Doctrine\Common\Collections\Criteria;

/**
 * Newsletter-related REST API endpoints for MailPoet Extra Blocks
 */
class Newsletters extends Endpoint {
  public function init() {
    $this->addNewslettersGetEndpoint();
  }

  public function addNewslettersGetEndpoint() {
    add_action(
      'rest_api_init',
      function () {
        register_rest_route(
          Endpoint::API_ROOT,
          '/newsletters/',
          array(
            'methods'             => 'GET',
            'callback'            => array( $this, 'getNewsletters' ),
            'permission_callback' => array( $this, 'restrictToPostEditors' ),
            'args'                => array(
              'search' => array(
                'required'          => false,
                'validate_callback' => array( $this, 'validateString' ),
              ),
              'id'     => array(
                'required'          => false,
                'validate_callback' =>  array( $this, 'validateNumeric' ),
              ),
            ),
          )
        );
      }
    );
  }

  private function checkRuntimeRequirements() {
    return class_exists( ContainerWrapper::class )
      && class_exists( NewslettersRepository::class )
      && class_exists( NewsletterUrl::class )
      && class_exists( SubscribersRepository::class )
      && class_exists( Criteria::class );
  }

  private function loadDependencies() {
    $this->newsletters_repository = ContainerWrapper::getInstance()->get( NewslettersRepository::class );
    $this->newsletter_url        = ContainerWrapper::getInstance()->get( NewsletterUrl::class );
    $this->subscribers_repository = ContainerWrapper::getInstance()->get( SubscribersRepository::class );
  }

  /**
   * Fetches MailPoet newsletters for the Newsletter Embed Block
   *
   * @since 0.1.0
   * @param WP_REST_Request $request The request object containing the parameters.
   * @return WP_REST_Response The response object containing the results or error status.
   */
  public function getNewsletters( $request ) {
    if ( ! $this->checkRuntimeRequirements() ) {
      return new \WP_REST_Response( array(), 404 );
    }

    $this->loadDependencies();
    $search     = $request->get_param( 'search' );
    $id         = $request->get_param( 'id' );
    $subscriber = $this->subscribers_repository->getCurrentWPUser() ?: null;

    if ( $id ) {
      $newsletter = $this->newsletters_repository->findOneBy( array( 'id' => $id ) );
      if ( $newsletter ) {
        return new \WP_REST_Response(
          array(
            $this->buildNewsletterResponse( $newsletter, $subscriber ),
          ),
          200
        );
      }
      return new \WP_REST_Response( array(), 404 );
    }

    if ( $search && strlen( $search ) >= 3 ) {
      $criteria = new Criteria();
      $criteria->where( Criteria::expr()->contains( 'subject', $search ) );
      $newsletters = $this->newsletters_repository->matching( $criteria );

      if ( empty( $newsletters ) ) {
        return new \WP_REST_Response( array(), 200 );
      }

      $result = array();
      foreach ( $newsletters as $newsletter ) {
        $result[] = $this->buildNewsletterResponse( $newsletter, $subscriber );
      }
      return new \WP_REST_Response( $result, 200 );
    }

    return new \WP_REST_Response( array(), 400 );
  }

  private function buildNewsletterResponse($newsletter, $subscriber) {
    $queue = $newsletter->getLatestQueue();
    return array(
      'id'   => (string) $newsletter->getId(),
      'name' => $newsletter->getSubject(),
      'preview_url' => $this->newsletter_url->getViewInBrowserUrl($newsletter, $subscriber, $queue),
    );
  }
}
