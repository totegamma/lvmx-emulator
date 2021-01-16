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


	addChild(child: UIX) {
		this.childs.push(child);
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
			<div style={{...this.style, backgroundColor: `rgba(${this.numdv["R"] * 255}, ${this.numdv["G"] * 255}, ${this.numdv["B"] * 255}, ${this.numdv["A"] * 255})`}}>
				{this.childs.map((elem, index) => <div className="UIempty" key={index}>{elem.render()}</div>)}
			</div>
		)
	}

}

