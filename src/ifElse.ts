const ifElse = <A, B>(predicate: (a: A) => boolean) => (
  ifThen: (a: A) => B,
) => (elseThen: (a: A) => B) => (a: A): B =>
  predicate(a) ? ifThen(a) : elseThen(a);

export default ifElse;
