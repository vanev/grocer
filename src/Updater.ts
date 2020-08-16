type Updater<T> = (update: (t: T) => T) => unknown;

export default Updater;
