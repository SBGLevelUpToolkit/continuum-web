function getEnvironment() {
    let host = window.location.host;
    let pathName = window.location.pathname;
    if (host.indexOf('staging') > -1 || pathName.indexOf('source') > -1) {
        console.log('Host: ' + host);
        return 'http://continuumapi-staging.azurewebsites.net';
    } else {
        console.log('Host: ' + host);
        return 'http://continuumapi.azurewebsites.net';
    }
}

export default {
    'LOCAL': 'http://localhost:8887',
    'REMOTE': getEnvironment()
};