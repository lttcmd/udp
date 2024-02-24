const OSC = require('node-osc');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const oscClient = new OSC.Client('127.0.0.1', 12345);

app.post('/mouseposition', (req, res) => {
    const { mouseX, mouseY } = req.body;
    console.log(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`);

    oscClient.send(new OSC.Message('/mouseposition', mouseX, mouseY), () => {
        // If you need to perform an action after sending, do it here.
        // But do not call oscClient.kill(); as it's not a valid method.
    });

    res.json({ status: 'Data received and forwarded' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
