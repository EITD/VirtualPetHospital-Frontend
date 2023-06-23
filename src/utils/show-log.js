export const logAct = (...mess) => {
  // evelopment Log Action
  if (import.meta.env.MODE === 'development') {
    console.group(`%c${mess[0]}`, 'color:white;padding:5px;background:#25aeab;border-radius:5px;');
    mess.forEach((v, i) => { if (i > 0) console.log(v) });
    console.groupEnd();
  }
}