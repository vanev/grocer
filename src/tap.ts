const tap = <A>(fn: (a: A) => unknown) => (a: A): A => {
  fn(a);
  return a;
};

export default tap;
