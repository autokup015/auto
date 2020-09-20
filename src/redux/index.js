import { createStore } from 'redux'

const initValue = {
    userId: ''
}

const reducer = (state = '', action) => {
    switch (action.type) {
        case 'SAVE_ID':
            state = action.userId
            break;
        case 'DELETE_ID':
            state = ''
            break;
        default:
            break;
    }
    return state
}

const store = createStore(reducer)

// store.dispatch({
//     type: 'SAVE_ID',
//     userId: '1234'
// })

export default store