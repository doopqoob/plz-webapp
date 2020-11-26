function getNewApiKey() {
    getData("/api/v2/api_key")
        .then(response => {
            setApiKeyCookie(response.content['credentials']);
            getApiKeyFromCookie()
        })
}

function setCookie(key, value, maxAgeInDays=365) {
    let path = '/';
    let maxAge = 60 * 60 * 24 * maxAgeInDays;

    document.cookie = key + "=" + value + "; secure=true; samesite=true; path=" + path + "; max-age=" + maxAge;
}

function getCookie(key) {
    if (document.cookie === "") {
        return null;
    }

    let allCookies = document.cookie.split('; ');
    let cookie = allCookies.find(row => row.startsWith(key + '='))
    if (cookie) {
        return cookie.split('=')[1];
    } else {
        return null;
    }

    //return allCookies.find(row => row.startsWith(key + '=')).split('=')[1];
}

function setApiKeyCookie(credentials) {

    setCookie('credential_id', credentials['credential_id']);
    setCookie('credential_secret', credentials['secret'])

    alert("Your API key is " + credentials['credential_id'] +  " -- please activate this key before continuing.")
}

function getApiKeyFromCookie() {
    let credential_id = getCookie('credential_id')

    if (credential_id === null) {
        return null;
    }

    let secret = getCookie('credential_secret')

    return {
        "credential_id": credential_id,
        "credential_secret": secret
    };
}

function getApiKey() {
    let apiKey = getApiKeyFromCookie();
    if (apiKey === null) {
        getNewApiKey();
    } else {
        return apiKey;
    }
}

