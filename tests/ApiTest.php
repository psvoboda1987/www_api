<?php

declare(strict_types = 1);

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;
use Tester\Assert;
use Tracy\Debugger;
use Tracy\ILogger;

require __DIR__ . '/../vendor/autoload.php';

final class ApiTest extends TestCase
{
    private string $baseUrl = 'http://api.svobodaweb.cz';
    
    private array $endpoints = [
        'animal-facts',
        'animal-facts/random',
        'chuck-norris-jokes',
        'chuck-norris-jokes/random',
        'cities',
        'counties',
        'countries',
        'daily-quotes',
        'lorem-ipsum',
        'moon' => [
            'phase',
            'phase-name',
            'age-in-days',
            'earth-distance-in-km',
            'sun-distance-in-km',
            'illuminated-fraction',
            'next-first-quarter',
            'previous-last-quarter',
            'next-full-moon',
            'full-moon',
            'next-new-moon',
            'new-moon',
        ],
        'postal-codes',
        'regions',
        'validations/email/psvoboda1987@gmail.com',
    ];
    
    public function __construct($name = null, private Client $client = new Client())
    {
        parent::__construct($name);
    }
    
    public function testEndpoints(): void
    {
        foreach ($this->endpoints as $key => $endpoint) {
            if (is_array($endpoint)) {
                foreach ($endpoint as $route) {
                    $this->baseTest($this->client->request('GET', "$this->baseUrl/$key/$route"));
                }
            } else {
                $this->baseTest($this->client->request('GET', "$this->baseUrl/$endpoint"));
            }
        }
    }
    
    private function baseTest($response): void
    {
        $this->assertNotEmpty($response);
        $this->assertNotEmpty($response->getHeaders());
        $this->assertEquals(200, $response->getStatusCode());
        
        $contents = $response->getBody()->getContents();
        $this->assertNotEmpty($contents);
        
        $decodedData = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);
        $this->assertArrayHasKey('data', $decodedData);
        $this->assertArrayHasKey('status', $decodedData);
        $this->assertArrayHasKey('message', $decodedData);
        $this->assertArrayHasKey('itemsCount', $decodedData);
        $this->assertNotEmpty($decodedData['data']);
    }
}
