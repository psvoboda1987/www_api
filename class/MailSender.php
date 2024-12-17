<?php

declare(strict_types = 1);

namespace MyClass;

use Nette\Mail\Mailer;
use Nette\Mail\Message;

class MailSender
{
    public function __construct(private readonly Mailer $mailer, private readonly Message $message)
    {
    }

    public function sendEmail(string|array $recievers, string $subject, string $sender, string $content): void
    {
        $this->message->setSubject($subject)
            ->setFrom($sender)
            ->addReplyTo($sender)
            ->setHtmlBody($content);

        foreach ((array)$recievers as $reciever) {
            $this->message->addCc($reciever);
        }

        $this->mailer->send($this->message);
    }
}