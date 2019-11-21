> [使用redux-devtools工具](https://www.cnblogs.com/zhuzhenwei918/p/7249357.html)

1.  在谷歌应用商店下载redux-devtools

2. `npm install  redux-devtools-extension --save-dev`

3. 在使用的store的地方引入`composeWithDevTools`

  ```
import { createStore, compose, applyMiddleware } from 'redux'
import thunkmiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reducers/index'
const devTools = require('remote-redux-devtools').default
let store
if (process.env.NODE_ENV === 'development') {
	store = createStore(
		reducer,
		compose(
			applyMiddleware(thunkmiddleware),
			composeWithDevTools(),
		)
	)
} else {
	store = createStore(reducer, applyMiddleware(thunkmiddleware))
}
export default store
```
