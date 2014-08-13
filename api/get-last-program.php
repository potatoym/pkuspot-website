<?php

require_once('config.php');
require_once('functions.php');

/**
 * 获取最新一个Podcast信息
 * @param  Array $items     Podcast列表
 * @return Array            最新一个Podcast信息
 */
function getLastItem($items) {
    $item = $items[0];
    $item['cache_time'] = time();
    return $item;
}

/**
 * 更新缓存
 * @return Array    Podcast列表
 */
function updateCache() {
    downloadPodcastXml(XML_URL, XML_FILENAME);
    $items = parseXmlToArray(XML_FILENAME);
    // print_r($items);
    $podcasts_cache_client = new Cache(PODCASTS_CACHE);
    $podcasts_cache_client->write($items);
    return $items;
}


$latest_podcast_cache_client = new Cache(LATEST_PODCAST_CACHE);
/**
 * 检查缓存是否过期
 * @return Boolean      是否需要更新缓存
 */
function checkCacheExpire() {
    $is_force_update_cache = isset($_GET['force-update-cache']) ? true : false;
    if ($is_force_update_cache) return true;
    global $latest_podcast_cache_client;
    $item = $latest_podcast_cache_client->read();
    return time() > $item['cache_time'] + CACHE_MAX_AGE;
}





header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: max-age='. CACHE_MAX_AGE);


if (checkCacheExpire()) {
    $items = updateCache();
    $item = getLastItem($items);
    $latest_podcast_cache_client->write($item);
    echo json_encode($item);
} else {
    echo file_get_contents(LATEST_PODCAST_CACHE);
}




