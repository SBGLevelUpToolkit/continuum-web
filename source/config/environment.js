function getEnvironment() {
    let host = window.location.pathname;
    if (host.indexOf('staging') > -1 || host.indexOf('source') > -1) {
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