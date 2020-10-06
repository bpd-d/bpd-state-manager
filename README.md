# bpd-state-manager
Simple state management library for web applications.

## Basics
States default are immutable. The only way to update state goes though performer function which is similar in structure to reducer pattern used in e.g. Redux.
All subscribers get most recent copy of the state when are called after update

## Usage
There are several ways to work with library in application.
Most common and simple usage is calling state functions. More advanced users may initiate state manager factory by themselves and attach object to application root object. States may be also created manually if none of previous options will not suit to application design.

### Functions
First call **BpdStateManager.createStateManager** in the application init. This will initialize state manager factory and attach it to window.
Method may take *config* object as argument. It will be passed to children state instances on the time of their initialization. Options set in this object will overwrite default behavior of the state.
```
BpdStateManager.createStateManager(config?);

```
To create state call  **BpdStateManager.createState** and pass state name, initial value and performer function to it, see example:
```
BpdStateManager.createState(name: string, initialValue: VStates, performer: StatePerformer<TActions, VStates>, config?: BpdStateManagerConfig<VStates>)
```

>NOTE
>One state factory may create many states so there is point to create complex state object with many actions in the performer. Specially if complex object may be split into smaller chunks. Splitting also gives a performance advantage, because each state has it's own worker queue.  Sases where there are many updates invoked on single state with many subscribers may lead to performance degradation.

>WARN
>Make sure each state name is unique.

To subscribe to state call **BpdStateManager.subscribeToState** and pass valid state name and callback that will be invoked on state update:
```
BpdStateManager.subscribeToState(name: string, callback: (state: VStates) => void)
```

Method returns a subscription identifier which shall be used when unsubscribing from state in method **BpdStateManager.unsubscribeFromState**:
```
BpdStateManager.unsubscribeFromState(name: string, id: string)
```

To mutate a state call function **BpdStateManager.performStateAction** and pass state name and action to be performed on state:
```
BpdStateManager.performStateAction(name: string, action: BpdStateAction<TActions>, callback?: (state: VStates) => void)
```

Optionally you can pass a subscriber callback which will be executed along with other subscribers. This one however is different as it will be removed after first one execution.

There is an additional option in the library which allows to undo last state change: **BpdStateManager.undoState**. Method takes only state name as parameter. **Undo** not only revert last changes but also notifies all subscirbers.

>NOTE 
>Currently option is handled by a backup implementation that holds up to 20 state changes in th array.

There are two more methods that are available in state manager. First one is **BpdStateManager.removeState** which removes instance of the state from manager. Second method is **BpdStateManager.getState** which returns copy of the current state.


## State Config
State config is an object that may holds configuration for state instance. It keeps following options:

* onChange?: BpdStateOnChange<V> - callback function that is invoked on state change. It receives state idenitfier, change type, change detail message and value of the state
* onError?: BpdStateOnError - callback that is invoked when error occurs in state. It receives state identifier, change type, error and detail message.
* copyMaker?: IObjectCopyMaker<V> - instance which is used by to create copy of the state.

## Performer
Performer is a callback method used to mutate state. It accepts two arguments: *state* and *action* where state represents current state value and action is an object that holds mutate data or points to mutation operation. Method shall return a new state value:

```
function StatePerformer<V, P>(state: P, action: BpdStateAction<V>): P {
    // Make change to state value
    // Use action to identify type of change and get additional data
    return state;
}

```

##