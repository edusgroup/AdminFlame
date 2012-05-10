<?php
// Conf
use \SITE as CONF;
use \DIR as DIR;
// Engine
//use core\classes\DB\adapter\adapter;
use core\classes\request;
use core\classes\DB\DB as DBCore;

// Грузим конфиги админки
define('DIR_CONF', './../FlameCore/engine/admin/');


include(DIR_CONF . 'conf/DIR.php');
include(DIR_CONF . 'conf/SITE.php');
include(DIR_CONF . 'conf/CONSTANT.php');
umask(0002);

$siteName = 'seoforbeginners.ru';

include DIR::SITE_CORE.$siteName.'/conf/SITE.php';
include DIR::SITE_CORE.$siteName.'/conf/DIR.php';
include DIR::SITE_CORE.$siteName.'/conf/DB.php';

session_start();

include DIR::CORE . 'admin/library/function/autoload.php';
// Костыль для проверки скалярных типо данных в параметрах функции. В PHP 5.4 пофиксят
include DIR::CORE . 'core/function/errorHandler.php';
// Подгрузка драйвера БД
include DIR::CORE . 'core/classes/DB/adapter/' . CONF::DB_ADAPTER . '/adapter.php';

DBCore::addParam('site', \site\conf\DB::$conf);

// Получаем типо контроллера
$initType = trim(request::get('$t'));
// Формируем имя класса для типа контроллера
$initClassName = 'admin\library\init\\' . $initType;
// Существует ли наш типо контроллера, автоматическая автоподрузка
if (!class_exists($initClassName)) {
    header('Content-Type: text/html; charset=UTF-8');
    echo "Page 404<br/>\nBad parametr initType";
    exit;
}

// Могут быть исключительные ситуации
try {
    // Создаём и запускаем
    $initObj = new $initClassName();
    $initObj->run();
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