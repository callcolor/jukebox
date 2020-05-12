<?php

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
define('SECONDS_PER_MINUTE', 60);

function ytTime($youtube_time, $format = false){
    $start = new DateTime('@0'); // Unix epoch
    $start->add(new DateInterval($youtube_time));
    if ($format){
      return $start->format($format);
    }
    return $start->getTimeStamp();
}

$key = $_ENV["GOOGLE_JUKEBOX_KEY"];

$query = urlencode($_GET['search']);
if (strlen($query) < 1){
  header("Content-Type: application/json");
  header("Access-Control-Allow-Origin: *");
  echo "[]";
  exit;
}

$url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&safeSearch=none&type=video&key={$key}&q={$query}";
$result = file_get_contents($url);
$result = json_decode($result, true);
$results = $result['items'];

$ids = [];
foreach ($results as $result){
  $ids[] = $result['id']['videoId'];
}
$ids = implode($ids, ",");

$url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&key={$key}&id={$ids}";
$result = file_get_contents($url);
$result = json_decode($result, true);
$results = $result['items'];

$return = [];
$i = 0;
foreach ($results as $result){
  if (ytTime($result['contentDetails']['duration']) > 10 * SECONDS_PER_MINUTE) continue;
  if (ytTime($result['contentDetails']['duration']) < 5) continue;
  $i++;
  if ($i > 10) break;
  $title = substr(ucwords($result['snippet']['title']), 0, 80);
  $m = (int)ytTime($result['contentDetails']['duration'], 'i');
  $s = ytTime($result['contentDetails']['duration'], 's');
  $human_duration = "{$m}:{$s}";
  $return[] = [
    'index' => $i,
    'name' => "{$title} ({$human_duration})",
    'id' => $result['id']
  ];
}

$return = array_reverse($return);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
echo json_encode($return);
