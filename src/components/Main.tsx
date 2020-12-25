import React, { useState } from 'react';

export function Main() {

	const [bytesInput, setBytesInput] = useState("");

	const [PC, setPC] = useState(0);
	const [SP, setSP] = useState(0);
	const [FP, setFP] = useState(0);

	var opc: { [name: number]: string } = {};
	var arg: { [name: number]: number } = {};
	var st: { [name: number]: number } = {};

	const load = () => {
		const obj = JSON.parse(bytesInput);
		obj['code'].map((e : any) => e['Inst'])
					.forEach((e : any, i : any) => {opc[i] = e['opc']; arg[i] = e['arg']});
		obj['data'].forEach((e: any, i: any) => st[i] = e);
		setSP(obj['data'].length);

		console.log(opc)
		console.log(arg)
	}

	return (
		<div className="body">
			<ul>
				<li>PC: {PC}</li>
				<li>SP: {SP}</li>
				<li>FP: {FP}</li>
			</ul>
			<textarea value={bytesInput} onChange={(e) => setBytesInput(e.target.value)} />
			<button onClick={load}>
				load
			</button>
		</div>
	);
};


