import * as preact from 'preact'
import * as hooks from 'preact/hooks'

const Thing = () => {
    const [message, setMessage] = hooks.useState('oNo')

    return preact.h(
        'div',
        { onClick: () => setMessage(message + "!") },
        message
    )
}

preact.render(
    preact.h(Thing),
    document.getElementById('app')
)