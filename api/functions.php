<?php

/**
 * 缓存类
 */
class Cache {

    private $filename;

    /**
     * __construct
     * @param String $cache_filename 缓存文件名
     */
    function __construct($cache_filename) {
        $this->filename = $cache_filename;
    }

    /**
     * 写入缓存
     * @param  Array $data  缓存数据
     * @return Int       写入字节数
     */
    public function write($data) {
        $ret = file_put_contents($this->filename, json_encode($data));
        return $ret;
    }

    /**
     * 读取缓存
     * @return stdClass 缓存数据
     */
    public function read() {
        $content = file_get_contents($this->filename);
        return json_decode($content, true);
    }

}

/**
 * GET请求
 * @param  String $url 请求的网址
 * @return String      返回的内容
 */
function cURL($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

/**
 * 下载XML文件
 * @param  String $url      XML文件网址
 * @param  String $filename 保存文件名
 * @return Int              文件写入字节数
 */
function downloadPodcastXml($url, $filename) {
    $podcast_xml = cURL($url);
    return file_put_contents($filename, $podcast_xml);
}

/**
 * 解析XML为数组
 * @param  String $xml_filename XML文件名
 * @return Array                解析得到的数组
 */
function parseXmlToArray($xml_filename) {
    $xml = simplexml_load_file($xml_filename);
    $xml_items = $xml->xpath('/rss/channel/item');
    $items = array();
    // print_r($xml_items);
    foreach ($xml_items as $item) {
        $items[] = array(
            'title' => $item->title->__toString(),
            'description' => $item->description->__toString(),
            'pubdate' => $item->pubDate->__toString(),
            'guid' => $item->guid->__toString()
        );
    }
    return $items;
}



