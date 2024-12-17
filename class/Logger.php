<?php

declare(strict_types = 1);

namespace MyClass;

use Throwable;
use Tracy\Debugger;
use Tracy\ILogger;
use function Sentry\captureException;
use function Sentry\init;

class Logger
{
    public static function createDevLog(Throwable $e, string $type = ILogger::EXCEPTION): void
    {
        Debugger::log($e->getMessage(), $type);
    }

    public static function createLog(Throwable $e, string $type = ILogger::EXCEPTION): void
    {
        init(['dsn' => '']);
        captureException($e);
        Debugger::log($e->getMessage(), $type);
    }
}