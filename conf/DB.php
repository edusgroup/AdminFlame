<?php

use core\classes\DB\adapter\adapter;

class ADMIN_DB{
	 public static $conf = [
            adapter::USER => 'adminx2',
            adapter::PWD => 'ASKLEU4023987YR3OH4298luhy78fy9o273',
            adapter::HOST => 'localhost',
            adapter::PORT => '3306',
            adapter::NAME => 'adminx2',
            adapter::CHARSET => 'utf8',
            adapter::SOCKET => '/var/run/mysqld/mysqld.sock'
        ];

    public static $files = [
        adapter::USER => 'files',
        adapter::PWD => ';LKAJSfgP(S*Hwio;3h4osdf0(*DFwo38i4',
        adapter::HOST => 'localhost',
        adapter::PORT => '3306',
        adapter::NAME => 'files',
        adapter::CHARSET => 'utf8',
        adapter::SOCKET => '/var/run/mysqld/mysqld.sock'
    ];
	
}