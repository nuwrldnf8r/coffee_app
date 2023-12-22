import React from 'react'

const Button = (props) => {
    const classEnabled = "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    const classDisabled = "cursor-not-allowed text-gray-500 bg-white border border-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    return (
        <button type="button" class={props.disabled?classDisabled:classEnabled} disabled={props.disabled} onClick={props.onClick}>{props.children}</button>
    )
}

export default Button