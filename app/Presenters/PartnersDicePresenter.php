<?php

declare(strict_types = 1);

namespace App\Presenters;

final class PartnersDicePresenter extends BasePresenter
{
    private array $actions = [
        'lick',
        'kiss',
        'touch',
        'hold',
        'pull',
        'pinch',
        'squeeze',
        'slap',
        'bite',
        'whisper',
        'blow',
        'smell',
        'listen',
    ];

    private array $bodyParts = [
        'lips',
        'eyes',
        'nose',
        'ears',
        'hand',
        'leg',
        'butt',
        'belly',
        'neck',
        'hair',
        'tongue',
    ];

    // GET /partners-dice
    public function actionDefault(): void
    {
        $this->sendItemsResponse(
            (array)$this->getPartnersMove()
        );
    }

    public function getPartnersMove(): string
    {
        return $this->actions[array_rand($this->actions)] . ' ' . $this->bodyParts[array_rand($this->bodyParts)];
    }
}
