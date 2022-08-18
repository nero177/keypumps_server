const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const router = require('./routers/router');
const cors = require('cors');
const DB_URI = `mongodb+srv://eyeadmin:yhe0BtoHQ1XRB1C0@cluster0.r6brd.mongodb.net/keypumps?retryWrites=true&w=majority`;
const mongoose = require('mongoose');

app.use(cors({
    origin: 'https://keypumps-client.vercel.app'
}));
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.headers)
    next();
})
app.use(express.urlencoded({ extended: false }));
app.use('/', router);

app.listen(PORT, async () => {
    console.log(`Server running at ${PORT}`);

    try {
        return await mongoose.connect(DB_URI);
    } catch (err){
        console.log(`connecting error: ${err}`);
    }
})

