<?php

namespace MailPoetExtraBlocks\API;

abstract class Endpoint {
  const API_ROOT = 'mailpoet-extra-blocks/v1';

  public function restrictToPostEditors() {
    return current_user_can( 'edit_posts' );
  }

  public function validateString( $param ) {
    return is_string( $param );
  }

  public function validateNumeric( $param ) {
    return is_numeric( $param );
  }

  abstract public function init();
}
