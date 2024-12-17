<?php

declare(strict_types = 1);

namespace App\Presenters;

final class LeetCodePresenter extends BasePresenter
{
    // GET leet-code?text=test,text,to,turn,to,leet
    public function actionDefault(): void
    {
        $this->sendItemsResponse(
            (array)$this->getLeetText($this->getParameter('text') ?? '')
        );
    }

    public function getLeetText(string $text): string
    {
        return str_replace(
            [
                'O',
                'o',
                'l',
                'Z',
                'z',
                'E',
                'e',
                'A',
                'a',
                'S',
                's',
                'b',
                'B',
                'g',
            ],
            [
                '0',
                '0',
                '1',
                '2',
                '2',
                '3',
                '3',
                '4',
                '4',
                '5',
                '5',
                '6',
                '8',
                '9',
            ],
            $text
        );
    }
}
