const express = require('express');
const cors = require('cors');
const Request = require('./../../models/request');
const { pusher, transporter } = require('./../../utils');

const app = express();
app.use(cors({
		optionsSuccessStatus: 200,
		credentials: true,
	}));

exports.completeReq = async (req, res) => {
	try {
		console.log(req.params.id);
		const existingReq = await Request.findById(req.params.id);

		if (existingReq) {
			const complete = await Request.findByIdAndUpdate(req.params.id, {
				completed: true,
				pending: false,
			});

			// const userRequested = await User.findById(complete.user);

			// transporter
			// 	.sendMail({
			// 		from: '"MIS Helpline"', // sender address
			// 		to: `${userRequested.email}, ${process.env.MAIL_USER}, ${req.user.sub}`, // list of receivers
			// 		subject: 'MIS Completed Request', // Subject line
			// 		text: `Request`, // plain text body
			// 		html: `<b>Hi ${userRequested.firstName}, your request has already been approved and our team is on its way to help you on your request.</b>`, // html body
			// 	})
			// 	.catch(console.error);

			pusher.trigger('request', 'updated', complete);
			res.status(200).send({
				message: 'A request has been approved!',
			});
		}
	} catch (e) {
		console.log(e);
		res.status(400).send({ message: 'Error to complete the request' });
	}
};
