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

	p?: UIX = undefined;

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
		child.p = this;
		this.childs.push(child);
	}

	DUP(p?: UIX, instance?: UIX) : UIX {
		if (!instance) {
			instance = new UIX();
		}
		if (!p) {
			instance.p = this.p;
		} else {
			instance.p = p;
		}
		if (instance.p) instance.p.addChild(instance);
		instance.strdv = Object.assign({}, this.strdv);
		instance.numdv = Object.assign({}, this.numdv);
		instance.childs = this.childs.map(x => x.DUP(instance));
		return instance;
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

	DUP(p?: UIX, instance?: UIX) : UIX {
		if (!instance) instance = new UIX_EMPTY();
		return super.DUP(p, instance);
	}

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
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}

	DUP(p?: UIX, instance?: UIX) : UIX {
		if (!instance) instance = new UIX_TEXT();
		return super.DUP(p, instance);
	}

	render() {
		return (
			<div style={this.style}>
				<div>{this.strdv["content"]}</div>
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

	DUP(p?: UIX, instance?: UIX) : UIX {
		if (!instance) instance = new UIX_IMAGE();
		return super.DUP(p, instance);
	}

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

	DUP(p?: UIX, instance?: UIX) : UIX {
		if (!instance) instance = new UIX_BUTTON();
		return super.DUP(p, instance);
	}

	render() {
		return (
			<div style={this.style} onClick={this.click}>
				{this.childs.map((elem, index) => <div className="UIempty" key={index}>{elem.render()}</div>)}
			</div>
		)
	}

}

export class UIX_VERTICAL_LAYOUT extends UIX {

	/*
	constructor() {
		super()
	}
	 */

	style = {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column' as 'column',
	}

	DUP(p?: UIX, instance?: UIX) : UIX {
		if (!instance) instance = new UIX_VERTICAL_LAYOUT();
		return super.DUP(p, instance);
	}

	render() {
		return (
			<div style={this.style}>
				{this.childs.map((elem, index) => <div className="UIempty" key={index}>{elem.render()}</div>)}
			</div>
		)
	}

}

export class UIX_HORIZONTAL_LAYOUT extends UIX {

	/*
	constructor() {
		super()
	}
	 */

	style = {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'row' as 'row',
	}

	DUP(p?: UIX, instance?: UIX) : UIX {
		if (!instance) instance = new UIX_HORIZONTAL_LAYOUT();
		return super.DUP(p, instance);
	}

	render() {
		return (
			<div style={this.style}>
				{this.childs.map((elem, index) => <div className="UIempty" key={index}>{elem.render()}</div>)}
			</div>
		)
	}

}

