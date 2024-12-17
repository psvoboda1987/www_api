<?php

declare(strict_types = 1);

namespace App\Models;

use SimpleXMLElement;

final class ConvertModel
{
    public function array2xml(array $array, ?string $xml = null): bool|string
    {
        // Test if iteration
        if ($xml === null) {
            $xml = new SimpleXMLElement('<root/>');
        }

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $this->array2xml($value, $xml->addChild($key));
                continue;
            }

            $xml->addChild((string)$key, (string)$value);
        }

        return $xml->asXML();
    }

    /**
     * @throws \JsonException
     */
    public function xml2json(string $xml): bool|string
    {
        return json_encode(simplexml_load_string($xml), JSON_THROW_ON_ERROR);
    }
}