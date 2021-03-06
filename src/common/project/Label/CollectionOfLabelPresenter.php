<?php
/**
 * Copyright (c) Enalean, 2017. All Rights Reserved.
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

namespace Tuleap\Project\Label;

use Project;
use Tuleap\Event\Dispatchable;

class CollectionOfLabelPresenter implements Dispatchable
{
    const NAME = 'collection_of_label_presenter';

    /** @var LabelPresenter[] */
    private $labels_presenter = array();

    /**
     * @var Project
     */
    private $project;

    public function __construct(Project $project)
    {
        $this->project = $project;
    }

    public function add(LabelPresenter $presenter)
    {
        $this->labels_presenter[$presenter->id] = $presenter;
    }

    /**
     * @return Project
     */
    public function getProject()
    {
        return $this->project;
    }

    public function switchToUsed($label_id)
    {
        $this->labels_presenter[$label_id]->switchToUsed();
    }

    public function getPresenters()
    {
        return array_values($this->labels_presenter);
    }
}
