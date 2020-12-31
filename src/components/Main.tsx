import React, { useState } from 'react';
import { Box, Button, ButtonGroup, List, ListItem, ListItemText, TextField } from '@material-ui/core';
import { UIX_RENDER_PROP, UIX_RENDERER, UIX, UIX_TEXT } from './UIX';

interface StringDV {
	[Key: number]: string;
}

interface NumberDV {
	[Key: number]: number;
}

interface SlotDV {
	[Key: number]: UIX;
}

export function Main() {

	const [bytesInput, setBytesInput] = useState("");

	let [STATUS, setSTATUS] = useState(0);

	let [CLOCK, setCLOCK] = useState(0);
	let [PC, setPC] = useState(0);
	let [SP, setSP] = useState(0);
	let [FP, setFP] = useState(0);

	let [Log, setLog] = useState("");

	let [OPC_DV, setOPC_DV] = useState<StringDV>({});
	let [ARG_DV, setARG_DV] = useState<NumberDV>({});
	let [ST_DV, setST_DV] = useState<NumberDV>({});

	let [SLOT_DV, setSLOT_DV] = useState<SlotDV>({});

	let [REG_DV, setREG_DV] = useState<NumberDV>({});
	let [TIMER, setTIMER] = useState<NodeJS.Timer>();
	let [UIXProp, setUIXProp] = useState<UIX_RENDER_PROP>({
		onchange: 0,
		root: new UIX()
	});

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
		console.log("start!");
		let timerId = setInterval(tick, 100);
		setTIMER(TIMER = timerId);
	}

	const load = () => {
		const obj = JSON.parse(bytesInput);
		setOPC_DV(obj['code'].map((e : any) => e['opc']));
		setARG_DV(obj['code'].map((e : any) => e['arg']));
		setST_DV(obj['data'])
		setFP(obj['data'].length);
		setSP(obj['data'].length);
		setSTATUS(1);

		SLOT_DV[Object.keys(SLOT_DV).length] = UIXProp.root;
		SLOT_DV[Object.keys(SLOT_DV).length] = UIXProp.root;
		setSLOT_DV(SLOT_DV);
	}

	const readNullTermStr = (addr : number) : string => {
		var buff = "";
		var tmp = 0;
		while ((tmp = ST_DV[addr++]) !== 0) {
			buff += String.fromCharCode(tmp);
		}

		return buff;
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
				setFP(FP = (SP - 1));
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
					console.log(TIMER);
					if (TIMER) {
						console.log("stop.");
						clearInterval(TIMER);
						setTIMER(TIMER);
					}
					
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

			case "DUP":
				bufA = pop();
				push(bufA);
				push(bufA);
				setPC(++PC);
				break;

			case "PRINT":
				bufA = pop();
				let buff = readNullTermStr(bufA);
				setLog(Log += buff);
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
				setSTATUS(STATUS = 0);
				break;
			case "ASIN":
				setSTATUS(STATUS = 0);
				break;
			case "ACOS":
				setSTATUS(STATUS = 0);
				break;
			case "ATAN":
				setSTATUS(STATUS = 0);
				break;
			case "ATAN2":
				setSTATUS(STATUS = 0);
				break;
			case "ROOT":
				setSTATUS(STATUS = 0);
				break;
			case "POW":
				setSTATUS(STATUS = 0);
				break;
			case "LOG":
				setSTATUS(STATUS = 0);
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
				setPC(++PC);
				break;

			case "UTOF":
				setPC(++PC);
				break;

			case "ITOF":
				setPC(++PC);
				break;

			case "ITOU":
				bufA = pop();
				push(Math.abs(bufA));
				setPC(++PC);
				break;

			case "FTOU":
				bufA = pop();
				push(Math.floor(bufA));
				setPC(++PC);
				break;

			case "FTOI":
				bufA = pop();
				push(Math.floor(bufA));
				setPC(++PC);
				break;

			case "REDDU":
				break;

			case "REDDI":
				break;

			case "REDDF":
				break;

			case "REDDS":
				break;

			case "WRIDU":
				break;

			case "WRIDI":
				break;

			case "WRIDF":
				break;

			case "WRIDS":
				bufA = pop(); // slot
				bufB = pop(); // key
				let bufC = pop(); // content
				let key = readNullTermStr(bufB);
				let data = readNullTermStr(bufC);
				SLOT_DV[bufA].setStrDV(key, data);
				UIXProp.onchange = Math.random();
				setUIXProp(UIXProp);
				setPC(++PC);
				break;

			case "CSFT":
				bufA = pop();
				let name = readNullTermStr(bufA);
				let newID = Object.keys(SLOT_DV).length
				switch (name){
					case "uix":
						SLOT_DV[newID] = new UIX();
						break;

					case "uix_text":
						SLOT_DV[newID] = new UIX_TEXT();
						break;
					default:
						setLog(Log += "unknown template error!");
						newID = -1;
						break;
					}
				setSLOT_DV(SLOT_DV);
				push(newID);
				setPC(++PC);
				break;

			case "SSPA":
				bufA = pop();
				bufB = pop();
				SLOT_DV[bufB].addChild(SLOT_DV[bufA])
				UIXProp.onchange = Math.random();
				setUIXProp(UIXProp);
				setPC(++PC);
				break;

			case "DS":
				break;


			default:
				setSTATUS(0);
				break;

		}
		console.log(opc + ':' + arg);
		console.log(ST_DV);
		setCLOCK(++CLOCK);
	}

	return (
		<div id="body">

			<Box id="LoaderView">
				<TextField label="input" variant="outlined" multiline={true} value={bytesInput} onChange={(e) => setBytesInput(e.target.value)}/>
				<Button id="loadbutton" variant="contained" color="primary" onClick={load}>load</Button>
			</Box>

			<Box id="EmulatorView">
				<Box id="preview">
					<Box id="UIXRoot">
						<UIX_RENDERER {...UIXProp}/>
					</Box>
				</Box>
				<Box id="log">
					{Log}
				</Box>
			</Box>

			<Box id="ContextView">
				<Box>
					<span>PC: {PC}</span>
					<span>SP: {SP}</span>
					<span>FP: {FP}</span>
					<span>CLK: {CLOCK}</span>
					<span>status: {STATUS}</span>
				</Box>
				<Box>
					<ButtonGroup disabled={STATUS===0}>
						<Button variant="contained" color="primary" onClick={tick}>tick</Button>
						<Button variant="contained" color="primary" onClick={start}>start</Button>
					</ButtonGroup>
				</Box>
				<Box>
					{Object.keys(ST_DV).map((key: any) => <ListItem key={key} divider><ListItemText primary={String(key) + ": " + String(ST_DV[key])}/></ListItem>)}
					<List>
					</List>
				</Box>
			</Box>

		</div>
	);
};


