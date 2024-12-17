<?php

declare(strict_types = 1);

namespace App\Presenters;

use Mpdf\Mpdf;
use Mpdf\Output\Destination;
use Nette\Utils\Json;
use Throwable;

final class PdfPresenter extends BasePresenter
{
    public function actionDefault(): void
    {
        dumpe('TODO: list of methods :-)');
    }

    // POST pdf/from-html [html]
    public function actionFromHtml(): void
    {
        require_once ROOT_DIR . '/vendor/autoload.php';

        $html = $this->getHtml();

        if ($html === null) {
            $this->sendItemsResponse([]);
        }

        try {
            $mpdf = new Mpdf();
            $mpdf->WriteHTML($html);

            $this->sendJson(
                Json::encode(utf8_encode($mpdf->Output('', Destination::STRING_RETURN)))
            );
        } catch (Throwable $e) {
            $this->createLog($e);
        }

        $this->sendItemsResponse([]);
    }

    public function getHtml(): mixed
    {
        if ($this->getHttpRequest()->getPost('html')) {
            return $this->getHttpRequest()->getPost('html');
        }

        return $this->getHttpRequest()->getQuery('html');
    }
}
