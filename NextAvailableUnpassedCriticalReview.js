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
                displayCriticalCountdown();
            }
        }
    )};

    function displayCriticalCountdown(availableAt = null) {
        let delta;
        if (availableAt == null) {
            availableAt = "Do Lessons!";
        }
        else if (availableAt < Date.now()) {
            availableAt = "Available Now";
        }
        else {
            let deltaHours = Math.floor((availableAt - Date.now()) / 3600000);
            let deltaMinutes = 60 - new Date().getMinutes();
            delta = deltaHours + " H " + deltaMinutes +  " M";

            availableAt = new Date(availableAt);
            let hours = availableAt.getHours();
            let amPM = hours > 12 ? "PM" : "AM";
            if (hours > 12) hours -= 12;
            let tomorrow = new Date(Date.now() + 86400000).toDateString();

            if (availableAt.toDateString() === new Date().toDateString()) {
                availableAt = hours + " " + amPM;
            } else if (availableAt.toDateString() === tomorrow) {
                availableAt = "Tomorrow at " + hours + amPM;
            } else {
                let year = availableAt.getFullYear();
                let month = padValue(availableAt.getMonth() + 1);
                let day = padValue(availableAt.getDate());

                availableAt = year + "-" + month + "-" + day + " " + hours + ":00 " + amPM
            }
        }

        let elem = document.createElement('section');
        elem.className = "critical-countdown";
        elem.innerHTML = '<div><h1 class="text-xl leading-normal font-medium text-dark-gray m-0">Next Critical Review</h1>';

        if (delta != null) {
            elem.innerHTML += '<div>' + delta + ' from now</div>'
        }

        elem.innerHTML += '<div>' + availableAt + '</div>';
        $('.progress-and-forecast').before(elem);
    }

    function padValue(value) {
        return (value < 10) ? "0" + value : value;
    }
})();
