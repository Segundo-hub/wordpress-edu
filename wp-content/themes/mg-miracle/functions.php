<?php

function add_theme_scripts() {
   wp_enqueue_style('style', get_stylesheet_uri());

   wp_enqueue_style('build', get_template_directory_uri() . '/sass/bundle.css');

   if (is_singular() && comments_open() && get_option('thread_comments')) {
      wp_enqueue_script('comment-reply');
   }
}
add_action('wp_enqueue_scripts', 'add_theme_scripts');

?>