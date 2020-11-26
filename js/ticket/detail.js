document.addEventListener("DOMContentLoaded", function () {
    getTimeZones();
    getTicketFromUrl();
});

function getTicketFromUrl() {
    let apiKey = getApiKey();
    let urlParams = new URLSearchParams(window.location.search);
    let ticketId = urlParams.get("ticket_id");
    let timeZone = getCookie("timeZone");

    let url = null;

    if (apiKey === null) {
        return;
    }

    if (ticketId === null) {
        return;
    }

    if (timeZone === null) {
        url = "/api/v2/download_ticket?ticket_id=" + ticketId;
    } else {
        url = "/api/v2/download_ticket?ticket_id=" + ticketId + "&time_zone=" + timeZone
    }
    getData(url, apiKey["credential_id"], apiKey["credential_secret"])
        .then(result => {
            ticket = result.content['ticket']
            populateTicket(ticket)
        })
}

function populateTicket(ticket) {
    let submissionDate = ticket['requested_at'].split(" ")[0];
    let submissionTime = ticket['requested_at'].split(" ")[1] + " " + ticket['tz_abbrev'];
    document.getElementById("show_name").textContent = ticket['show_name'];
    document.getElementById("artist").textContent = ticket['artist_name'];
    document.getElementById("title").textContent = ticket['song_title'];
    document.getElementById("tempo").textContent = ticket['song_tempo'];
    document.getElementById("key").textContent = ticket['song_key'];
    document.getElementById("requested_by").textContent = ticket['requested_by'];
    document.getElementById("notes").textContent = ticket['notes'];
    document.getElementById("submission-date").textContent = submissionDate;
    document.getElementById("submission-time").textContent = submissionTime;
    document.getElementById("ip-address").textContent = ticket['ip_address'];
    document.getElementById("reverse-dns").textContent = ticket['reverse_dns'];
    document.getElementById("ticket-id").textContent = ticket['ticket_id'];
    document.getElementById("ticket-type").textContent = ticket['type'];
    document.getElementById("printed").textContent = ticket['printed'];

    document.getElementById("return-to-index").addEventListener("click", goToIndex);
    document.getElementById("user-tickets").addEventListener("click", goToUserIndex);
    document.getElementById("ip-tickets").addEventListener("click", goToIpIndex);
    document.getElementById("blocklist-ip").addEventListener("click", blocklistIp);

}

function changeTimeZone() {
    let timeZone = document.getElementById("time-zones").value;
    setCookie("timeZone", timeZone);
    getTicketFromUrl();
}

function getTimeZones() {
    let apiKey = getApiKey();
    if (apiKey !== null) {
        getData('/api/v2/get_time_zones', apiKey['credential_id'], apiKey['credential_secret'])
            .then(result => {
                populateTimeZones(result.content['time_zones'])
            })
    }
}

function populateTimeZones(timeZoneList) {
    let currentTimeZone = getCookie('timeZone');
    let timeZoneSelect = document.getElementById('time-zones');
    let matched = false;
    timeZoneList.forEach(timeZone => {
        let timeZoneOption = document.createElement("option");
        timeZoneOption.value = timeZone;
        timeZoneOption.textContent = timeZone;
        if (timeZone === currentTimeZone) {
            timeZoneOption.selected = true;
            matched = true;
            console.log("matched")
        }
        timeZoneSelect.appendChild(timeZoneOption);
    });

    if (matched === false) {
        setCookie('timeZone', 'Etc/UTC');
        timeZoneSelect.childNodes.forEach(option => {
            if (option.value === 'Etc/UTC') {
                option.selected = true;
            }
        })
    }
}

function goToIndex() {
    let urlParams = new URLSearchParams(window.location.search);
    let timeZone = urlParams.get("time_zone");
    if (timeZone !== null) {
        window.location.href = '/ticket/index.html?time_zone=' + timeZone;
    } else {
        window.location.href = '/ticket/index.html';
    }
}

function goToUserIndex() {
    let user_name = encodeURIComponent(document.getElementById("requested_by").textContent)
    let urlParams = new URLSearchParams(window.location.search);
    let timeZone = urlParams.get('time_zone');
    if (timeZone !== null) {
        window.location.href = '/ticket/index.html?user_name=' + user_name + '&time_zone=' + timeZone;
    } else {
        window.location.href = '/ticket/index.html?user_name=' + user_name;
    }
}

function goToIpIndex() {
    let ip_address = encodeURIComponent(document.getElementById("ip-address").textContent)
    let urlParams = new URLSearchParams(window.location.search);
    let timeZone = urlParams.get('time_zone');
    if (timeZone !== null) {
        window.location.href = '/ticket/index.html?ip_address=' + ip_address + '&time_zone=' + timeZone;
    } else {
        window.location.href = '/ticket/index.html?ip_address=' + ip_address;
    }
}

function blocklistIp() {
    let ip_address = encodeURIComponent(document.getElementById("ip-address").textContent);
    let urlParams = new URLSearchParams(window.location.search);
    let timeZone = urlParams.get('time_zone')
    if (timeZone !== null) {
        window.location.href = '/ticket/block.html?ip_address=' + ip_address + '&time_zone=' + timeZone;
    } else {
        window.location.href = '/ticket/block.html?ip_address=' + ip_address;
    }

}
