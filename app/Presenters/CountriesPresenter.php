<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\CountriesModel;
use Dibi\Connection;

final class CountriesPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly CountriesModel $countiesModel)
    {
        parent::__construct($db);
    }

    /*
     * GET countries?country=France
     * capital=Paris
     * sort=ASC|DESC => orderBy('city')
     */
    public function actionDefault(): void
    {
        $this->query = $this->countiesModel->getAllCountries();

        $this->addQueryFilter('capital');
        $this->addQueryFilter('country');
        $this->setQuerySort();

        $this->sendItemsResponse($this->query->fetchPairs('country', 'capital'));
    }
}
