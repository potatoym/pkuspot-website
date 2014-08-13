<?php

require_once('config.php');
require_once('functions.php');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: max-age='. CACHE_MAX_AGE);

echo file_get_contents(PODCASTS_CACHE);
