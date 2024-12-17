<?php

declare(strict_types = 1);

namespace App\Presenters;

use App\Models\LoremModel;
use Dibi\Connection;

final class LoremIpsumPresenter extends BasePresenter
{
    public function __construct(Connection $db, private readonly LoremModel $loremModel)
    {
        parent::__construct($db);
    }

    // GET lorem-ipsum?limit=500
    public function actionDefault(): void
    {
        $this->query = $this->loremModel->getLoremIpsum();
        $this->setQueryLimit();
        $this->sendItemsResponse($this->query->fetchPairs(null, 'word'));
    }

    // GET lorem-ipsum/dummy-data?type=city
    public function actionDummyData(): void
    {
        $this->sendItemsResponse(
            (array)$this->loremModel->getFakeData(
                $this->getHttpRequest()->getQuery('type')
            )
        );
    }
}
