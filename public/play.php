<?php

$id = $_GET['id'];
$id = preg_replace("/[^A-Za-z0-9-_]/", '', $id);
if (!$id) fail("request");

$stream = 1;

$user = $_GET['user'];
$user = preg_replace("/[^A-Za-z0-9-_ ]/", '', $user);
if (strlen($user) < 1) fail("user");

$path = "/usr/share/nginx/liquidsoap/tmp/";

putenv('PATH=/usr/bin:/usr/local/bin');

if (!file_exists("{$path}{$id}.mp3")){
  ini_set('max_execution_time', 300);
  $cmd = "/usr/bin/youtube-dl {$id} -o \"{$path}{$id}.%(ext)s\" --extract-audio --audio-format mp3 --audio-quality 128K 2>&1";
  $cmdret = shell_exec($cmd);
}

if (!file_exists("{$path}{$id}.mp3")){
  fail("youtube ");
}

$cmd = "eyeD3 -a \"{$id}\" -t \"{$user}\" {$path}{$id}.mp3 2>&1";
shell_exec($cmd);

$socket = fsockopen("localhost", "1234", $errno, $errstr);
if(!$socket){
  fail("telnet");
}

usleep(0.5 * 1000000);
fputs($socket, "{$stream}.push {$path}{$id}.mp3\n");
$buffer = fgets($socket, 32);
fclose($socket);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
echo $buffer;
exit;

function fail($msg){
  header("Content-Type: application/json");
  header("Access-Control-Allow-Origin: *");
  echo "ERROR: " . $msg;
  exit;
}
