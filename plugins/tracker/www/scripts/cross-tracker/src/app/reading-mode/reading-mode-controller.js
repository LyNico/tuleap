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

import { watch } from 'wrist';
import { updateReport, getReport } from '../rest-querier.js';

export default class ReadingModeController {
    constructor(
        widget_content,
        report_mode,
        backend_cross_tracker_report,
        writing_cross_tracker_report,
        reading_cross_tracker_report,
        reading_trackers_controller,
        query_resut_controller,
        user,
        widget_loader_displayer,
        success_displayer,
        error_displayer,
        gettext_provider
    ) {
        this.widget_content               = widget_content;
        this.report_mode                  = report_mode;
        this.backend_cross_tracker_report = backend_cross_tracker_report;
        this.writing_cross_tracker_report = writing_cross_tracker_report;
        this.reading_cross_tracker_report = reading_cross_tracker_report;
        this.reading_trackers_controller  = reading_trackers_controller;
        this.query_result_controller      = query_resut_controller;
        this.widget_loader_displayer      = widget_loader_displayer;
        this.success_displayer            = success_displayer;
        this.error_displayer              = error_displayer;
        this.gettext_provider             = gettext_provider;

        this.reading_mode                = this.widget_content.querySelector('.dashboard-widget-content-cross-tracker-reading-mode');
        this.reading_mode_trackers_empty = this.widget_content.querySelector('.dashboard-widget-content-cross-tracker-reading-mode-trackers-empty');
        this.reading_mode_fields         = this.widget_content.querySelector('.dashboard-widget-content-cross-tracker-reading-mode-fields');
        this.reading_mode_actions        = this.widget_content.querySelector('.dashboard-widget-content-cross-tracker-reading-mode-actions');
        this.reading_mode_save_report    = this.widget_content.querySelector('.dashboard-widget-content-cross-tracker-reading-mode-actions-save');
        this.reading_mode_cancel_report  = this.widget_content.querySelector('.dashboard-widget-content-cross-tracker-reading-mode-actions-cancel');

        this.loadBackendReport().then(() => {
            if (user.isAnonymous()) {
                this.disableEditMode();
                return;
            }
            this.listenSaveReport();
            this.listenEditClick();
            this.listenChangeMode();
            this.listenCancelReport();
        });
    }

    listenEditClick() {
        this.reading_mode_fields.addEventListener('click', () => {
            this.writing_cross_tracker_report.duplicateFromReport(this.reading_cross_tracker_report);
            this.report_mode.switchToWritingMode();
        });
    }

    listenChangeMode() {
        const watcher = (property_name, old_value, new_value) => {
            if (new_value) {
                if (this.backend_cross_tracker_report.isDifferentFromReadingReport(this.reading_cross_tracker_report)) {
                    this.showReportActions();
                } else {
                    this.hideReportActions();
                }
            }
        };

        watch(this.report_mode, 'reading_mode', watcher);
    }

    listenSaveReport() {
        this.reading_mode_save_report.addEventListener('click', () => {
            this.updateReport();
        });
    }

    listenCancelReport() {
        this.reading_mode_cancel_report.addEventListener('click', () => {
            this.hideReportActions();
            this.reading_cross_tracker_report.duplicateFromReport(this.backend_cross_tracker_report);

            this.reading_trackers_controller.updateTrackersReading();
            this.query_result_controller.loadReportContent();
        });
    }

    async updateReport() {
        this.backend_cross_tracker_report.loaded = false;
        this.showSaveReportLoading();
        try {
            this.backend_cross_tracker_report.duplicateFromReport(this.reading_cross_tracker_report);
            const tracker_ids  = this.backend_cross_tracker_report.getTrackerIds();
            const { trackers } = await updateReport(this.backend_cross_tracker_report.report_id, tracker_ids);

            if (trackers) {
                this.initTrackers(trackers);
            }
            this.success_displayer.displaySuccess(this.gettext_provider.gettext('Report has been successfully saved'));
            this.hideReportActions();
            this.backend_cross_tracker_report.loaded = true;
        } catch (error) {
            this.error_displayer.displayError(this.gettext_provider.gettext('Error while updating the cross tracker report'));
            throw error;
        } finally {
            this.hideSaveReportLoading();
        }
    }

    showReportActions() {
        this.reading_mode_actions.classList.remove('cross-tracker-hide');
    }

    hideReportActions() {
        this.reading_mode_actions.classList.add('cross-tracker-hide');
    }

    initTrackers(trackers) {
        this.backend_cross_tracker_report.initTrackers(trackers);
        this.reading_cross_tracker_report.duplicateFromReport(this.backend_cross_tracker_report);
        this.writing_cross_tracker_report.duplicateFromReport(this.reading_cross_tracker_report);
    }

    async loadBackendReport() {
        this.widget_loader_displayer.show();
        this.backend_cross_tracker_report.loaded = false;
        try {
            const { trackers } = await getReport(this.backend_cross_tracker_report.report_id);
            if (trackers) {
                this.initTrackers(trackers);
            }
            this.backend_cross_tracker_report.loaded = true;
        } catch (error) {
            this.reading_trackers_controller.setDisabled();
            this.error_displayer.displayError(this.gettext_provider.gettext('Error while fetching the cross tracker report'));
            throw error;
        } finally {
            this.widget_loader_displayer.hide();
        }
    }

    disableSaveReport() {
        this.reading_mode_save_report.disabled = true;
    }

    disableEditMode() {
        this.disableSaveReport();
        this.reading_mode_fields.classList.add('disabled');
    }

    showSaveReportLoading() {
        this.reading_mode_save_report.classList.add('cross-tracker-loading');
    }

    hideSaveReportLoading() {
        this.reading_mode_save_report.classList.remove('cross-tracker-loading');
    }
}
