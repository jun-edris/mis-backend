-require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const superAdminRoute = require('./routes/superAdmin');

const app = express();
const port = process.env.PORT || 3001;

app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'https://localhost:3000',
			process.env.CLIENT_URL,
		],
		optionsSuccessStatus: 200,
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', userRoute);
app.use('/api', adminRoute);
app.use('/api', superAdminRoute);

mongoose
	.connect(process.env.ATLAS_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(port, () => {
			console.log(`API listening on localhost:${port}`);
		});
	})
	.catch((err) => {
		console.log(err.message);
	});
