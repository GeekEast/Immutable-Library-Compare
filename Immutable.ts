import _ from "lodash";
import { update } from 'immutable';
import produce from 'immer';
import { update as lpdate } from 'lodash/fp';
import Immutable from 'seamless-immutable';
import { generateData, getPerformance, getAverage } from "./utils";
import { set, lensPath } from 'ramda';

// 不可变库updater
const immutableJsReducer = (todos, id) => update(todos, id, (val: any) => update(val, 'complete', v => !v))
const lodashReducer = (todos, id) => lpdate([id, 'complete'], x => !x, todos)
const ramdaReducer = (todos, id) => set(lensPath([id,'complete']), true, todos);
const es6Reducer = (todos, id) => { return { ...todos, [id]: { ...todos[id], complete: !todos[id].complete } } }
const immerReducer = (todos, id) => produce(todos, draft => { draft[id].complete = true })
const seamlessImmutableReducer = (todos, id) => Immutable(todos).updateIn([id, 'complete'], x => !x);

// 初始化数据
const data = generateData(1000000);

// immutable是否满足检测:
// const es6G = es6Reducer(data, '5000');
// const immutableG = immutableJsReducer(data, '5000');
// const immerG = immerReducer(data, '5000') as Object;
// const lodashG = lodashReducer(data, '5000');
// const seamlessG = seamlessImmutableReducer(data, '5000')
// console.log(es6G === data);
// console.log(immutableG === data);
// console.log(immerG === data);
// console.log(lodashG === data);
// console.log(seamlessG === data);

// 性能测试
getAverage(10, es6Reducer, data, '5000')
getAverage(10, lodashReducer, data, '5000')
getAverage(10, immutableJsReducer, data, '5000')
getAverage(10, ramdaReducer, data, '5000')
getAverage(10, immerReducer, data, '5000')
getAverage(10, seamlessImmutableReducer, data, '5000');

