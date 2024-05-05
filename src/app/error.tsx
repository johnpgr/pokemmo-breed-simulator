"use client"
import React from 'react'

export default function Error(props: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    React.useEffect(() => {
        console.error(props.error)

    }, [props.error])
    return (
        <div>
            <h2>Something went wrong!</h2>
            <button>
                Try again
            </button>
        </div>)
}

