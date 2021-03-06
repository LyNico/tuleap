<?php
/**
* Copyright (c) Enalean, 2016 - 2017. All Rights Reserved.
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

namespace Tuleap\Svn\Repository;

use Backend;
use EventManager;
use TuleapTestCase;

require_once __DIR__ .'/../../bootstrap.php';

class RepositoryManagerTest extends TuleapTestCase
{

    private $manager;
    private $project_manager;
    private $dao;


    public function setUp()
    {
        parent::setUp();

        $this->dao                   = mock('Tuleap\Svn\Dao');
        $this->project_manager       = mock('ProjectManager');
        $svn_admin                   = mock('Tuleap\Svn\SvnAdmin');
        $logger                      = mock('Logger');
        $system_command              = mock('System_Command');
        $destructor                  = mock('Tuleap\Svn\Admin\Destructor');
        $event_manager               = EventManager::instance();
        $backend                     = Backend::instance(Backend::SVN);
        $access_file_history_factory = mock('Tuleap\Svn\AccessControl\AccessFileHistoryFactory');
        $this->manager               = new RepositoryManager(
            $this->dao,
            $this->project_manager,
            $svn_admin,
            $logger,
            $system_command,
            $destructor,
            $event_manager,
            $backend,
            $access_file_history_factory
        );
        $project               = stub("Project")->getId()->returns(101);

        stub($this->project_manager)->getProjectByUnixName('projectname')->returns($project);
        stub($this->dao)->searchRepositoryByName($project, 'repositoryname')->returns(
            array(
                'id'                       => 1,
                'name'                     => 'repositoryname',
                'repository_deletion_date' => '0000-00-00 00:00:00',
                'backup_path'              => ''
            )
        );
    }

    public function tearDown()
    {
        EventManager::clearInstance();
        Backend::clearInstances();

        parent::tearDown();
    }

    public function itReturnsRepositoryFromAPublicPath(){
        $public_path = 'projectname/repositoryname';

        $repository = $this->manager->getRepositoryFromPublicPath($public_path);
        $this->assertEqual($repository->getName(), 'repositoryname');
    }

    public function itThrowsAnExceptionWhenRepositoryNameNotFound(){
        $public_path = 'projectname/repositoryko';

        $this->expectException('Tuleap\Svn\Repository\Exception\CannotFindRepositoryException');
        $this->manager->getRepositoryFromPublicPath($public_path);
    }

    public function itThrowsAnExceptionWhenProjectNameNotFound(){
        $public_path = 'projectnameko/repositoryname';

        $this->expectException('Tuleap\Svn\Repository\Exception\CannotFindRepositoryException');
        $this->manager->getRepositoryFromPublicPath($public_path);
    }
}
