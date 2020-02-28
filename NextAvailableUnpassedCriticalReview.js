// ==UserScript==
// @name         WaniKani Next Available Current Level Apprentice Radical or Kanji
// @namespace    WaniKani Next Available Current Level Apprentice Radical or Kanji
// @version      1.0.0
// @description  Displays when the next unpassed radical or kanji will be available for review on the dashboard.
// @author       Devin Schaffer
// @include      https://www.wanikani.com/
// @include      https://www.wanikani.com/dashboard*
// @grant        none
// ==/UserScript==

(function() {
    wkof.include('Apiv2');
    wkof.ready('Apiv2')
        .then(getLevel)
        .then(getAssignments);

    function getLevel() {
        return wkof.Apiv2.fetch_endpoint('user');
    }

    // Get assignment data and find when the next unpassed radical or kanji review item will be available.
    function getAssignments(level) {
        let assignmentFilter = {passed: false, subject_types: ['radical', 'kanji'], levels: [level.data.level]};
        wkof.Apiv2.fetch_endpoint('assignments', {filters: assignmentFilter}).then(function (assignments) {
            assignments = assignments.data.filter(item => item.data.srs_stage > 0);

            if (assignments.length) {
                assignments = assignments.sort((a, b) => (a.available_at > b.available_at) ? 1 : -1);
                displayCriticalCountdown(Date.parse(assignments[0].data.available_at));
            } else {
                displayCriticalCountdown("Do Lessons!");
            }
        }
    )};

    function setHeaderWidth() {
        var headerCount = $('.dashboard section.review-status ul li').length;
        var width = (100/headerCount);
        $('.dashboard section.review-status ul li').css('width', width + '%');
    }

    function displayCriticalCountdown(availableAt) {
        if (availableAt == "Do Lessons!") {
            // Do nothing
        }
        else if (availableAt < Date.now()) {
            availableAt = "Available Now";
        }
        else {
            let hours = Math.floor((availableAt - Date.now()) / 3600000);
            let minutes = 60 - new Date().getMinutes();
            availableAt = hours + " H " + minutes +  " M";
        }

        let elem = document.createElement('li');
        elem.className = "critical-countdown";
        elem.innerHTML = '<time>' + availableAt + '</time><i class="icon-time"></i> Next Critical Review';
        $('.next').after(elem);

        setHeaderWidth();
    }
})();