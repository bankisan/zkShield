// Adapted from https://stackoverflow.com/a/58253280.
export const toJson = (data) => {
    return JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? `${v}#bigint` : v), 4).replace(/"(-?\d+)#bigint"/g, (_, a) => a);
};
