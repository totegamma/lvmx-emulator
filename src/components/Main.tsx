import React, { useState } from 'react';

export function Main() {

	const [bytesInput, setBytesInput] = useState("");

	const start = () => {
		console.log(bytesInput)
	}

	return (
		<div className="body">
			<textarea value={bytesInput} onChange={(e) => setBytesInput(e.target.value)} />
			<button onClick={start}>
				start
			</button>
		</div>
	);
};


