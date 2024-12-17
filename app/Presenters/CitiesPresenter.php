<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\CitiesModel;
use Dibi\Connection;

final class CitiesPresenter extends BasePresenter
{
    public const LIMIT = 1000;

    public function __construct(Connection $db, private readonly CitiesModel $citiesModel)
    {
        parent::__construct($db);
    }

    /*
     * GET cities
     * zip=25162
     * county=xy
     * region=Praha
     * sort=ASC|DESC => orderBy('city')
     * limit=500
     */

    public function actionDefault(): void
    {
        $this->query = $this->citiesModel->getAllCities();

        $this->addQueryFilter('zip');
        $this->addQueryFilter('county');
        $this->addQueryFilter('region');

        $this->setQuerySort();
        $this->setQueryLimit(self::LIMIT);

        $this->sendItemsResponse($this->query->fetchPairs('zip', 'city'));
    }
}
