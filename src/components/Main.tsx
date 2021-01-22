import React, { useState } from 'react';
import { Box, Button, ButtonGroup, List, ListItem, ListItemText, TextField, Input } from '@material-ui/core';
import { UIX_RENDER_PROP, UIX_RENDERER, UIX, UIX_EMPTY, UIX_TEXT, UIX_IMAGE, UIX_BUTTON, UIX_VERTICAL_LAYOUT, UIX_HORIZONTAL_LAYOUT } from './UIX';

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

	let fileReader : any;

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
		++SP;
	}

	const pop = () : number => {
		--SP;
		return ST_DV[SP]
	}

	const start = () => {
		console.log("start!");
		let timerId = setInterval(tick, 20);
		setTIMER(TIMER = timerId);
	}

	const load = () => {
		const obj = JSON.parse(fileReader.result);
		setOPC_DV(obj['code'].map((e : any) => e['opc']));
		setARG_DV(obj['code'].map((e : any) => e['arg']));
		setST_DV(obj['data'])
		setFP(obj['data'].length);
		setSP(obj['data'].length);
		setSTATUS(1);

		SLOT_DV[Object.keys(SLOT_DV).length] = UIXProp.root;
		SLOT_DV[Object.keys(SLOT_DV).length] = UIXProp.root;
		SLOT_DV[Object.keys(SLOT_DV).length] = UIXProp.root;
		setSLOT_DV(SLOT_DV);
	}

	const readNullTermStr = (addr : number) : string => {
		var buff = "";
		var tmp = 0;
		while ((tmp = ST_DV[addr++]) !== 0) {
			buff += String.fromCharCode(Math.floor(tmp));
		}
		return buff;
	}

	const writeNullTermStr = (addr : number, str : string) => {
		for (var i = 0; i < str.length; i++) {
			ST_DV[i + addr] = str.charCodeAt(i);
		}
		ST_DV[i+str.length] = 0;
	}

	const tick = () => {
		for (var i = 0; i < 15; i++) {
			if (STATUS !== 0) clock();
		}
		setST_DV(ST_DV);
		setREG_DV(REG_DV);
		setSLOT_DV(SLOT_DV);
		setPC(PC);
		setSP(SP);
		setFP(FP);
		setLog(Log);
		setUIXProp(UIXProp);
		setCLOCK(CLOCK);
	}

	const clock = () => {
		var opc = OPC_DV[PC]
		var arg = ARG_DV[PC]

		var bufA;
		var bufB;
		var bufC;

		switch (opc) {
			case "PUSH":
				push(arg);
				++PC
				break;

			case "POP":
				pop();
				++PC
				break;

			case "JUMP":
				PC = arg
				break;

			case "JIF0":
				bufA = pop();
				if (bufA === 0) {
					PC = arg;
				} else {
					++PC;
				}
				break;

			case "FRAME":
				push(FP)
				FP = (SP - 1);
				for (let i = 0; i < arg; i++) {
					push(0);
				}
				++PC;
				break;

			case "POPR":
				bufA = pop();
				for (let i = 0; i < arg; i++) {
					pop();
				}
				push(bufA);
				++PC;
				break;

			case "CALL":
				push(++PC);
				PC = arg;
				break;

			case "RET":
				bufA = pop();
				bufB = SP - FP - 1;
				for (let i = 0; i < bufB; i++) {
					pop();
				}
				FP = pop();
				PC = pop();

				if (PC === 0) {
					pop();
					push(0);
					push(0);
					setSTATUS(STATUS = 0);
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
				++PC;
				break;

			case "PUAP":
				push(FP - arg - 2);
				++PC;
				break;

			case "DUP":
				bufA = pop();
				push(bufA);
				push(bufA);
				++PC;
				break;

			case "PRINT":
				bufA = pop();
				let buff = readNullTermStr(bufA);
				Log += buff;
				++PC;
				break;

			case "LOADG":
				push(ST_DV[arg])
				++PC;
				break;

			case "LOADL":
				push(ST_DV[FP + arg + 1])
				++PC;
				break;

			case "LOADA":
				push(ST_DV[FP - arg - 2])
				++PC;
				break;

			case "LOADR":
				push(REG_DV[arg])
				++PC;
				break;

			case "LOADP":
				bufA = pop();
				push(ST_DV[bufA]);
				++PC;
				break;

			case "LOADD":
				bufA = pop(); // slot
				bufB = pop(); // key
				bufC = readNullTermStr(bufB); // keystring
				switch (arg) {
					case 0:
						push(Math.floor(SLOT_DV[bufA].getNumDV(bufC)));
						break;
					case 1:
						push(SLOT_DV[bufA].getNumDV(bufC));
					break;
					case 2:
						let dest = pop(); // dest
						let str = SLOT_DV[bufA].getStrDV(bufC);
						writeNullTermStr(dest, str);
					break;
					default:
						setSTATUS(STATUS = 0);
					break;
				}
				UIXProp.onchange = Math.random();
				++PC;
				break;

			case "STOREG":
				ST_DV[arg] = pop();
				++PC;
				break;

			case "STOREL":
				ST_DV[FP + arg + 1] = pop();
				++PC;
				break;

			case "STOREA":
				ST_DV[FP - arg - 2] = pop();
				++PC;
				break;

			case "STORER":
				REG_DV[arg] = pop();
				++PC;
				break;

			case "STOREP":
				bufA = pop();
				bufB = pop();
				ST_DV[bufA] = bufB;
				++PC;
				break;

			case "STORED":
				bufA = pop(); // slot
				bufB = pop(); // key
				var data = pop(); // content
				let key = readNullTermStr(bufB);
				switch (arg) {
					case 0:
					case 1:
						SLOT_DV[bufA].setNumDV(key, data);
					break;
					case 2:
						let str = readNullTermStr(data);
						SLOT_DV[bufA].setStrDV(key, str);
					break;
					default:
						setSTATUS(STATUS = 0);
					break;
				}
				UIXProp.onchange = Math.random();
				++PC;
				break;

			case "SIN":
				bufA = pop();
				push(Math.sin(bufA));
				++PC;
				break;

			case "COS":
				bufA = pop();
				push(Math.cos(bufA));
				++PC;
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

			case "INV":
				bufA = pop();
				push(bufA ? 0 : 1);
				++PC;
				break;

			case "INC":
				bufA = pop();
				push(bufA + 1);
				++PC;
				break;

			case "DEC":
				bufA = pop();
				push(bufA - 1);
				++PC;
				break;

			case "ADDI":
			case "ADDF":
				bufA = pop();
				bufB = pop();
				push(bufA + bufB);
				++PC;
				break;

			case "SUBI":
			case "SUBF":
				bufA = pop();
				bufB = pop();
				push(bufA - bufB);
				++PC;
				break;

			case "MULI":
			case "MULF":
				bufA = pop();
				bufB = pop();
				push(bufA * bufB);
				++PC;
				break;

			case "DIVI":
			case "DIVF":
				bufA = pop();
				bufB = pop();
				push(bufA / bufB);
				++PC;
				break;

			case "MODI":
			case "MODF":
				bufA = pop();
				bufB = pop();
				push(bufA % bufB);
				++PC;
				break;

			case "AND":
				bufA = pop();
				bufB = pop();
				push((bufA===1) && (bufB===1) ? 1 : 0);
				++PC;
				break;

			case "OR":
				bufA = pop();
				bufB = pop();
				push((bufA===1) || (bufB===1) ? 1 : 0);
				++PC;
				break;


			case "LTI":
			case "LTF":
				bufA = pop();
				bufB = pop();
				push(bufA < bufB ? 1 : 0);
				++PC;
				break;

			case "LTEI":
			case "LTEF":
				bufA = pop();
				bufB = pop();
				push(bufA <= bufB ? 1 : 0);
				++PC;
				break;

			case "GTI":
			case "GTF":
				bufA = pop();
				bufB = pop();
				push(bufA > bufB ? 1 : 0);
				++PC;
				break;

			case "GTEI":
			case "GTEF":
				bufA = pop();
				bufB = pop();
				push(bufA >= bufB ? 1 : 0);
				++PC;
				break;

			case "EQI":
			case "EQF":
				bufA = pop();
				bufB = pop();
				push(bufA === bufB ? 1 : 0);
				++PC;
				break;

			case "NEQI":
			case "NEQF":
				bufA = pop();
				bufB = pop();
				push(bufA !== bufB ? 1 : 0);
				++PC;
				break;


			case "ITOF":
				++PC;
				break;

			case "FTOI":
				bufA = pop();
				push(Math.floor(bufA));
				++PC;
				break;

			case "SLEN":
				bufA = pop();
				bufC = readNullTermStr(bufA);
				push(bufC.length);
				++PC;
				break;

			case "STOI":
				bufA = pop();
				bufC = readNullTermStr(bufA);
				push(parseInt(bufC));
				++PC;
				break;

			case "STOF":
				bufA = pop();
				bufC = readNullTermStr(bufA);
				push(parseFloat(bufC));
				++PC;
				break;

			case "SCMP":
				break;

			case "ITOS":
				bufA = pop(); // input
				bufB = pop(); // dest
				bufC = String(bufA);
				writeNullTermStr(bufB, bufC);
				++PC;
				break;

			case "FOTS":
				bufA = pop(); // input
				bufB = pop(); // dest
				bufC = String(bufA);
				writeNullTermStr(bufB, bufC);
				++PC;
				break;

			case "CSFT":
				bufA = pop();
				let name = readNullTermStr(bufA);
				let newID = Object.keys(SLOT_DV).length;
				switch (name){
					case "UIXempty":
						SLOT_DV[newID] = new UIX_EMPTY();
						break;
					case "UIXtext":
						SLOT_DV[newID] = new UIX_TEXT();
						break;
					case "UIXimage":
						SLOT_DV[newID] = new UIX_IMAGE();
						break;
					case "UIXbutton":
						SLOT_DV[newID] = new UIX_BUTTON();
						break;
					case "UIXlayoutV":
						SLOT_DV[newID] = new UIX_VERTICAL_LAYOUT();
						break;
					case "UIXlayoutH":
						SLOT_DV[newID] = new UIX_HORIZONTAL_LAYOUT();
						break;
					default:
						Log += "unknown template error!";
						newID = -1;
						break;
					}
				push(newID);
				++PC;
				break;

			case "SSPA":
				bufA = pop();
				bufB = pop();
				SLOT_DV[bufB].addChild(SLOT_DV[bufA])
				UIXProp.onchange = Math.random();
				++PC;
				break;

			case "DUPS":
				bufA = pop();
				bufB = Object.keys(SLOT_DV).length;
				SLOT_DV[bufB] = SLOT_DV[bufA].DUP();
				push(bufB);
				++PC;
				break;

			case "DS":
				break;


			default:
				console.log(opc);
				setSTATUS(0);
				break;

		}
		//console.log(opc + ':' + arg);
		//console.log(ST_DV);
		++CLOCK;
	}

	const handleFileChosen = (file: any) => {
		fileReader = new FileReader();
		fileReader.readAsText(file);
	};

	return (
		<div id="body">

			<Box id="LoaderView">
				実行ファイル(Json)
				<Input type="file" id="file" onChange={(e: any)=>handleFileChosen(e.target.files[0])}/>
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
					{Object.keys(ST_DV).filter((elem: any, index: number) => index < SP).map((key: any) => <ListItem key={key} divider><ListItemText primary={String(key) + ": " + String(ST_DV[key])}/></ListItem>)}
					<List>
					</List>
				</Box>
			</Box>

		</div>
	);
};


