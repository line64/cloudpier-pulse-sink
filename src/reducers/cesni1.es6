import moment from 'moment';
import _ from 'lodash'; _.mixin(require('lodash-deep'));

import kumeliUpdateDashlets from '../utils/kumeliUpdateDashlets';

export default function(config, state, checkpoint, signalBatch) {

	return new Promise((resolve, reject) => {

		if (!checkpoint || !Object.keys(checkpoint).length) {
			checkpoint = {
				subjects: [],
				surveys: [],
				agents: []
			};
		}

		signalBatch.forEach(signal => {
			if (signal.type === 'SUBJECT_POSTED' || signal.type === 'SUBJECT_UPDATED') {
				let subject = checkpoint.subjects.find(s => s.id === signal.data.id);
				if (subject) {
					subject.status = signal.data.status;
				} else {
					checkpoint.subjects.push(signal.data);
				}
			}
			else if (signal.type === 'DEVICE_AUTHENTICATED') {
				let agent = checkpoint.agents.find(a => a.id === signal.data.id);
				if (agent) {
					agent.keys = signal.data.keys;
				} else if (signal.data.role !== 'administrator') {
					checkpoint.agents.push(signal.data);
				}
			}
		});

		let amountSubjects = checkpoint.subjects.length;
		let amountSubjectsApproved = checkpoint.subjects.filter(s => s.status === 'approved').length;
		let weeklyAmountSubjects = 0;
		let weeklyAmountSubjectsApproved = 0;
		let subjectsPerDay = [];
		let subjectsApprovedPerDay = [];
		for (let i = 30; i >= 0; i--) {
			let date = moment().subtract(i, 'day');
			let amount = checkpoint.subjects.filter(s => moment(s.createdAt, 'x').isSame(date, 'day')).length;
			subjectsPerDay.push({ x: +date.format('x'), y: amount });
			let amountApproved = checkpoint.subjects.filter(s => moment(s.updatedAt, 'x').isSame(date, 'day') && s.status === 'approved').length;
			subjectsApprovedPerDay.push({ x: +date.format('x'), y: amountApproved });
			if (i <= 7) {
				weeklyAmountSubjects += amount;
				weeklyAmountSubjectsApproved += amountApproved;
			}
		};

		let agentsSubjectsTop = [];
		let agentsSubjectsBottom = [];
		checkpoint.agents.forEach(agent => {
			let amount = checkpoint.subjects.filter(s => s.agent && s.agent.id === agent.id).length;
			agentsSubjectsTop.push({ data: [ agent.keys.name, amount ] });
			agentsSubjectsBottom.push({ data: [ agent.keys.name, amount ] });
		});
		agentsSubjectsBottom.sort((a, b) => {
			if (a.data[1] > b.data[1]) return +1; 
			if (a.data[1] < b.data[1]) return -1;
			return 0; 
		});
		agentsSubjectsTop.sort((a, b) => {
			if (a.data[1] > b.data[1]) return -1; 
			if (a.data[1] < b.data[1]) return +1;
			return 0; 
		});

		let dashlets = [
			{
				// Top 5
				dashletUid: 'frpb7w5',
				teamUid: 'sae2016',
				data: agentsSubjectsTop
			},
			{
				// Bottom 5
				dashletUid: 'ye5jdjx',
				teamUid: 'sae2016',
				data: agentsSubjectsBottom
			},
			{
				// Amount subjects
				dashletUid: 'd2ink1s',
				teamUid: 'sae2016',
				data: { goal: 1000, value: amountSubjects }
			},
			{
				// Amount subjects approved
				dashletUid: 'g9bi51f',
				teamUid: 'sae2016',
				data: { goal: 1000, value: amountSubjectsApproved }
			},
			{
				// Amount weekly subjects
				dashletUid: 'jrhbu05',
				teamUid: 'sae2016',
				data: { goal: 200, value: weeklyAmountSubjects }
			},
			{
				// Subjects per day
				dashletUid: 'vp5hjhh',
				teamUid: 'sae2016',
				data: subjectsPerDay
			},
			{
				// Amount weekly subjects approved
				dashletUid: '07c8vqf',
				teamUid: 'sae2016',
				data: { goal: 200, value: weeklyAmountSubjectsApproved }
			},
			{
				// Subjects approved per day
				dashletUid: '4tw78rn',
				teamUid: 'sae2016',
				data: subjectsApprovedPerDay
			}
		];

		kumeliUpdateDashlets(config, state, dashlets);

		return resolve(checkpoint);

	});

}