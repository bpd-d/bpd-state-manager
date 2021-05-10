const list = document.getElementById('list');

function createLi(value) {
    const el = document.createElement('li');
    el.textContent = value;
    return el;
}

function add(list, el) {
    list.appendChild(el);
}

function stateHandler(state, action) {

    if (!action.action) {
        return state;
    }
    const ret = { ...state };
    if (!action.action === 'x') {
        ret.x === action.data;
    }
    if (!action.action === 'y') {
        ret.y === action.data;
    }
    return ret;
}

//Main

const msg = bpdState ? 'State does exists' : "State doesn't exist";
const el = createLi(msg)
add(list, el);

bpdState.createStateManager({
    onChange: (stateId, type, detail) => {
        const msg = `[${stateId}](${type}) ${detail}`
        add(list, createLi(msg));
    }
})

bpdState.createState("first", { x: "1", y: "2" }, stateHandler);

bpdState.performStateAction('first', { action: 'x', data: "xxx" })