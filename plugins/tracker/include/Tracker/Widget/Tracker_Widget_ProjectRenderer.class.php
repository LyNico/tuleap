<?php
/**
 * Copyright (c) Xerox Corporation, Codendi Team, 2001-2009. All rights reserved
 * Copyright (c) Enalean, 2014 - 2017. All Rights Reserved.
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

/**
 * Widget_MyTrackerRenderer
 *
 * Personal tracker renderer
 */
class Tracker_Widget_ProjectRenderer extends Tracker_Widget_Renderer
{
    const ID = 'plugin_tracker_projectrenderer';

    public function __construct()
    {
        parent::__construct(
            self::ID, HTTPRequest::instance()->get('group_id'),
            \Tuleap\Dashboard\Project\ProjectDashboardController::LEGACY_DASHBOARD_TYPE
        );
    }

    function canBeUsedByProject($project)
    {
        return true;
    }

    public function isAjax()
    {
        return false;
    }
}