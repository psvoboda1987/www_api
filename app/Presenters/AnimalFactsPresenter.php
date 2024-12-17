<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\AnimalFactsModel;
use Dibi\Connection;

final class AnimalFactsPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly AnimalFactsModel $animalFactsModel)
    {
        parent::__construct($db);
    }

    /*
     * GET /animal-facts?animal=cat|dog|horse|snail
     * limit=500
     */
    public function actionDefault(): void
    {
        $this->query = $this->animalFactsModel->getAll();

        $this->addQueryFilter('animal');
        $this->setQueryLimit();

        $this->sendItemsResponse($this->query->fetchPairs(null, 'fact'));
    }

    /*
     * GET /animal-facts/random?animal=cat|dog|horse|snail
     */
    public function actionRandom(): void
    {
        $this->query = $this->animalFactsModel->getRandomAnimal();

        $this->addQueryFilter('animal');

        $this->sendItemsResponse($this->query->fetchPairs(null, 'fact'));
    }
}
