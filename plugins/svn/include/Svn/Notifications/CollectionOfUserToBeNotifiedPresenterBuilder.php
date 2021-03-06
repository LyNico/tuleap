<?php
/**
 * Copyright Enalean (c) 2017. All rights reserved.
 *
 * This file is a part of Tuleap.
 *
 * Tuleap is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Tuleap is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Tuleap. If not, see <http://www.gnu.org/licenses/>.
 */

namespace Tuleap\Svn\Notifications;

use Tuleap\Notifications\UserToBeNotifiedPresenter;
use Tuleap\Svn\Admin\MailNotification;

class CollectionOfUserToBeNotifiedPresenterBuilder
{
    /**
     * @var UsersToNotifyDao
     */
    private $dao;

    public function __construct(UsersToNotifyDao $dao)
    {
        $this->dao = $dao;
    }

    public function getCollectionOfUserToBeNotifiedPresenter(MailNotification $notification)
    {
        $presenters = array();
        foreach ($this->dao->searchUsersByNotificationId($notification->getId()) as $row) {
            $presenters[] = new UserToBeNotifiedPresenter(
                $row['user_id'],
                $row['user_name'],
                $row['realname'],
                $row['has_avatar'],
                '/users/'. urlencode($row['user_name']) .'/avatar.png'
            );
        }
        $this->sortUsersAlphabetically($presenters);

        return $presenters;
    }

    private function sortUsersAlphabetically(&$presenters)
    {
        usort($presenters, function (UserToBeNotifiedPresenter $a, UserToBeNotifiedPresenter $b) {
            return strnatcasecmp($a->label, $b->label);
        });
    }
}
