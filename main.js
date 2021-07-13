const http = require('http')
const shell = require('shelljs')

function handle(data) {
    data = JSON.parse(data)
    let branch = data.ref.split('/')[2]
    shell.exec('rm -rf src')
    shell.exec('git clone ' + data.repository.html_url + ' src')
    shell.cd('src')
    shell.exec('git checkout ' + branch)
    shell.cd('..')
    console.log('clone successful')
    try {
        shell.exec('bash src/.lbuild.sh')
    } catch (err) {}
}

http.createServer(function (req, res) {
    res.setHeader("Content-Type", "application/json;charset=UTF-8");
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        if (req.method.toUpperCase() === 'POST') {
            let postData = '';
            req.on('data', data => postData += data);
            req.on('end', () => {
                res.end('true');
                handle(postData)
                postData = ''
            });
        } else {
            res.end();
        }
    } catch (err) {
        res.statusCode = 400;
        res.statusMessage = "Bad Request";
        res.end("null");
    }
}).listen(6530)

console.log("Server running successfully")