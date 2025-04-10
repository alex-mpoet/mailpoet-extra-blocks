# MailPoet Extra Blocks for Gutenberg

Extra MailPoet blocks for the Gutenberg block editor: **Newsletter Archive** and **Newsletter Embed**.

**Newsletter Archive** allows you to insert a list of links to your past MailPoet newsletters. You can customize its contents, including the number of entries, date range, and specific lists, as well as adjust styles such as colors and font size.

<img src="/assets/img/newsletter-archive-block.png?raw=true" alt="Newsletter Archive Block">

**Newsletter Embed** lets you embed a preview of a MailPoet newsletter directly into your post or page, allowing non-subscribers to access your awesome content.

<img src="/assets/img/newsletter-embed-block.png?raw=true" alt="Newsletter Embed Block">

## Requirements

* PHP >=7.4
* [WordPress](http://wordpress.org/) >=6.7

## Build

```
npm ci
composer install
npm run build
npm run plugin-zip
```

## Installation

1. You need to have the [MailPoet](https://wordpress.org/plugins/mailpoet/) plugin installed and activated before using this plugin. Send some newsletters so you have content for the blocks.
1. Upload this plugin's files to the `/wp-content/plugins/mailpoet-extra-blocks` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress.
1. Use the extra MailPoet blocks in the Gutenberg editor.
