function getData(url = ``, username = null, password = null) {

    let fetchInit = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            "Accept": "application/json",
        }
    }

    if (username !== null) {
        fetchInit['headers']['Authorization'] = "Basic " + btoa(username + ":" + password);
    }

    return fetch(url, fetchInit)
        .then(response => {
            if ((response.status === 200) || (response.status === 201)) {
                return response.json().then(responseData => ({status: response.status, content: responseData }))
            } else {
                return {status: response.status, content: ""}
            }
        });
}

function postData(url = ``, data = {}, username = null, password = null) {
    let fetchInit = {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }

    if (username !== null) {
        fetchInit['headers']['Authorization'] = "Basic " + btoa(username + ":" + password);
    }

    return fetch(url, fetchInit)
        .then(response => {
            if ((response.status === 200) || (response.status === 201)) {
                return response.json().then(responseData => ({status: response.status, content: responseData }))
            } else {
                return {status: response.status, content: ""}
            }
        });
}