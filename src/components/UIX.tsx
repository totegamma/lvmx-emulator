import React from 'react';

export interface UIX_RENDER_PROP {
	onchange: number;
	root: UIX;
}

export function UIX_RENDERER(prop: UIX_RENDER_PROP) {
	return (
		<div>
			{prop.root.render()}
		</div>
	)
}

export class UIX {

	strdv: { [key: string]: string; } = {};
	numdv: { [key: string]: number; } = {};

	childs: UIX[] = [];

	render() {
		return (
			<div>
				{this.childs.map((elem, index) => <div key={index}>{elem.render()}</div>)}
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
		this.strdv["text"] = "testtext"
	}

	render() {
		return (
			<div>
				<div>{this.strdv["text"]}</div>
			</div>
		)
	}

}

export class UIX_IMAGE extends UIX {

	constructor() {
		super()
		this.strdv["text"] = "testtext"
	}

	render() {
		return (
			<div>
				<div>{this.strdv["text"]}</div>
			</div>
		)
	}

}

