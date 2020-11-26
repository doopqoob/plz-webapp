document.addEventListener("DOMContentLoaded", function () {
    populateIndex();
    let timer = setInterval(getTickets, 15000);
});

function populateIndex() {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("time_zone")) {
        setTimeZoneFromUrl();
    }

    getShows();
    getTimeZones();
    let timeZoneList = document.getElementById("time-zones");
    while (timeZoneList.value === null) {
        // wait
    }

    getTickets();
}

function setTimeZoneFromUrl() {
    let url = new URL(window.location.href);
    console.log(url);
    let searchParams = url.searchParams;

    setCookie("timeZone", searchParams.get('time_zone'));

    searchParams.delete("time_zone");

    window.location.href = url.href;
}

function changeTimeZone() {
    let timeZone = document.getElementById("time-zones").value;
    setCookie("timeZone", timeZone);
    getTickets();
}

function getTickets() {
    let url = new URL("https://" + window.location.hostname + "/api/v2/download_tickets");
    let urlParams = new URLSearchParams(window.location.search);

    let timeZone = getCookie('timeZone');
    if (timeZone !== null) {
        url.searchParams.append("time_zone", encodeURIComponent(timeZone));
    }

    let show_id = document.getElementById("shows").value;
    if (show_id !== "null") {
        url.searchParams.append("show_id", show_id);
    }

    let timeInterval = document.getElementById("interval").value;
    if (timeInterval !== "null") {
        url.searchParams.append("time_interval", timeInterval);
    }

    let ipAddress = urlParams.get("ip_address");
    if (ipAddress !== null) {
        url.searchParams.append("ip_address", ipAddress);
    }

    let apiKey = getApiKey();
    if (apiKey !== null) {
        getData(url.href, apiKey["credential_id"], apiKey["credential_secret"])
            .then(result => {
                tickets = result.content['tickets'];
                depopulateTickets();
                populateTickets(tickets, timeZone);
            })
    }
}

function getShows() {
    getData("/api/v2/get_shows")
        .then(result => {
            populateShowList(result.content['shows']);
        });
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

function populateShowList(showList) {
    let showSelect = document.getElementById("shows");
    showList.forEach(show => {
        let showOption = document.createElement("option");
        showOption.value = show[0];
        showOption.textContent = show[1];
        showSelect.appendChild(showOption);
    })
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

function populateTickets(tickets = null, timeZone = null) {
    if (tickets === null) {
        return;
    }

    let content = document.getElementById("content");
    let template = document.getElementById("ticket-template");
    template.removeAttribute("class");

    let index = 0;
    tickets.forEach(ticket => {
        console.log(ticket);
        let new_ticket_div = template.cloneNode(true);

        new_ticket_div.id = "ticket-div-" + index;

        let elements = Array.from(new_ticket_div.getElementsByTagName("span"));
        elements.forEach(element => {
            element.id = element.id + "-" + index;
        })

        elements = Array.from(new_ticket_div.getElementsByTagName("button"));
        elements.forEach(element => {
            element.id = element.id + "-" + index;
        })

        content.appendChild(new_ticket_div);

        document.getElementById("show-" + index).textContent = ticket['show_name'];
        document.getElementById("artist-" + index).textContent = ticket['artist_name'];
        document.getElementById("title-" + index).textContent = ticket['song_title'];
        document.getElementById("requested-by-" + index).textContent = ticket['requested_by'];

        let submissionDate = ticket['requested_at'].split(" ")[0];
        let submissionTime = ticket['requested_at'].split(" ")[1] + " " + ticket['tz_abbrev'];

        document.getElementById("requested-at-" + index).textContent = submissionDate + " " + submissionTime;

        document.getElementById("ticket-detail-" + index).addEventListener("click", function (){
            goToDetail(ticket['ticket_id']);
        });

        index++;

    });

    template.setAttribute("class", "d-none");
}

function depopulateTickets() {
    let ticketList = document.getElementById("content");
    while (ticketList.firstChild) {
        ticketList.firstChild.remove()
    }
}


function goToDetail(ticket_id) {
    window.location.href = '/ticket/detail.html?ticket_id=' + ticket_id;
}
