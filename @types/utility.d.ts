declare type AnyFunction = (...args: any[]) => any

declare type ArrayMapCallback = Parameters<Array<any>['map']>[0]

declare type ArrayMapIndex = Parameters<ArrayMapCallback>[1]