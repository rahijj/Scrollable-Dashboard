import React from 'react'

type Props = {
	onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const GreenButton: React.FC<Props> = ({ onClick, children }) => {

	return <Button onClick={onClick} className="
		bg-green-500 
		hover:bg-green-700 
		text-white 
		focus:ring-green-400">
		{children}
	</Button>
}

export const RedButton: React.FC<Props> = ({ onClick, children }) => {

	return <Button onClick={onClick} className="
		bg-red-500 
		hover:bg-red-700 
		text-white 
		focus:ring-red-400">
		{children}
	</Button>
}

export const Button: React.FC<Props & { className: string }> = ({ onClick, children, className }) => {

	return <button onClick={onClick} className={`
		${className}
		py-2 
		px-4 
		font-semibold 
		rounded-lg shadow-md 
		focus:outline-none focus:ring-2 focus:ring-opacity-75
		`}>
		{children}
	</button>
}

