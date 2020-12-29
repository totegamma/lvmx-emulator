
interface strDV{
	[Key: string]: string;
}

interface numDV{
	[Key: string]: number;
}

export interface TemplateParameters {
	strdv: strDV;
	numdv: numDV;
}

