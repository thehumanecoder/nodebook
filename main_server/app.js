const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const os = require('os');
const cluster = require('cluster');
const mongoose = require('mongoose');



require('dotenv').config();


app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ extended: true }));


// creating a mongoose connection 
mongoose.connect(process.env.mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to DB"))
    .catch(console.error);


const authRouter = require("./routes/auth");

app.use('/auth', authRouter);

const port = process.env.PORT || 4500;


const clusterWorkerSize = os.cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < clusterWorkerSize; i++) {
        cluster.fork();
    }
    cluster.on('exit', () => {
        cluster.fork();
    })
} else {
    app.listen(port, () => {
        console.log(`Server is running on port ${port} , listening to service id ${process.pid} \n`);
    });
}