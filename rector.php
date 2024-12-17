<?php

use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\SetList;
use Rector\TypeDeclaration\Rector\Property\TypedPropertyFromStrictConstructorRector;
use RectorNette\Set\NetteSetList;

return static function (RectorConfig $rectorConfig): void {
    $rectorConfig->rule(TypedPropertyFromStrictConstructorRector::class);

    $rectorConfig->paths([
        __DIR__ . '/app',
    ]);

    $rectorConfig->sets([
        SetList::CODE_QUALITY,
        SetList::CODING_STYLE,
        SetList::DEAD_CODE,
        SetList::EARLY_RETURN,
        SetList::MYSQL_TO_MYSQLI,
        SetList::PRIVATIZATION,
        SetList::PHP_81,
        SetList::PHP_82,
        NetteSetList::NETTE_24,
    ]);
};
