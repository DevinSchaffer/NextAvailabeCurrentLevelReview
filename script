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
        .then(getAssignments);

    // Get assignment data and find when the next unpassed radical or kanji review item will be available.
    function getAssignments() {
        var assignmentFilter = {passed: false, subject_types: ['radical', 'kanji']};
        wkof.Apiv2.fetch_endpoint('assignments', {filters: assignmentFilter}).then(function (assignments) {
            assignments = assignments.data.sort((a, b) => (a.data.available_at > b.data.available_at) ? 1 : -1);

            if ((assignments.length)) {
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
            var hours = Math.floor((availableAt - Date.now()) / 3600000);
            var minutes = 60 - new Date().getMinutes();
            availableAt = hours + " H " + minutes +  " M";
        }

        var elem = document.createElement('li');
        elem.className = "critical-countdown";
        elem.innerHTML = '<time>' + availableAt + '</time><i class="icon-time"></i> Next Critical Review';
        $('.next').after(elem);

        setHeaderWidth();
    }
})();
