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

	const [PC, setPC] = useState(0);
	const [SP, setSP] = useState(0);
	const [FP, setFP] = useState(0);

	const [OPC_DV, setOPC_DV] = useState<StringDV>({});
	const [ARG_DV, setARG_DV] = useState<NumberDV>({});
	const [ST_DV, setST_DV] = useState<NumberDV>({});


	const push = (x : number) => {
		ST_DV[SP] = x;
		setST_DV(ST_DV);
		setSP(SP + 1);
	}

	const pop = () : number => {
		setSP(SP - 1);
		return ST_DV[SP - 1]
	}

	const load = () => {
		const obj = JSON.parse(bytesInput);
		setOPC_DV(obj['code'].map((e : any) => mnemonic[e['Inst']['opc']]));
		setARG_DV(obj['code'].map((e : any) => e['Inst']['arg']));
		setST_DV(obj['data'])
		setSP(obj['data'].length);
	}

	const tick = () => {
		var opc = OPC_DV[PC]
		var arg = ARG_DV[PC]

		switch (opc) {
			case "PUSH":
				push(arg);
				break;
			case "POP":
				pop();
				break;
			case "JUMP":
			break;
			case "JIF0":
			break;
			case "FRAME":
			break;
			case "POPR":
			break;
			case "CALL":
			break;
			case "RET":
			break;
			case "PULP":
			break;
			case "PUAP":
			break;

			case "LOADG":
			break;
			case "LOADL":
			break;
			case "LOADA":
			break;
			case "LOADR":
			break;
			case "LOADP":
			break;
			case "STOREG":
			break;
			case "STOREL":
			break;
			case "STOREA":
			break;
			case "STORER":
			break;
			case "STOREP":
			break;

			case "SIN":
			break;
			case "COS":
			break;
			case "TAN":
			break;
			case "ASIN":
			break;
			case "ACOS":
			break;
			case "ATAN":
			break;
			case "ATAN2":
			break;
			case "ROOT":
			break;
			case "POW":
			break;
			case "LOG":
			break;

			case "ADDU":
			break;
			case "SUBU":
			break;
			case "MULU":
			break;
			case "DIVU":
			break;
			case "MODU":
			break;
			case "LTU":
			break;
			case "LTEU":
			break;
			case "GTU":
			break;
			case "GTEU":
			break;
			case "EQU":
			break;
			case "NEQU":
			break;
			case "UTOI":
			break;
			case "UTOF":
			break;

			case "ADDI":
			break;
			case "SUBI":
			break;
			case "MULI":
			break;
			case "DIVI":
			break;
			case "MODI":
			break;
			case "LTI":
			break;
			case "LTEI":
			break;
			case "GTI":
			break;
			case "GTEI":
			break;
			case "EQI":
			break;
			case "NEQI":
			break;
			case "ITOF":
			break;
			case "ITOU":
			break;

			case "ADDF":
			break;
			case "SUBF":
			break;
			case "MULF":
			break;
			case "DIVF":
			break;
			case "MODF":
			break;
			case "LTF":
			break;
			case "LTEF":
			break;
			case "GTF":
			break;
			case "GTEF":
			break;
			case "EQF":
			break;
			case "NEQF":
			break;
			case "FTOU":
			break;
			case "FTOI":
			break;

		}
		console.log(opc + ':' + arg)

		setPC(PC + 1)
	}


	return (
		<div className="body">
			<ul>
				<li>PC: {PC}</li>
				<li>SP: {SP}</li>
				<li>FP: {FP}</li>
			</ul>
			<textarea value={bytesInput} onChange={(e) => setBytesInput(e.target.value)} />
			<button onClick={load}>load</button>
			<button onClick={tick}>tick</button>

		</div>
	);
};


