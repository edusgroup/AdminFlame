<?php
// Conf
use \SITE as CONF;
use \DIR as DIR;
// Engine
//use core\classes\DB\adapter\adapter;
use core\classes\request;
use core\classes\DB\DB as DBCore;

// Грузим конфиги админки
define('DIR_CONF', '/opt/www/FlameCore/engine/admin/');
include('../conf/DB.php');

include(DIR_CONF . 'conf/DIR.php');
include(DIR_CONF . 'conf/SITE.php');
include(DIR_CONF . 'conf/CONSTANT.php');

define('SITE_CORE', '/opt/www/SiteCoreFlame/');

// Получаем тип контроллера
$initType = isset($_GET['$t']) ? trim($_GET['$t']) : 'manager';
$contrName = isset($_GET['$c']) ? trim($_GET['$c']) : 'site';

$siteName = isset($_COOKIE['siteName']) ? $_COOKIE['siteName'] : null;
if ( !$siteName ){
    $siteName = isset($_GET['siteName']) ? trim($_GET['siteName']) : null;
}
/*
$isDirNotExist = !$siteName || !is_dir(SITE_CORE.$siteName);
$isContr = !(in_array($contrName, ['site','auth']) && ($initType == 'manager'));
if ($isDirNotExist && $isContr){
    header('Location: /?$t=manager&$c=site');
    exit;
} // if*/

$isChooseSite = (in_array($contrName, ['site','auth']) && ($initType == 'manager'));
if ($isChooseSite){
    $siteName = null;
}

umask(0002);

if ( $siteName ){
    include SITE_CORE.$siteName.'/conf/SITE.php';
    include SITE_CORE.$siteName.'/conf/DIR.php';
    include SITE_CORE.$siteName.'/conf/DB.php';
} // if ( $siteName )

session_start();
include DIR::CORE . 'admin/library/function/autoload.php';
// Костыль для проверки скалярных типо данных в параметрах функции. В PHP 5.4 пофиксят
include DIR::CORE . 'core/function/errorHandler.php';
// Подгрузка драйвера БД
include DIR::CORE . 'core/classes/DB/adapter/' . CONF::DB_ADAPTER . '/adapter.php';


if ( $siteName ){
    DBCore::addParam('site', \site\conf\DB::$conf);
}
DBCore::addParam('admin', \ADMIN_DB::$conf);
DBCore::addParam('files', \ADMIN_DB::$files);

// Формируем имя класса для типа контроллера
$initClassName = 'admin\library\init\\' . $initType;
// Существует ли наш типо контроллера, автоматическая автоподрузка
if (!@class_exists($initClassName)) {
    header('Content-Type: text/html; charset=UTF-8');
    echo "Page 404<br/>\nBad parametr initType";
    exit;
} // if

// Могут быть исключительные ситуации
try {
    // Создаём и запускаем
    $initObj = new $initClassName();
    $initObj->run($siteName);
} catch (\Exception $e) {
    /*header('Content-Type: text/html; charset=UTF-8');
    $errorMsg = htmlspecialchars($e->getMessage());
    $errorCode = $e->getCode();
    print "Page 505<br/>\nError: <B>$errorMsg</B>\n<br/>Code: $errorCode<br/>\n";
    echo nl2br($e->getTraceAsString());*/
    $msg = array();
    $msg['error'] = array('msg' => $e->getMessage(), 'code' => $e->getCode());
    echo json_encode($msg);
    exit;
}

//print "\n<br style='clear:both'/>Use:".''.memory_get_usage().'<br/>Max:'.memory_get_peak_usage().'<br/>';
?>