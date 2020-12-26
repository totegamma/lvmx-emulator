import React, { useState } from 'react';

import mnemonicjson from './mnemonic.json';


interface MnemonicDict {
	[Key: string]: string;
}

interface StringDV {
	[Key: number]: string;
}

interface NumberDV {
	[Key: number]: number;
}

export function Main() {

	const [bytesInput, setBytesInput] = useState("");

	let mnemonic : MnemonicDict = mnemonicjson;

	let [STATUS, setSTATUS] = useState(0);

	let [PC, setPC] = useState(0);
	let [SP, setSP] = useState(0);
	let [FP, setFP] = useState(0);

	let [OPC_DV, setOPC_DV] = useState<StringDV>({});
	let [ARG_DV, setARG_DV] = useState<NumberDV>({});
	let [ST_DV, setST_DV] = useState<NumberDV>({});

	let [REG_DV, setREG_DV] = useState<NumberDV>({});


	const push = (x : number) => {
		ST_DV[SP] = x;
		setST_DV(ST_DV);
		setSP(++SP);
	}

	const pop = () : number => {
		setSP(--SP);
		return ST_DV[SP]
	}

	const start = () => {
		while (STATUS === 1) {
			tick();
		}
	}

	const load = () => {
		const obj = JSON.parse(bytesInput);
		setOPC_DV(obj['code'].map((e : any) => mnemonic[e['opc']]));
		setARG_DV(obj['code'].map((e : any) => e['arg']));
		setST_DV(obj['data'])
		setFP(obj['data'].length);
		setSP(obj['data'].length);
		setSTATUS(1);
	}

	const tick = () => {
		var opc = OPC_DV[PC]
		var arg = ARG_DV[PC]

		var bufA;
		var bufB;

		switch (opc) {
			case "PUSH":
				push(arg);
				setPC(++PC)
				break;

			case "POP":
				pop();
				setPC(++PC)
				break;

			case "JUMP":
				setPC(PC = arg)
				break;

			case "JIF0":
				bufA = pop();
				if (bufA === 0) {
					setPC(PC = arg);
				} else {
					setPC(++PC);
				}
				break;

			case "FRAME":
				push(FP)
				setFP(SP - 1);
				for (let i = 0; i < arg; i++) {
					push(0);
				}
				setPC(++PC);
				break;

			case "POPR":
				bufA = pop();
				for (let i = 0; i < arg; i++) {
					pop();
				}
				push(bufA);
				setPC(++PC);
				break;

			case "CALL":
				push(++PC);
				setPC(PC = arg);
				break;

			case "RET":
				bufA = pop();
				bufB = SP - FP - 1;
				for (let i = 0; i < bufB; i++) {
					pop();
				}
				setFP(FP = pop());
				setPC(PC = pop());

				if (PC === 0) {
					pop();
					push(0);
					push(0);
					setSTATUS(STATUS = 0);
				} else {
					push(bufA);
				}

				break;

			case "PULP":
				push(FP + arg + 1);
				setPC(++PC);
				break;

			case "PUAP":
				push(FP - arg - 2);
				setPC(++PC);
				break;

			case "LOADG":
				push(ST_DV[arg])
				setPC(++PC);
				break;

			case "LOADL":
				push(ST_DV[FP + arg + 1])
				setPC(++PC);
				break;

			case "LOADA":
				push(ST_DV[FP - arg - 2])
				setPC(++PC);
				break;

			case "LOADR":
				push(REG_DV[arg])
				setPC(++PC);
				break;

			case "LOADP":
				bufA = pop();
				push(ST_DV[bufA]);
				setPC(++PC);
				break;

			case "STOREG":
				ST_DV[arg] = pop();
				setST_DV(ST_DV);
				setPC(++PC);
				break;

			case "STOREL":
				ST_DV[FP + arg + 1] = pop();
				setST_DV(ST_DV);
				setPC(++PC);
				break;

			case "STOREA":
				ST_DV[FP - arg - 2] = pop();
				setST_DV(ST_DV);
				setPC(++PC);
				break;

			case "STORER":
				REG_DV[arg] = pop();
				setREG_DV(REG_DV);
				setPC(++PC);
				break;

			case "STOREP":
				bufA = pop();
				bufB = pop();
				ST_DV[bufA] = bufB;
				setST_DV(ST_DV);
				setPC(++PC);
				break;

			case "SIN":
				bufA = pop();
				push(Math.sin(bufA));
				setPC(++PC);
				break;

			case "COS":
				bufA = pop();
				push(Math.cos(bufA));
				setPC(++PC);
				break;

			case "TAN":
				setSTATUS(0);
				break;
			case "ASIN":
				setSTATUS(0);
				break;
			case "ACOS":
				setSTATUS(0);
				break;
			case "ATAN":
				setSTATUS(0);
				break;
			case "ATAN2":
				setSTATUS(0);
				break;
			case "ROOT":
				setSTATUS(0);
				break;
			case "POW":
				setSTATUS(0);
				break;
			case "LOG":
				setSTATUS(0);
				break;

			case "ADDU":
			case "ADDI":
			case "ADDF":
				bufA = pop();
				bufB = pop();
				push(bufA + bufB);
				setPC(++PC);
				break;

			case "SUBU":
			case "SUBI":
			case "SUBF":
				bufA = pop();
				bufB = pop();
				push(bufA - bufB);
				setPC(++PC);
				break;

			case "MULU":
			case "MULI":
			case "MULF":
				bufA = pop();
				bufB = pop();
				push(bufA * bufB);
				setPC(++PC);
				break;

			case "DIVU":
			case "DIVI":
			case "DIVF":
				bufA = pop();
				bufB = pop();
				push(bufA / bufB);
				setPC(++PC);
				break;

			case "MODU":
			case "MODI":
			case "MODF":
				bufA = pop();
				bufB = pop();
				push(bufA % bufB);
				setPC(++PC);
				break;

			case "LTU":
			case "LTI":
			case "LTF":
				bufA = pop();
				bufB = pop();
				push(bufA < bufB ? 1 : 0);
				setPC(++PC);
				break;

			case "LTEU":
			case "LTEI":
			case "LTEF":
				bufA = pop();
				bufB = pop();
				push(bufA < bufB ? 1 : 0);
				setPC(++PC);
				break;

			case "GTU":
			case "GTI":
			case "GTF":
				bufA = pop();
				bufB = pop();
				push(bufA < bufB ? 1 : 0);
				setPC(++PC);
				break;

			case "GTEU":
			case "GTEI":
			case "GTEF":
				bufA = pop();
				bufB = pop();
				push(bufA < bufB ? 1 : 0);
				setPC(++PC);
				break;

			case "EQU":
			case "EQI":
			case "EQF":
				bufA = pop();
				bufB = pop();
				push(bufA < bufB ? 1 : 0);
				setPC(++PC);
				break;

			case "NEQU":
			case "NEQI":
			case "NEQF":
				bufA = pop();
				bufB = pop();
				push(bufA < bufB ? 1 : 0);
				setPC(++PC);
				break;


			case "UTOI":
				break;
			case "UTOF":
				break;
			case "ITOF":
				break;
			case "ITOU":
				break;
			case "FTOU":
				break;
			case "FTOI":
				break;
			default:
				setSTATUS(0);
				break;

		}
		console.log(opc + ':' + arg);
		console.log(ST_DV);

	}


	return (
		<div className="body">
			<ul>
				<li>PC: {PC}</li>
				<li>SP: {SP}</li>
				<li>FP: {FP}</li>
			</ul>
			<div>status: {STATUS}</div>
			<textarea value={bytesInput} onChange={(e) => setBytesInput(e.target.value)} />
			<button onClick={load}>load</button>
			<button onClick={tick}>tick</button>
			<button onClick={start}>start</button>

		</div>
	);
};


