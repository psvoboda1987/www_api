<?php

declare(strict_types = 1);

namespace MyClass;

use Latte\Engine;

final class LatteRenderer
{
    public function __construct(
        private readonly Engine $latte = new Engine(),
        private readonly string $tempDir = '/temp'
    ) {
    }

    public function render(
        string $templatePath,
        array $params = [],
    ): void {
        $this->latte->setTempDirectory($this->tempDir)
            ->render($templatePath, $params);
    }

    public function getHtml(
        string $templatePath,
        array $params = []
    ): string {
        return $this->latte->setTempDirectory($this->tempDir)
            ->renderToString($templatePath, $params);
    }
}