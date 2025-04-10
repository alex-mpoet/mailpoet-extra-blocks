<?php

namespace MailPoetExtraBlocks\API;

/**
 * REST API for MailPoet Extra Blocks
 */
class API {
  public function init() {
    (new Newsletters())->init();
    (new Segments())->init();
  }
}
