<?php

declare(strict_types = 1);

namespace MyClass;

use Latte\Engine;
use Nette\Utils\Paginator;

final class Pager
{
    public function __construct(
        public Paginator $paginator,
        private Engine $latte,
        int $count,
        int $page = 1,
        int $itemsPerPage = 10,
        string $tempDir = '/temp'
    )
    {
        $this->paginator = $paginator
            ->setItemCount($count)
            ->setItemsPerPage($itemsPerPage)
            ->setPage($page);

        $this->latte = $latte->setTempDirectory($tempDir);
    }

    public function render(): void
    {
        $this->latte->render(__DIR__ . '/templates/pager.latte', ['paginator' => $this->paginator]);
    }
}