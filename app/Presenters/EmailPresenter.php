<?php

declare(strict_types = 1);

namespace App\Presenters;

use Nette\Mail\Message;
use Nette\Mail\SendmailMailer;
use Webmozart\Assert\Assert;

final class EmailPresenter extends BasePresenter
{
    public function actionDefault(): void
    {
        dumpe('TODO: list of methods :-)');
    }

    // POST email/send [from, to, subject, message]
    public function actionSend(): void
    {
        $from = $this->getHttpRequest()->getPost('from');
        $to = $this->getHttpRequest()->getPost('to');
        Assert::notNull($to);
        $subject = $this->getHttpRequest()->getPost('subject');
        Assert::notNull($subject);
        $message = $this->getHttpRequest()->getPost('message');
        Assert::notNull($message);

        $this->sendEmailAsHtml($from, $to, $subject, $message);
        $this->sendItemsResponse(['ok']);
    }

    private function sendEmailAsHtml(string $from, string $to, string $subject, string $body): void
    {
        if ($from === '') {
            $from = 'no-reply@svobodaweb.cz';
        }

        $message = new Message;
        $message->setFrom($from)
            ->addTo($to)
            ->setSubject($subject);

        $message->setHtmlBody($body);
        $mailer = new SendmailMailer;
        $mailer->send($message);
    }
}
