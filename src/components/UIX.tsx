import React from 'react';

export interface UIX_RENDER_PROP {
	onchange: number;
	root: UIX;
}

export function UIX_RENDERER(prop: UIX_RENDER_PROP) {
	return (
		<>
			{prop.root.render()}
		</>
	)
}

export class UIX {

	strdv: { [key: string]: string; } = {};
	numdv: { [key: string]: number; } = {};

	childs: UIX[] = [];

	style = {
		width: '100%',
		height: '100%',
	}

	render() {
		return (
			<div style={this.style}>
				{this.childs.map((elem, index) => <div className="UIempty" key={index}>{elem.render()}</div>)}
			</div>
		)
	}

	setStrDV(key: string, value: string) {
		this.strdv[key] = value;
	}

	setNumDV(key: string, value: number) {
		this.numdv[key] = value;
	}

	getStrDV(key: string) {
		return this.strdv[key];
	}

	getNumDV(key: string) {
		return this.numdv[key];
	}


	addChild(child: UIX) {
		this.childs.push(child);
	}

}

export class UIX_EMPTY extends UIX {

	constructor() {
		super()
		this.numdv["Amx"] = 0;
		this.numdv["Amy"] = 0;
		this.numdv["AMx"] = 1;
		this.numdv["AMy"] = 1;
		this.numdv["Omx"] = 0;
		this.numdv["Omy"] = 0;
		this.numdv["OMx"] = 0;
		this.numdv["OMy"] = 0;
	};

	render() {
		return (
			<div style={{position: 'absolute',
					width: `calc(100% - ${this.numdv["Omx"] + this.numdv["OMx"]}px - ${(this.numdv["Amx"] + (1-this.numdv["AMx"])) * 100}%)`,
					height: `calc(100% - ${this.numdv["Omy"] + this.numdv["OMy"]}px - ${(this.numdv["Amy"] + (1-this.numdv["AMy"])) * 100}%)`,
					left: `calc(${this.numdv["Omx"]}px + ${this.numdv["Amx"] * 100}%)`,
					bottom: `calc(${this.numdv["Omy"]}px + ${this.numdv["Amy"] * 100}%)`
			}}>
				{this.childs.map((elem, index) => <div className="UIempty" key={index}>{elem.render()}</div>)}
			</div>
		)
	}

}



export class UIX_TEXT extends UIX {

	constructor() {
		super()
		this.strdv["content"] = ""
	}

	style = {
		width: '100%',
		height: '100%',
	}

	render() {
		return (
			<div style={this.style}>
				{this.strdv["content"]}
			</div>
		)
	}

}

export class UIX_IMAGE extends UIX {

	constructor() {
		super()
		this.numdv["R"] = 1;
		this.numdv["G"] = 1;
		this.numdv["B"] = 1;
		this.numdv["A"] = 1;
	};

	style = {
		width: '100%',
		height: '100%'
	};

	render() {
		return (
			<div style={{...this.style, backgroundColor: `rgba(${this.numdv["R"] * 255},
					${this.numdv["G"] * 255}, ${this.numdv["B"] * 255}, ${this.numdv["A"] * 255})`}}>
				{this.childs.map((elem, index) => <div className="UIempty" key={index}>{elem.render()}</div>)}
			</div>
		)
	}

}

export class UIX_BUTTON extends UIX {

	constructor() {
		super()
		this.numdv["pressed"] = 0;
	}

	style = {
		width: '100%',
		height: '100%',
	}

	click = () => {
		this.numdv["pressed"] = 1;
	}

	render() {
		return (
			<div style={this.style} onClick={this.click}>
				{this.childs.map((elem, index) => <div className="UIempty" key={index}>{elem.render()}</div>)}
			</div>
		)
	}

}

