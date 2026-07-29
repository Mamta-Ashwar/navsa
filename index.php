<?php

$apiPublicDir = __DIR__ . '/navsa-api/public';

if (file_exists($apiPublicDir . '/index.php')) {
    chdir($apiPublicDir);
    $_SERVER['SCRIPT_FILENAME'] = $apiPublicDir . '/index.php';
    $_SERVER['SCRIPT_NAME'] = '/index.php';
    $_SERVER['PHP_SELF'] = '/index.php';
    require $apiPublicDir . '/index.php';
} else {
    chdir('/kunden/homepages/32/d853845507/htdocs/navsa-api/public');
    $_SERVER['SCRIPT_FILENAME'] = '/kunden/homepages/32/d853845507/htdocs/navsa-api/public/index.php';
    $_SERVER['SCRIPT_NAME'] = '/index.php';
    $_SERVER['PHP_SELF'] = '/index.php';
    require '/kunden/homepages/32/d853845507/htdocs/navsa-api/public/index.php';
}