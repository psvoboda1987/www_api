<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\RegionsModel;
use Dibi\Connection;

final class RegionsPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly RegionsModel $regionsModel)
    {
        parent::__construct($db);
    }

    /*
     * GET regions?zip=25162
     * county=xy
     * city=Kladno
     * sort=ASC|DESC => orderBy('city')
     * limit=500
     */
    public function actionDefault(): void
    {
        $this->query = $this->regionsModel->getRegions();

        $this->addQueryFilter('zip');
        $this->addQueryFilter('city');
        $this->addQueryFilter('county');

        $this->setQuerySort();
        $this->setQueryLimit(1000);

        $this->sendItemsResponse($this->query->fetchPairs(null, 'region'));
    }
}