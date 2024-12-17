<?php

declare(strict_types = 1);

namespace App\Presenters;

use Dibi\Connection;
use Dibi\Fluent;
use Nette;
use Nette\Application\AbortException;
use Nette\Utils\ArrayHash;
use Nette\Utils\Validators;
use Throwable;
use Tracy\Debugger;
use Tracy\ILogger;
use function Sentry\captureException;
use function Sentry\init;

abstract class BasePresenter extends Nette\Application\UI\Presenter
{
    public const MIN_COUNT = 1;
    public int $limit;
    protected ?Fluent $query = null;
    protected array $items = [];
    protected ArrayHash $response;

    public function __construct(protected readonly Connection $db)
    {
    }

    public function addQueryFilter(string $key): void
    {
        if (!$this->getParameter($key)) {
            return;
        }

        $this->query->where([$key => $this->getParameter($key)]);
    }

    public function setQuerySort(): void
    {
        $sort = $this->getParameter('sort');

        if ($sort === null) {
            return;
        }

        if (!in_array(strtoupper($sort), ['DESC', 'ASC'], true)) {
            return;
        }

        $this->query->$sort();
    }

    public function setQueryLimit(int $max = 100, int $default = 50): void
    {
        $limit = (int)$this->getParameter('limit');

        if ($limit === 0) {
            $this->limit = $default;
            $this->query->limit($this->limit);
            return;
        }

        if (!Validators::isInRange($limit, [self::MIN_COUNT, $max])) {
            return;
        }

        $this->limit = $limit;
        $this->query->limit($this->limit);
    }

    public function sendItemsResponse(array $items): void
    {
        $this->items = $items;
        $this->response = $this->getResponse();
        $this->respond();
    }

    public function getResponse(): ArrayHash
    {
        $response = $this->getResponseObject();

        if ($this->query !== null) {
            $response->itemsFound = $this->query->count();
        }

        $response->itemsCount = count($this->items);
        $response->data = $this->items;

        return $response;
    }

    public function getResponseObject(): ArrayHash
    {
        $response = new ArrayHash();

        if ($this->items === []) {
            $response->itemsFound = 0;
            $response->status = 0;
            $response->message = 'error';
            return $response;
        }

        $response->status = 1;
        $response->message = 'ok';
        return $response;
    }

    /**
     * @throws AbortException
     */
    public function respond(string $response = null): void
    {
        $this->getHttpResponse()->setHeader('Access-Control-Allow-Origin', '*');
        $this->getHttpResponse()->setHeader('Content-Type', 'application/json');
        $this->getHttpResponse()->setHeader('Access-Control-Allow-Methods', 'GET, POST');

        $this->sendJson($response ?? $this->response);
    }

    public function createLog(Throwable $e, string $type = ILogger::EXCEPTION): void
    {
        if (ENV_PRODUCTION) {
            init(['dsn' => 'https://87f46e4dacb84ffdbf2753619bd513c0@o1233979.ingest.sentry.io/6440766']);
            captureException($e);
        }

        Debugger::log($e->getMessage(), $type);
    }
}
